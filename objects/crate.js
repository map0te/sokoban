import {defs, tiny} from '../examples/common.js';

import {Shape_From_File} from '../examples/obj-file-demo.js';
// Pull these names into this module's scope for convenience:
const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4,
    Light, Shape, Material, Shader, Texture, Scene, hex_color
} = tiny;

export class Crate {
	constructor() {
		this.model = new Shape_From_File('assets/box.obj');
		this.material = new Material(new defs.Textured_Phong(1),
			{ambient: .5, diffusivity: .5, specularity: .2, 
				texture: new Texture('assets/boxt.jpg')});
	}
}

export class Tree_Trunks {
	constructor() {
		this.model = new Shape_From_File('assets/pine_tree_trunks.obj');
		this.material = new Material(new defs.Textured_Phong(1),
			{ambient: .1, diffusivity: 1, specularity: 0.1, color: hex_color('#964B00')});
	}
}

export class Tree_Leaves {
	constructor() {
		this.model = new Shape_From_File('assets/pine_tree_leaves.obj');
		this.material = new Material(new defs.Textured_Phong(1),
			{ambient: .1, diffusivity: 1, specularity: 0.1, color: hex_color('#026440')});
	}
}

export class Round_Tree_Trunks {
	constructor() {
		this.model = new Shape_From_File('assets/round_tree_trunk1.obj');
		this.material = new Material(new defs.Textured_Phong(1),
			{ambient: .1, diffusivity: 1, specularity: 0.1, color: hex_color('#964B00')});
	}
}

export class Round_Tree_Leaves {
	constructor() {
		this.model = new Shape_From_File('assets/round_tree_leaves1.obj');
		this.material = new Material(new defs.Textured_Phong(1),
			{ambient: .1, diffusivity: 1, specularity: 0.1, color: hex_color('#037d50')});
	}
}

