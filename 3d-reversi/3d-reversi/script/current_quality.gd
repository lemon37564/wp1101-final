extends Label

func _on_QualityLevel_value_changed(value):
	if int(value) == 0:
		self.text = "低"
	elif int(value) == 1:
		self.text = "中"
	else:
		self.text = "高"
