package ai

const u1 uint64 = 1

var DIR = []int{-8, -7, 1, 9, 8, 7, -1, -9}

type bboard8 struct {
	black, white uint64
}

func newBboard8(input string) bboard8 {
	bd := bboard8{}
	for i := 0; i < 64; i++ {
		switch input[i] {
		case 'X':
			bd.assign(BLACK, i)
		case 'O':
			bd.assign(WHITE, i)
		case '_':
		default:
			panic("input err: " + string(input[i]))
		}
	}
	return bd
}

func (bd bboard8) String() (res string) {
	for loc := 0; loc < 64; loc++ {
		switch bd.at(loc) {
		case NONE:
			res += "_"
		case BLACK:
			res += "X"
		case WHITE:
			res += "O"
		default:
			panic("err: " + bd.at(loc).String())
		}
	}
	return
}

func (bd bboard8) visualize() (res string) {
	res = "  a b c d e f g h"
	for loc := 0; loc < 64; loc++ {
		if loc%8 == 0 {
			res += "\n" + string(rune('A'+loc/8)) + " "
		}
		switch bd.at(loc) {
		case NONE:
			res += "+ "
		case BLACK:
			res += "X "
		case WHITE:
			res += "O "
		default:
			panic("err: " + bd.at(loc).String())
		}
	}
	return res + "\n"
}

func (bd bboard8) cpy() bboard8 {
	return bboard8{bd.black, bd.white}
}

func (bd bboard8) at(loc int) color {
	sh := u1 << loc
	if bd.black&sh != 0 {
		return BLACK
	} else if bd.white&sh != 0 {
		return WHITE
	}
	return NONE
}

func (bd *bboard8) assign(cl color, loc int) {
	sh := u1 << loc
	if cl == BLACK {
		bd.black |= sh
	} else {
		bd.white |= sh
	}
}

func (bd *bboard8) put(cl color, loc int) {
	bd.assign(cl, loc)
	bd.flip(cl, loc)
}

func (bd *bboard8) putAndCheck(cl color, loc int) bool {
	if loc < 0 {
		return false
	}
	if bd.at(loc) != NONE || !bd.isValidLoc(cl, loc) {
		return false
	}
	bd.put(cl, loc)
	bd.flip(cl, loc)
	return true
}

func (bd *bboard8) clear(loc int) {
	c := ^(u1 << loc)
	bd.black &= c
	bd.white &= c
}

func (bd *bboard8) flip(cl color, loc int) {
	var x, bounding_disk uint64
	new_disk := (u1 << loc)
	captured_disks := uint64(0)

	if cl == BLACK {
		bd.black |= new_disk

		x = (new_disk >> 1) & 0x7F7F7F7F7F7F7F7F & bd.white
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.white
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.white
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.white
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.white
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.white
		bounding_disk = (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk >> 9) & 0x007F7F7F7F7F7F7F & bd.white
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.white
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.white
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.white
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.white
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.white
		bounding_disk = (x >> 9) & 0x007F7F7F7F7F7F7F & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk >> 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		bounding_disk = (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk >> 7) & 0x00FEFEFEFEFEFEFE & bd.white
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.white
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.white
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.white
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.white
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.white
		bounding_disk = (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 1) & 0xFEFEFEFEFEFEFEFE & bd.white
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.white
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.white
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.white
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.white
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.white
		bounding_disk = (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 9) & 0xFEFEFEFEFEFEFE00 & bd.white
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.white
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.white
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.white
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.white
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.white
		bounding_disk = (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.white
		bounding_disk = (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 7) & 0x7F7F7F7F7F7F7F00 & bd.white
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.white
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.white
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.white
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.white
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.white
		bounding_disk = (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.black

		if bounding_disk != 0 {
			captured_disks |= x
		}

		bd.black ^= captured_disks
		bd.white ^= captured_disks
	} else {
		bd.white |= new_disk

		x = (new_disk >> 1) & 0x7F7F7F7F7F7F7F7F & bd.black
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.black
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.black
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.black
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.black
		x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.black
		bounding_disk = (x >> 1) & 0x7F7F7F7F7F7F7F7F & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk >> 9) & 0x007F7F7F7F7F7F7F & bd.black
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.black
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.black
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.black
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.black
		x |= (x >> 9) & 0x007F7F7F7F7F7F7F & bd.black
		bounding_disk = (x >> 9) & 0x007F7F7F7F7F7F7F & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk >> 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		bounding_disk = (x >> 8) & 0xFFFFFFFFFFFFFFFF & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk >> 7) & 0x00FEFEFEFEFEFEFE & bd.black
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.black
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.black
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.black
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.black
		x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.black
		bounding_disk = (x >> 7) & 0x00FEFEFEFEFEFEFE & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 1) & 0xFEFEFEFEFEFEFEFE & bd.black
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.black
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.black
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.black
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.black
		x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.black
		bounding_disk = (x << 1) & 0xFEFEFEFEFEFEFEFE & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 9) & 0xFEFEFEFEFEFEFE00 & bd.black
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.black
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.black
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.black
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.black
		x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.black
		bounding_disk = (x << 9) & 0xFEFEFEFEFEFEFE00 & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.black
		bounding_disk = (x << 8) & 0xFFFFFFFFFFFFFFFF & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		x = (new_disk << 7) & 0x7F7F7F7F7F7F7F00 & bd.black
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.black
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.black
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.black
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.black
		x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.black
		bounding_disk = (x << 7) & 0x7F7F7F7F7F7F7F00 & bd.white

		if bounding_disk != 0 {
			captured_disks |= x
		}

		bd.white ^= captured_disks
		bd.black ^= captured_disks
	}
}

func (bd bboard8) allValidLoc(cl color) uint64 {
	var legal uint64
	var self, opp uint64

	if cl == BLACK {
		self = bd.black
		opp = bd.white
	} else {
		self = bd.white
		opp = bd.black
	}
	empty := ^(self | opp)

	x := (self >> 1) & 0x7F7F7F7F7F7F7F7F & opp
	x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & opp
	x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & opp
	x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & opp
	x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & opp
	x |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & opp
	legal |= (x >> 1) & 0x7F7F7F7F7F7F7F7F & empty

	x = (self >> 9) & 0x007F7F7F7F7F7F7F & opp
	x |= (x >> 9) & 0x007F7F7F7F7F7F7F & opp
	x |= (x >> 9) & 0x007F7F7F7F7F7F7F & opp
	x |= (x >> 9) & 0x007F7F7F7F7F7F7F & opp
	x |= (x >> 9) & 0x007F7F7F7F7F7F7F & opp
	x |= (x >> 9) & 0x007F7F7F7F7F7F7F & opp
	legal |= (x >> 9) & 0x007F7F7F7F7F7F7F & empty

	x = (self >> 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & opp
	legal |= (x >> 8) & 0xFFFFFFFFFFFFFFFF & empty

	x = (self >> 7) & 0x00FEFEFEFEFEFEFE & opp
	x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & opp
	x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & opp
	x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & opp
	x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & opp
	x |= (x >> 7) & 0x00FEFEFEFEFEFEFE & opp
	legal |= (x >> 7) & 0x00FEFEFEFEFEFEFE & empty

	x = (self << 1) & 0xFEFEFEFEFEFEFEFE & opp
	x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & opp
	x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & opp
	x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & opp
	x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & opp
	x |= (x << 1) & 0xFEFEFEFEFEFEFEFE & opp
	legal |= (x << 1) & 0xFEFEFEFEFEFEFEFE & empty

	x = (self << 9) & 0xFEFEFEFEFEFEFE00 & opp
	x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & opp
	x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & opp
	x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & opp
	x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & opp
	x |= (x << 9) & 0xFEFEFEFEFEFEFE00 & opp
	legal |= (x << 9) & 0xFEFEFEFEFEFEFE00 & empty

	x = (self << 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & opp
	x |= (x << 8) & 0xFFFFFFFFFFFFFFFF & opp
	legal |= (x << 8) & 0xFFFFFFFFFFFFFFFF & empty

	x = (self << 7) & 0x7F7F7F7F7F7F7F00 & opp
	x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & opp
	x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & opp
	x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & opp
	x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & opp
	x |= (x << 7) & 0x7F7F7F7F7F7F7F00 & opp
	legal |= (x << 7) & 0x7F7F7F7F7F7F7F00 & empty

	return legal
}

func (bd bboard8) hasValidMove(cl color) bool {
	return bd.allValidLoc(cl) != 0
}

func (bd bboard8) isValidLoc(cl color, loc int) bool {
	mask := u1 << loc
	return bd.allValidLoc(cl)&mask != 0
}

// var (
// 	masks = []uint64{
// 		0x7F7F7F7F7F7F7F7F,
// 		0x007F7F7F7F7F7F7F,
// 		0xFFFFFFFFFFFFFFFF,
// 		0x00FEFEFEFEFEFEFE,
// 		0xFEFEFEFEFEFEFEFE,
// 		0xFEFEFEFEFEFEFE00,
// 		0xFFFFFFFFFFFFFFFF,
// 		0x7F7F7F7F7F7F7F00,
// 	}

// 	lshift = []uint64{
// 		0, 0, 0, 0, 1, 9, 8, 7,
// 	}

// 	rshift = []uint64{
// 		1, 9, 8, 7, 0, 0, 0, 0,
// 	}
// )

// func shift8(x uint64, dir int) uint64 {
// 	switch dir {
// 	case 0:
// 		return (x >> 1) & 0x7F7F7F7F7F7F7F7F
// 	case 1:
// 		return (x >> 9) & 0x007F7F7F7F7F7F7F
// 	case 2:
// 		return (x >> 8) & 0xFFFFFFFFFFFFFFFF
// 	case 3:
// 		return (x >> 7) & 0x00FEFEFEFEFEFEFE
// 	case 4:
// 		return (x << 1) & 0xFEFEFEFEFEFEFEFE
// 	case 5:
// 		return (x << 9) & 0xFEFEFEFEFEFEFE00
// 	case 6:
// 		return (x << 8) & 0xFFFFFFFFFFFFFFFF
// 	case 7:
// 		return (x << 7) & 0x7F7F7F7F7F7F7F00
// 	}
// 	panic("dir error")
// }

func (bd bboard8) count(cl color) int {
	if cl == BLACK {
		return hammingWeight(bd.black)
	} else {
		return hammingWeight(bd.white)
	}
}

func (bd bboard8) emptyCount() int {
	return 64 - hammingWeight(bd.black|bd.white)
}

func (bd bboard8) isOver() bool {
	if hammingWeight(bd.black^bd.white) == 64 {
		return true
	}
	return !(bd.hasValidMove(BLACK) || bd.hasValidMove(WHITE))
}

// var (
// 	CORNER = []uint64{
// 		0x8100000000000081,
// 		0x0042000000004200,
// 		0x0000240000240000,
// 		0x0000001818000000,
// 	}
// 	CORNERV = []int{800, -552, 62, -18}

// 	EDGE = []uint64{
// 		0x4281000000008142,
// 		0x2400810000810024,
// 		0x1800008181000018,
// 		0x0024420000422400,
// 		0x0018004242001800,
// 		0x0000182424180000,
// 	}
// 	EDGEV = []int{-286, 426, -24, -177, -82, 8}
// )

// loop unrolling
func (bd bboard8) eval(cl color) int {
	bv, wv := 0, 0
	cnt := 0

	cnt = hammingWeight(bd.black & 0x8100000000000081)
	bv += cnt * 800
	cnt = hammingWeight(bd.black & 0x0042000000004200)
	bv += cnt * -552
	cnt = hammingWeight(bd.black & 0x0000240000240000)
	bv += cnt * 62
	cnt = hammingWeight(bd.black & 0x0000001818000000)
	bv += cnt * -18
	cnt = hammingWeight(bd.black & 0x4281000000008142)
	bv += cnt * -286
	cnt = hammingWeight(bd.black & 0x2400810000810024)
	bv += cnt * 426
	cnt = hammingWeight(bd.black & 0x1800008181000018)
	bv += cnt * -24
	cnt = hammingWeight(bd.black & 0x0024420000422400)
	bv += cnt * -177
	cnt = hammingWeight(bd.black & 0x0018004242001800)
	bv += cnt * -82
	cnt = hammingWeight(bd.black & 0x0000182424180000)
	bv += cnt * 8

	cnt = hammingWeight(bd.white & 0x8100000000000081)
	wv += cnt * 800
	cnt = hammingWeight(bd.white & 0x0042000000004200)
	wv += cnt * -552
	cnt = hammingWeight(bd.white & 0x0000240000240000)
	wv += cnt * 62
	cnt = hammingWeight(bd.white & 0x0000001818000000)
	wv += cnt * -18
	cnt = hammingWeight(bd.white & 0x4281000000008142)
	wv += cnt * -286
	cnt = hammingWeight(bd.white & 0x2400810000810024)
	wv += cnt * 426
	cnt = hammingWeight(bd.white & 0x1800008181000018)
	wv += cnt * -24
	cnt = hammingWeight(bd.white & 0x0024420000422400)
	wv += cnt * -177
	cnt = hammingWeight(bd.white & 0x0018004242001800)
	wv += cnt * -82
	cnt = hammingWeight(bd.white & 0x0000182424180000)
	wv += cnt * 8

	if cl == BLACK {
		return bv - wv
	} else {
		return wv - bv
	}
}

func (bd bboard8) conner(cl color) int {
	if cl == BLACK {
		return int(bd.black & 0x8100000000000081)
	} else {
		return int(bd.white & 0x8100000000000081)
	}
}

// return the mobility (how many possible moves)
func (bd bboard8) mobility(cl color) int {
	allv := bd.allValidLoc(cl)
	return hammingWeight(allv)
}
