import {defs, tiny} from './examples/common.js';
import {Tree_Trunks} from './objects/crate.js';
import {Tree_Leaves} from './objects/crate.js';
import {Round_Tree_Trunks} from './objects/crate.js';
import {Round_Tree_Leaves} from './objects/crate.js';
import {Rock} from "./objects/crate.js";
import {Game} from "./game_logic.js";

// shadows
import {Color_Phong_Shader, Shadow_Textured_Phong_Shader,
	Depth_Texture_Shader_2D, Buffered_Texture, LIGHT_DEPTH_TEX_SIZE} from './examples/shadow-shader.js'

const {
	Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene, Shader, Texture} = tiny;

const {Cube, Tetrahedron, Axis_Arrows, Textured_Phong, Phong_Shader, Basic_Shader, Subdivision_Sphere} = defs;

// 2D shape, to display the texture buffer
const Square =
	class Square extends tiny.Vertex_Buffer {
		constructor() {
			super("position", "normal", "texture_coord");
			this.arrays.position = [
				vec3(0, 0, 0), vec3(1, 0, 0), vec3(0, 1, 0),
				vec3(1, 1, 0), vec3(1, 0, 0), vec3(0, 1, 0)
			];
			this.arrays.normal = [
				vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
				vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
			];
			this.arrays.texture_coord = [
				vec(0, 0), vec(1, 0), vec(0, 1),
				vec(1, 1), vec(1, 0), vec(0, 1)
			]
		}
	}

export class Sokoban extends Scene {
	constructor() {
		// constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
		super();
		this.flat = false;
		this.solved = false;
		this.angle = 0;
		this.move = [0,0];
		this.moving = false;
		this.trees = Array.from({length: 100}, () => Math.floor(Math.random() * 3));
		console.log(this.trees);
		this.tree_counter = 0;
		this.movement_enabled = true;
		//this.solution = [];
		this.test = [[1,0], [1,0], [1,0], [0,-1], [1,0], [0,1], [0,1]];

		// At the beginning of our program, load one of each of these shape definitions onto the GPU.
		this.shapes = {
			'player': new Cube(), //TODO
			'tree': new Cube(), //TODO
			'bush': new defs.Subdivision_Sphere(2),
			'crate': new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2), //TODO
			'skybox': new defs.Subdivision_Sphere(4),
			'correction': new defs.Subdivision_Sphere(4),
			'Tree_Trunks': new Tree_Trunks(),
			'Tree_Leaves': new Tree_Leaves(),
			'Round_Tree_Trunks': new Round_Tree_Trunks(),
			'Round_Tree_Leaves': new Round_Tree_Leaves(),
			'Rock': new Rock,
			'square_2d': new Square(),
			'grass': new (Tetrahedron.prototype.make_flat_shaded_version())(),
		};

		// Sokoban Game
		this.game = new Game()
		this.game.reset_level();

		// For the first pass 
		this.pure = new Material(new Color_Phong_Shader(), {});
		// For light source
		this.light_src = new Material(new defs.Phong_Shader(), {
			color: color(1, 1, 1, 1), ambient: 1, diffusivity: 0, specularity: 0
		});
		// For depth texture display
		this.depth_tex =  new Material(new Depth_Texture_Shader_2D(), {
			color: color(0, 0, .0, 1),
			ambient: 1, diffusivity: 0, specularity: 0, texture: null
		});

		// To make sure texture initialization only does once
		this.init_ok = false;

		// *** Materials
		this.materials = {
			plastic: new Material(new Shadow_Textured_Phong_Shader(1),
				{ambient: .4, diffusivity: 1, 
					color: hex_color("#ffffff"),
					color_texture: null,
					light_depth_texture: null}),

			bush: new Material(new Shadow_Textured_Phong_Shader(1),
				{ambient: .1, diffusivity: 1, specularity: 0.1, 
					color: hex_color("#039660"),
					color_texture: null,
					light_depth_texture: null}),

			player: new Material(new Shadow_Textured_Phong_Shader(1),
				{ambient: .1, diffusivity: 1,
					color: hex_color("#800080"),
					color_texture: null,
					light_depth_texture: null}),

			tree: new Material(new Shadow_Textured_Phong_Shader(1),
				{ambient: .1, diffusivity: 1, specularity: 0, 
					color: hex_color("#00FF00"),
					color_texture: null,
					light_depth_texture: null}),

			crate: new Material(new Shadow_Textured_Phong_Shader(1),
				{ambient: .1, diffusivity: 1, specularity: 0.1,
					color: hex_color("#F5F5DC"),
					color_texture: null,
					light_depth_texture: null}),

			skybox: new Material(new defs.Phong_Shader(),
				{ambient: 1, diffusivity: 0, color: hex_color("#87CEEB")}),

			correction: new Material(new defs.Phong_Shader(),
				{ambient: .1, diffusivity: 1, specularity: 0.1, color: hex_color("#964B00")}),

			trail: new Material(new Shadow_Textured_Phong_Shader(1),
				{ambient: .1, diffusivity: 1, specularity: 0,
					color_texture: null,
					light_depth_texture: null}),
		};

		this.initial_camera_location = Mat4.look_at(vec3(5, 10, 30), vec3(5, 0, 0), vec3(0, 1, 0));
	}

	make_control_panel() {
		this.key_triggered_button("Move Up", ["w"], () => {
			if (this.movement_enabled){
				this.begin_move([0,-1]);
			}
		});
		this.key_triggered_button("Move Left", ["a"], () => {
			if (this.movement_enabled){
				this.begin_move([-1,0]);
			}
		});
		this.key_triggered_button("Move Right", ["d"], () => {
			if (this.movement_enabled)
			{
				this.begin_move([1,0]);
			}
		});
		this.key_triggered_button("Move Down", ["s"], () => {
			if (this.movement_enabled)
			{
				this.begin_move([0,1]);
			}
		});
		this.key_triggered_button("Reset", ["r"], () => {
			this.moving = false;
			this.movement_enabled = true;
			this.game.reset_level();
		});
		this.key_triggered_button("Next Level", ["n"], () => {
			this.game.next_level();
			this.tree_counter = 0;
            this.trees = Array.from({length: 100}, () => Math.floor(Math.random() * 3));
		});
		this.key_triggered_button("Prev Level", ["Shift", "N"], () => this.game.prev_level());
		this.key_triggered_button("Toggle View", ["c"], () => {
			this.pressed = !this.pressed;
			this.flat = !this.flat;
		})
		this.key_triggered_button("AI Solve", ["p"], () => {
			this.movement_enabled = false;
			this.solution = this.game.ai_sol();
		});
	}

	begin_move(move) {
		// prohibit moving while other move animating
		if (!this.moving)
			// test if move is legal
			if (this.game.move(move, true, this.game.game) > 0) {
				this.angle = 0;
				this.move = move;
				this.moving = true;
			}
	}

	end_move(move) {
		this.moving = false;
		// actually make move
		this.game.move(move, false, this.game.game);
	}

	ai_mover(){
		if (this.solution.length == 0)
		{
			this.movement_enabled = true;
		}
		else{
			this.begin_move(this.solution[0]);
			this.solution.shift();
		}
	}


	texture_buffer_init(gl) {
		// Depth Texture
		this.lightDepthTexture = gl.createTexture();
		// Bind it to TinyGraphics
		this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);
		this.materials.plastic.light_depth_texture = this.light_depth_texture;
		this.materials.player.light_depth_texture = this.light_depth_texture;
		this.materials.bush.light_depth_texture = this.light_depth_texture;
		this.materials.tree.light_depth_texture = this.light_depth_texture;
		this.materials.crate.light_depth_texture = this.light_depth_texture;
		this.shapes.Tree_Trunks.material.light_depth_texture = this.light_depth_texture;
		this.shapes.Tree_Leaves.material.light_depth_texture = this.light_depth_texture;
		this.shapes.Round_Tree_Trunks.material.light_depth_texture = this.light_depth_texture;
		this.shapes.Round_Tree_Leaves.material.light_depth_texture = this.light_depth_texture;
		this.shapes.Rock.material.light_depth_texture = this.light_depth_texture;
		this.materials.trail.light_depth_texture = this.light_depth_texture;


		this.lightDepthTextureSize = LIGHT_DEPTH_TEX_SIZE;
		gl.bindTexture(gl.TEXTURE_2D, this.lightDepthTexture);
		gl.texImage2D(
			gl.TEXTURE_2D,      // target
			0,                  // mip level
			gl.DEPTH_COMPONENT, // internal format
			this.lightDepthTextureSize,   // width
			this.lightDepthTextureSize,   // height
			0,                  // border
			gl.DEPTH_COMPONENT, // format
			gl.UNSIGNED_INT,    // type
			null);              // data
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		// Depth Texture Buffer
		this.lightDepthFramebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,       // target
			gl.DEPTH_ATTACHMENT,  // attachment point
			gl.TEXTURE_2D,        // texture target
			this.lightDepthTexture,         // texture
			0);                   // mip level
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// create a color texture of the same size as the depth texture
		// see article why this is needed_
		this.unusedTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.unusedTexture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			this.lightDepthTextureSize,
			this.lightDepthTextureSize,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			null,
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		// attach it to the framebuffer
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,        // target
			gl.COLOR_ATTACHMENT0,  // attachment point
			gl.TEXTURE_2D,         // texture target
			this.unusedTexture,         // texture
			0);                    // mip level
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	render_scene(context, program_state, shadow_pass, draw_light_source=false, draw_shadow=false) {
		// shadow_pass: true if this is the second pass that draw the shadow.
		// draw_light_source: true if we want to draw the light source.
		// draw_shadow: true if we want to draw the shadow

		let light_position = this.light_position;
		let light_color = this.light_color;

		program_state.draw_shadow = draw_shadow;

		let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

		if(!this.movement_enabled && !this.moving)
		{
			this.ai_mover();
		}

		// skybox
		this.shapes.skybox.draw(context, program_state, Mat4.identity().times(Mat4.scale(1000, 1000, 1000)), this.materials.skybox);

		// ground
		let xlen = this.game.levels[this.game.index].length;
		let zlen = this.game.levels[this.game.index][0].length;
		//let gt = Mat4.translation(-3, -2, -3).times(Mat4.scale(xlen+2, .5, zlen+2).times(Mat4.translation(1, 1, 1)));
		//this.shapes.player.draw(context, program_state, gt, shadow_pass ? this.materials.tree.override({color: hex_color("#D2B48C")}) : this.pure);

		let player_pos = this.game.get_keeper_pos(this.game.game);

		// Check if solved before animating to have red block at end of solution
		if (this.game.is_solved(this.game.game))
			this.solved = true;

		for (let i = 0; i < xlen+2; i++) {
			for (let j = 0; j < zlen+2; j++) {
				if (i == 0 || i == xlen + 1 || j == 0 || j == zlen + 1 || (i < xlen+1 && i > 0  && j < zlen+1 && j > 0 && this.game.game[i-1][j-1] == 7)) {
					this.shapes.player.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i-2, -1.5, 2*j-2)).times(Mat4.scale(1, .5, 1)), this.materials.tree.override({color: hex_color("#41980a")}));
				}
			}
		}

		this.tree_counter = 0;

		for (let i = 0; i < xlen+2; i++) {
			for (let j = 0; j < zlen+2; j++) {
				this.shapes.player.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i-2, -2.5, 2*j-2)).times(Mat4.scale(1, .5, 1)), this.materials.tree.override({color: hex_color("#41980a")}));
			}
		}


		// Place objects in scene
		for (let i=0; i < xlen; i++) {
			let gl = this.game.game[i];
			for (let j=0; j < zlen; j++) {

				if (gl[j] != 1 && gl[j] != 7) {
					this.shapes.player.draw(context, program_state, Mat4.identity().times(Mat4.translation(2 * i, -1.5, 2 * j)).times(Mat4.scale(1, .5, 1)), this.materials.trail.override({color: hex_color("#D2B48C")}));
				} else {
					this.shapes.player.draw(context, program_state, Mat4.identity().times(Mat4.translation(2 * i, -1.5, 2 * j)).times(Mat4.scale(1, .5, 1)), this.materials.tree.override({color: hex_color("#41980a")}));
				}

				// wall
				if (gl[j] == 1) {
					if(this.trees[this.tree_counter] ==  0) {
						this.shapes.Tree_Trunks.model.draw(context, program_state, Mat4.translation(2*i, 0, 2*j).times(Mat4.scale(0.75, 1.25, 0.75)), shadow_pass ? this.shapes.Tree_Trunks.material : this.pure);
						this.shapes.Tree_Leaves.model.draw(context, program_state, Mat4.translation(2*i, 2, 2*j).times(Mat4.scale(1, 1.25, 1)), shadow_pass ? this.shapes.Tree_Leaves.material : this.pure);
					}

					// temporarily remove big trees
					else if(this.trees[this.tree_counter] == 1) {
						this.shapes.Round_Tree_Trunks.model.draw(context, program_state, Mat4.translation(2*i, 1.3, 2*j), shadow_pass ? this.shapes.Round_Tree_Trunks.material : this.pure);
						this.shapes.Round_Tree_Leaves.model.draw(context, program_state, Mat4.translation(2*i, 2.3, 2*j).times(Mat4.scale(1.35, 1.35, 1.35)), shadow_pass ? this.shapes.Round_Tree_Leaves.material : this.pure);
					}

					else {
						this.shapes.bush.draw(context, program_state, Mat4.translation(2*i, -0.25, 2*j), shadow_pass ? this.materials.bush : this.pure);
					}

					this.tree_counter++;
				}
				// crate
				else if (gl[j] == 2 | gl[j] == 5) {
					let material = this.materials.crate;
					if (this.moving && player_pos[0]+this.move[0] == i && player_pos[1]+this.move[1] == j) {
						let tm = Mat4.translation(2*i + 2*this.move[0]*Math.sin(this.angle), -0.2, 2*j + 2*this.move[1]*Math.sin(this.angle));
						this.shapes.crate.draw(context, program_state, tm, shadow_pass ? material : this.pure);
					} else {
						let tm = Mat4.translation(2*i, -0.2, 2*j);
						this.shapes.crate.draw(context, program_state, tm, shadow_pass ? material : this.pure);
					}
				}
				// player
				else if (gl[j] == 3 || gl[j] == 6) {
					if (!this.moving) {
						this.shapes.player.draw(context, program_state, Mat4.translation(2*i, 0, 2*j), shadow_pass ? this.materials.player : this.pure);
					} else {
						let ax_tr = Mat4.translation(-this.move[0], 1, -this.move[1]);
						let x_rot = Mat4.rotation(this.move[1]*this.angle, 1, 0, 0);
						let y_rot = Mat4.rotation(-this.move[0]*this.angle, 0, 0, 1);
						let pos_tr = Mat4.translation(2*i, 0, 2*j);
						let tm = pos_tr.times(Mat4.inverse(ax_tr)).times(x_rot).times(y_rot).times(ax_tr);
						this.shapes.player.draw(context, program_state, tm, shadow_pass ? this.materials.player : this.pure);
						if (this.angle > Math.PI/2)
							this.end_move(this.move)
						else
							this.angle += 4*dt;
					}
				}
				// goal
				if (gl[j] == 4 || gl[j] == 6 || gl[j] == 5) {
					this.shapes.player.draw(context, program_state, Mat4.translation(2*i,-1.4,2*j).times(Mat4.scale(1,.5,1)), shadow_pass ? this.materials.crate.override({color: hex_color("FF817E")}) : this.pure);
				}
			}
		}
		this.tree_counter = 0;
	}

	display(context, program_state) {
		const gl = context.context;

		if (!this.init_ok) {
			const ext = gl.getExtension('WEBGL_depth_texture');
			if (!ext) {
				return alert('need WEBGL_depth_texture');  // eslint-disable-line
			}
			this.texture_buffer_init(gl);

			this.init_ok = true;
		}

		if (!context.scratchpad.controls) {
			this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
			// Define the global camera and projection matrices, which are stored in program_state.
			program_state.set_camera(this.initial_camera_location);
		}

		if (this.pressed && this.flat)
		{
			this.camera_save = program_state.camera_transform;
			program_state.set_camera(Mat4.look_at(vec3(5, 40, 5), vec3(5, 0, 5), vec3(0, 0, -1)));
			this.pressed = false;
		}

		if (this.pressed && !this.flat)
		{
			program_state.set_camera(Mat4.inverse(this.camera_save));
			this.pressed = false;
		}

		if (this.solved)
		{
			this.solved = false;
			var start_timer = new Date().getTime();
			for (var i = 0; i < 1e7; i++) {
				if ((new Date().getTime() - start_timer) > 500){
					break;
				}
			}
			this.tree_counter = 0;
			this.trees = Array.from({length: 100}, () => Math.floor(Math.random() * 3));
			this.game.next_level();
		}

		// *** Lights: *** Values of vector or point lights.
		//let light_position = vec4(Math.floor((this.game.levels[this.game.index].length + 2)/2),100, Math.floor((this.game.levels[this.game.index][0].length + 2)/2), 1);
		//program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10000)];

		this.light_position = vec4(0, 15, 10, 1);
		this.light_color = color(1, 1, 1, 1);
		program_state.lights = [new Light(this.light_position, this.light_color, 10000)];

		// This is a rough target of the light.
		// Although the light is point light, we need a target to set the POV of the light
		this.light_view_target = vec4(0, 0, 0, 1);
		this.light_field_of_view = 130 * Math.PI / 180; // 130 degree

		// Step 1: set the perspective and camera to the POV of light
		const light_view_mat = Mat4.look_at(
			vec3(this.light_position[0], this.light_position[1], this.light_position[2]),
			vec3(this.light_view_target[0], this.light_view_target[1], this.light_view_target[2]),
			vec3(0, 1, 0), // assume the light to target will have a up dir of +y, maybe need to change according to your case
		);
		const light_proj_mat = Mat4.perspective(this.light_field_of_view, 1, 1, 10000);
		// Bind the Depth Texture Buffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
		gl.viewport(0, 0, this.lightDepthTextureSize, this.lightDepthTextureSize);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		// Prepare uniforms
		program_state.light_view_mat = light_view_mat;
		program_state.light_proj_mat = light_proj_mat;
		program_state.light_tex_mat = light_proj_mat;
		program_state.view_mat = light_view_mat;
		program_state.projection_transform = light_proj_mat;
		this.render_scene(context, program_state, false,false, false);

		// Step 2: unbind, draw to the canvas
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		program_state.view_mat = program_state.camera_inverse;
		program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 1, 10000);
		this.render_scene(context, program_state, true,true, true);
	}
}
