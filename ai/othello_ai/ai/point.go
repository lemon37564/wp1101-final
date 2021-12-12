package ai

type point struct {
	x, y int
}

func (p point) String() string {
	return string(rune('A'+p.y)) + string(rune('a'+p.x))
}
