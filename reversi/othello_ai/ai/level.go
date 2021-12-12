package ai

import "fmt"

type Level int

func (lv Level) String() string {
	return fmt.Sprintf("level %d", lv+1)
}

const (
	LV_ONE Level = iota
	LV_TWO
	LV_THREE
	LV_FOUR
	LV_FIVE
)
