package ai

import (
	"math/rand"
	"testing"
)

// avg: 91.04 ns/op
func BenchmarkEvalNorm(b *testing.B) {
	bd := newBoardFromStr("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	for i := 0; i < b.N; i++ {
		bd.eval(BLACK, WHITE, VALUE8x8)
	}
}

// avg: 56.4 ns/op
func BenchmarkEvalB(b *testing.B) {
	bd := newBboard8("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	for i := 0; i < b.N; i++ {
		bd.eval(BLACK)
	}
}

// avg: 82 ns/op
func BenchmarkCountNorm(b *testing.B) {
	bd := newBoardFromStr("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	for i := 0; i < b.N; i++ {
		_ = bd.countPieces(BLACK) - bd.countPieces(WHITE)
	}
}

// avg: 8.4 ns/op
func BenchmarkCountB(b *testing.B) {
	bd := newBboard8("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	for i := 0; i < b.N; i++ {
		_ = bd.count(BLACK) - bd.count(WHITE)
	}
}

// avg: 564 ns/op 496 B/op 13 allocs/op
func BenchmarkCpy(b *testing.B) {
	bd := newBoardFromStr("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	for i := 0; i < b.N; i++ {
		bd.put(WHITE, point{4, 0})
		_ = bd.Copy()
	}
}

// avg: 170 ns/op 96 B/op 2 allocs/op
func BenchmarkRevertbd(b *testing.B) {
	bd := newBoardFromStr("+++++++++XX++OOOX+++OXOO++X+XX++++++")

	for i := 0; i < b.N; i++ {
		hs := bd.put(WHITE, point{4, 0})
		bd.revert(hs)
	}
}

// avg: 40 ns/op 0 B/op 0 allocs/op
func BenchmarkCpyb(b *testing.B) {
	bd := newBboard8("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	for i := 0; i < b.N; i++ {
		bd.put(WHITE, 32)
		_ = bd.cpy()
	}
}

func BenchmarkAccessNorm(b *testing.B) {
	bd := newBoardFromStr("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	p := point{4, 3}
	for i := 0; i < b.N; i++ {
		_ = bd.at(p)
	}
}

// almost the same ↑↓ (0.5 ns/op)

func BenchmarkAccessB(b *testing.B) {
	bd := newBboard8("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	loc := 28
	for i := 0; i < b.N; i++ {
		_ = bd.at(loc)
	}
}

// avg: 0.677 ns/op
func BenchmarkAssignNorm(b *testing.B) {
	bd := newBoardFromStr("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	p := point{4, 3}
	for i := 0; i < b.N; i++ {
		bd.assign(WHITE, p)
	}
}

// avg: 1.372 ns/op
func BenchmarkAssignB(b *testing.B) {
	bd := newBboard8("+++++++++++XO++++++OOX+++OOOOXO+++OOOOOO+OXOOXXX+++OOXX++++XO+++")
	loc := 28
	for i := 0; i < b.N; i++ {
		bd.assign(WHITE, loc)
	}
}

func BenchmarkHw(b *testing.B) {
	num := rand.Uint64()
	for i := 0; i < b.N; i++ {
		hammingWeight(num)
	}
}

func BenchmarkCasting(b *testing.B) {
	// 0.2533 ns/op
	a := uint64(365312)
	for i := 0; i < b.N; i++ {
		_ = int(a)
	}
}

const m1 uint64 = 0x5555555555555555  //binary: 0101...
const m2 uint64 = 0x3333333333333333  //binary: 00110011..
const m4 uint64 = 0x0f0f0f0f0f0f0f0f  //binary:  4 zeros,  4 ones ...
const m8 uint64 = 0x00ff00ff00ff00ff  //binary:  8 zeros,  8 ones ...
const m16 uint64 = 0x0000ffff0000ffff //binary: 16 zeros, 16 ones ...
const m32 uint64 = 0x00000000ffffffff //binary: 32 zeros, 32 ones
const h01 uint64 = 0x0101010101010101 //the sum of 256 to the power of 0,1,2,3...

func hammingWeight1(x uint64) int {
	x = (x & m1) + ((x >> 1) & m1)    //put count of each  2 bits into those  2 bits
	x = (x & m2) + ((x >> 2) & m2)    //put count of each  4 bits into those  4 bits
	x = (x & m4) + ((x >> 4) & m4)    //put count of each  8 bits into those  8 bits
	x = (x & m8) + ((x >> 8) & m8)    //put count of each 16 bits into those 16 bits
	x = (x & m16) + ((x >> 16) & m16) //put count of each 32 bits into those 32 bits
	x = (x & m32) + ((x >> 32) & m32) //put count of each 64 bits into those 64 bits
	return int(x)
}

//This uses fewer arithmetic operations than any other known
//implementation on machines with slow multiplication.
//This algorithm uses 17 arithmetic operations.
func hammingWeight2(x uint64) int {
	x -= (x >> 1) & m1             //put count of each 2 bits into those 2 bits
	x = (x & m2) + ((x >> 2) & m2) //put count of each 4 bits into those 4 bits
	x = (x + (x >> 4)) & m4        //put count of each 8 bits into those 8 bits
	x += x >> 8                    //put count of each 16 bits into their lowest 8 bits
	x += x >> 16                   //put count of each 32 bits into their lowest 8 bits
	x += x >> 32                   //put count of each 64 bits into their lowest 8 bits
	return int(x & 0x7f)
}

//This uses fewer arithmetic operations than any other known
//implementation on machines with fast multiplication.
//This algorithm uses 12 arithmetic operations, one of which is a multiply.
func hammingWeight3(x uint64) int {
	x -= (x >> 1) & m1             //put count of each 2 bits into those 2 bits
	x = (x & m2) + ((x >> 2) & m2) //put count of each 4 bits into those 4 bits
	x = (x + (x >> 4)) & m4        //put count of each 8 bits into those 8 bits
	return int((x * h01) >> 56)    //returns left 8 bits of x + (x<<8) + (x<<16) + (x<<24) + ...
}

// 0.2550 ns/op
func BenchmarkHammingWeight1(b *testing.B) {
	num := rand.Uint64()
	for i := 0; i < b.N; i++ {
		hammingWeight1(num)
	}
}

// 0.2567 ns/op
func BenchmarkHammingWeight2(b *testing.B) {
	num := rand.Uint64()
	for i := 0; i < b.N; i++ {
		hammingWeight2(num)
	}
}

// 0.2562 ns/op
func BenchmarkHammingWeight3(b *testing.B) {
	num := rand.Uint64()
	for i := 0; i < b.N; i++ {
		hammingWeight3(num)
	}
}
