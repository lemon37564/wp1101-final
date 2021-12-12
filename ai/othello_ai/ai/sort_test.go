package ai

import (
	"math/rand"
	"sort"
	"testing"
	"time"
)

const size = 24

// avg: 180 ns/op 96 B/op 3 allocs/op
func BenchmarkSortBuiltIn(b *testing.B) {
	ns := make(nodes, size)
	rand.Seed(time.Now().Unix())
	for i := range ns {
		ns[i] = node{rand.Int(), rand.Intn(size)}
	}

	for i := 0; i < b.N; i++ {
		sort.Slice(ns, func(i, j int) bool {
			return ns[i].value < ns[j].value
		})
	}
}

// 2 times faster than standard libary sort (on small slices)
// much much slower on large slices
// avg: 90 ns/op 0 B/op 0 allocs/op
func BenchmarkQSortSimple(b *testing.B) {
	n := make(nodes, size)
	rand.Seed(time.Now().Unix())
	for i := range n {
		n[i] = node{rand.Int(), rand.Intn(size)}
	}

	for i := 0; i < b.N; i++ {
		qsortSimple(n)
	}
}

// modified from standard libary
// avg: 16.5 ns/op 0 B/op 0 allocs/op (10 times faster before modified)
func BenchmarkQSortModified(b *testing.B) {
	n := make(nodes, size)
	rand.Seed(time.Now().Unix())
	for i := range n {
		n[i] = node{rand.Int(), rand.Intn(size)}
	}

	for i := 0; i < b.N; i++ {
		qsort(n)
	}
}

// avg: 7.2 ns/op
func BenchmarkInsertionSort(b *testing.B) {
	n := make(nodes, size)
	rand.Seed(time.Now().Unix())
	for i := range n {
		n[i] = node{rand.Int(), rand.Intn(size)}
	}

	for i := 0; i < b.N; i++ {
		n.sortAsc()
	}
}

func qsortSimple(s []node) {
	if len(s) < 2 {
		return
	}

	left, right := 0, len(s)-1

	pivot := 0

	s[pivot], s[right] = s[right], s[pivot]

	for i := range s {
		if s[i].value < s[right].value {
			s[left], s[i] = s[i], s[left]
			left++
		}
	}

	s[left], s[right] = s[right], s[left]

	qsortSimple(s[:left])
	qsortSimple(s[left+1:])
}

func maxDepth(n int) int {
	var depth int
	for i := n; i > 0; i >>= 1 {
		depth++
	}
	return depth * 2
}

func qsort(data nodes) {
	length := len(data)
	quickSort_func(data, 0, length, maxDepth(length))
}

func quickSort_func(data nodes, a, b, maxDepth int) {
	for b-a > 12 {
		if maxDepth == 0 {
			heapSort_func(data, a, b)
			return
		}
		maxDepth--
		mlo, mhi := doPivot_func(data, a, b)
		if mlo-a < b-mhi {
			quickSort_func(data, a, mlo, maxDepth)
			a = mhi
		} else {
			quickSort_func(data, mhi, b, maxDepth)
			b = mlo
		}
	}
	if b-a > 1 {
		for i := a + 6; i < b; i++ {
			if data.Less(i, i-6) {
				data.Swap(i, i-6)
			}
		}
		insertionSort_func(data, a, b)
	}
}

func insertionSort_func(data nodes, a, b int) {
	for i := a + 1; i < b; i++ {
		for j := i; j > a && data.Less(j, j-1); j-- {
			data.Swap(j, j-1)
		}
	}
}

func medianOfThree_func(data nodes, m1, m0, m2 int) {
	if data.Less(m1, m0) {
		data.Swap(m1, m0)
	}
	if data.Less(m2, m1) {
		data.Swap(m2, m1)
		if data.Less(m1, m0) {
			data.Swap(m1, m0)
		}
	}
}

func doPivot_func(data nodes, lo, hi int) (midlo, midhi int) {
	m := int(uint(lo+hi) >> 1)
	if hi-lo > 40 {
		s := (hi - lo) / 8
		medianOfThree_func(data, lo, lo+s, lo+2*s)
		medianOfThree_func(data, m, m-s, m+s)
		medianOfThree_func(data, hi-1, hi-1-s, hi-1-2*s)
	}
	medianOfThree_func(data, lo, m, hi-1)
	pivot := lo
	a, c := lo+1, hi-1
	for ; a < c && data.Less(a, pivot); a++ {
	}
	b := a
	for {
		for ; b < c && !data.Less(pivot, b); b++ {
		}
		for ; b < c && data.Less(pivot, c-1); c-- {
		}
		if b >= c {
			break
		}
		data.Swap(b, c-1)
		b++
		c--
	}
	protect := hi-c < 5
	if !protect && hi-c < (hi-lo)/4 {
		dups := 0
		if !data.Less(pivot, hi-1) {
			data.Swap(c, hi-1)
			c++
			dups++
		}
		if !data.Less(b-1, pivot) {
			b--
			dups++
		}
		if !data.Less(m, pivot) {
			data.Swap(m, b-1)
			b--
			dups++
		}
		protect = dups > 1
	}
	if protect {
		for {
			for ; a < b && !data.Less(b-1, pivot); b-- {
			}
			for ; a < b && data.Less(a, pivot); a++ {
			}
			if a >= b {
				break
			}
			data.Swap(a, b-1)
			a++
			b--
		}
	}
	data.Swap(pivot, b-1)
	return b - 1, c
}

func siftDown_func(data nodes, lo, hi, first int) {
	root := lo
	for {
		child := 2*root + 1
		if child >= hi {
			break
		}
		if child+1 < hi && data.Less(first+child, first+child+1) {
			child++
		}
		if !data.Less(first+root, first+child) {
			return
		}
		data.Swap(first+root, first+child)
		root = child
	}
}

func heapSort_func(data nodes, a, b int) {
	first := a
	lo := 0
	hi := b - a
	for i := (hi - 1) / 2; i >= 0; i-- {
		siftDown_func(data, i, hi, first)
	}
	for i := hi - 1; i >= 0; i-- {
		data.Swap(first, first+i)
		siftDown_func(data, lo, i, first)
	}
}
