

// // Find the container id in the DOM and create a new scene
// const container = document.querySelector('#container');
// const scene = new Scene();

// scene.background = new Color('skyblue');

// // Set camera data and initialize camera object, position
// const fov = 35; // AKA Field of View
// const aspect = container.clientWidth / container.clientHeight;
// const near = 0.1; // the near clipping plane
// const far = 3500; // the far clipping plane
// const camera = new PerspectiveCamera(fov, aspect, near, far);
// camera.position.set(500, 500, 500);

// // set light data and initialize light object
// let light = new DirectionalLight(0xbbbbbb);
// light.position.set(0, 200, 100);
// light.castShadow = true;
// light.shadow.camera.top = 180;
// light.shadow.camera.bottom = - 100;
// light.shadow.camera.left = - 120;
// light.shadow.camera.right = 120;
// scene.add(light);

// //Optional: add hemisphere light for more lighting 
// scene.add(new HemisphereLight(0xffffff, 1.5));

// // initialize axes (optional)
// const axesHelper = new AxesHelper( 5 );
// scene.add( axesHelper );

// // initialize environment grid 
// var grid = new GridHelper(2000, 20, 0x000000, 0x000000);
// grid.material.opacity = 0.2;
// grid.material.transparent = true;
// scene.add(grid);

// // set the camera object to view the origin
// camera.lookAt(new Vector3(0,0,0));

// // Initialize WebGL Renderer to view the scene
// const renderer = new WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(container.clientWidth, container.clientHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// container.append(renderer.domElement);

// // Initialize Orbit Controls to drag, pan, and 
// // zoom the camera around the workspace
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.rotateSpeed = 0.35;
// controls.dampingFactor = 0.6;
// controls.addEventListener('change', render);
// controls.target.set(0, 45, 0);
// controls.update();

// // Create a draggable object and add Drag Controls to move
// // it with the cursor
// var draggableObjects = new Array();
// const boxGeometry = new BoxBufferGeometry(100, 100, 100);

// var target = new Mesh(boxGeometry, new MeshLambertMaterial({ color: 0x3399dd }));
// target.position.set(100, 50, 0);
// target.scale.set(0.05, 0.05, 0.05);
// target.transparent = true;
// target.opacity = 0.5;
// target.castShadow = true;
// target.receiveShadow = true;
// scene.add(target);
// draggableObjects.push(target);

// // DragControls events to overwrite Orbit Controls when dragging the target 
// const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

// dragControls.addEventListener('dragstart', function () {
//   controls.enabled = false;
// });  

// dragControls.addEventListener('dragend', function () {
//   controls.enabled = true;
// });

// dragControls.addEventListener('hoveron', function () {
//   controls.enabled = false;
// });

// dragControls.addEventListener('hoveroff', function () {
//   controls.enabled = true;
// });

// MATT's PLTW Work

const loader = new GLTFLoader();

// assign global vars in order to set each part within an 
// assembly post-loading. There should be a better way to
// receive the parts and attach them to variables
var base;
var shoulder;
var arm;
var forearm;
var wrist; 

// loading function, takes in the resource URL, loading func, 
loader.load(
  // resource URL
  './static/gltf/PLTW.gltf',
  function ( gltf ) {
    console.log(gltf.scene);
    let pltw = gltf.scene;

    // clone the root of the assembly with no children
    let pltw_gltf = gltf.scene.clone(false);

    // ORDERING OF THE PLTW HIERARCHY 
    // BASE --> SHOULDER --> ARM --> FOREARM --> WRIST 

    // Obtain the 5 children from the root 
    let children = pltw.clone().children[0].children;

    // since the loading is async, we have to iterate through the 
    // children array in order to obtain the correct ordering
    // of the hierarchy

    // The names are the exact names within the Onshape Assembly
    // with spaces replaced with underscore (_)

    for (let i=0; i < children.length; i++){
      switch (children[i].name){
        case "Base_<1>":
          base = children[i];
          break;
        case "Shoulder_<1>":
          shoulder = children[i];
          break;
        case "Arm_<1>":
          // fanuc_j2_original = children[i];
          // fanuc_j2_original.rotateY(radians(90));
          arm = children[i];
          break;
        case "Forearm_<1>":
          forearm = children[i];
          break;
        case "Wrist_<1>":
          wrist = children[i];
          break;
      }
    }

    // Assign Helper axes in order to see how each 
    // part is oriented during the reparenting process

    // let j1axis = new AxesHelper( .50 );
    // let j2axis = new AxesHelper( .50 );
    // let j3axis = new AxesHelper( .50 );
    // let j4axis = new AxesHelper( .50 );
    // let j5axis = new AxesHelper( .50 );

    // Change hierarchy to achieve animation
    // Using attach in order to maintain world
    // coordinates while reparenting
    console.log(children);
    scene.attach(pltw_gltf);
    pltw_gltf.attach(base);
    base.attach(shoulder);
    shoulder.attach(arm);
    arm.attach(forearm);
    forearm.attach(wrist);

    pltw_gltf.scale.set(200,200,200);
    pltw_gltf.position.set(0,0,0);
    shoulder.rotation.set(0,-Math.PI, 0);
    console.log(pltw_gltf);
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