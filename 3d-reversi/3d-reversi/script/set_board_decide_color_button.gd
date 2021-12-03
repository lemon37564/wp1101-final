extends TextureButton

const black: Resource = preload("res://picture/black.png")
const white: Resource = preload("res://picture/white.png")

var i: int = 0

func _pressed():
	i += 1
	if i % 2 == 0:
		self.texture_normal = black
	else:
		self.texture_normal = white

func color() -> String:
	if i % 2 == 0:
		return "X"
	else:
		return "O"
