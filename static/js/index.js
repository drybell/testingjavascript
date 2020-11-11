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
  MOUSE
} from './three.module.js';

import { OrbitControls } from './OrbitControls.js';

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

const renderer = new WebGLRenderer();

renderer.setSize(container.clientWidth, container.clientHeight);

renderer.setPixelRatio(window.devicePixelRatio);

container.append(renderer.domElement);

renderer.render(scene, camera);
const controls = new OrbitControls( camera, renderer.domElement );
controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
function animate() {
 
    requestAnimationFrame(animate);
    controls.update();
 
    renderer.render(scene, camera);
 
};

animate();
