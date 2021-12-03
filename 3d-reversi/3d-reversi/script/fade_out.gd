extends ColorRect

func _ready():
	self.show()

func _on_Fade_animation_finished(_anim_name):
	self.hide()
