import {defs, tiny} from '../examples/common.js';

import {Shape_From_File} from '../examples/obj-file-demo.js';
// Pull these names into this module's scope for convenience:
const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4,
    Light, Shape, Material, Shader, Texture, Scene
} = tiny;

export class Crate {
	constructor() {
		this.model = new Shape_From_File('assets/box.obj');
		this.material = new Material(new defs.Textured_Phong(1),
			{ambient: .5, diffusivity: .5, specularity: .2, 
				texture: new Texture('assets/boxt.jpg')});
	}
}
