extends Label

func _process(_delta):
	self.text = "FPS " + String(Performance.get_monitor(Performance.TIME_FPS))
