extends TextureButton

const empty: Resource = preload("res://picture/square.png")
const black: Resource = preload("res://picture/black.png")
const white: Resource = preload("res://picture/white.png")

var counter: int = 0

func _pressed():
	counter += 1
	var current: int = counter % 3
	if current == 0:
		self.texture_normal = empty
	elif current == 1:
		self.texture_normal = black
	else:
		self.texture_normal = white

func color() -> String:
	var current: int = counter % 3
	if current == 0:
		return "_"
	elif current == 1:
		return "X"
	else:
		return "O"
