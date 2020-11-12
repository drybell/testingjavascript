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
  MOUSE
} from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { STLLoader } from './STLLoader.js';

const container = document.querySelector('#container');
const scene = new Scene();

scene.background = new Color('skyblue');

const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);

camera.position.set(0, 0, 10);

const geometry = new BoxBufferGeometry(2, 2, 2);
const material = new MeshBasicMaterial();
const cube = new Mesh(geometry, material);

scene.add(cube);
scene.add(new HemisphereLight(0xffffff, 1.5));

const renderer = new WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);

renderer.setPixelRatio(window.devicePixelRatio);

container.append(renderer.domElement);

renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.rotateSpeed = 0.05;
controls.dampingFactor = 0.1;
controls.enableZoom = true;
controls.autoRotate = true;
controls.autoRotateSpeed = .75;
function animate() {
 
    requestAnimationFrame(animate);
    controls.update();
 
    renderer.render(scene, camera);
 
};

animate();

// QUATERNION
// const quaternion = new THREE.Quaternion();
// quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );

// const vector = new THREE.Vector3( 1, 0, 0 );
// vector.applyQuaternion( quaternion );

// EULER
// const a = new THREE.Euler( 0, 1, 1.57, 'XYZ' );
// const b = new THREE.Vector3( 1, 0, 1 );
// b.applyEuler(a);

// def quatsFromJointLimits(jlims):
// 	quats = []
// 	for min_max, axis in jlims:
// 		lower = min_max[0]
// 		upper = min_max[1]
// 		temp = []
// 		temp.append(axisAngleToQuat(axis, lower))
// 		temp.append(axisAngleToQuat(axis, upper))
// 		quats.append(temp)

// 	return quats

// def distanceBetween(j1, j2): 
// 	return abs(np.linalg.norm(j1-j2))

class SimpleArm {
	constructor(nodes, edges, jlims, anglelims, axes){
		this.nodes = nodes;
		this.edges = edges;
		this.jlims = jlims; 
		this.anglelims = anglelims;
		this.axes  = axes;
		this.distances = new Array(nodes.length);
	}

	checkDistances(){
		return true; 
	}

	updateDistances(){
		return true;
	}

	addNodes(){ 
		return true;
	}

	addEdges(){
		return true;
	}

	currRot(){
		return true;
	}

	debugging(){
		return true; 
	}

	maxDistance(){
		return 10; 
	}

	num_nodes(){
		return this.node.length; 
	}

	num_links(){
		return this.edges.length;
	}

	setAngles(){

	}

	getAngle(index){
		return this.anglelims[index];
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

	}

	setNode(index, node){

	}

	constrainQuat(quaternion, motor_index){

	}

	rotateJByQuat(index, q){

	}

	isQuatWithinBounds(q_check, q_range){

	}


	checkBounds(j_to_rotate, motor_index, target){

	}

}

// function CCDIK(s, t, tolerance, steps){
// 	let ctr = 0
	
// 	// TODO
// 	let dist = distanceBetween(s.getEndEffector(), t)

// 	while (dist > tolerance && ctr < steps){
// 		for (let i=s.num_links(); i >= 0; i--){

// 			let curr = s.getNode(i)
// 			let ee   = s.getEndEffector()

// 			let vec_to_ee = ee - curr
// 			let vec_to_target = t - curr

// 			let quat_rot = findQuatforVecs(vec_to_ee, vec_to_target)
// 			let quat_inv = quat_rot.inverse()
// 			let curr_axis = s.getAxis(i)

// 			let parent_axis = rotatePByQuat(curr_axis, quat_inv)
// 			let quat_axis = findQuatforVecs(curr_axis, parent_axis)
// 			let new_quat = quat_rot.multiply(quat_axis)

// 			let new_q = s.constrainQuat(new_quat, i)
// 			if (!new_q.equals(Quaternion(0,0,0,0))){
// 				s.rotateJByQuat(i, new_quat)
// 			}
// 		}

// 		dist = distanceBetween(s.getEndEffector(), t)
// 		ctr += 1
// 	}

// 	return ctr
// }
