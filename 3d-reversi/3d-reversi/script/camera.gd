extends Camera

# move z to 0.375, move y to 0.85
const TARGET = Vector3(0, 0.85, 0.375)
const SPEED = 1.875

const ROTATE_TARGET_X = deg2rad(-72)
const ROTATE_TARGET_Y = 0
const FOV_TARGET = 75

const THRESHOLD = 1e-3
const START_GAME = 0.01

const FOV_MIN = 50
const FOV_MAX = 90

const ROTATE_MIN = deg2rad(-90)
const ROTATE_MAX = deg2rad(-55)
const ROTATE_SPEED = deg2rad(3)

const MOVE_SPEED = 0.062

var move_camera = true
var signal_emitted = false
var ctrl_pressed = false

signal camera_on_position

func _process(delta):
	if not move_camera:
		return

	var dist: float = 0
	dist += abs(self.translation.z - TARGET.z)
	dist += abs(self.rotation.x - ROTATE_TARGET_X)
	dist += abs(self.rotation.y - ROTATE_TARGET_Y)

	if dist > THRESHOLD:
		var speed: float = SPEED * delta
		self.translation = lerp(self.translation, TARGET, speed)
		self.rotation.x = lerp(self.rotation.x, ROTATE_TARGET_X, speed)
		self.rotation.y = lerp(self.rotation.y, ROTATE_TARGET_Y, speed)
		self.fov = lerp(self.fov, FOV_TARGET, speed)
	else:
		move_camera = false

	if not signal_emitted and dist < START_GAME:
		emit_signal("camera_on_position")
		signal_emitted = true

func _input(event):
	# need to be front of if move_camera: return otherwise ctrl_pressed wont be recorded when camera is moving
	if event.is_action_pressed("ctrl"):
		ctrl_pressed = true
	if event.is_action_released("ctrl"):
		ctrl_pressed = false

	if event.is_action_pressed("key_c"):
		move_camera = true

	if move_camera:
		return

	# if control is pressed then mouse wheel become zooming
	if ctrl_pressed:
		if event.is_action("scroll_up"):
			if self.fov >= FOV_MIN:
				self.fov -= 1
		elif event.is_action("scroll_down"):
			if self.fov <= FOV_MAX:
				self.fov += 1
	# if control not pressed then mouse wheel to rotate the camera (also moves camera to fit position)
	else:
		if event.is_action("scroll_up"):
			if self.rotation.x >= ROTATE_MIN:
				self.rotate_x(-ROTATE_SPEED)
				self.translation.z -= MOVE_SPEED
		elif event.is_action("scroll_down"):
			if self.rotation.x <= ROTATE_MAX:
				self.rotate_x(ROTATE_SPEED)
				self.translation.z += MOVE_SPEED
