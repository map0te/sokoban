import {defs, tiny} from './examples/common.js';
import {Tree_Trunks, Tree_Leaves} from './objects/crate.js';
import {Game} from "./game_logic.js";

// shadows
import {Color_Phong_Shader, Shadow_Textured_Phong_Shader,                                          Depth_Texture_Shader_2D, Buffered_Texture, LIGHT_DEPTH_TEX_SIZE} from './examples/shadow-shader.js'

const {
	Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
	constructor() {
		super("position", "normal",);
		// Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
		this.arrays.position = Vector3.cast(
			[-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
			[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
			[-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
		this.arrays.normal = Vector3.cast(
			[0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
			[-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
			[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
		// Arrange the vertices into a square shape in texture space too:
		this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
			14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
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

		// At the beginning of our program, load one of each of these shape definitions onto the GPU.
		this.shapes = {
			'player': new Cube(), //TODO
			'tree': new Cube(), //TODO
			'bush': new Cube(), //TODO
			'crate': new Cube(), //TODO
			'skybox': new defs.Subdivision_Sphere(4),
			'Tree_Trunks': new Tree_Trunks(),
			'Tree_Leaves': new Tree_Leaves(),
		};

		// Sokoban Game
		this.game = new Game()
		this.game.reset_level();

		this.floor = new Material(new Shadow_Textured_Phong_Shader(1), {
			color: color(1, 1, 1, 1), 
			ambient: .3, diffusivity: 0.6, specularity: 0.4, smoothness: 64, 
			color_texture: null,
			light_depth_texture: null})
		// For the first pass 
		this.pure = new Material(new Color_Phong_Shader(), {}) 
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
			plastic: new Material(new defs.Phong_Shader(),
				{ambient: .4, diffusivity: 1, color: hex_color("#ffffff")}),

			bush: new Material(new defs.Phong_Shader(),
				{ambient: .1, diffusivity: 1, color: hex_color("#FFFF00")}),

			player: new Material(new defs.Phong_Shader(),
				{ambient: .1, diffusivity: 1, color: hex_color("#800080")}),

			tree: new Material(new defs.Phong_Shader(),
				{ambient: .1, diffusivity: 1, color: hex_color("#00FF00")}),

			crate: new Material(new defs.Phong_Shader(),
				{ambient: .1, diffusivity: 1, color: hex_color("#F5F5DC")}),

			skybox: new Material(new defs.Phong_Shader(),
				{ambient: 1, diffusivity: 0, color: hex_color("#87CEEB")}),
		};
		// The white material and basic shader are used for drawing the outline.
		this.white = new Material(new defs.Basic_Shader());

		this.initial_camera_location = Mat4.look_at(vec3(5, 10, 30), vec3(5, 0, 0), vec3(0, 1, 0));
	}

	make_control_panel() {
		this.key_triggered_button("Move Up", ["w"], () => this.begin_move([0,-1]));
		this.key_triggered_button("Move Left", ["a"], () => this.begin_move([-1,0]));
		this.key_triggered_button("Move Right", ["d"], () => this.begin_move([1,0]));
		this.key_triggered_button("Move Down", ["s"], () => this.begin_move([0,1]));
		this.key_triggered_button("Reset", ["r"], () => this.game.reset_level());
		this.key_triggered_button("Next Level", ["n"], () => this.game.next_level());
		this.key_triggered_button("Prev Level", ["Shift", "N"], () => this.game.prev_level());
		this.key_triggered_button("Toggle View", ["c"], () => {
			this.pressed = !this.pressed;
			this.flat = !this.flat;
		})
	}

	begin_move(move) {
		// prohibit moving while other move animating
		if (!this.moving)
			// test if move is legal
			if (this.game.move(move, true) > 0) {
				this.angle = 0;
				this.move = move;
				this.moving = true;
			}
	}

	end_move(move) {
		this.moving = false;
		// actually make move
		this.game.move(move, false);
	}

	texture_buffer_init(gl) {
		// Depth Texture
		this.lightDepthTexture = gl.createTexture();
		// Bind it to TinyGraphics
		this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);
		this.stars.light_depth_texture = this.light_depth_texture
		this.floor.light_depth_texture = this.light_depth_texture

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

        // skybox
        this.shapes.skybox.draw(context, program_state, Mat4.identity().times(Mat4.scale(1000, 1000, 1000)), this.materials.skybox);

        // ground
        let xlen = this.game.levels[this.game.index].length;
        let zlen = this.game.levels[this.game.index][0].length;
        let gt = Mat4.translation(-3, -2, -3).times(Mat4.scale(xlen+2, .5, zlen+2).times(Mat4.translation(1, 1, 1)));
        this.shapes.player.draw(context, program_state, gt, this.materials.tree.override({color: hex_color("#D2B48C")}));

        let player_pos = this.game.get_keeper_pos();

        // Check if solved before animating to have red block at end of solution
        if (this.game.is_solved())
            this.solved = true;

        // Place objects in scene
        for (let i=0; i < xlen; i++) {
            let gl = this.game.game[i];
            for (let j=0; j < zlen; j++) {
                // wall
                if (gl[j] == 1) {
                    this.shapes.Tree_Trunks.model.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 0, 2*j)), this.shapes.Tree_Trunks.material);
                    this.shapes.Tree_Leaves.model.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 2, 2*j)), this.shapes.Tree_Leaves.material);
                }
                // crate
                else if (gl[j] == 2 | gl[j] == 5) {
                    let material = this.materials.crate;
                    if (gl[j] == 5)
                        material = this.materials.crate.override({color: hex_color("#FF817E")});
                    if (this.moving && player_pos[0]+this.move[0] == i && player_pos[1]+this.move[1] == j) {
                        let tm = Mat4.translation(2*i + 2*this.move[0]*Math.sin(this.angle), 0, 2*j + 2*this.move[1]*Math.sin(this.angle));
                        this.shapes.crate.draw(context, program_state, tm, material);
                    } else {
                        let tm = Mat4.translation(2*i, 0, 2*j);
                        this.shapes.crate.draw(context, program_state, tm, material);
                    }
                }
                // player
                else if (gl[j] == 3 || gl[j] == 6) {
                    if (!this.moving) {
                        this.shapes.player.draw(context, program_state, Mat4.translation(2*i, 0, 2*j), this.materials.player);
                    } else {
                        let ax_tr = Mat4.translation(-this.move[0], 1, -this.move[1]);
                        let x_rot = Mat4.rotation(this.move[1]*this.angle, 1, 0, 0);
                        let y_rot = Mat4.rotation(-this.move[0]*this.angle, 0, 0, 1);
                        let pos_tr = Mat4.translation(2*i, 0, 2*j);
                        let tm = pos_tr.times(Mat4.inverse(ax_tr)).times(x_rot).times(y_rot).times(ax_tr);
                        this.shapes.player.draw(context, program_state, tm, this.materials.player);
                        if (this.angle > Math.PI/2)
                            this.end_move(this.move);
                        else
                            this.angle += 6*dt;
                    }
                }
                // goal
                if (gl[j] == 4 || gl[j] == 6 || gl[j] == 5) {
                    this.shapes.player.draw(context, program_state, Mat4.translation(2*i,-1.4,2*j).times(Mat4.scale(1,.5,1)), this.materials.crate.override({color: hex_color("FF817E")}));
                }
            }
        }
	}

	display(context, program_state) {
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
			//program_state.set_camera(this.initial_camera_location);
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
			this.game.next_level();
		}

		program_state.projection_transform = Mat4.perspective(
			Math.PI / 4, context.width / context.height, 1, 10000);

		// *** Lights: *** Values of vector or point lights.
		this.light_position = vec4(20,20, 20, 1);
		this.light_color = color(1, 1, 1, 1);
		program_state.lights = [new Light(this.light_position, this.light_color, 10000)];

		this.render_scene(context, program_state, false, false, false);
	}
}
