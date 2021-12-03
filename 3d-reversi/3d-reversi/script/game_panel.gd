extends Control

signal game_start(player1_role, player2_role, first_color)

func _ready():
	self.rect_scale = Vector2(0, 0)

func _on_Start_pressed():
	$Fold.play("fold")
	var first = "white"
	if $WhoFirst/Black.pressed:
		first = "black"
	var player1 = "human"
	if $BlackSide/Player/AI.pressed:
		player1 = String($BlackSide/HBox/StrengthOption.selected)
	var player2 = "human"
	if $WhiteSide/Player/AI.pressed:
		player2 = String($WhiteSide/HBox/StrengthOption.selected)
	emit_signal("game_start", player1, player2, first)

func _on_Camera_on_position():
	# first time, hide the X button
	$Cancel.hide()
	$Fold.play("unfold")
	$BlackSide/Player/Human.grab_focus()

func _on_Close_pressed():
	$Fold.play("fold")

func _on_NewGameBtn_pressed():
	$Cancel.show()
	$BlackSide/Player/Human.grab_focus()
	$Fold.play("unfold")

func _on_GameOver_show_newgame_panel():
	$Fold.play("unfold")

func _on_Fold_animation_finished(anim_name):
	if anim_name == "fold":
		self.hide()

func _on_Fold_animation_started(anim_name):
	if anim_name == "unfold":
		self.show()
