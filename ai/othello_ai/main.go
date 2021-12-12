//go:build !js
// +build !js

package main

import (
	"fmt"
	"reversi/ai"

	"github.com/pkg/profile"
)

func main() {
	defer profile.Start(profile.BlockProfile, profile.CPUProfile).Stop()

	var input string
	var color int
	var mainAi *ai.AI8

	fmt.Scan(&input, &color)
	if color == 1 {
		mainAi = ai.NewAI8(ai.BLACK, ai.LV_FIVE)
	} else {
		mainAi = ai.NewAI8(ai.WHITE, ai.LV_FIVE)
	}
	out, err := mainAi.Move(input)
	if err != nil {
		panic(err)
	}
	fmt.Println(out)

	for {
		n, _ := fmt.Scan(&input, &color)
		if n == 0 {
			break
		}

		if color == 1 {
			mainAi = ai.NewAI8(ai.BLACK, ai.LV_FIVE)
		} else {
			mainAi = ai.NewAI8(ai.WHITE, ai.LV_FIVE)
		}

		out, err := mainAi.Move(input)
		if err != nil {
			panic(err)
		}
		fmt.Println(out)
	}
}
