extends OptionButton

func _ready():
	self.disabled = true

func _on_Human_pressed():
	self.disabled = true

func _on_AI_pressed():
	self.disabled = false
