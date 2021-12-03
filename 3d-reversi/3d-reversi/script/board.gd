extends StaticBody

enum Stone {NONE = 0, BLACK = 1, WHITE = 2, BORDER = -1}

const IDENTIFIER = {Stone.NONE: "_", Stone.BLACK: "X", Stone.WHITE: "O", Stone.BORDER: "E"}

const stone_scene = preload("res://scene/Stone.tscn")
const hint_scene = preload("res://scene/hint.tscn")

# Y axis is 0.045 on board
const Y_ON_BOARD = 0.045
# the left-top of board is (-0.463, Y_HEIGHT, -0.463)
const LEFT_TOP = Vector3(-0.463, 0, -0.46)
# cell size is 0.13225 x 0.13225
const STONE_SIZE = 0.13225
const BOARD_SIZE = 8
const BIAS = Vector3(STONE_SIZE/2, STONE_SIZE/2, STONE_SIZE/2)

# use global coordinates, not local to node
onready var space_state: PhysicsDirectSpaceState = get_world().get_direct_space_state()
onready var locater: Spatial = $Locater

onready var camera: Node = get_node("/root/GameScene/Camera")
onready var game_panel = get_node("/root/GameScene/GamePanel")
onready var setting_panel = get_node("/root/GameScene/Setting")
onready var info_panel = get_node("/root/GameScene/Info")
onready var game_over_panel = get_node("/root/GameScene/GameOver")
onready var set_board_panel = get_node("/root/GameScene/SetBoard")
onready var pass_dialog = get_node("/root/GameScene/Pass")
onready var regret_button = get_node("/root/GameScene/Buttons/Regret")
onready var side_label = get_node("/root/GameScene/HUD/Turn")
onready var side_label2 = get_node("/root/GameScene/Thinking")
onready var counter = get_node("/root/GameScene/HUD")
onready var black_counter = get_node("/root/GameScene/HUD/Black/BlackCount")
onready var white_counter = get_node("/root/GameScene/HUD/White/WhiteCount")

var board: Board
var current_texture: String = "fabric"
var animation_speed: float = 1
var show_hint: bool = true
var ai_thinking: bool = false
var game_over: bool = false

var current_player: Player
var player1: Player
var player2: Player

func _ready():
	assert(stone_scene != null and locater != null and regret_button != null)
	assert(game_panel != null and setting_panel != null and info_panel != null and game_over_panel != null)
	assert(pass_dialog != null and side_label != null and side_label2 != null and set_board_panel != null)
	assert(counter != null and black_counter != null and white_counter != null)
	counter.hide()
	locater.hide()

func _input(event):
	# if panel shows then don't handle input
	if game_panel.is_visible_in_tree() or setting_panel.is_visible_in_tree() or info_panel.is_visible_in_tree() \
	or pass_dialog.is_visible_in_tree() or set_board_panel.is_visible_in_tree() or game_over:
		return
		
	if current_player == null or current_player.is_ai():
		return
	
	if (event.is_action_released("click") or event is InputEventScreenTouch):
		var collision = self._convert_mouse_2d_to_3d(event.position)
		if collision.size() == 0:
			return

		# convert to board coordinate first then convert back
		var pos: Vector3 = collision["position"]
		var board_coordinate: Array = convert_real_2_board_coordinate(pos)
		if not check_board_coordinate(board_coordinate):
			return
		var world_coordinate: Vector3 = convert_board_2_real_coordinate(board_coordinate)
		
		# double check, only put if selected and preseed, select it otherwise
		if locater.translation == world_coordinate:
			put_to_game_board(board_coordinate)
		else:
			locater.translation = world_coordinate
	else:
		handle_locater_by_ui_keys(event)

func _process(_delta):
	if game_panel.is_visible_in_tree() or setting_panel.is_visible_in_tree() or info_panel.is_visible_in_tree() \
	or pass_dialog.is_visible_in_tree() or set_board_panel.is_visible_in_tree() or game_over:
		return

	if current_player != null and current_player.is_ai() and not ai_thinking:
		ai_thinking = true
		regret_button.disabled = true
		current_player.ai_move(board.string())

func put_to_game_board(board_coordinate: Array):
	if board.can_put(board_coordinate[0], board_coordinate[1], current_player.color):
		board.put(board_coordinate[0], board_coordinate[1], current_player.color)
		
		var me: Player = current_player
		var enemy: Player = current_player.next_player
		var enemy_is_able_to_move: bool = board.all_valid_point(enemy.color).size() > 0
		var i_am_able_to_move: bool = board.all_valid_point(me.color).size() > 0

		# enemy can move, his turn
		if enemy_is_able_to_move:
			current_player = enemy
			_update_label()
			_update_hints()
			_update_counter()
			return
		# enemy cannot move, pass
		else:
			if i_am_able_to_move:
				# if enemy is human, show dialog that enemy need to pass
				if enemy.is_human():
					pass_dialog.set_text("PassMe")
				# if enemy is ai, show dialog that ai need to pass
				else:
					pass_dialog.set_text("PassAI")
				pass_dialog.show_with_anime()
				_update_hints()
			# nobody can move, game is over
			else:
				_deal_game_over()

func handle_locater_by_ui_keys(event):
	if event.is_action_pressed("ui_left", true):
		var board_coordinate: Array = convert_real_2_board_coordinate(locater.translation)
		board_coordinate[0] -= 1
		if check_board_coordinate(board_coordinate):
			locater.translation = convert_board_2_real_coordinate(board_coordinate)
	elif event.is_action_pressed("ui_right", true):
		var board_coordinate: Array = convert_real_2_board_coordinate(locater.translation)
		board_coordinate[0] += 1
		if check_board_coordinate(board_coordinate):
			locater.translation = convert_board_2_real_coordinate(board_coordinate)
	elif event.is_action_pressed("ui_up", true):
		var board_coordinate: Array = convert_real_2_board_coordinate(locater.translation)
		board_coordinate[1] -= 1
		if check_board_coordinate(board_coordinate):
			locater.translation = convert_board_2_real_coordinate(board_coordinate)
	elif event.is_action_pressed("ui_down", true):
		var board_coordinate: Array = convert_real_2_board_coordinate(locater.translation)
		board_coordinate[1] += 1
		if check_board_coordinate(board_coordinate):
			locater.translation = convert_board_2_real_coordinate(board_coordinate)
	elif event.is_action_pressed("ui_accept"):
		var board_coordinate: Array = convert_real_2_board_coordinate(locater.translation)
		put_to_game_board(board_coordinate)

func check_board_coordinate(board_coordinate: Array) -> bool:
	return board_coordinate[0] >= 0 and board_coordinate[0] < BOARD_SIZE and \
	board_coordinate[1] >= 0 and board_coordinate[1] < BOARD_SIZE

func reverse(s: int) -> int:
	assert(s == Stone.BLACK or s == Stone.WHITE)
	match s:
		Stone.BLACK:
			return Stone.WHITE
		Stone.WHITE:
			return Stone.BLACK
		_:
			return Stone.NONE
	
# https://docs.godotengine.org/zh_TW/stable/tutorials/physics/ray-casting.html#d-ray-casting-from-screen
func _convert_mouse_2d_to_3d(pos) -> Dictionary:
	var RAY_LENGTH: int = 10
	var from = camera.project_ray_origin(pos)
	var to = from + camera.project_ray_normal(pos) * RAY_LENGTH
	return space_state.intersect_ray(from, to)

# convert the real world coordinate to bord coordinate
func convert_real_2_board_coordinate(real_co: Vector3) -> Array:
	# set the left-top as Board(0, 0)
	real_co = real_co - LEFT_TOP + BIAS
	var board_coordinate: Array = [real_co.x, real_co.z]
	# fit in cell properlly
	board_coordinate[0] /= STONE_SIZE
	board_coordinate[1] /= STONE_SIZE
	board_coordinate[0] = int(board_coordinate[0])
	board_coordinate[1] = int(board_coordinate[1])
	return board_coordinate

# convert the board coordinate to real world coordinate
func convert_board_2_real_coordinate(board_co: Array) -> Vector3:
	var world_coordinate: Vector3 = Vector3()
	world_coordinate.x = float(board_co[0]) * STONE_SIZE
	world_coordinate.z = float(board_co[1]) * STONE_SIZE
	world_coordinate += LEFT_TOP
	world_coordinate.y = Y_ON_BOARD
	return world_coordinate

func create_stone_mesh(s: int, pos: Array) -> Spatial:
	var new_stone: Spatial = stone_scene.instance()
	var world_coordinate = convert_board_2_real_coordinate(pos)
	new_stone.translation = world_coordinate
	new_stone.set_to_color(s)
	new_stone.set_texture(current_texture)
	new_stone.set_animation_speed(animation_speed)
	$Stones.add_child(new_stone)
	new_stone.play_anmiation_put()
	return new_stone

func _deal_game_over():
	side_label.text = "GameOver"
	side_label2.hide()
	_update_hints()
	_update_counter()
	var black_count = board.count_pieces(Stone.BLACK)
	var white_count = board.count_pieces(Stone.WHITE)
	var ai_level = ""
	if player1.is_ai():
		ai_level = player1.ai_level
	if player2.is_ai():
		ai_level = player2.ai_level
	game_over_panel.delay_show(black_count, white_count, player1.is_human(), player2.is_human(), ai_level)
	game_over = true
	locater.hide()

func _update_hints():
	if show_hint and current_player.is_human():
		for hint in $Hints.get_children():
			hint.queue_free()
		for ava in board.all_valid_point(current_player.color):
			var hint = hint_scene.instance()
			hint.translation = convert_board_2_real_coordinate(ava)
			$Hints.add_child(hint)
	else:
		for hint in $Hints.get_children():
			hint.queue_free()

func _update_label():
	if current_player.color == Stone.BLACK:
		side_label.text = "BlacksTurn"
	else:
		side_label.text = "WhitesTurn"
	if current_player.is_ai():
		side_label2.show()
	else:
		side_label2.hide()

func _update_counter():
	black_counter.text = String(board.count_pieces(Stone.BLACK))
	white_counter.text = String(board.count_pieces(Stone.WHITE))

func _on_game_start(player1_role: String, player2_role: String, first_color: String):
	_clean_up()
	board = Board.new(self)
	
	var fst = Stone.WHITE
	if first_color == "black":
		fst = Stone.BLACK
	
	player1 = Player.new(self, player1_role, fst)
	player2 = Player.new(self, player2_role, reverse(fst))
	player1.set_next_player(player2)
	player2.set_next_player(player1)
	current_player = player1
	
	# if someone is ai, hide item which is not needed
	if player1.is_ai() or player2.is_ai():
		regret_button.hide()
	# show
	else:
		regret_button.show()
	
	if player1.is_ai() and player2.is_ai():
		locater.hide()
	else:
		locater.show()
		
	_update_label()
	_update_hints()
	_update_counter()
	locater.translation = convert_board_2_real_coordinate([4, 4])
	counter.show()
	game_over = false

# clean unnecessarily meshes
func _clean_up():
	for hint in $Hints.get_children():
		hint.queue_free()
	for stone in $Stones.get_children():
		stone.queue_free()

func _on_texture_change(texture):
	current_texture = texture
	$Mesh.set_texture(texture)
	for stone in $Stones.get_children():
		stone.set_texture(texture)

func _on_animation_change(speed):
	if speed != INF:
		locater.get_child(1).playback_speed = speed
		locater.get_child(1).play()
	else:
		# false means pause
		locater.get_child(1).stop(false)
	animation_speed = speed
	for stone in $Stones.get_children():
		stone.set_animation_speed(speed)

func _on_Setting_hint_change(show):
	show_hint = show
	if show:
		_update_hints()
	else:
		for hint in $Hints.get_children():
			hint.queue_free()

# on regret pressed then current_player must be human
func _on_Regret_pressed():
	# revert until it is current_player's turn
	while board.can_revert():
		if board.revert() == current_player.color:
			break
		else:
			# special case: if revert all but still not current_player's turn, switch to next player
			if not board.can_revert():
				current_player = current_player.next_player
	_update_hints()
	_update_counter()
	_update_label()
	# set game_over to false because if game was over and press regret, then game is started again
	game_over = false
	# same as above
	locater.show()

func _on_SetBoard_assign_board(input: String, color: String):
	var cur_color: int
	if color == "O":
		cur_color = Stone.WHITE
	else:
		cur_color = Stone.BLACK
	if current_player.color != cur_color:
		current_player = current_player.next_player
	_clean_up()
	board.assign_board(input)
	if board.is_over():
		_deal_game_over()
	else:
		game_over = false
		locater.show()
		_update_label()
		_update_hints()
		_update_counter()

func _on_HTTPRequest_request_completed(_result, _response_code, _headers, body):
	var res: String = body.get_string_from_utf8()
	print_debug("get result: ", res)
	put_to_game_board([int(res[0]), int(res[1])])
	ai_thinking = false
	regret_button.disabled = false

class Board:
	const DIRECTION = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
	
	var virt_board: Array
	var real_board: Array
	var game_history: Array
	
	######### delete this after godot 4.0
	var outside

	func _init(outs):
		######## delete this after godot 4.0
		self.outside = outs
		self.game_history = Array()
		self.virt_board = Array()
		# +2 to create border
		for _i in range(BOARD_SIZE + 2):
			var tmp: Array = Array()
			for _j in range(BOARD_SIZE + 2):
				tmp.append(Stone.NONE)
			self.virt_board.append(tmp)
		# border
		for i in range(BOARD_SIZE + 2):
			self.virt_board[0][i] = Stone.BORDER
			self.virt_board[i][0] = Stone.BORDER
			self.virt_board[BOARD_SIZE+1][i] = Stone.BORDER
			self.virt_board[i][BOARD_SIZE+1] = Stone.BORDER
		# initial stones
		self.assign(3, 3, Stone.WHITE)
		self.assign(4, 4, Stone.WHITE)
		self.assign(3, 4, Stone.BLACK)
		self.assign(4, 3, Stone.BLACK)
		
		self.real_board = Array()
		for _i in range(BOARD_SIZE):
			var tmp: Array = Array()
			for _j in range(BOARD_SIZE):
				tmp.append(null)
			self.real_board.append(tmp)
		
		var ms: Spatial
		ms = self.outside.create_stone_mesh(Stone.WHITE, [3, 3])
		self.real_board[3][3] = ms
		ms = self.outside.create_stone_mesh(Stone.WHITE, [4, 4])
		self.real_board[4][4] = ms
		ms = self.outside.create_stone_mesh(Stone.BLACK, [3, 4])
		self.real_board[3][4] = ms
		ms = self.outside.create_stone_mesh(Stone.BLACK, [4, 3])
		self.real_board[4][3] = ms
		
	func string() -> String:
		var res: String = ""
		for i in range(BOARD_SIZE):
			for j in range(BOARD_SIZE):
				res += IDENTIFIER[self.at(j, i)]
		return res

	func visualize() -> String:
		var col = ["A ", "B ", "C ", "D ", "E ", "F ", "G ", "H "]
		var res: String = "  a b c d e f g h\n"
		for i in range(BOARD_SIZE):
			res += col[i]
			for j in range(BOARD_SIZE):
				res += IDENTIFIER[self.at(j, i)] + " "
			res += "\n"
		return res
	
	func assign_board(input: String):
		var index: int = 0
		var ms: Spatial
		self.game_history = Array()
		for i in range(BOARD_SIZE):
			for j in range(BOARD_SIZE):
				match input[index]:
					'_':
						self.assign(j, i, Stone.NONE)
					'X':
						self.assign(j, i, Stone.BLACK)
						ms = self.outside.create_stone_mesh(Stone.BLACK, [j, i])
						self.real_board[j][i] = ms
					'O':
						self.assign(j, i, Stone.WHITE)
						ms = self.outside.create_stone_mesh(Stone.WHITE, [j, i])
						self.real_board[j][i] = ms
					_:
						assert(1 == 0)
				index += 1

	func at(x: int, y: int) -> int:
		return self.virt_board[x+1][y+1]

	func assign(x: int, y: int, s: int):
		self.virt_board[x+1][y+1] = s

	func can_put(x: int, y: int, s: int) -> bool:
		if x < 0 or x > BOARD_SIZE or y < 0 or y > BOARD_SIZE:
			return false
		if self.at(x, y) != Stone.NONE:
			return false
		return self.is_valid_point(x, y, s)

	func put(x: int, y: int, s: int):
		assert(self.can_put(x, y, s))
		var ms: Spatial = self.outside.create_stone_mesh(s, [x, y])
		self.real_board[x][y] = ms
		self.assign(x, y, s)
		self.flip(x, y, s)
	
	func can_revert() -> bool:
		return self.game_history.size() > 0
	
	# use stored history to revert board
	func revert() -> int:
		var hs: History = self.game_history.pop_back()
		if hs == null:
			return Stone.NONE
		var x: int = hs.put_position[0]
		var y: int = hs.put_position[1]
		var my_color = self.at(x, y)
		var orig_color = self.outside.reverse(my_color)
		self.assign(hs.put_position[0], hs.put_position[1], Stone.NONE)
		self.real_board[hs.put_position[0]][hs.put_position[1]].play_animation_leave()
		for flip_stone in hs.flips:
			for i in range(1, flip_stone[2]+1):
				self.real_board[x + flip_stone[0]*i][y + flip_stone[1]*i].play_animation_flip()
				self.assign(x + flip_stone[0]*i, y + flip_stone[1]*i, orig_color)
		return my_color

	func is_valid_point(x: int, y: int, s: int) -> bool:
		if self.at(x, y) != Stone.NONE:
			return false
		for i in range(BOARD_SIZE):
			if self.count_flip_pieces(x, y, s, DIRECTION[i]) > 0:
				return true
		return false

	func count_flip_pieces(x: int, y: int, s: int, dir: Array) -> int:
		var count: int = 0
		var oppo: int = self.outside.reverse(s)
		
		x = x + dir[0]
		y = y + dir[1]
		if self.at(x, y) != oppo:
			return 0
		count += 1
		
		var now: int
		while true:
			x = x + dir[0]
			y = y + dir[1]
			now = self.at(x, y)
			if now != oppo:
				if now == s:
					return count
				else:
					return 0
			count += 1
		return -1

	func flip(x: int, y: int, s: int):
		var count: int
		var hs: History = History.new([x, y])
		for i in range(BOARD_SIZE):
			count = self.count_flip_pieces(x, y, s, DIRECTION[i])
			if count > 0:
				hs.add_dir(DIRECTION[i], count)
				for j in range(1, count+1):
					self.real_board[x + DIRECTION[i][0]*j][y + DIRECTION[i][1]*j].play_animation_flip()
					self.assign(x + DIRECTION[i][0]*j, y + DIRECTION[i][1]*j, s)
		self.game_history.append(hs)
		
	func all_valid_point(s: int) -> Array:
		var all: Array = Array()
		for i in range(BOARD_SIZE):
			for j in range(BOARD_SIZE):
				if self.is_valid_point(i, j, s):
					all.append([i, j])
		return all

	func count_pieces(s: int) -> int:
		var count: int = 0
		for i in range(BOARD_SIZE):
			for j in range(BOARD_SIZE):
				if self.at(i, j) == s:
					count += 1
		return count

	func empty_count() -> int:
		return self.count_pieces(Stone.NONE)

	func winner() -> int:
		var black: int = self.count_pieces(Stone.BLACK)
		var white: int = self.count_pieces(Stone.WHITE)
		
		if black > white:
			return Stone.BLACK
		elif black < white:
			return Stone.WHITE
		else:
			return Stone.NONE

	func is_over() -> bool:
		for i in range(BOARD_SIZE):
			for j in range(BOARD_SIZE):
				if self.is_valid_point(i, j, Stone.BLACK):
					return false
				if self.is_valid_point(i, j, Stone.WHITE):
					return false
		return true

class History:
	# [int, int]
	var put_position: Array
	# [int, int, int], first two int describe direction, last int describe flip count
	var flips: Array
	
	func _init(position: Array):
		self.put_position = position
		self.flips = Array()
	
	func add_dir(dir: Array, count: int):
		self.flips.append([dir[0], dir[1], count])

class Player:
	var role: String
	var ai_level: String
	var color: int # change into type: Stone in godot 4.0
	var next_player: Player
	
	##### remove this in godot 4.0
	var outside
	
	func _init(outside_, role_: String, color_):
		if role_ == "human":
			self.role = "human"
			self.ai_level = "-1"
		else:
			self.role = "ai"
			self.ai_level = role_
		self.color = color_
		self.outside = outside_
	
	func set_next_player(next_player_: Player):
		assert(next_player_ != null)
		self.next_player = next_player_
	
	func is_human() -> bool:
		return self.ai_level == "-1"
	
	func is_ai() -> bool:
		return self.ai_level != "-1"
	
	func ai_move(input: String):
		# my ai
		var url: String
		if self.color == Stone.BLACK:
			url = "https://ntou-sell.herokuapp.com/backend/ai/move?board=%s&color=black&level=" % input
		else:
			url = "https://ntou-sell.herokuapp.com/backend/ai/move?board=%s&color=white&level=" % input
		url += self.ai_level
		print_debug("connecting to server...")
		self.outside.get_node("HTTPRequest").request(url)
