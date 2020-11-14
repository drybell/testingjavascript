// Initialize number of bins

// var bins = 10; 
// var ul   = document.getElementById('eq');
// for (let i=0; i < bins; i++){
// 	var bin = document.createElement("li");
// 	ul.appendChild(bin);
// }

// function changeHeight(id, height){
// 	column = ul.children[id];
// 	// if (height > 200) height=200;
// 	// if (height < 10) height=10;
// 	column.style.height = height+"px";
// }

// function randomNumber(min, max) {
//   number =  Math.floor((Math.random()*(max-min))+ min);
//   return number;
// }


// for (let i=0; i < bins; i++){
// 	changeHeight(i, randomNumber(10,200));
// }

// function getFFTUpdate(){ 
// 	// make fetch or XMLHTTPRequest here 


// 	//make call every 100ms and update eq 
// 	setTimeout(getFFTUpdate, 100)
// }


import {
  BoxBufferGeometry,
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
  AxesHelper
} from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { DragControls } from './DragControls.js';
// import { STLLoader } from './STLLoader.js';

const container = document.querySelector('#container');
const scene = new Scene();

scene.background = new Color('skyblue');

var white = new MeshLambertMaterial({ color: 0x888888 });

const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 2000; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);
var draggableObjects = new Array();
camera.position.set(50, 100, 150)

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
target2.position.set(5, 11, 3);
target2.scale.set(0.02, 0.02, 0.02);
target2.transparent = true;
target2.opacity = 0.5;
target2.castShadow = true;
target2.receiveShadow = true;
scene.add(target2);
draggableObjects.push(target2);

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

var j1_angles = new Array(-179, 179);
var j1_axis   = new Vector3(0,1,0);

var j2_angles = new Array(-60, 60);
var j2_axis   = new Vector3(0,0,1);

var j3_angles = new Array(-30, 30);
var j3_axis   = new Vector3(0,0,1);

var j4_angles = new Array(-30, 30);
var j4_axis   = new Vector3(0,0,1);

var j5_angles = new Array(-30, 30);
var j5_axis   = new Vector3(1,0,0);

// var j1 = new Vector3(0,0,0);
// var j2 = new Vector3(0, -116, 137.484);
// var j3 = new Vector3(0, -116 ,777.484);
// var j4 = new Vector3(0, 0, 777.484);
// var j5 = new Vector3(0, 0, 969.484);
// var j6 = new Vector3(256, 0, 969.484);

var j1 = new Vector3(0,0,0);
var j2 = new Vector3(0, 1.37484, -1.16);
var j3 = new Vector3(0, 7.77484, -1.16);
var j4 = new Vector3(0, 7.77484, 0);
var j5 = new Vector3(0, 9.69484, 0);
var j6 = new Vector3(2.56, 9.69484, 0);

var fanuc_angles = new Array(j1_angles, j2_angles, j3_angles, j4_angles, j5_angles);
var fanuc_axes   = new Array(j1_axis, j2_axis, j3_axis, j4_axis, j5_axis);
var fanuc_nodes = new Array(j1, j2, j3, j4, j5, j6);
var fanuc_edges = new Array(new Array((0,1)),new Array((1,2)), new Array((2,3)), new Array((3,4)), new Array((4,5)));
var fanuc_sizes = new Array([.01,.01,.01], [.01, .01, .01], [.01, .01, .01], [.01, .01, .01], [.01,.01,.01], [.005,.005,.005]);
const test = new SimpleArm(fanuc_nodes, fanuc_edges, fanuc_angles, fanuc_axes, fanuc_sizes);

// TESTING distanceBetween 
console.log(distanceBetween(j1_axis, j2_axis));
console.log(distanceBetween(new Vector3(10,20,30), new Vector3(5,2,8)));
console.log(test.distances);

// TESTING checkDistance and updateDistances
console.log(test.checkDistances(new Array(179.88287927426558, 640, 116, 192, 256)));
test.updateDistances();

// TESTING maxDistance
console.log(test.maxDistance());

function animate() {
	test.CCDIKIter(target2.position);
    requestAnimationFrame(animate);
    controls.update();
 
    render();
 
};
animate();

function render() {
  renderer.render( scene, camera );
}
