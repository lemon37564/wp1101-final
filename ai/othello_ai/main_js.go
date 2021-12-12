//go:build js
// +build js

package main

import (
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

	if color == "1" {
		mainAi = ai.NewAI8(ai.BLACK, lv)
	} else {
		mainAi = ai.NewAI8(ai.WHITE, lv)
	}
	out, err := mainAi.Move(input)
	if err != nil {
		panic(err)
	}
	return out
}

func jsFuncWrapper() js.Func {
	// 傳回 JavaScript 函式
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		// 取得 JavaScript DOM 文件元素
		alert := js.Global().Get("alert")
		doc := js.Global().Get("document")
		label := doc.Call("getElementById", "result")
		if !label.Truthy() {
			alert.Invoke("網頁未包含 id='result' 元素")
			return nil
		}
		label.Set("innerHTML", "")
		// 開一個新的 Goroutine, 以免 http.Get 卡死 js.FuncOf
		go func() {
			// 呼叫 queryCovidCase
			result := aiThink(args[0].String(), args[1].String(), args[2].String())
			// 將查詢結果寫到網頁的 DOM 元素
			label.Set("innerHTML", result)
		}()
		return nil
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
