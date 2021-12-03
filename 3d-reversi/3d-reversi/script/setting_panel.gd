extends Control

onready var view_port: Viewport = get_viewport()

func _ready():
	self.hide()
	self.rect_scale = Vector2(0, 0)
	assert(view_port != null)
	view_port.fxaa = 0.4
	if TranslationServer.get_locale() != "en":
		$Buttons/Language/ZhTW.pressed = true

signal texture_change(texture)
signal animation_change(speed)
signal hint_change(show)
signal shadow_change(onoff)
signal quality_change(level)

func _input(event):
	if event.is_action_pressed("key_esc"):
		if self.visible:
			$Fold.play("fold")
		else:
			$Fold.play("unfold")
		$Buttons/Language/En.grab_focus()

func _on_SettingBtn_pressed():
	$Fold.play("unfold")

func _on_Close_pressed():
	$Fold.play("fold")

func _on_Default_pressed():
	$Buttons/Texture/Fabric.pressed = true
	$Buttons/Animation/Normal.pressed = true
	$Buttons/Hint/On.pressed = true
	$Buttons/Shadow/Off.pressed = true
	$Buttons/AA/Medium.pressed = true
	$Buttons/Quality/Medium.pressed = true
	_on_Fabric_pressed()
	_on_Animation_Normal_pressed()
	_on_hint_On_toggled(true)
	_on_Shadow_toggled(false)
	_on_anti_aliasing_medium()
	_on_quality_medium()

func _on_En_pressed():
	TranslationServer.set_locale("en")

func _on_ZhTW_pressed():
	TranslationServer.set_locale("zh-TW")

func _on_Fabric_pressed():
	emit_signal("texture_change", "fabric")

func _on_Metal_pressed():
	emit_signal("texture_change", "metal")

func _on_Animation_Fast_pressed():
	emit_signal("animation_change", 2)

func _on_Animation_Normal_pressed():
	emit_signal("animation_change", 1)

func _on_Animation_Disable_pressed():
	# for non cyclic animation, if it's speed is INF, then it is equivalent to no animation
	emit_signal("animation_change", INF)

func _on_hint_On_toggled(button_pressed):
	emit_signal("hint_change", button_pressed)

func _on_Shadow_toggled(button_pressed):
	emit_signal("shadow_change", button_pressed)

func _on_anti_aliasing_high():
	view_port.fxaa = false
	view_port.msaa = Viewport.MSAA_16X

func _on_anti_aliasing_medium():
	view_port.fxaa = false
	view_port.msaa = Viewport.MSAA_4X
	
func _on_anti_aliasing_low():
	view_port.msaa = Viewport.MSAA_DISABLED
	view_port.fxaa = true

func _on_anti_aliasing_disable():
	view_port.msaa = Viewport.MSAA_DISABLED
	view_port.fxaa = false

func _on_quality_high():
	emit_signal("quality_change", 2)

func _on_quality_medium():
	emit_signal("quality_change", 1)

func _on_quality_low():
	emit_signal("quality_change", 0)
	
func _on_Fold_animation_finished(anim_name):
	if anim_name == "fold":
		self.hide()

func _on_Fold_animation_started(anim_name):
	if anim_name == "unfold":
		self.show()
