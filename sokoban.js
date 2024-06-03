import {defs, tiny} from './examples/common.js';
import {Crate} from './objects/crate.js';
import {Tree_Trunks} from './objects/crate.js';
import {Tree_Leaves} from './objects/crate.js';
import {Game} from "./game_logic.js";

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

class Base_Scene extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.flat = false;
        this.pressed = false;
        this.solved = false;
        this.direction_pressed = false;
        this.down_pressed = false;
        this.rotation_angle_down = false;
        this.right_pressed = false;
        this.rotation_angle_right = false;
        this.angle = 0;

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'crate2': new Crate(), //TODO
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
    	this.key_triggered_button("Move Up", ["w"], () => this.game.move([0,-1]));
		this.key_triggered_button("Move Left", ["a"], () => this.game.move([-1,0]));
		this.key_triggered_button("Move Right", ["d"], () => {
            this.right_pressed = true;
            this.direction_pressed = true;
        });
		this.key_triggered_button("Move Down", ["s"], () => {
            this.down_pressed = true;
            this.direction_pressed = true;
        });
   		this.key_triggered_button("Reset", ["r"], () => this.game.reset_level());
		this.key_triggered_button("Next Level", ["n"], () => this.game.next_level());
		this.key_triggered_button("Prev Level", ["Shift", "N"], () => this.game.prev_level());
        this.key_triggered_button("Toggle View", ["c"], () => {
            this.pressed = !this.pressed;
            this.flat = !this.flat;
        })
	}

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
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
        const light_position = vec4(20,20, 20, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10000)];
    }
}

export class Sokoban extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    constructor() {
        super();
    }

    display(context, program_state) {
        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        super.display(context, program_state);

		// skybox
		this.shapes.skybox.draw(context, program_state, Mat4.identity().times(Mat4.scale(1000, 1000, 1000)), this.materials.skybox);

		// ground
		let xlen = this.game.levels[this.game.index].length;
		let zlen = this.game.levels[this.game.index][0].length;
		let gt = Mat4.translation(-3, -2, -3).times(Mat4.scale(xlen+2, .5, zlen+2).times(Mat4.translation(1, 1, 1)));
		this.shapes.player.draw(context, program_state, gt, this.materials.tree.override({color: hex_color("#D2B48C")}));

        for(let i = 0; i < xlen; i++) {
            let game_level = this.game.game[i];
            for(let j = 0; j < zlen; j++) {

                if (this.down_pressed && game_level[j] == 3 && this.game.game[i][j+1] == 1)
                {
                    this.down_pressed = false;
                    this.direction_pressed = false;
                }

                if (game_level[j] == 1){
					
					//if (j % 2 == 0){
                        this.shapes.Tree_Trunks.model.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 0, 2*j)), this.shapes.Tree_Trunks.material);
                        this.shapes.Tree_Leaves.model.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 2, 2*j)), this.shapes.Tree_Leaves.material);
                    //}

                    //else{
                    //    this.shapes.crate.draw(context, program_state, Mat4.identity().times(Mat4.translation(5*i, 0, 5*j)), this.materials.crate);
                    //}

                }

                if (game_level[j] == 2){


                    if(this.rotation_angle_down && this.game.game[i][j-1] == 3){
                        if(this.game.game[i][j+1] == 1 || this.game.game[i][j+1] == 2)
                        {
                            this.down_pressed = false;
                            this.direction_pressed = false;
                        }

                        else{
                            this.shapes.crate.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 0, 2*j + 2*this.angle/(Math.PI/2))), this.materials.crate);
                        }
                    }

                    else if(this.rotation_angle_right && this.game.game[i-1][j] == 3){
                        this.shapes.crate.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i + 2*this.angle/(Math.PI/2), 0, 2*j)), this.materials.crate);
                    }

                    else{
                        this.shapes.crate.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 0, 2*j)), this.materials.crate);
                    }
                }

                if (game_level[j] == 3 || game_level[j] == 6){

                    if(!this.direction_pressed){
                        this.shapes.player.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 0, 2*j)), this.materials.player);
                    }

                    if(this.down_pressed){
                        this.angle = 0;
                        this.down_pressed = false;
                        this.rotation_angle_down = true;
                    }

                    if(this.rotation_angle_down){
                        this.shapes.player.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 0, 2*j + 2*this.angle/(Math.PI/2))).times(Mat4.rotation(this.angle, 1, 0, 0)), this.materials.player);
                        this.angle = this.angle + 4*dt;

                        if (this.angle > Math.PI/2)
                        {
                            this.rotation_angle_down = false;
                            this.direction_pressed = false;
                            this.game.move([0,1]);
                        }
                    }

                    if(this.right_pressed){
                        this.angle = 0;
                        this.right_pressed = false;
                        this.rotation_angle_right = true;
                    }

                    if(this.rotation_angle_right){
                        this.shapes.player.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i + 2*this.angle/(Math.PI/2), 0, 2*j)).times(Mat4.rotation(this.angle, 0, 0, -1)), this.materials.player);
                        this.angle = this.angle + 4*dt;

                        if (this.angle > Math.PI/2)
                        {
                            this.rotation_angle_right = false;
                            this.direction_pressed = false;
                            this.game.move([1,0]);
                        }
                    }
                }

				if (game_level[j] == 4){
					this.shapes.player.draw(context, program_state, Mat4.translation(2*i,-1.4,2*j).times(Mat4.scale(1,.5,1)), this.materials.crate.override({color: hex_color("FF817E")}));
				}
				if (game_level[j] == 5){
					this.shapes.crate.draw(context, program_state, Mat4.identity().times(Mat4.translation(2*i, 0, 2*j)), this.materials.crate.override({color: hex_color("FF817E")}));
                    if (this.game.is_solved()){
                        this.solved = true;
                    }
				}

            }
        }
    }
}