import './style.css'

import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2 ( 0xcccccc, 0.01 );

// FOV, Aspect ratio, view frustrum start & end
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( {
  canvas: document.querySelector( '#bg' ),
} );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//const controls = new OrbitControls(camera, renderer.domElement);

// Lights
const directLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
directLight.position.set( -25,25,-25 );
directLight.castShadow = true;

//Set up shadow properties for the light
directLight.shadow.mapSize.width = 1024; // default
directLight.shadow.mapSize.height = 1024; // default
directLight.shadow.camera.near = 0.5; // default
directLight.shadow.camera.far = 500; // default
directLight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.5, 1000 );

const ambientLight = new THREE.AmbientLight( 0x404040, 0.25 ); // soft white light
scene.add(directLight, ambientLight);

// Skybox
const spaceTexture = new THREE.TextureLoader().load( 'nightsky.jpg' );
scene.background = spaceTexture;

// Add plane
const plane_geometry = new THREE.PlaneGeometry( 150, 150 );
const plane_texture = new THREE.TextureLoader().load( 'snow01.png' );
plane_texture.wrapS = THREE.RepeatWrapping;
plane_texture.wrapT = THREE.RepeatWrapping;
plane_texture.repeat.set( 4, 4 );
const plane_material = new THREE.MeshStandardMaterial( {
  color: 0xffffff,
  map: plane_texture,
  shadowSide: THREE.FrontSide
} );
const plane = new THREE.Mesh( plane_geometry, plane_material );
plane.receiveShadow = true;
plane.rotation.x = -( Math.PI / 2 );
plane.position.set( 0, -1.5, 0 );
scene.add( plane );

// Tree stuff
const trunk_geometry = new THREE.CylinderGeometry( 0.5, 0.4, 1.5 ).translate( 0, -1, 0 );
const trunk_material = new THREE.MeshStandardMaterial( {color: 0x663300} );
const leaves_geometry = mergeBufferGeometries( [
  new THREE.ConeGeometry( 2, 5 ),
  new THREE.ConeGeometry( 1.9, 4 ).translate( 0, 0.2, 0 ),
  new THREE.ConeGeometry( 1.75, 3 ).translate( 0, 0.4, 0 ),
  new THREE.ConeGeometry( 1.2, 2 ).translate( 0, 1.3, 0 )
] );
const leaves_material = new THREE.MeshStandardMaterial( { color: 0x023020 } );

// Stuff for a wireframe tree at the end
const wireframe_trunk = new THREE.MeshBasicMaterial( {color: 0x663300, wireframe: true} );
const wireframe_leaves = new THREE.MeshBasicMaterial( {color: 0x023020, wireframe: true} );

function addTree( x, y, z ) {
  const trunk = new THREE.Mesh( trunk_geometry, trunk_material );
  const leaves = new THREE.Mesh( leaves_geometry, leaves_material );
  leaves.castShadow = true;

  // Randomize the heights a bit to look more natural
  y -= THREE.MathUtils.randFloat( 0, 0.5 );

  trunk.position.set( x, y, z );
  leaves.position.set( x, y + 2, z );

  scene.add( trunk, leaves );
};

function addTreeRandom() {
  const trunk = new THREE.Mesh( trunk_geometry, trunk_material );
  const leaves = new THREE.Mesh( leaves_geometry, leaves_material );

  var x = THREE.MathUtils.randFloat(8, 75);
  var z = THREE.MathUtils.randFloat(0, 75);

  if (THREE.MathUtils.randInt(0, 10) % 2 == 0) {
    x = -x;
  };

  if (THREE.MathUtils.randInt(0, 10) % 2 == 0) {
    z = -z;
  };

  var y = 0;

  // Randomize the heights a bit to look more natural
  y -= THREE.MathUtils.randFloat( 0, 0.5 );

  trunk.position.set( x, y, z );
  leaves.position.set( x, y + 2, z );

  scene.add( trunk, leaves );
};

function addTreeWireFrame( x, y, z ) {
  const trunk = new THREE.Mesh( trunk_geometry, wireframe_trunk );
  const leaves = new THREE.Mesh( leaves_geometry, wireframe_leaves );

  // Randomize the heights a bit to look more natural
  const height = THREE.MathUtils.randFloat( 0, 0.5 );
  y = y - height;

  trunk.position.set( x, y, z );
  leaves.position.set( x, y + 2, z );
  scene.add( trunk, leaves );
};

// Hand placed trees along the camera path
addTree( 0, 0, -10 );
addTree( 5, 0, -8 );
addTree( -5, 0, -9 );
addTree( -3, 0, -12 );
addTree( 3.5, 0, -13 );
addTree( -6, 0, -5 );
addTree( 5.7, 0, -4 );
addTree( 4, 0, 3 );
addTree( -6, 0, 0 );
addTree( 3, 0, -20 );
addTree( -3, 0, -20 );

// Enough of handplaced trees, generate more randomly.
Array(750).fill().forEach(addTreeRandom);

// Wireframe trees to the end
addTreeWireFrame( 5, 0, 10 );
addTreeWireFrame( -6.2, 0, 10 );
addTreeWireFrame( -6.4, 0, 16 );
addTreeWireFrame( -7, 0, 3.8 );
addTreeWireFrame( 6, 0, 15 );

// Campfire logs
const campfire_logs_geometry = mergeBufferGeometries( [
  new THREE.CylinderGeometry( 0.1, 0.1, 0.8 ).rotateZ( -(Math.PI / 3) ),
  new THREE.CylinderGeometry( 0.1, 0.1, 0.8 ).rotateZ( Math.PI / 3 ),
  new THREE.CylinderGeometry( 0.1, 0.1, 0.8 )
] ).rotateX( -( Math.PI / 2 ) );
const campfire_logs = new THREE.Mesh( campfire_logs_geometry, trunk_material );
campfire_logs.position.set ( 0, -1.45, -5 );

// Campfire fire
const campfire_fire_geometry = new THREE.ConeGeometry( 0.2, 0.3 );
const campfire_fire_material = new THREE.MeshStandardMaterial( {color: 0xFFA500} );
const campfire_fire_1 = new THREE.Mesh( campfire_fire_geometry, campfire_fire_material );
const campfire_fire_2 = new THREE.Mesh( campfire_fire_geometry, campfire_fire_material );
const campfire_fire_3 = new THREE.Mesh( campfire_fire_geometry, campfire_fire_material );
campfire_fire_1.position.set( -0.1, -1.2, -5 );
campfire_fire_2.position.set( 0.1, -1.2, -5 );
campfire_fire_3.position.set( 0, -1.2, -4.9 );

// Campfire light
const campfire_light = new THREE.PointLight( 0xFFA500, 1, 15);
campfire_light.position.set( 0, -1, -5 );

// Add the whole campfire
scene.add( campfire_logs, campfire_fire_1, campfire_fire_2, campfire_fire_3, campfire_light );

// Scrolling
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.01;
};

document.body.onscroll = moveCamera;

// Main loop
var light_intensity = 0;
function animate() {
  requestAnimationFrame( animate );

  // Increment light intensity
  light_intensity += 0.05;
  const light_phase = Math.sin(light_intensity);
  campfire_light.intensity = 1.6 + (light_phase / 2);
  campfire_fire_1.scale.set( 1, ( 2 + light_phase ), 1 );
  campfire_fire_2.scale.set( 1, ( 2 - light_phase ), 1 );
  campfire_fire_3.scale.set( 1, ( 2.5 + light_phase ), 1 );

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  //controls.update();
  renderer.render( scene, camera );
};

// Start loop
animate();
