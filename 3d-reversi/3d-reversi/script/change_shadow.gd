extends HBoxContainer

onready var light: Node = get_node("/root/GameScene/Light")

func _ready():
	assert(light != null)

func _on_On_toggled(button_pressed):
	light.shadow_enabled = button_pressed
	if button_pressed:
		print("shadow enabled")
	else:
		print("shadow disabled")
