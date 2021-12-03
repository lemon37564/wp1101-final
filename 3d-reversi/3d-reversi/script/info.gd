extends Control


func _ready():
	self.hide()
	self.rect_scale = Vector2(0, 0)

func _on_InfoBtn_pressed():
	$Fold.play("unfold")

func _on_close():
	$Fold.play("fold")

func _on_SourceCode_pressed():
	if OS.shell_open("https://github.com/lemon37564/godot-3d-reversi") != OK:
		OS.alert("cannot open URL", "error")

func _on_Fold_animation_finished(anim_name):
	if anim_name == "fold":
		self.hide()

func _on_Fold_animation_started(anim_name):
	if anim_name == "unfold":
		self.show()
