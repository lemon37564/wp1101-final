extends Control

signal show_newgame_panel

var delay: int = -1
var delta_: float

var ai_level: String
var self_point: int
var enemy_point: int

func _process(delta):
	delta_ = delta
	delay -= 1
	if delay == 0:
		$Fold.play("unfold")

func _ready():
	self.rect_scale = Vector2(0, 0)
	self.hide()

func _on_NewGame_pressed():
	$Fold.play("fold")
	emit_signal("show_newgame_panel")

func _on_Close_pressed():
	$Fold.play("fold")

func delay_show(black_result: int, white_result: int, black_side_is_human: bool, white_side_is_human: bool, ai_strength: String):
	# 0.8 sec
	delay = int(0.8 / delta_)
	$HBox/NewGame.grab_focus()
	
	if black_result > white_result:
		$Result.text = "BlackWon"
	elif white_result > black_result:
		$Result.text = "WhiteWon"
	else:
		$Result.text = "Draw"
	
	if black_side_is_human:
		self_point = black_result
		enemy_point = white_result
	if white_side_is_human:
		self_point = white_result
		enemy_point = black_result
	ai_level = ai_strength
	if ((not black_side_is_human) and (not white_side_is_human)) or ((black_side_is_human) and (white_side_is_human)):
		$HBox2.hide()
	else:
		$HBox2.show()
		$HBox2/Label.text = "Name"
		$HBox2/LineEdit.show()
		$HBox2/Button.show()

func _on_Fold_animation_finished(anim_name):
	if anim_name == "fold":
		self.hide()

func _on_Fold_animation_started(anim_name):
	if anim_name == "unfold":
		self.show()

func _on_Button_pressed():
	$HBox2/Label.text = "Uploading"
	$HBox2/LineEdit.hide()
	$HBox2/Button.hide()
	
	var body = JSON.print({"name": $HBox2/LineEdit.text, "self_point": String(self_point), "enemy_point": String(enemy_point), "strength": ai_level})
	$HTTPRequest.request("https://ntou-sell.herokuapp.com/backend/leaderboard/post", ["Content-Type: application/json"], false, HTTPClient.METHOD_POST, body)

func _on_HTTPRequest_request_completed(result, response_code, _headers, body):
	print("result: ", result, " response code: ", response_code, " body: ", body.get_string_from_ascii())
	$HBox2/Label.text = "UploadDone"
