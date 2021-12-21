//go:build js
// +build js

package main

import (
	"time"

	"reversi/ai"
	"syscall/js"
)

func aiThink(input string, color string, strength string) string {
	var mainAi *ai.AI8
	var lv ai.Level

	if strength == "0" {
		lv = ai.LV_ONE
	} else if strength == "1" {
		lv = ai.LV_THREE
	} else {
		lv = ai.LV_FIVE
	}

	t := time.Now()
	if color == "1" {
		mainAi = ai.NewAI8(ai.BLACK, lv)
	} else {
		mainAi = ai.NewAI8(ai.WHITE, lv)
	}
	out, err := mainAi.Move(input)
	if err != nil {
		panic(err)
	}

	spent := time.Since(t)
	if spent < time.Millisecond*650 {
		time.Sleep(time.Millisecond*650 - spent)
	}
	return out
}

func jsFuncWrapper() js.Func {
	// 傳回 JavaScript 函式
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		result := aiThink(args[0].String(), args[1].String(), args[2].String())
		return result
	})
}

func main() {
	// 註冊 JavaScript 函式, 結束時釋出資源
	jsFunc := jsFuncWrapper()
	js.Global().Set("aiThink", jsFunc)
	defer jsFunc.Release()
	// 用空 select 卡住主程式
	select {}
}
