extends Label

const TIME = 0.25

var counter: int = 0
var texts: Array = ["AIThinking1", "AIThinking2", "AIThinking3"]
var current_index: int = 0

func _ready():
	self.hide()

func _process(delta):
	counter += 1
	if counter % int(TIME / delta) == 0:
		current_index += 1
		self.text = texts[current_index % 3]
