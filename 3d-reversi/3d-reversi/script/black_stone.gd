extends Spatial

const LIFT_TIMES = 5
const LIFT_PER_FRAME = 0.01

enum STATE {NORMAL, PLAYING_ANIMATION, GOUP, ROTATING, GOBACK}

var current = STATE.NORMAL
var rotate = 0
var lifted = 0

# Called when the node enters the scene tree for the first time.
func _ready():
	var button = Button.new()
	button.text = "Click me"
	button.connect("pressed", self, "_button_pressed")
	add_child(button)

	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _physics_process(delta):
	if current == STATE.GOUP:
		if lifted != LIFT_TIMES:
			translate(Vector3(0, -LIFT_PER_FRAME, 0))
			lifted += 1
		else:
			current = STATE.ROTATING
	elif current == STATE.ROTATING:
		if rotate != 180:
			rotate_object_local(Vector3(1, 0, 0), deg2rad(5))
			#rotate_object_local(Vector3(0, 0, 1), deg2rad(5))
			rotate += 5
		else:
			current = STATE.GOBACK
	elif current == STATE.GOBACK:
		if lifted != 0:
			translate(Vector3(0, -LIFT_PER_FRAME, 0))
			lifted -= 1
		else:
			current = STATE.NORMAL
			lifted = 0
			rotate = 0

func _button_pressed():
	if current == STATE.NORMAL:
		current = STATE.GOUP
