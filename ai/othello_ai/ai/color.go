package ai

type color int8

const (
	NONE   color = 0
	BLACK  color = 1
	WHITE  color = -1
	BORDER color = 127
)

func (cl color) reverse() color {
	return -1 * cl
}

func (cl color) String() string {
	switch cl {
	case NONE:
		return "none"
	case BLACK:
		return "black"
	case WHITE:
		return "white"
	default:
		return "border"
	}
}
