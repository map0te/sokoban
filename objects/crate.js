import {tiny} from './tiny-graphics.js';
import {widgets} from './tiny-graphics-widgets.js';
import {Shape_From_File} from './examples/obj-file-demo.js';
// Pull these names into this module's scope for convenience:
const {
    Vector, Vector3, vec, vec3, vec4, color, Matrix, Mat4,
    Light, Shape, Material, Shader, Texture, Scene
} = tiny;

Object.assign(tiny, widgets);

export class Crate {
	constructor() {
		this.model = Shape_From_File('assets/box.obj');
		this.material = new Material(new defs.Textured_Phong(1);
	}
}
