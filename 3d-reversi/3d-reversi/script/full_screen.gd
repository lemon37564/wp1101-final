extends TextureButton

func _ready():
	if OS.get_name() == "Android":
		self.queue_free()

func _pressed():
	OS.window_fullscreen = !OS.window_fullscreen
