/*
	Daniel Ryaboshapka
	EXAMPLE
*/

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
 
/*
    THREE.JS SCENE SETUP
*/

// Find the container id in the DOM and create a new scene
const container = document.querySelector('#container');
const scene = new Scene();

scene.background = new Color('skyblue');

// Set camera data and initialize camera object, position
const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 3500; // the far clipping plane
const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.set(500, 500, 500);

// set light data and initialize light object
let light = new DirectionalLight(0xbbbbbb);
light.position.set(0, 200, 100);
light.castShadow = true;
light.shadow.camera.top = 180;
light.shadow.camera.bottom = - 100;
light.shadow.camera.left = - 120;
light.shadow.camera.right = 120;
scene.add(light);

//Optional: add hemisphere light for more lighting 
scene.add(new HemisphereLight(0xffffff, 1.5));

// initialize axes (optional)
const axesHelper = new AxesHelper( 5 );
scene.add( axesHelper );

// initialize environment grid 
var grid = new GridHelper(2000, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// set the camera object to view the origin
camera.lookAt(new Vector3(0,0,0));

// Initialize WebGL Renderer to view the scene
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.append(renderer.domElement);

// Initialize Orbit Controls to drag, pan, and 
// zoom the camera around the workspace
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.rotateSpeed = 0.35;
controls.dampingFactor = 0.6;
controls.addEventListener('change', render);
controls.target.set(0, 45, 0);
controls.update();

// Create a draggable object and add Drag Controls to move
// it with the cursor

var draggableObjects = new Array();
const boxGeometry = new BoxBufferGeometry(100, 100, 100);

var target = new Mesh(boxGeometry, new MeshLambertMaterial({ color: 0x3399dd }));
target.position.set(100, 50, 0);
target.scale.set(0.05, 0.05, 0.05);
target.transparent = true;
target.opacity = 0.5;
target.castShadow = true;
target.receiveShadow = true;
scene.add(target);
draggableObjects.push(target);

// DragControls events to overwrite Orbit Controls when dragging the target 
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

/*
  END SCENE SETUP 
*/

const loader = new GLTFLoader();
var spike;

loader.load(
  // resource URL
  './static/gltf/SPIKE.gltf',
  function ( gltf ) {
    spike = gltf.scene;

    scene.add(spike);
    spike.scale.set(500,500,500);
    spike.position.set(0,0,0);
    spike.rotation.set(-Math.PI/2, 0, 0);
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

//Create a closed wavey loop
const curve = new CatmullRomCurve3( [
  new Vector3( -1, 0, 1 ),
  new Vector3( -.5, .5, .5 ),
  new Vector3( 0, 0, 0 ),
  new Vector3( .5, -.5, .5 ),
  new Vector3( 1, 0, 1 )
] );

const points = curve.getPoints( 1000 );
const geometry = new BufferGeometry().setFromPoints( points );

const material = new LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new Line( geometry, material );

var ctr = 0;
var direction = 1;
// animate function
function animate(){

    requestAnimationFrame(animate);
    controls.update();
   
    //check to see if spike is loaded before animating
    if (spike){
      spike.rotateY(.05);
      spike.rotateZ(.025);
      // spike.rotateX(.05);
      if (ctr === 99){
        direction = -1;
      }
      else if (ctr === 0){
        direction = 1;
      }
      ctr += direction;
      // console.log(points[ctr]);
      let curr_vec = points[ctr];
      spike.translateX(curr_vec.x * direction);
      spike.translateY(curr_vec.y * direction);
      spike.translateZ(curr_vec.z * direction);
    }

    render();
 
};
animate();

// render function
function render() {
  renderer.render( scene, camera );
}
