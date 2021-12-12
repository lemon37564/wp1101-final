package ai

import (
	"math/rand"
)

type node struct {
	loc   int
	value int
}

type nodes []node

func (ns nodes) Less(i, j int) bool {
	return ns[i].value < ns[j].value // ascending order
}

func (ns nodes) Large(i, j int) bool {
	return ns[i].value > ns[j].value // descending order
}

func (ns nodes) Swap(i, j int) {
	ns[i], ns[j] = ns[j], ns[i]
}

// provide randomness
func (ns nodes) shuffle() {
	rand.Shuffle(len(ns), func(i, j int) {
		ns[i], ns[j] = ns[j], ns[i]
	})
}

// on smaller slices, insertion sort is faster
// since it has lower overhead
func (ns nodes) sortDesc() {
	length := len(ns)
	if length > 1 {
		for i := 1; i < length; i++ {
			for j := i; j > 0 && ns.Large(j, j-1); j-- {
				ns.Swap(j, j-1)
			}
		}
	}
}

func (ns nodes) sortAsc() {
	length := len(ns)
	if length > 1 {
		for i := 1; i < length; i++ {
			for j := i; j > 0 && ns.Less(j, j-1); j-- {
				ns.Swap(j, j-1)
			}
		}
	}
}
