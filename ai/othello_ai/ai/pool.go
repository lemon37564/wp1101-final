package ai

// a customized pool that store nodes

// the allocation and deallocation of nodes is first-in-last-out
// so it can simply implement with stack
type pool struct {
	stack []nodes
	curr  int
}

const INIT_SIZE = 64

func newPool(cap int) pool {
	s := make([]nodes, 0)
	for i := 0; i < cap; i++ {
		s = append(s, make(nodes, 0, INIT_SIZE))
	}
	return pool{
		stack: s,
		curr:  0,
	}
}

// clear the slice to avoid data confusion
func (p *pool) getClearOne() nodes {
	ns := p.stack[p.curr]
	p.curr++
	return ns[:0]
}

// tell the pool that the slice is free
func (p *pool) freeOne() {
	p.curr--
}
