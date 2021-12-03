extends Spatial

enum Stone {NONE = 0, BLACK = 1, WHITE = 2, BORDER = -1}

var fabric_black: Resource = preload("res://material/fabric_black.material")
var fabric_white: Resource = preload("res://material/fabric_white.material")

var ceramics_black: Resource = preload("res://material/metal_black.material")
var ceramics_white: Resource = preload("res://material/metal_white.material")

var self_color = Stone.WHITE

func _ready():
	assert(fabric_black != null and fabric_white != null)
	assert(ceramics_white != null and ceramics_black != null)

func reverse(s: int) -> int:
	assert(s == Stone.BLACK or s == Stone.WHITE)
	match s:
		Stone.BLACK:
			return Stone.WHITE
		Stone.WHITE:
			return Stone.BLACK
		_:
			return Stone.NONE

func set_texture(texture: String):
	if texture == "fabric":
		$Mesh.set_surface_material(0, fabric_black)
		$Mesh.set_surface_material(1, fabric_white)
	else:
		$Mesh.set_surface_material(0, ceramics_black)
		$Mesh.set_surface_material(1, ceramics_white)

func set_animation_speed(speed: float):
	$Mesh/Animation.playback_speed = speed

func play_animation_flip():
	if self_color == Stone.WHITE:
		$Mesh/Animation.play("flip")
	else:
		$Mesh/Animation.play_backwards("flip")
	self_color = reverse(self_color)

func play_anmiation_put():
	$Mesh/Animation.play("put")

func play_animation_leave():
	$Mesh/Animation.play("leave")

func set_to_color(color: int):
	self_color = color
	if color == Stone.BLACK:
		$Mesh.rotation = Vector3(PI, 0, 0)
	else:
		$Mesh.rotation = Vector3(0, 0, 0)

func _on_Animation_finished(anim_name):
	if anim_name == "leave":
		self.queue_free()
