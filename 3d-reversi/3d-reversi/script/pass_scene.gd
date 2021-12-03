extends Control

signal confirm_pass

func _ready():
	self.hide()
	self.rect_scale = Vector2(0, 0)

func set_text(text: String):
	$Msg.text = text

func show_with_anime():
	$Fold.play("unfold")

func _on_Ok_pressed():
	$Fold.play("fold")
	emit_signal("confirm_pass")

func _on_Fold_animation_finished(anim_name):
	if anim_name == "fold":
		self.hide()

func _on_Fold_animation_started(anim_name):
	if anim_name == "unfold":
		self.show()
