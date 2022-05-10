extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

use arrayvec::ArrayVec;
// use std::time::{Duration, Instant};

const SIZE: i32 = 8;
const PHASE1_DEPTH: i32 = 10;
const PHASE2_DEPTH: i32 = 20;

const MAX_I32: i32 = i32::MAX;
const MIN_I32: i32 = i32::MIN;

const MASKS: [u64; 8] = [
    0x7F7F7F7F7F7F7F7F,
    0x007F7F7F7F7F7F7F,
    0xFFFFFFFFFFFFFFFF,
    0x00FEFEFEFEFEFEFE,
    0xFEFEFEFEFEFEFEFE,
    0xFEFEFEFEFEFEFE00,
    0xFFFFFFFFFFFFFFFF,
    0x7F7F7F7F7F7F7F00,
];

const LSHIFT: [u64; 8] = [0, 0, 0, 0, 1, 9, 8, 7];
const RSHIFT: [u64; 8] = [1, 9, 8, 7, 0, 0, 0, 0];

fn shift(disk: u64, dir: usize) -> u64 {
    if dir < 8 / 2 {
        (disk >> RSHIFT[dir]) & MASKS[dir]
    } else {
        (disk << LSHIFT[dir]) & MASKS[dir]
    }
}

// This uses fewer arithmetic operations than any other known
// implementation on machines with slow multiplication.
// This algorithm uses 17 arithmetic operations.
fn pop_cnt(mut x: u64) -> i32 {
    x -= (x >> 1) & 0x5555555555555555; //put count of each 2 bits into those 2 bits
    x = (x & 0x3333333333333333) + ((x >> 2) & 0x3333333333333333); //put count of each 4 bits into those 4 bits
    x = (x + (x >> 4)) & 0x0f0f0f0f0f0f0f0f; //put count of each 8 bits into those 8 bits
    x += x >> 8; //put count of each 16 bits into their lowest 8 bits
    x += x >> 16; //put count of each 32 bits into their lowest 8 bits
    x += x >> 32; //put count of each 64 bits into their lowest 8 bits
    (x & 0x7f) as i32
}

#[derive(Clone, Copy, PartialEq, Debug)]
pub enum Color {
    Black,
    White,
    Null,
}

impl Color {
    pub fn reverse(&self) -> Color {
        match self {
            Color::Black => Color::White,
            Color::White => Color::Black,
            Color::Null => Color::Null,
        }
    }
}

#[derive(Clone, Copy, Debug)]
pub struct Node {
    loc: i32,
    value: i32,
}

impl Node {
    pub fn new(loc: i32, value: i32) -> Node {
        Node {
            loc: loc,
            value: value,
        }
    }

    pub fn to_string(&self) -> String {
        let x = (self.loc % SIZE) as u8;
        let y = (self.loc / SIZE) as u8;

        format!("{}{}", x, y)
    }
}

#[derive(Debug)]
pub struct Nodes {
    nodes: ArrayVec<Node, 32>,
}

impl Nodes {
    pub fn new() -> Nodes {
        Nodes {
            nodes: ArrayVec::<Node, 32>::new(),
        }
    }

    fn less(&self, i: usize, j: usize) -> bool {
        self.nodes[i].value < self.nodes[j].value
    }

    fn large(&self, i: usize, j: usize) -> bool {
        self.nodes[i].value > self.nodes[j].value
    }

    fn swap(&mut self, i: usize, j: usize) {
        let tmp = self.nodes[i];
        self.nodes[i] = self.nodes[j];
        self.nodes[j] = tmp;
    }

    pub fn size(&self) -> usize {
        self.nodes.len()
    }

    pub fn push(&mut self, n: Node) {
        self.nodes.push(n);
    }

    pub fn sort_desc(&mut self) {
        let len = self.nodes.len();
        if len > 1 {
            for i in 1..len {
                let mut j = i;
                while j > 0 && self.large(j, j - 1) {
                    self.swap(j, j - 1);
                    j -= 1;
                }
            }
        }
    }

    pub fn sort_asc(&mut self) {
        let len = self.nodes.len();
        if len > 1 {
            for i in 1..len {
                let mut j = i;
                while j > 0 && self.less(j, j - 1) {
                    self.swap(j, j - 1);
                    j -= 1;
                }
            }
        }
    }
}

#[derive(Debug)]
pub struct BBoard {
    black: u64,
    white: u64,
}

impl BBoard {
    pub fn new(input: String) -> BBoard {
        let mut bd = BBoard { black: 0, white: 0 };
        let bytes = input.as_bytes();
        for i in 0..((SIZE * SIZE) as usize) {
            match bytes[i] {
                b'X' => bd.assign(i as i32, Color::Black),
                b'O' => bd.assign(i as i32, Color::White),
                b'_' => bd.assign(i as i32, Color::Null),
                _ => panic!("unknown identifier {}", bytes[i].to_string()),
            }
        }
        bd
    }

    pub fn copy(&self) -> BBoard {
        BBoard {
            black: self.black,
            white: self.white,
        }
    }

    pub fn at(&self, loc: i32) -> Color {
        let sh = 1u64 << loc;
        if self.black & sh != 0 {
            Color::Black
        } else if self.white & sh != 0 {
            Color::White
        } else {
            Color::Null
        }
    }

    pub fn assign(&mut self, loc: i32, cl: Color) {
        let sh = 1u64 << loc;
        match cl {
            Color::Black => self.black |= sh,
            Color::White => self.white |= sh,
            _ => (),
        }
    }

    pub fn put(&mut self, loc: i32, cl: Color) {
        self.assign(loc, cl);
        self.flip(loc, cl);
    }

    pub fn put_and_check(&mut self, loc: i32, cl: Color) -> bool {
        if loc < 0 || loc >= SIZE * SIZE {
            return false;
        }
        if self.at(loc) != Color::Null || !self.is_valid_loc(loc, cl) {
            return false;
        }
        self.put(loc, cl);
        true
    }

    pub fn flip(&mut self, loc: i32, cl: Color) {
        let (mut x, mut bounding_disk): (u64, u64);
        let new_disk = 1u64 << loc;
        let mut captured_disk: u64 = 0;

        if cl == Color::Black {
            self.black |= new_disk;
            for dir in 0..8 {
                x = shift(new_disk, dir) & self.white;
                x |= shift(x, dir) & self.white;
                x |= shift(x, dir) & self.white;
                x |= shift(x, dir) & self.white;
                x |= shift(x, dir) & self.white;
                x |= shift(x, dir) & self.white;
                bounding_disk = shift(x, dir) & self.black;

                if bounding_disk != 0 {
                    captured_disk |= x;
                }
            }
            self.black ^= captured_disk;
            self.white ^= captured_disk;
        } else {
            self.white |= new_disk;
            for dir in 0..8 {
                x = shift(new_disk, dir) & self.black;
                x |= shift(x, dir) & self.black;
                x |= shift(x, dir) & self.black;
                x |= shift(x, dir) & self.black;
                x |= shift(x, dir) & self.black;
                x |= shift(x, dir) & self.black;
                bounding_disk = shift(x, dir) & self.white;

                if bounding_disk != 0 {
                    captured_disk |= x;
                }
            }
            self.black ^= captured_disk;
            self.white ^= captured_disk;
        }
    }

    pub fn all_valid_loc(&self, cl: Color) -> u64 {
        let (mine, opp): (u64, u64);
        let mut legal: u64 = 0;

        if cl == Color::Black {
            mine = self.black;
            opp = self.white;
        } else {
            mine = self.white;
            opp = self.black;
        }
        let empty = !(mine | opp);

        for dir in 0..8 {
            let mut x = shift(mine, dir) & opp;
            x |= shift(x, dir) & opp;
            x |= shift(x, dir) & opp;
            x |= shift(x, dir) & opp;
            x |= shift(x, dir) & opp;
            x |= shift(x, dir) & opp;
            legal |= shift(x, dir) & empty;
        }

        legal
    }

    pub fn has_valid_move(&self, cl: Color) -> bool {
        self.all_valid_loc(cl) != 0
    }

    pub fn is_valid_loc(&self, loc: i32, cl: Color) -> bool {
        let mask = 1u64 << loc;
        self.all_valid_loc(cl) & mask != 0
    }

    pub fn count(&self, cl: Color) -> i32 {
        match cl {
            Color::Black => pop_cnt(self.black),
            Color::White => pop_cnt(self.white),
            _ => panic!("wrong color {:#?}", cl),
        }
    }

    pub fn empty_count(&self) -> i32 {
        SIZE * SIZE - pop_cnt(self.black | self.white)
    }

    pub fn is_over(&self) -> bool {
        !(self.has_valid_move(Color::Black) || self.has_valid_move(Color::White))
    }

    pub fn eval(&self, cl: Color) -> i32 {
        let mut bv: i32 = 0;
        let mut wv: i32 = 0;
        let mut cnt: i32;

        cnt = pop_cnt(self.black & 0x8100000000000081);
        bv += cnt * 800;
        cnt = pop_cnt(self.black & 0x0042000000004200);
        bv += cnt * -552;
        cnt = pop_cnt(self.black & 0x0000240000240000);
        bv += cnt * 62;
        cnt = pop_cnt(self.black & 0x0000001818000000);
        bv += cnt * -18;
        cnt = pop_cnt(self.black & 0x4281000000008142);
        bv += cnt * -286;
        cnt = pop_cnt(self.black & 0x2400810000810024);
        bv += cnt * 426;
        cnt = pop_cnt(self.black & 0x1800008181000018);
        bv += cnt * -24;
        cnt = pop_cnt(self.black & 0x0024420000422400);
        bv += cnt * -177;
        cnt = pop_cnt(self.black & 0x0018004242001800);
        bv += cnt * -82;
        cnt = pop_cnt(self.black & 0x0000182424180000);
        bv += cnt * 8;

        cnt = pop_cnt(self.white & 0x8100000000000081);
        wv += cnt * 800;
        cnt = pop_cnt(self.white & 0x0042000000004200);
        wv += cnt * -552;
        cnt = pop_cnt(self.white & 0x0000240000240000);
        wv += cnt * 62;
        cnt = pop_cnt(self.white & 0x0000001818000000);
        wv += cnt * -18;
        cnt = pop_cnt(self.white & 0x4281000000008142);
        wv += cnt * -286;
        cnt = pop_cnt(self.white & 0x2400810000810024);
        wv += cnt * 426;
        cnt = pop_cnt(self.white & 0x1800008181000018);
        wv += cnt * -24;
        cnt = pop_cnt(self.white & 0x0024420000422400);
        wv += cnt * -177;
        cnt = pop_cnt(self.white & 0x0018004242001800);
        wv += cnt * -82;
        cnt = pop_cnt(self.white & 0x0000182424180000);
        wv += cnt * 8;

        match cl {
            Color::Black => bv - wv,
            Color::White => wv - bv,
            _ => panic!("unknown color {:#?}", cl),
        }
    }

    pub fn mobility(&self, cl: Color) -> i32 {
        let allv = self.all_valid_loc(cl);
        pop_cnt(allv)
    }
}

pub struct AI {
    color: Color,
    opp: Color,
    phase: i32,
    depth: i32,
    reached_depth: i32,
    node: i32,
    level: i32,
}

impl AI {
    pub fn new(color: Color, lv: i32) -> AI {
        let ai = AI {
            color: color,
            opp: color.reverse(),
            phase: 1,
            reached_depth: 0,
            depth: 0,
            node: 0,
            level: lv,
        };
        ai
    }

    pub fn next_move(&mut self, input: String) -> String {
        let bd = BBoard::new(input);
        self.set_phase(&bd);
        self.set_depth();

        self.node = 0;

        // let now = Instant::now();
        let best = self.alpha_beta_helper(&bd, self.depth);
        // let elapsed = now.elapsed();

        best.to_string() + " " + &self.print_msg(best)
    }

    fn set_phase(&mut self, bd: &BBoard) {
        let empty = bd.empty_count();
        let phase2 = PHASE2_DEPTH + (self.level - 4) * 3;
        if empty > phase2 {
            self.phase = 1;
        } else {
            self.phase = 2;
        }
    }

    fn print_msg(&self, best: Node) -> String {
        match self.phase {
            1 => format!(
                "{{ depth: {:2}, value: {:+.2}, nodes: {} }}",
                self.reached_depth,
                best.value as f64 * ((SIZE * SIZE) as f64) / 1476.0,
                self.node,
                // t.as_secs_f64(),
                // self.node as f64 / t.as_secs_f64(),
            ),
            2 => format!(
                "{{ depth: {:2}, value: {:+}, nodes: {} }}",
                self.reached_depth,
                best.value,
                self.node,
                // t.as_secs_f64(),
                // self.node as f64 / t.as_secs_f64(),
            ),
            _ => panic!("unknown phase"),
        }
    }

    fn set_depth(&mut self) {
        if self.phase == 1 {
            self.depth = PHASE1_DEPTH + (self.level - 4) * 2;
            if self.depth <= 0 {
                self.depth = 1;
            }
        } else {
            self.depth = MAX_I32;
        }
    }

    fn heuristic(&self, bd: &BBoard) -> i32 {
        if self.phase == 1 {
            bd.eval(self.color)
        } else {
            bd.count(self.color) - bd.count(self.opp)
        }
    }

    fn sorted_valid_nodes(&self, bd: &BBoard, cl: Color) -> Nodes {
        let mut all: Nodes = Nodes::new();
        let all_valid: u64 = bd.all_valid_loc(cl);
        if self.phase == 1 {
            for loc in 0..SIZE * SIZE {
                if (1u64 << loc) & all_valid != 0 {
                    let mut tmp = bd.copy();
                    tmp.put(loc, cl);
                    all.push(Node::new(loc, tmp.eval(cl)));
                }
            }
            all.sort_desc();
        } else {
            let op = cl.reverse();
            for loc in 0..SIZE * SIZE {
                if (1u64 << loc) & all_valid != 0 {
                    let mut tmp = bd.copy();
                    tmp.put(loc, cl);
                    all.push(Node::new(loc, tmp.mobility(op)));
                }
            }
            all.sort_asc();
        }
        all
    }

    fn alpha_beta_helper(&mut self, bd: &BBoard, depth: i32) -> Node {
        self.alpha_beta(bd, depth, MIN_I32, MAX_I32, true)
    }

    fn alpha_beta(
        &mut self,
        bd: &BBoard,
        depth: i32,
        mut alpha: i32,
        mut beta: i32,
        max_layer: bool,
    ) -> Node {
        self.node += 1;

        if depth == 0 {
            self.reached_depth = self.depth;
            let v = self.heuristic(bd);
            return Node::new(-1, v);
        }
        if bd.is_over() {
            self.reached_depth = self.depth - depth;
            let v = self.heuristic(bd);
            return Node::new(-1, v);
        }

        if max_layer {
            let mut max_value = MIN_I32;
            let mut best_node = Node::new(-1, max_value);

            let ai_valid = self.sorted_valid_nodes(&bd, self.color);
            if ai_valid.size() == 0 {
                return self.alpha_beta(bd, depth, alpha, beta, false);
            }

            for n in ai_valid.nodes {
                let mut tmp = bd.copy();
                tmp.put(n.loc, self.color);
                let eval = self.alpha_beta(&tmp, depth - 1, alpha, beta, false).value;

                if eval > max_value {
                    max_value = eval;
                    best_node = n;
                }
                if max_value > alpha {
                    alpha = max_value;
                }

                if beta <= alpha {
                    break;
                }
            }

            return Node::new(best_node.loc, max_value);
        } else {
            let mut min_value = MAX_I32;
            let mut best_node = Node::new(-1, min_value);

            let op_valid = self.sorted_valid_nodes(&bd, self.opp);
            if op_valid.size() == 0 {
                return self.alpha_beta(bd, depth, alpha, beta, true);
            }

            for n in op_valid.nodes {
                let mut tmp = bd.copy();
                tmp.put(n.loc, self.opp);
                let eval = self.alpha_beta(&tmp, depth - 1, alpha, beta, true).value;

                if eval < min_value {
                    min_value = eval;
                    best_node = n;
                }
                if min_value < beta {
                    beta = min_value;
                }

                if beta <= alpha {
                    break;
                }
            }

            return Node::new(best_node.loc, min_value);
        }
    }
}

#[wasm_bindgen]
pub fn ai_move(input: String, color: i32, strength: i32) -> String {
    let level = match strength {
        0 => 0,
        1 => 2,
        2 => 4,
        _ => panic!("unknwn level"),
    };
    let mut ai = match color {
        1 => AI::new(Color::Black, level),
        2 => AI::new(Color::White, level),
        _ => panic!("error"),
    };
    return ai.next_move(input);
}
