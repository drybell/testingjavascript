

// https://codepen.io/zalo/pen/MLBKBv?editors=0011

import {
  BoxBufferGeometry,
  BufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  HemisphereLight,
  MOUSE,
  Vector3, 
  Quaternion,
  Euler,
  PlaneBufferGeometry,
  DirectionalLight,
  MeshPhongMaterial,
  GridHelper,
  MeshLambertMaterial,
  Group,
  AxesHelper,
  Matrix4,
  Vector2,
  CatmullRomCurve3,
  TextureLoader,
  PlaneGeometry,
  EllipseCurve,
  LineBasicMaterial,
  Line
} from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { DragControls } from './DragControls.js';
import { STLLoader } from './STLLoader.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { GLTFExporter } from './GLTFExporter.js';
// import { ImageLoader } from './ImageLoader.js';
 
const container = document.querySelector('#container');
const scene = new Scene();

scene.background = new Color('skyblue');

var white = new MeshLambertMaterial({ color: 0x888888 });

const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 3500; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);
var draggableObjects = new Array();
camera.position.set(1400, 300, 900);
// camera.position.set(1400, 700, -1000);

// const geometry = new BoxBufferGeometry(2, 2, 2);
const boxGeometry = new BoxBufferGeometry(100, 100, 100);
const material = new MeshBasicMaterial();
// const cube = new Mesh(geometry, material);

let light = new DirectionalLight(0xbbbbbb);
light.position.set(0, 200, 100);
light.castShadow = true;
light.shadow.camera.top = 180;
light.shadow.camera.bottom = - 100;
light.shadow.camera.left = - 120;
light.shadow.camera.right = 120;
scene.add(light);

const axesHelper = new AxesHelper( 5 );
scene.add( axesHelper );

var mesh2 = new Mesh(new PlaneBufferGeometry(2000, 2000), new MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh2.rotation.x = - Math.PI / 2;
mesh2.receiveShadow = true;
scene.add(mesh2);
var grid = new GridHelper(2000, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

var target2 = new Mesh(boxGeometry, new MeshLambertMaterial({ color: 0x3399dd }));
target2.position.set(100, 50, 0);
target2.scale.set(0.05, 0.05, 0.05);
target2.transparent = true;
target2.opacity = 0.5;
target2.castShadow = true;
target2.receiveShadow = true;
scene.add(target2);
draggableObjects.push(target2);
camera.lookAt(target2.position);

// var target3 = new Mesh(boxGeometry, new MeshLambertMaterial({ color: 0x3399dd }));
// target3.position.set(10, 137, -127.5);
// target3.scale.set(0.1, 0.1, 0.1);
// target3.transparent = true;
// target3.opacity = 0.5;
// target3.castShadow = true;
// target3.receiveShadow = true;
// scene.add(target3);

scene.add(new HemisphereLight(0xffffff, 1.5));

const renderer = new WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);

renderer.setPixelRatio(window.devicePixelRatio);

container.append(renderer.domElement);

// renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.rotateSpeed = 0.35;
controls.dampingFactor = 0.6;
// controls.enableZoom = true;
// controls.enablePan = true;
// controls.enableRotate = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 1;
controls.addEventListener('change', render);
controls.target.set(0, 45, 0);
controls.update();

const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

dragControls.addEventListener('dragstart', function () {
	controls.enabled = false;
});	

dragControls.addEventListener('dragend', function () {
	controls.enabled = true;
});

dragControls.addEventListener('hoveron', function () {
	controls.enabled = false;
});

dragControls.addEventListener('hoveroff', function () {
	controls.enabled = true;
});
const material2 = new MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );

// // https://stackoverflow.com/questions/23385623/three-js-proper-way-to-add-and-remove-child-objects-using-three-sceneutils-atta
// function reparentObject3D(subject, newParent)
// {
//     subject.matrix.copy(subject.matrixWorld);
//     subject.applyMatrix4(new Matrix4().getInverse(newParent.matrixWorld));
//     // subject.matrixAutoUpdate = false;
//     newParent.add(subject);
// }

// function reparentwithTarget(subject, target, newParent)
// {
//     subject.matrix.copy(target);
//     subject.applyMatrix4(new Matrix4().getInverse(newParent.matrixWorld));
//     // subject.matrixAutoUpdate = false;
//     newParent.add(subject);
// }

// const imageloader = new THREE.ImageLoader();

// // load a image resource
// imageloader.load(
// 	// resource URL
// 	'./static/png/out.png',

// 	// onLoad callback
// 	function ( image ) {
// 		// use the image, e.g. draw part of it on a canvas
// 		const image_canvas = document.createElement( 'image-canvas' );
// 		const context = image_canvas.getContext( '2d' );
// 		context.drawImage( image, 100, 100 );
// 	},

// 	// onProgress callback currently not supported
// 	undefined,

// 	// onError callback
// 	function () {
// 		console.error( 'An error happened.' );
// 	}
// );

// // Create a texture loader so we can load our image file
// var loader = new THREE.TextureLoader();

// // Load an image file into a custom material
// var material = new THREE.MeshLambertMaterial({
//   map: loader.load('https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg')
// });

// // create a plane geometry for the image with a width of 10
// // and a height that preserves the image's aspect ratio
// var geometry = new THREE.PlaneGeometry(10, 10*.75);

// // combine our image geometry and material into a mesh
// var mesh = new THREE.Mesh(geometry, material);

// // set the position of the image mesh in the x,y,z dimensions
// mesh.position.set(0,0,0)

// // add the image to the scene
// scene.add(mesh);

// instantiate a loader
// const texture_loader = new TextureLoader();

// // load a resource
// texture_loader.load(
// 	// resource URL
// 	'./static/png/out.png',

// 	// onLoad callback
// 	function ( texture ) {
// 		// in this example we create the material when the texture is loaded
// 		// create a plane geometry for the image with a width of 10
// 		// and a height that preserves the image's aspect ratio
// 		// 1573 x 945 = 
// 		let geometry = new PlaneGeometry(500, 500*.60076);

// 		// combine our image geometry and material into a mesh
// 		let mesh = new Mesh(geometry, material);
// 		scene.add(mesh);
// 	},

// 	// onProgress callback currently not supported
// 	undefined,

// 	// onError callback
// 	function ( err ) {
// 		console.error( 'An error happened.' );
// 	}
// );

const image_loader = new TextureLoader();

var plane_mat = new MeshLambertMaterial({
  map: image_loader.load('./static/png/out.png')
});

var plane_geometry = new PlaneGeometry(6500, 6500*.60076);
var plane_mesh = new Mesh(plane_geometry, plane_mat);
scene.add(plane_mesh);
plane_mesh.position.z = -1000;
plane_mesh.position.x = -1400;
plane_mesh.rotateX(-Math.PI/2);

var geo = new Mesh

const fanucloader = new GLTFLoader();
var fanuc_gltf;
var fanuc_j1;
var fanuc_j2;
var fanuc_j3;
var fanuc_j4;
var fanuc_j5;
var fanuc_j6;
var base;
var fanuc_anim;
fanucloader.load(
	// resource URL
	'./static/gltf/Full FANUC.gltf',
	// called when the resource is loaded
	// FWIW, what I was guessing was your 
	// question is doable by setting object.matrix to be the product 
	// of (1) the inverse of parent.matrixWorld and (2) your desired matrix. 
	// – WestLangley
	function ( gltf ) {

		// scene.add( gltf.scene );
		console.log(gltf.scene);
		// gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scene; // THREE.Group
		// gltf.scenes; // Array<THREE.Group>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object

		// let fanuc_j2_original = new Group();

		let fanuc = gltf.scene;
		let full_fanuc = fanuc.clone().children[0];
		fanuc_gltf = gltf.scene.clone(false);
		full_fanuc.children = [];
		let children = fanuc.clone().children[0].children;
		for (let i=0; i < children.length; i++){
			switch (children[i].name){
				case "occurrence_of_BaseJ1":
					base = children[i];
					break;
				case "occurrence_of_J1J2":
					fanuc_j1 = children[i];
					break;
				case "occurrence_of_J2J3":
					// fanuc_j2_original = children[i];
					// fanuc_j2_original.rotateY(radians(90));
					fanuc_j2 = children[i];
					break;
				case "occurrence_of_J3J4":
					fanuc_j3 = children[i];
					break;
				case "occurrence_of_J4J5":
					fanuc_j4 = children[i];
					break;
				case "occurrence_of_J5J6":
					fanuc_j5 = children[i];
					break;
				case "occurrence_of_J6End":
					fanuc_j6 = children[i];
					break;
			}
		}
		let j1axis = new AxesHelper( .50 );
		let j2axis = new AxesHelper( .20 );
		let j3axis = new AxesHelper( .20 );
		let j4axis = new AxesHelper( .20 );
		let j5axis = new AxesHelper( .20 );
		let j6axis = new AxesHelper( .20 );
		// let j2axisstatic = new AxesHelper( .20 );
		console.log(children);
		scene.attach(fanuc_gltf);
		fanuc_gltf.attach(full_fanuc);
		full_fanuc.attach(base);
		// fanuc_j1.rotation.x = radians(90);
		// fanuc_j1.rotation.z = radians(-105);
		base.attach(fanuc_j1);
		fanuc_j1.add(j1axis);
		// fanuc_j2.rotation.y = radians(18-);
		// fanuc_j2.rotation.y = Math.PI/2;
		// fanuc_j2.rotateY(Math.PI/2);
		fanuc_j1.attach(fanuc_j2);
		fanuc_j1.add(j1axis);
		fanuc_j2.attach(fanuc_j3);
		fanuc_j2.add(j2axis);
		// fanuc_j2.attach(j2axisstatic);
		fanuc_j3.attach(fanuc_j4);
		fanuc_j3.add(j3axis);
		fanuc_j4.attach(fanuc_j5);
		fanuc_j4.add(j4axis);
		fanuc_j5.attach(fanuc_j6);
		fanuc_j5.add(j5axis);

		
		fanuc_gltf.scale.set(100, 100, 100);
		fanuc_gltf.rotation.set(- Math.PI/2, 0, Math.PI/2);
		fanuc_gltf.position.set(-220, 0, 100);
		
		console.log(fanuc_gltf);
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( error );

	}
);

// https://stackoverflow.com/questions/44899019/how-to-draw-form-circle-with-two-points
function calculateRemainingPoint(points, x, precision, maxIteration) {
    if (x === void 0) { x = 0; };
    if (precision === void 0) { precision = 0.001; };
    if (maxIteration === void 0) { maxIteration = 10000; };
    var newPoint = {
        x: x,
        y: (points[0].y + points[1].y) / 2,
        r: 50
    };
    var d0 = distance(points[0].x, points[0].y, x, newPoint.y);
    var d1 = distance(points[1].x, points[1].y, x, newPoint.y);
    var iteration = 0;
    //Bruteforce approach
    while (Math.abs(d0 - d1) > precision && iteration < maxIteration) {
        var oldDiff = Math.abs(d0 - d1);
        var oldY = newPoint.y;
        iteration++;
        newPoint.y += oldDiff / 10;
        d0 = distance(points[0].x, points[0].y, x, newPoint.y);
        d1 = distance(points[1].x, points[1].y, x, newPoint.y);
        var diff_1 = Math.abs(d0 - d1);
        if (diff_1 > oldDiff) {
            newPoint.y = oldY - oldDiff / 10;
            d0 = distance(points[0].x, points[0].y, x, newPoint.y);
            d1 = distance(points[1].x, points[1].y, x, newPoint.y);
        }
    }
    var diff = (points[0].x + points[1].x) / points[0].x;
    newPoint.r = d0;
    return newPoint;
}

function distance(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}

var test_point1 = new Vector2(10, 10);
var test_point2 = new Vector2(2, -7);
var center = calculateRemainingPoint([test_point1, test_point2]);
console.log(center);
console.log(distance(center.x, center.y, test_point1.x, test_point1.y));
console.log(distance(center.x, center.y, test_point2.x, test_point2.y))


class MIR{

	constructor(robot, path, resolution, tolerance, velocity) {
		if ( resolution === void 0 ) resolution = 1000;
		if ( tolerance === void 0 ) tolerance = .1;
		if ( velocity === void 0) velocity = 5;
		this.robot   = robot;
		this.path    = path; 
		this.running = false; 
		// z component of its current orientation
		this.orientation = new Vector3(0,0,1);
		this.resolution  = resolution;
		this.tolerance   = tolerance;
		this.axis        = new Vector3(0,1,0);
		this.acceleration = null;
		this.velocity     = velocity;
		this.steps        = 0;
		// this.home         = robot.getWorldPosition();
		this.home_orientation = robot.quaternion.clone();
		this.increment = 1;

		// this.path  = new THREE.CatmullRomCurve3();
	}

	// calculateCircle(target, curr_pos) { 
	// 	let mir_pos = curr_pos.clone();
	// 	let tar_pos = target.clone();
	// 	let mir_pos2 = new Vector2(mir_pos.x, mir_pos.z);
	// 	let tar_pos2 = new Vector2(tar_pos.x, tar_pos.z);
	// 	let temp = [mir_pos2, tar_pos2];
	// 	let c = calculateRemainingPoint(temp);

	// 	// get angles to only keep arc
	// 	let mir_angle = mir_pos2.angle();
	// 	let tar_angle = tar_pos2.angle();

	// 	let circle = new EllipseCurve(c.x, c.y, c.r, c.r, tar_angle, mir_angle);
	// 	let points = circle.getPoints( this.resolution );
	// 	let g = new BufferGeometry().setFromPoints( points );

	// 	let m = new LineBasicMaterial( { color : 0xff0000 } );

	// 	// Create the final object to add to the scene
	// 	this.path = new Line( g, m );
	// 	scene.add(this.path);
	// 	this.path.rotateX(Math.PI/2);
	// }

	// move MIR back and forth along path
	handleMIR(target){
		// let target_world = new Vector3();
		// let mir_world    = new Vector3();
		// // let circle       = new CatmullRomCurve3();
		// let points       = new Array();

		// target.getWorldPosition(target_world);
		// this.robot.getWorldPosition(mir_world);

		// let distance = distanceBetween(target_world, mir_world);


		// if (this.running && distance <= this.tolerance) { 
		// 	this.running = false;
		// 	this.path.geometry.dispose();
		// 	this.path.material.dispose();
		// 	scene.remove( this.path );
		// 	this.path    = null;
		// }
		// else if (this.running && this.path !== null) { 
		// 	moveMIR();
		// }
		// else if (!this.running && distance > this.tolerance){ 
		// 	this.running = true;
		// 	// this.calculateCircle(target_world, mir_world);
		// 	this.steps = 0;
		// 	moveMIR();
		// }
	}	

	moveMIR(){
		//Then at each increment (in your render loop or in the 'update' function of a tween)
		if (this.steps >= this.path.length - (this.velocity * 2) - 1) { 
			this.increment = -1;
		}
		else if (this.steps <= (2 * this.velocity) + 1){
			this.increment = 1;
		}
		let new_pos = this.velocity * this.increment;

		let newPosition = this.path[this.steps];
		this.robot.position.copy( newPosition );

		//Also update the car's orientation so it looks at the road
		let target = this.path[this.steps + new_pos];
		this.robot.lookAt( target );//+.001 or whatever

		this.steps = this.steps + new_pos;
	}	
}

class FANUC extends Group { 

	constructor(robot, angles, axes, tolerance) { 

	}
}

// Create a sine-like wave
// const curve = new THREE.SplineCurve( [
// 	new THREE.Vector2( -10, 0 ),
// 	new THREE.Vector2( -5, 5 ),
// 	new THREE.Vector2( 0, 0 ),
// 	new THREE.Vector2( 5, -5 ),
// 	new THREE.Vector2( 10, 0 )
// ] );

// const points = curve.getPoints( 50 );
// const geometry = new THREE.BufferGeometry().setFromPoints( points );

// const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// // Create the final object to add to the scene
// const splineObject = new THREE.Line( geometry, material );

//Create a closed wavey loop
// const curve = new THREE.CatmullRomCurve3( [
// 	new THREE.Vector3( -10, 0, 10 ),
// 	new THREE.Vector3( -5, 5, 5 ),
// 	new THREE.Vector3( 0, 0, 0 ),
// 	new THREE.Vector3( 5, -5, 5 ),
// 	new THREE.Vector3( 10, 0, 10 )
// ] );

// const points = curve.getPoints( 50 );
// const geometry = new THREE.BufferGeometry().setFromPoints( points );

// const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// // Create the final object to add to the scene
// const curveObject = new THREE.Line( geometry, material );

// calculate the bounding circle in the xz plane
// where the target is on the circle and the mir's
// current vector is on the circle
// Give MIR an acceleration and a velocity

// //1. create spline's points
// var points = [
//     new THREE.Vector3( x1, y1, z1 ),
//     new THREE.Vector3( x2, y2, z2 ),
//     ...
//     new THREE.Vector3( xn, yn, zn )
//     ];

// //2. create spline
// var spline = new THREE.CatmullRomCurve3( points );
// //since r72. Before : THREE.SplineCurve3

// //3. define the car position on the spline, between its start (0) and end (1)
// var carPositionOnSpline = 0;

// //Then at each increment (in your render loop or in the 'update' function of a tween)
// var newPosition = spline.getPoint( carPositionOnSpline );
// car.position.copy( newPosition );

// //Also update the car's orientation so it looks at the road
// var target = spline.getPoint( carPositionOnSpline + .001 );
// car.lookAt( target );//+.001 or whatever
// var actualOrientation = new THREE.Vector3().subVectors( target, newPosition );
// actualOrientation.normalize();

// var orientation=new THREE.Vector3().crossVectors( actualOrientation, previousOrientation );

// wheel.rotation.y = something * orientation.y;

// previousOrientation = actualOrientation;

// const mir_loader = new GLTFLoader();
// var mir;
// mir_loader.load(
// 	// resource URL
// 	'./static/gltf/MIRCOARSE.gltf',
// 	// called when the resource is loaded
// 	// FWIW, what I was guessing was your 
// 	// question is doable by setting object.matrix to be the product 
// 	// of (1) the inverse of parent.matrixWorld and (2) your desired matrix. 
// 	// – WestLangley
// 	function ( gltf ) {

// 		// scene.add( gltf.scene );
// 		// gltf.animations; // Array<THREE.AnimationClip>
// 		// gltf.scene; // THREE.Group
// 		// gltf.scenes; // Array<THREE.Group>
// 		// gltf.cameras; // Array<THREE.Camera>
// 		// gltf.asset; // Object

// 		// let fanuc_j2_original = new Group();
// 		let j1axis = new AxesHelper( .50 );
// 		mir = gltf.scene;
// 		scene.add(mir);
// 		mir.add(j1axis);
// 		mir.position.set(800,0,290);
// 		mir.scale.set(100,100,100);
// 		mir.rotateY(radians(-155));
		
// 		console.log(mir);
// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( error );

// 	}
// );

var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

function downloadJSON( blob, filename ) {

	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();
	// URL.revokeObjectURL( url ); breaks Firefox...

}

// const urloader = new GLTFLoader();
// var ur_gltf;
// var urbase;
// var urj1;
// var urj2;
// var urj3;
// var urj4;
// var urj5;
// var urj6;
// // './static/gltf/UR3e_med.gltf'
// urloader.load(
// 	// resource URL
// 	'./static/gltf/ur3_small.gltf',
// 	// called when the resource is loaded
// 	function ( gltf ) {

// 		console.log(gltf.scene);
// 		// gltf.animations; // Array<THREE.AnimationClip>
// 		// gltf.scene; // THREE.Group
// 		// gltf.scenes; // Array<THREE.Group>
// 		// gltf.cameras; // Array<THREE.Camera>
// 		// gltf.asset; // Object
// 		let ur3 = gltf.scene;
// 		let full_ur3 = ur3.clone().children[0];
// 		ur_gltf = gltf.scene.clone(false);
// 		full_ur3.children = [];
// 		let children = ur3.clone().children[0].children;
// 		console.log(children);
// 		for (let i=0; i < children.length; i++){
// 			switch (children[i].name){
// 				case "occurrence_of_Base":
// 					urbase = children[i];
// 					break;
// 				case "occurrence_of_Shoulder":
// 					urj1 = children[i];
// 					break;
// 				case "occurrence_of_Elbow":
// 					urj2 = children[i];
// 					break;
// 				case "occurrence_of_Wrist_1":
// 					urj3 = children[i];
// 					break;
// 				case "occurrence_of_Wrist_2":
// 					urj4 = children[i];
// 					break;
// 				case "occurrence_of_Wrist_3":
// 					urj5 = children[i];
// 					break;
// 				case "occurrence_of_Tool_flange":
// 					urj6 = children[i];
// 					break;
// 			}
// 		}
// 		// let	j1axis = new AxesHelper( .20 );
// 		// let j2axis = new AxesHelper( .20 );
// 		// let j3axis = new AxesHelper( .20 );
// 		// let j4axis = new AxesHelper( .20 );
// 		// let j5axis = new AxesHelper( .20 );
// 		// let j6axis = new AxesHelper( .20 );
// 		scene.add(ur_gltf);
// 		ur_gltf.attach(full_ur3);
// 		full_ur3.attach(urbase);
// 		urbase.attach(urj1);
// 		urj1.attach(urj2);
// 		// urj1.add(j1axis);
// 		urj2.attach(urj3);
// 		// urj2.add(j2axis);
// 		urj3.attach(urj4);
// 		// urj3.add(j3axis);
// 		urj4.attach(urj5);
// 		// urj4.add(j4axis);
// 		urj5.attach(urj6);
// 		// urj5.add(j5axis);

// 		ur_gltf.scale.set(100, 100, 100);
// 		ur_gltf.position.set(595,80,415);
// 		ur_gltf.rotateY(Math.PI);

// 		console.log(ur_gltf);
// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( error );

// 	}
// );

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// j1 --> Vector3
// j2 --> Vector3 
function distanceBetween(j1, j2){
	return j1.distanceTo(j2);
}

// https://stackoverflow.com/questions/31973278/iterate-an-array-as-a-pair-current-next-in-javascript
function pairwise(arr, func){
	let new_arr = new Array(arr.length);
    for(let i=0; i < arr.length - 1; i++){
        new_arr[i] = func(arr[i], arr[i + 1])
    }
    return new_arr;
}

// https://stackoverflow.com/questions/9453421/how-to-round-float-numbers-in-javascript
function roundUsing(func, number, prec) {
    var tempnumber = number * Math.pow(10, prec);
    tempnumber     = func(tempnumber);
    return tempnumber / Math.pow(10, prec);
}

function orthogonal(p){
	let temp = p.clone();
	let x = Math.abs(p.x);
	let y = Math.abs(p.y);
	let z = Math.abs(p.z);

	let X_AXIS = new Vector3(1,0,0);
	let Y_AXIS = new Vector3(0,1,0);
	let Z_AXIS = new Vector3(0,0,1);

	let other = x < y ? (x < z ? X_AXIS : Z_AXIS) : (y < z ? Y_AXIS : Z_AXIS);
	temp.cross(other);
	return temp;
}

function quatToEuler(q){
	let phi1  = 2 * ((q.w * q.x) + (q.y * q.z));
    let phi2  = 1 - (2 * (q.x * q.x + q.y * q.y));
    let phi   = roundUsing(Math.floor, Math.atan2(phi1, phi2), 8);

    let theta = 2 * ((q.w * q.y) - (q.z * q.x));
    theta = theta > 1 ? 1 : theta;
    theta = theta < -1 ? -1 : theta;
    theta = roundUsing(Math.floor, Math.asin(theta), 8);

    let psi1  = 2 * ((q.w * q.z) + (q.x * q.y));
    let psi2  = 1 - (2 * (q.y * q.y + q.z * q.z));
    let psi   = roundUsing(Math.floor, Math.atan2(psi1, psi2), 8);

    return new Euler(phi, theta, psi);
}

// https://stackoverflow.com/questions/22015684/how-do-i-zip-two-arrays-in-javascript
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function degrees (angle) {
  return angle * (180 / Math.PI);
}

function radians (angle) {
  return angle * (Math.PI / 180);
}

function radsToQuaternion(psi, theta, phi){
	let c3 = Math.cos(psi / 2);
    let s3 = Math.sin(psi / 2);
    let c2 = Math.cos(theta / 2);
    let s2 = Math.sin(theta / 2);
    let c1 = Math.cos(phi / 2);
    let s1 = Math.sin(phi / 2);

    let w = (c1 * c2 * c3) + (s1 * s2 * s3);
    let x = (s1 * c2 * c3) - (c1 * s2 * s3);
    let y = (c1 * s2 * c3) + (s1 * c2 * s3);
    let z = (c1 * c2 * s3) - (s1 * s2 * c3);

    return new Quaternion(x, y, z, w).normalize();
}

// v1 --> Vector3
// v2 --> Vector3
function findQuatForVecs(v1, v2){ 
	let v1_norm = v1.clone().normalize();
	let v2_norm = v2.clone().normalize();

	let _dot    = v1.dot(v2);
	let k       = Math.sqrt(v1.length() * v2.length());
	if (_dot / k == -1){
		let ortho = orthogonal(v1_norm).normalize();
		return new Quaternion(ortho.x, ortho.y, ortho.z, 0);
	}

	let quat_vec = v1_norm.clone().cross(v2_norm);
	let quat_w = _dot + k;
	return new Quaternion(quat_vec.x, quat_vec.y, quat_vec.z, quat_w);
}

// p -> Vector3
// q -> Quaternion
function rotatePByQuat(p, q){
	let q_norm  = q.clone().normalize();
	let q_vec   = new Vector3(q_norm.x, q_norm.y, q_norm.z, 0);
	let q_vec_2 = q_vec.clone().multiplyScalar(2);
	let t       = q_vec_2.clone().cross(p);

	let qw_times_t   = t.clone().multiplyScalar(q_norm.w);
	let p_plus_qw    = p.clone().add(qw_times_t);
	let cross_qvec_t = q_vec.clone().cross(t);
	let result = p_plus_qw.clone().add(cross_qvec_t);
	let rounded_x = roundUsing(Math.floor, result.x, 10);
	let rounded_y = roundUsing(Math.floor, result.y, 10);
	let rounded_z = roundUsing(Math.floor, result.z, 10);
	return new Vector3(rounded_x, rounded_y, rounded_z);
}

class SimpleArm {
	// nodes --> Array of Vec3
	// edges --> Array of pair of int 
	// anglelims --> Array of pair of int
	// axes --> array of Vec3
	constructor(nodes, edges, anglelims, axes, sizes){
		this.nodes       = nodes;
		this.edges       = edges;
		this.anglelims   = anglelims;
		this.axes        = axes;
		this.sizes       = sizes;
		this.angles      = new Array(edges.length).fill(0);
		this.eulerangles = new Array(edges.length).fill(new Euler(0,0,0));
		this.distances   = pairwise(nodes, distanceBetween);

		this.checkDistances = this.checkDistances.bind(this);
		this.createRobot = this.createRobot.bind(this);
		this.robot       = this.createRobot(scene);
		this.updateDistances = this.updateDistances.bind(this);
		this.setRobot = this.setRobot.bind(this);
		this.maxDistance = this.maxDistance.bind(this);
		this.num_nodes = this.num_nodes.bind(this);
		this.num_links = this.num_links.bind(this);
		this.getCurrMotorAngle = this.getCurrMotorAngle.bind(this);
		this.setAngles = this.setAngles.bind(this);
		this.getEndEffector = this.getEndEffector.bind(this);
		this.constrainQuat = this.constrainQuat.bind(this);
		this.CCDIKIter = this.CCDIKIter.bind(this);
		this.rotateJByQuat = this.rotateJByQuat.bind(this);
		this.getAngleLims = this.getAngleLims.bind(this);
		this.getNode = this.getNode.bind(this);
		this.getEulerAngles = this.getEulerAngles.bind(this);
		this.getAxis = this.getAxis.bind(this);

		this.tcp		 = new Vector3();
	}

	checkDistances(new_dists){
		let combined_dists = zip(this.distances, new_dists);
		console.log(combined_dists);
		let temp = new Array();
		combined_dists.forEach(e => {
			let e1 = e[0];
			let e2 = e[1];
			let a = roundUsing(Math.floor, e1, 6);
			let b = roundUsing(Math.floor, e2, 6);
			temp.push(a == b);
		});
		return temp.every(v => v === true); 
	}

	createRobot(base){
		let temp = new Array();
		for (let i = 0; i < this.num_nodes(); i++){
			let position = this.getNode(i).toArray();
			let size     = this.sizes[i];
			let joint    = new Group();
			// let graphicsOffset = 
			if (i == 0){
				let axis     = this.getAxis(i).toArray();
				let limits   = this.anglelims[i];
				base.add(joint);
				joint.position.set(position[0], position[1], position[2]);
				joint.axis = new Vector3(axis[0], axis[1], axis[2]);
				joint.minLimit = limits[0] * 0.0174533;
				joint.maxLimit = limits[1] * 0.0174533;
				temp.push(joint);
				let box = new Mesh(boxGeometry, white);
				joint.add(box);
				box.scale.set(size[0], size[1], size[2]);
				box.position.set(0, 0, 0);
				box.castShadow = true;
			}
			else if (i != this.num_links()){
				let axis     = this.getAxis(i).toArray();
				let limits   = this.anglelims[i];
				temp[i-1].add(joint);
				let prev_position = this.getNode(i - 1).toArray();
				position = [position[0] - prev_position[0], position[1] - prev_position[1], position[2] - prev_position[2]];
				joint.position.set(position[0], position[1], position[2]);
				joint.axis = new Vector3(axis[0], axis[1], axis[2]);
				joint.minLimit = limits[0] * 0.0174533;
				joint.maxLimit = limits[1] * 0.0174533;
				temp.push(joint);
				let box = new Mesh(boxGeometry, white);
				joint.add(box);
				box.scale.set(size[0], size[1], size[2]);
				box.position.set(0,0,0);
				box.castShadow = true;
			}
			else {
      			temp[i-1].add(joint);
      			let prev_position = this.getNode(i - 1).toArray();
				position = [position[0] - prev_position[0], position[1] - prev_position[1], position[2] - prev_position[2]];
      			joint.position.set(position[0], position[1], position[2]);
      			temp.push(joint);
      			let box = new Mesh(boxGeometry, white);
				joint.add(box);
				box.scale.set(size[0], size[1], size[2]);
				box.position.set(0,0,0);
				box.castShadow = true;
			}
		}
		console.log(temp);
		return temp;
	}

	updateDistances(){
		let temp = pairwise(this.nodes, distanceBetween);
		if (! this.checkDistances(temp)){
			console.log("WARNING: DISTANCES CHANGED");
		}
		this.distances = temp;
	}

	setRobot(robot){
		this.robot = robot;
	}

	maxDistance(){
		return this.distances.reduce((a, b) => a + b, 0);
	}

	num_nodes(){
		return this.nodes.length; 
	}

	num_links(){
		return this.edges.length;
	}

	getCurrMotorAngle(index){
		return this.angles[index];
	}

	setAngles(index, theta){
		this.angles[index] = theta;

		let curr_axis  = this.axes[index];
		let eulerarray = new Array(3);
		let i = curr_axis.toArray().indexOf(1);
		eulerarray[i] = radians(theta);

		this.eulerangles[i] = new Euler().fromArray(eulerarray);
	}

	getAngleLims(index){
		return this.anglelims[index];
	}

	getNode(index){
		return this.nodes[index];
	}

	getEulerAngles(){
		return this.anglelims;
	}

	getAxis(index){
		return this.axes[index];
	}

	getEndEffector(){
		return this.nodes.slice(-1)[0];
	}

	getDistanceOfJointLink(index){
		return this.distances[index];
	}

	setNode(index, node){
		this.nodes[index] = node;
	}

	constrainQuat(q, motor_index){
		let euler    = quatToEuler(q).toArray();
		let eulerdeg = new Array();
		euler.forEach(i => eulerdeg.push(degrees(i)));

		let axis   = this.getAxis(motor_index);
		let angles = this.getAngleLims(motor_index);
		let j_min = angles[0];
		let j_max = angles[1];
		let angle = this.getCurrMotorAngle(motor_index);
		let focus_index = axis.toArray().indexOf(1);
		let focus_angle = eulerdeg[focus_index];

		if (angle == j_min || angle == j_max){
			return new Quaternion(0,0,0,0);
		}
		else if (focus_angle < angle + j_min){
			euler[focus_index] = j_min;
			this.setAngles(motor_index, j_min);
			return radsToQuaternion(euler[2], euler[1], euler[0]);
		}
		else if (focus_angle > angle + j_max){
			euler[focus_index] = j_max;
			this.setAngles(motor_index, j_max);
			return radsToQuaternion(euler[2], euler[1], euler[0]);
		}
		else{
			this.setAngles(motor_index, angle + focus_angle);
			return q;
		}
	}

	rotateJByQuat(index, q){
		if (index == this.num_links()){
			return
		}

		for (let i = index + 1; i <= this.num_links(); i++){
			let vec = this.getNode(i);
			let prev_vec = this.getNode(i - 1);

			vec.clone().sub(prev_vec).applyQuaternion(q).add(prev_vec);
			this.setNode(i, vec);
		}
	}

	CCDIKIter(target){
		let tcp = new Vector3();
		for (let i = this.num_links() - 1; i >= 0; i--){
			this.robot[i].updateMatrixWorld();
			let curr_axis = this.getAxis(i);
			let angles = this.getAngleLims(i);
	        this.robot[this.num_links()].getWorldPosition(this.tcp);
	        let toolDirection = this.robot[i].worldToLocal(this.tcp.clone()).normalize();
	        let targetDirection = this.robot[i].worldToLocal(target.clone()).normalize();
	        let fromToQuat = new Quaternion(0, 0, 0, 1).setFromUnitVectors(toolDirection, targetDirection);
	        this.robot[i].quaternion.multiply(fromToQuat);

	        let invRot = this.robot[i].quaternion.clone().inverse();
	        let parentAxis = this.robot[i].axis.clone().applyQuaternion(invRot);
	        fromToQuat.setFromUnitVectors(this.robot[i].axis, parentAxis);
	        this.robot[i].quaternion.multiply(fromToQuat);
	        // this.robot[i].setRotationFromQuaternion(fromToQuat);

	        let clampedRot = this.robot[i].rotation.toVector3().clampScalar(radians(angles[0]), radians(angles[1]));
	        this.robot[i].rotation.setFromVector3(clampedRot);

	        this.robot[i].updateMatrixWorld();
	        // console.log(this.robot);
		}
	}
}

// arm    --> SimpleArm
// target --> Vector3 
// tolerance --> number
// steps  --> int
function CCDIK(arm, target, tolerance, steps){ 
	let ctr = 0;
	let dist = distanceBetween(arm.getEndEffector(), target);
	// console.log(dist);
	while (dist > tolerance && ctr < steps){
		for (let i = arm.num_links(); i >= 0; i--){
			let curr = arm.getNode(i);
			let ee   = arm.getEndEffector();

			let vec_to_ee     = ee.clone().sub(curr);
			let vec_to_target = target.clone().sub(curr); 

			let quat_rot      = findQuatForVecs(vec_to_ee, vec_to_target);
			let quat_inv      = quat_rot.clone().inverse();
			let curr_axis     = arm.getAxis(i);

			let parent_axis   = rotatePByQuat(curr_axis, quat_inv);
			let quat_axis     = findQuatForVecs(curr_axis, parent_axis);
			let new_quat      = quat_rot.clone().multiply(quat_axis);

			let new_q = arm.constrainQuat(new_quat, i);
			if (!new_q.equals(new Quaternion(0,0,0,0))){
				arm.rotateJByQuat(i, new_quat);
			}
		}
		dist = distanceBetween(arm.getEndEffector(), target);
		ctr++;
	}
}
// function maxDist(model){
// 	let temp_pos = new Array();
// 	let temp = new Vector3();
// 	model[0].getWorldPosition(temp)
// 	let base_length = temp.length();
// 	let summ_dists = base_length;
// 	model.forEach(e => {e.getWorldPosition(temp); temp_pos.push(temp);});

// 	for (let i=0; i < model.length - 1; i++){
// 		summ_dists += Math.abs(temp_pos[i].distanceTo(temp_pos[i+1]));
// 	}
// 	return summ_dists;
// }

	// if (target.length() > maxDist(model)){
	// 	let lastJoint = model.slice(-2)[0];
	// 	// just make sure the end effector is pointing towards
	// 	// the target 
	// 	lastJoint.lookAt(target);
	// 	let invRot = lastJoint.quaternion.clone().inverse();
 //        let parentAxis = lastJoint.axis.clone().applyQuaternion(invRot);
 //        let fromToQuat = new Quaternion(0,0,0,1).setFromUnitVectors(lastJoint.axis, parentAxis);
 //        lastJoint.quaternion.multiply(fromToQuat);
 //        return;
	// }

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
// Optimizations from https://github.com/mrdoob/three.js/blob/master/examples/jsm/animation/CCDIKSolver.js
// 

function CCDIKGLTF(model, anglelims, axes, target){
	let tcp             = new Vector3();
	let targetDirection = new Vector3();
	let invQ            = new Quaternion();
	let scale_junk      = new Vector3();
	let endEffector     = model.slice(-1)[0];
	let ee              = new Vector3();
	let temp_ee         = new Vector3();
	let temp_target     = new Vector3();
	let axis            = new Vector3();
	let q               = new Quaternion();
	// endEffector.getWorldPosition(ee);

	for (let i = model.length - 2; i >= 0; i--){
		// console.log(i);
		let curr = model[i];
        curr.updateMatrixWorld();

        let curr_axis = axes[i];
        let angles = anglelims[i];

        curr.matrixWorld.decompose(tcp, invQ, scale_junk);
        invQ.inverse();
        ee.setFromMatrixPosition(endEffector.matrixWorld);

        endEffector.getWorldPosition(ee);

        temp_ee.subVectors(ee, tcp);
        temp_ee.applyQuaternion(invQ);
        temp_ee.normalize();

        temp_target.subVectors(target, tcp);
        temp_target.applyQuaternion(invQ);
        temp_target.normalize();

        let angle = temp_target.dot(temp_ee);
        if ( angle > 1.0 ) {
			angle = 1.0;
		} else if ( angle < - 1.0 ) {
			angle = - 1.0;
		}

		angle = Math.acos( angle );

		if ( angle < 1e-5 ) continue;

		if (angle < angles[0]) {
			angle = angles[0];
		}
		if (angle > angles[1] ) {
			angle = angles[1];
		}

		axis.crossVectors( temp_ee, temp_target );
		axis.normalize();

		q.setFromAxisAngle( axis, angle );
		curr.quaternion.multiply( q );

        let invRot = curr.quaternion.clone().inverse();
        let parentAxis = curr.axis.clone().applyQuaternion(invRot);
        // console.log(parentAxis);

        let fromToQuat = new Quaternion(0,0,0,1).setFromUnitVectors(curr.axis, parentAxis);
        let eulercheck = new Euler().setFromQuaternion(fromToQuat);
  //       let angle2 = Math.acos( curr_axis.dot(parentAxis));
  //       if (curr_axis.toArray() === [1,0,0]){
		// 	curr.rotateX(eulercheck.toArray()[0]);
		// }
		// else if (curr_axis.toArray() === [0,1,0]){
		// 	curr.rotateY(eulercheck.toArray()[0]);
		// }
		// else {
		// 	curr.rotateZ(eulercheck.toArray()[0]);
		// }

        curr.quaternion.multiply(fromToQuat); 
        // model[1].rotation.y = -Math.PI/2;
		// model[1].rotation.z = 0;
        // let clampedRot = curr.rotation.toVector3().clampScalar(radians(angles[0]), radians(angles[1]));
        // curr.rotation.setFromVector3(clampedRot);
        curr.updateMatrixWorld();
        // console.log(curr.rotation);
	}
}

function CCDSINGULAR(curr, endEffector, angles, curr_axis, target){
	let tcp             = new Vector3();
	let targetDirection = new Vector3();
	let invQ            = new Quaternion();
	let scale_junk      = new Vector3();
	let ee              = new Vector3();
	let temp_ee         = new Vector3();
	let temp_target     = new Vector3();
	let axis            = new Vector3();
	let q               = new Quaternion();
	// endEffector.getWorldPosition(ee);
	// console.log(i);
    curr.updateMatrixWorld();

    curr.matrixWorld.decompose(tcp, invQ, scale_junk);
    invQ.inverse();
    ee.setFromMatrixPosition(endEffector.matrixWorld);

    endEffector.getWorldPosition(ee);

    temp_ee.subVectors(ee, tcp);
    temp_ee.applyQuaternion(invQ);
    temp_ee.normalize();

    temp_target.subVectors(target, tcp);
    temp_target.applyQuaternion(invQ);
    temp_target.normalize();

    let angle = temp_target.dot(temp_ee);
    if ( angle > 1.0 ) {
		angle = 1.0;
	} else if ( angle < - 1.0 ) {
		angle = - 1.0;
	}

	angle = Math.acos( angle );

	if ( angle < 1e-5 ) return;

	if (angle < angles[0]) {
		angle = angles[0];
	}
	if (angle > angles[1] ) {
		angle = angles[1];
	}

	axis.crossVectors( temp_ee, temp_target );
	axis.normalize();

	q.setFromAxisAngle( axis, angle );
	curr.quaternion.multiply( q );

    let invRot = curr.quaternion.clone().inverse();
    let parentAxis = curr.axis.clone().applyQuaternion(invRot);
    // console.log(parentAxis);

    let fromToQuat = new Quaternion(0,0,0,1).setFromUnitVectors(curr.axis, parentAxis);

    curr.quaternion.multiply(fromToQuat); 
    curr.updateMatrixWorld();
    // console.log(curr.rotation);
}

function LOOKATCCD(model, anglelims, axes, target){
	let tcp = new Vector3();
	let targetDirection = new Vector3();
	let endEffector = model.slice(-1)[0];
	let ee = new Vector3();
	endEffector.getWorldPosition(ee);

	for (let i = model.length - 2; i >= 0; i--){
		let curr = model[i];
        curr.updateMatrixWorld();

        let curr_axis = axes[i];
        let angles = anglelims[i];

        // let tcp = target.clone();
        // let toolDirection = curr.worldToLocal(tcp);
        curr.lookAt(target);

        let invRot = curr.quaternion.clone().inverse();
        let parentAxis = curr.axis.clone().applyQuaternion(invRot);
        let fromToQuat = new Quaternion(0,0,0,1).setFromUnitVectors(curr.axis, parentAxis);
        curr.quaternion.multiply(fromToQuat);

        // let clampedRot = curr.rotation.toVector3().clampScalar(radians(angles[0]), radians(angles[1]));
        // curr.rotation.setFromVector3(clampedRot);

        curr.updateMatrixWorld();
	}
}

var j1_angles = new Array(-179, 179);
var j1_axis   = new Vector3(0,0,1);
var urj1_axis = new Vector3(0,1,0);

var j2_angles = new Array(-120, 60);
var j2_axis   = new Vector3(0,1,0);
var urj2_axis = new Vector3(0,0,1);

var j3_angles = new Array(-60, 60);
var j3_axis   = new Vector3(0,1,0);
var urj3_axis = new Vector3(0,1,0);

var j4_angles = new Array(-120, 120);
var j4_axis   = new Vector3(1,0,0);
var urj4_axis = new Vector3(0,0,1);

var j5_angles = new Array(-179, 179);
var j5_axis   = new Vector3(0,1,0);
var urj5_axis = new Vector3(1,0,0);

var j6_angles = new Array(0, 0);
var j6_axis = new Vector3(0,0,0);
var urj6_axis = new Vector3(0,0,0);

// var j1 = new Vector3(0,0,0);
// var j2 = new Vector3(0, -116, 137.484);
// var j3 = new Vector3(0, -116 ,777.484);
// var j4 = new Vector3(0, 0, 777.484);
// var j5 = new Vector3(0, 0, 969.484);
// var j6 = new Vector3(256, 0, 969.484);

var fanuc_angles = new Array(j1_angles, j2_angles, j3_angles, j4_angles, j5_angles);
var fanuc_axes   = new Array(j1_axis, j2_axis, j3_axis, j4_axis, j5_axis);
var ur_angles = new Array([-179, 179], [-179, 179], [-179, 179], [-179, 179], [-179, 179]);
var ur_axes = new Array(urj1_axis, urj2_axis, urj3_axis, urj4_axis, urj5_axis, urj6_axis);
var fanuc_edges = new Array(new Array((0,1)),new Array((1,2)), new Array((2,3)), new Array((3,4)), new Array((4,5)));
// var fanuc_sizes = new Array([.01,.01,.01], [.01, .01, .01], [.01, .01, .01], [.01, .01, .01], [.01,.01,.01], [.005,.005,.005]);
// const test = new SimpleArm(fanuc_nodes, fanuc_edges, fanuc_angles, fanuc_axes, fanuc_sizes);

// // TESTING distanceBetween 
// console.log(distanceBetween(j1_axis, j2_axis));
// console.log(distanceBetween(new Vector3(10,20,30), new Vector3(5,2,8)));
// console.log(test.distances);

// // TESTING checkDistance and updateDistances
// console.log(test.checkDistances(new Array(179.88287927426558, 640, 116, 192, 256)));
// test.updateDistances();

// // TESTING maxDistance
// console.log(test.maxDistance());

// var j1_model;
// fanuc_j1.getWorldPosition(j1_model);
// var j2_model;
// fanuc_j2.getWorldPosition(j2_model);
// var j3_model;
// fanuc_j3.getWorldPosition(j3_model);
// var j4_model;
// fanuc_j4.getWorldPosition(j4_model);
// var j5_model;
// fanuc_j5.getWorldPosition(j5_model);
// var j6_model;
// fanuc_j6.getWorldPosition(j6_model);



// var fanuc_gltf_nodes = new Array(j1_model, j2_model, j3_model, j4_model, j5_mode, j6_model);
var new_points = new Array();
var mir_handler = null;
var check = false;
var cccc = null;
var fanuc_robot = new Array();
var ur_robot = new Array();
var check_coords = false;
var export_flag = true;
var calc_circle = true;
var target_world_pos = new Vector3();
// CCDIKGLTF(fanuc_robot, fanuc_angles, fanuc_axes, target2.position);
function animate() {
	// test.CCDIKIter(target2.position);
	// if (fanuc_j2){
	// 	fanuc_j2.rotateY(.1);
	// }
	if (check === false){
		if (fanuc_j1 && fanuc_j2 && fanuc_j3 && fanuc_j4 && fanuc_j5 && fanuc_j6){
			// fanuc_j2.rotation.set(0, -Math.PI / 2, 0);
			fanuc_robot = new Array(fanuc_j1, fanuc_j2, fanuc_j3, fanuc_j4, fanuc_j5, fanuc_j6);
			fanuc_j1.axis = j1_axis;
			fanuc_j2.axis = j2_axis;
			fanuc_j3.axis = j3_axis;
			fanuc_j4.axis = j4_axis;
			fanuc_j5.axis = j5_axis;
			fanuc_j6.axis = j6_axis;
			check = true;
			console.log("TH");
		}
		if (urj1 && urj2 && urj3 && urj4 && urj5 && urj6){
			ur_robot = new Array(urj1, urj2, urj3, urj4, urj5, urj6);
			urj1.axis = urj1_axis;
			urj2.axis = urj2_axis;
			urj3.axis = urj3_axis;
			urj4.axis = urj4_axis;
			urj5.axis = urj5_axis;
			urj6.axis = urj6_axis;
			console.log("TH");
			check = true;
		}
	}

	if (!export_flag && fanuc_gltf !== undefined) {
		// Instantiate a exporter
		const exporter = new GLTFExporter();

		// Parse the input and generate the glTF output
		exporter.parse( fanuc_gltf, function ( gltf ) {
			console.log( gltf );
			let output = JSON.stringify( gltf, null, 2 );
			let blob_output = new Blob( [ output ], { type: 'text/plain' } );
			console.log( output );
			downloadJSON( blob_output ,'scene.gltf' );
		} ); 
		export_flag = true;
	}

	if (calc_circle && mir !== undefined && ur_gltf !== undefined && fanuc_gltf !== undefined) {
		let mir_pos = new Vector3();
		let tar_pos = new Vector3();
		ur_gltf.getWorldPosition(mir_pos);
		fanuc_gltf.getWorldPosition(tar_pos);
		let mir_pos2 = new Vector2(mir_pos.x, mir_pos.z);
		let tar_pos2 = new Vector2(tar_pos.x, tar_pos.z);
		let temp = [mir_pos2, tar_pos2];
		let c = calculateRemainingPoint(temp);

		// get angles to only keep arc
		let mir_angle = new Vector2();
		let tar_angle = new Vector2();
		mir_angle.subVectors(mir_pos2, c);
		tar_angle.subVectors(tar_pos2, c);

		mir_angle = mir_angle.angle();
		tar_angle = tar_angle.angle();
		let circle = new EllipseCurve();

		if (Math.abs(tar_angle) < Math.abs(mir_angle)) {
			circle = new EllipseCurve(c.x, c.y, c.r, c.r, tar_angle, mir_angle);
		}
		else { 
			circle = new EllipseCurve(c.x, c.y, c.r, c.r, mir_angle, tar_angle);
		}
		let points = circle.getPoints( 1000 );

		points.forEach((p) => {
			new_points.push(new Vector3(p.x, 0, p.y));
		})

		let g = new BufferGeometry().setFromPoints( new_points );

		let m = new LineBasicMaterial( { color : 0xff0000 } );

		// Create the final object to add to the scene
		cccc = new Line( g, m );
		scene.add(cccc);
		// cccc.rotateX(Math.PI/2);
		mir.add(target2);
		calc_circle = false;
		cccc.visible = false;
		console.log(cccc);
		mir_handler = new MIR(mir, new_points);
	}
		
	if (fanuc_robot.length != 0 && mir !== undefined){
		mir.getWorldPosition(target_world_pos);
		target_world_pos.add(new Vector3(0, 50, 0));
		CCDIKGLTF(fanuc_robot, fanuc_angles, fanuc_axes, target_world_pos);
		// CCDIKGLTF(ur_robot, ur_angles, ur_axes, target2.position);
		// for (let i=0; i <= fanuc_robot.length - 2; i++){
		// 	await sleep(1000);
		// 	CCDSINGULAR(fanuc_robot[i], fanuc_robot.slice(-1)[0], fanuc_angles[i], fanuc_axes[i], target2.position);
		// }
		// if (!check_coords) { console.log(ur_robot); console.log(fanuc_robot); check_coords = true };
	}
	if (mir_handler !== null) { 
		mir_handler.moveMIR();
	}
    requestAnimationFrame(animate);
    controls.update();
 
    render();
 
};
animate();

function render() {
  renderer.render( scene, camera );
}
