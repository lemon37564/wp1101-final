// old version of board

package ai

import (
	"testing"
)

type aiboard [][]color

var (
	DIRECTION = [8][2]int{{-1, 0}, {-1, 1}, {0, 1}, {1, 1}, {1, 0}, {1, -1}, {0, -1}, {-1, -1}}
)

func newBoardFromStr(str string) aiboard {
	var size int
	if len(str) == 36 {
		size = 6
	} else {
		size = 8
	}

	indx := 0
	bd := make(aiboard, size+2)
	for i := range bd {
		bd[i] = make([]color, size+2)
	}

	for i := 0; i < bd.size(); i++ {
		for j := 0; j < bd.size(); j++ {
			p := point{j, i}
			switch str[indx] {
			case '+':
				bd.assign(NONE, p)
			case 'X':
				bd.assign(BLACK, p)
			case 'O':
				bd.assign(WHITE, p)
			default:
				panic("err: " + string(str[indx]))
			}
			indx++
		}
	}

	for i := 0; i < size+2; i++ {
		bd[i][0] = BORDER
		bd[0][i] = BORDER
		bd[size+1][0] = BORDER
		bd[0][size+1] = BORDER
	}

	return bd
}

func (bd aiboard) size() int {
	return len(bd) - 2
}

func (bd aiboard) Copy() aiboard {
	nbd := make(aiboard, bd.size()+2)
	for i := range bd {
		nbd[i] = make([]color, bd.size()+2)
		copy(nbd[i], bd[i])
	}
	return nbd
}

func (bd aiboard) String() (res string) {
	for i := 0; i < bd.size(); i++ {
		for j := 0; j < bd.size(); j++ {
			switch bd.at(point{j, i}) {
			case NONE:
				res += "+"
			case BLACK:
				res += "X"
			case WHITE:
				res += "O"
			default:
				panic("err: " + bd.at(point{j, i}).String())
			}
		}
	}
	return
}

func (bd aiboard) visualize() (res string) {
	res = "  "
	for i := 0; i < bd.size(); i++ {
		res += string(rune('a'+i)) + " "
	}
	res += "\n"
	for i := 0; i < bd.size(); i++ {
		res += string(rune('A'+i)) + " "
		for j := 0; j < bd.size(); j++ {
			switch bd.at(point{j, i}) {
			case NONE:
				res += "+ "
			case BLACK:
				res += "X "
			case WHITE:
				res += "O "
			}
		}
		res += "\n"
	}
	return
}

func (bd aiboard) put(cl color, p point) history {
	bd.assign(cl, p)
	return bd.flip(cl, p)
}

func (bd aiboard) putAndCheck(cl color, p point) bool {
	if p.x < 0 || p.x >= bd.size() || p.y < 0 || p.y >= bd.size() {
		return false
	}
	if bd.at(p) != NONE {
		return false
	}
	if !bd.isValidPoint(cl, p) {
		return false
	}
	bd.assign(cl, p)
	bd.flip(cl, p)
	return true
}

func (bd aiboard) assign(cl color, p point) {
	bd[p.x+1][p.y+1] = cl
}

func (bd aiboard) at(p point) color {
	return bd[p.x+1][p.y+1]
}

// undo a move
func (bd aiboard) revert(hs history) {
	for i := range hs.dirs {
		x, y := hs.place.x+hs.dirs[i][0], hs.place.y+hs.dirs[i][1]
		for j := 0; j < hs.flips[i]; j++ {
			bd.assign(hs.origColor, point{x, y})
			x, y = x+hs.dirs[i][0], y+hs.dirs[i][1]
		}
	}
	bd.assign(NONE, hs.place)
}

// self loop unrolling lol
func (bd aiboard) isValidPoint(cl color, p point) bool {
	if bd.at(p) != NONE {
		return false
	}
	op := cl.reverse()
	return bd.countFlipPieces(cl, op, p, DIRECTION[0]) > 0 ||
		bd.countFlipPieces(cl, op, p, DIRECTION[1]) > 0 ||
		bd.countFlipPieces(cl, op, p, DIRECTION[2]) > 0 ||
		bd.countFlipPieces(cl, op, p, DIRECTION[3]) > 0 ||
		bd.countFlipPieces(cl, op, p, DIRECTION[4]) > 0 ||
		bd.countFlipPieces(cl, op, p, DIRECTION[5]) > 0 ||
		bd.countFlipPieces(cl, op, p, DIRECTION[6]) > 0 ||
		bd.countFlipPieces(cl, op, p, DIRECTION[7]) > 0
}

func (bd aiboard) countFlipPieces(cl color, opponent color, p point, dir [2]int) int {
	count := 0
	x, y := p.x+dir[0], p.y+dir[1]
	if bd.at(point{x, y}) != opponent {
		return 0
	}
	count++

	for {
		x, y = x+dir[0], y+dir[1]
		now := bd.at(point{x, y})
		if now == opponent {
			count++
		} else {
			if now == cl {
				return count
			} else {
				return 0
			}
		}
	}
}

func (bd aiboard) flip(cl color, p point) history {
	hs := newHistory(p, cl.reverse())
	op := cl.reverse()
	for i := 0; i < 8; i++ {
		if count := bd.countFlipPieces(cl, op, p, DIRECTION[i]); count > 0 {
			x, y := p.x+DIRECTION[i][0], p.y+DIRECTION[i][1]
			for j := 0; j < count; j++ {
				bd.assign(cl, point{x, y})
				x, y = x+DIRECTION[i][0], y+DIRECTION[i][1]
			}
			hs.dirs = append(hs.dirs, DIRECTION[i])
			hs.flips = append(hs.flips, count)
		}
	}
	return hs
}

func (bd aiboard) emptyCount() int {
	return bd.countPieces(NONE)
}

func (bd aiboard) isOver() bool {
	for i := 0; i < bd.size(); i++ {
		for j := 0; j < bd.size(); j++ {
			p := point{i, j}
			if bd.isValidPoint(BLACK, p) || bd.isValidPoint(WHITE, p) {
				return false
			}
		}
	}
	return true
}

var (
	VALUE6x6 = [][]int{
		{100, -36, 53, 53, -36, 100},
		{-36, -69, -10, -10, -69, -36},
		{53, -10, -2, -2, -10, 53},
		{53, -10, -2, -2, -10, 53},
		{-36, -69, -10, -10, -69, -36},
		{100, -36, 53, 53, -36, 100},
	}

	VALUE8x8 = [][]int{
		{800, -286, 426, -24, -24, 426, -286, 800},
		{-286, -552, -177, -82, -82, -177, -552, -286},
		{426, -177, 62, 8, 8, 62, -177, 426},
		{-24, -82, 8, -18, -18, 8, -82, -24},
		{-24, -82, 8, -18, -18, 8, -82, -24},
		{426, -177, 62, 8, 8, 62, -177, 426},
		{-286, -552, -177, -82, -82, -177, -552, -286},
		{800, -286, 426, -24, -24, 426, -286, 800},
	}

	TOTAL6x6 int
	TOTAL8x8 int
)

func TestTotal(t *testing.T) {
	for i := 0; i < len(VALUE6x6); i++ {
		for j := 0; j < len(VALUE6x6); j++ {
			TOTAL6x6 += abs(VALUE6x6[i][j])
		}
	}
	for i := 0; i < len(VALUE8x8); i++ {
		for j := 0; j < len(VALUE8x8); j++ {
			TOTAL8x8 += abs(VALUE8x8[i][j])
		}
	}
	t.Error(TOTAL6x6, TOTAL8x8)
}

func (bd aiboard) eval(cl color, opponent color, valueDisk [][]int) int {
	value := 0
	for i := 0; i < bd.size(); i++ {
		for j := 0; j < bd.size(); j++ {
			p := point{i, j}
			if bd.at(p) == cl {
				value += valueDisk[i][j]
			} else if bd.at(p) == opponent {
				value -= valueDisk[i][j]
			}
		}
	}
	return value
}

func (bd aiboard) countPieces(cl color) int {
	count := 0
	for i := 0; i < bd.size(); i++ {
		for j := 0; j < bd.size(); j++ {
			if bd.at(point{i, j}) == cl {
				count++
			}
		}
	}
	return count
}

// return the mobility (how many possible moves)
func (bd aiboard) mobility(cl color) int {
	count := 0
	for i := 0; i < bd.size(); i++ {
		for j := 0; j < bd.size(); j++ {
			if bd.isValidPoint(cl, point{i, j}) {
				count++
			}
		}
	}
	return count
}

func (bd aiboard) flipCount(cl color, op color, p point) int {
	count := 0
	for i := 0; i < 8; i++ {
		count += bd.countFlipPieces(cl, op, p, DIRECTION[i])
	}
	return count
}

func (bd aiboard) changedValue(cl color, p point, dir [2]int, valueDisk [][]int) int {
	delta := 0
	x, y := p.x, p.y
	opponent := cl.reverse()

	x, y = x+dir[0], y+dir[1]
	if bd.at(point{x, y}) != opponent {
		return 0
	}
	delta += valueDisk[x][y] * 2 // flip opponent to yours, so double

	for {
		x, y = x+dir[0], y+dir[1]
		now := bd.at(point{x, y})
		if now != opponent {
			if now == cl {
				return delta
			} else {
				return 0
			}
		}
		delta += valueDisk[x][y] * 2 // same as above
	}
}

// don't need to copy
func (bd aiboard) evalAfterPut(currentValue int, p point, cl color, valueDisk [][]int) int {
	for i := 0; i < 8; i++ {
		currentValue += bd.changedValue(cl, p, DIRECTION[i], valueDisk)
	}
	currentValue += valueDisk[p.x][p.y]
	return currentValue
}

// don't need to copy board
// func (ai *AI) countAfterPut(bd aiboard, currentCount int, p point, cl color) int {
// 	for i := 0; i < 8; i++ {
// 		currentCount += bd.countFlipPieces(cl, cl.reverse(), p, DIRECTION[i])
// 	}
// 	return currentCount + 1 // include p itself
// }

// func (ai *AI) heuristicAfterPut(bd aiboard, currentValue int, p point, cl color) int {
// 	if ai.phase == 1 {
// 		return bd.evalAfterPut(currentValue, p, cl, ai.valueDisk)
// 	} else {
// 		return ai.countAfterPut(bd, currentValue, p, ai.color)
// 	}
// }

type history struct {
	origColor color
	place     point
	dirs      [][2]int
	flips     []int
}

func newHistory(place point, origColor color) history {
	return history{
		origColor: origColor,
		place:     place,
		dirs:      make([][2]int, 0, 4),
		flips:     make([]int, 0, 4),
	}
}

func testValidPoint(t *testing.T, input string, p point, target int) {

	bd := newBoardFromStr("+++++++++XX++OOOX+++OXOO++X+XX++++++")

	count := 0
	for i := 0; i < 8; i++ {
		count += bd.countFlipPieces(WHITE, BLACK, point{4, 3}, DIRECTION[i])
	}
	if count != 1 {
		t.Error(count, "\n", bd.visualize())
	}
}

func TestValidPoint(t *testing.T) {

	testValidPoint(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", point{4, 3}, 1)
	testValidPoint(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", point{0, 5}, 3)
	// testValidPoint(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", point{ 4,  3}, 1)

}

func testFlip(t *testing.T, input string, cl color, p point, targetState string) {
	bd := newBoardFromStr(input)

	if !bd.putAndCheck(cl, p) {
		t.Error("cannot put")
		t.Error("\n", bd.visualize())
		bd.assign(cl, p)
		t.Error("\n", bd.visualize())
		return
	}

	out := bd.String()

	for i := range out {
		if out[i] != targetState[i] {
			t.Error("failed\n", out, "\n", targetState)
			t.Error("\n", bd.visualize())
			return
		}
	}
}

func TestFlip(t *testing.T) {

	testFlip(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", WHITE, point{4, 0}, "++++O++++OO++OOOO+++OXOO++X+XX++++++")
	testFlip(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", WHITE, point{5, 2}, "+++++++++XX++OOOOO++OXOO++X+XX++++++")
	testFlip(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", BLACK, point{5, 2}, "+++++++++XX++OOOXX++OXOX++X+XX++++++")

}

func testRevert(t *testing.T, input string, cl color, p point) {

	bd := newBoardFromStr(input)
	orig := bd.String()
	origBoard := bd.Copy()

	hs := bd.put(cl, p)

	bd.revert(hs)
	afterRevert := bd.String()

	for i := 0; i < len(orig); i++ {
		if orig[i] != afterRevert[i] {
			t.Error("\n", origBoard.visualize(), "\n", bd.visualize())
		}
	}
}

func TestRevert(t *testing.T) {

	testRevert(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", WHITE, point{4, 0})
	testRevert(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", WHITE, point{5, 2})
	testRevert(t, "+++++++++XX++OOOX+++OXOO++X+XX++++++", BLACK, point{5, 2})

}

// func testPartialValueChange(t *testing.T, input string, p point, cl color) {
// 	ai := New(cl, 6, 0)

// 	bd := newBoardFromStr(input)

// 	currentV := bd.eval(ai.color, ai.opponent, ai.valueDisk)
// 	c := bd.Copy()
// 	if !c.putAndCheck(cl, p) {
// 		t.Error(c.visualize())
// 		c[p.x][p.y] = cl
// 		t.Error(c.visualize())
// 		t.Fatal("cannot put")
// 	}
// 	newV := c.eval(ai.color, ai.opponent, ai.valueDisk)

// 	aiV := bd.evalAfterPut(currentV, p, cl, ai.valueDisk)

// 	if newV != aiV {
// 		t.Error("error, orig:", currentV, "real:", newV, "but:", aiV)
// 		t.Error(c.visualize())
// 	}
// }

// func TestPartialValueChange(t *testing.T) {

// 	testPartialValueChange(t, "+++++++++++++XXX++++OXX+++O+++++++++", point{5, 3}, WHITE)
// 	testPartialValueChange(t, "++++++++++++XXOOO++XXOO+O+XXO++XXXO+", point{1, 4}, WHITE)
// 	testPartialValueChange(t, "++++++++O+X+XXOOO++XXXXXO+XXO+OOOOO+", point{1, 4}, WHITE)

// }
