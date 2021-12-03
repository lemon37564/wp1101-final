extends WorldEnvironment

func _on_Setting_quality_change(level):
	if level == 2:
		self.environment.ssao_enabled = true
		self.environment.ss_reflections_enabled = true
	elif level == 1:
		self.environment.ssao_enabled = false
		self.environment.ss_reflections_enabled = false
	else:
		self.environment.ssao_enabled = false
		self.environment.ss_reflections_enabled = false
