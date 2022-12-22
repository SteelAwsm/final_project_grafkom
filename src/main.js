import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/loaders/GLTFLoader.js';
import {controls} from './controls.js';
import {game} from './game.js';
import {sky} from './sky.js';
import {terrain} from './terrain.js';
import {textures} from './textures.js';


let _APP = null;





class ProceduralTerrain_Demo extends game.Game {
  constructor() {
    super();
  }

  _OnInitialize() {
    this._CreateGUI();

    this._userCamera = new THREE.Object3D();
    this._userCamera.position.set(4100, 0, 0);
    this._graphics.Camera.position.set(3853, -609, -1509);
    this._graphics.Camera.quaternion.set(0.403, 0.59, -0.549, 0.432);

    this._graphics.Camera.position.set(1412, -1674, -3848);
    this._graphics.Camera.quaternion.set(0.1004, 0.7757, -0.6097, 0.1278);

    this._entities['_terrain'] = new terrain.TerrainChunkManager({
      camera: this._graphics.Camera,
      scene: this._graphics.Scene,
      gui: this._gui,
      guiParams: this._guiParams,
      game: this
    });

    this._entities['_controls'] = new controls.FPSControls({
      camera: this._graphics.Camera,
      scene: this._graphics.Scene,
      domElement: this._graphics._threejs.domElement,
      gui: this._gui,
      guiParams: this._guiParams,
    });

    // this._entities['_controls'] = new controls.OrbitControls({
    //   camera: this._graphics.Camera,
    //   scene: this._graphics.Scene,
    //   domElement: this._graphics._threejs.domElement,
    //   gui: this._gui,
    //   guiParams: this._guiParams,
    // });
    // bulan 1
    this._focusMeshtexture = new THREE.TextureLoader().load("resources/2k_ceres_fictional.jpg");
    this._focusMesh = new THREE.Mesh(
      new THREE.SphereGeometry(200, 32, 32),
      new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          map: this._focusMeshtexture,
      }));
    // bulan 2
    this._focusMesh.castShadow = true;
    this._focusMesh.receiveShadow = true;
    this._graphics.Scene.add(this._focusMesh);
    
    this._moonMeshtexture = new THREE.TextureLoader().load("resources/2k_makemake_fictional.jpg");
    this._moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(400, 32, 32),
      new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          map: this._moonMeshtexture,
      }));
    
    this._moonMesh.castShadow = true;
    this._moonMesh.receiveShadow = true;
    this._graphics.Scene.add(this._moonMesh);


    //ring planet
    this._ringGeo = new THREE.RingGeometry (6500, 11500, 64);
    this._ringTexture = new THREE.TextureLoader().load("resources/ring4.png");
	  this._ringMaterial = new THREE.MeshBasicMaterial({
		map: this._ringTexture,
		side: THREE.DoubleSide,
		transparent: true
	  });
    this._ring = new THREE.Mesh(this._ringGeo,this._ringMaterial);
	  this._ring.rotation.x = Math.PI/2;
	  this._ring.castShadow = true;
	  this._ring.receiveShadow = true;
    this._graphics.Scene.add(this._ring);


    this._loader = new GLTFLoader();
    this._loader.crossOrigin = "anonymous";
    this._loader.load('3dmodel/cargoship.gltf', function ( gltf ) 
    {
      console.log(result);
    });

    this._totalTime = 0;

    this._LoadBackground();
  }

  

  _CreateGUI() {
    this._guiParams = {
      general: {
      },
    };
    this._gui = new GUI();

    const generalRollup = this._gui.addFolder('General');
    this._gui.close();
  }

  _LoadBackground() {
    this._graphics.Scene.background = new THREE.Color(0x000000);
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/space-posx1.jpg',
        './resources/space-negx1.jpg',
        './resources/space-posy1.jpg',
        './resources/space-negy1.jpg',
        './resources/space-posz1.jpg',
        './resources/space-negz1.jpg',
    ]);
    this._graphics._scene.background = texture;
  }

  //pergerakan & rotasi dari objek
  _OnStep(timeInSeconds) {
    let index = 0;
    let indexfocusmesh = 0;
    let indexmoonmesh = 0;
    this._totalTime += timeInSeconds;
    const x = Math.cos(this._totalTime * 0.050) * 12300;
    const y = Math.sin(this._totalTime * 0.050) * 12300;
    const z = Math.sin(this._totalTime * 0.050) * 9000;

    const x1 = Math.cos(this._totalTime * 0.050) * 20500;
    const y1 = Math.sin(this._totalTime * 0.050) * 20500;
    const z1 = Math.sin(this._totalTime * 0.050) * 18000;
    
    this._userCamera.position.set(x, z, y);
    this._moonMesh.position.set(x1, y1, z1);
    index += 0.05;
    indexfocusmesh -= 0.1;
    indexmoonmesh -= 0.1;
    this._focusMesh.position.copy(this._userCamera.position);
    this._ring.rotation.z += index*0.05
    this._focusMesh.rotation.y += indexfocusmesh*0.05
    this._moonMesh.rotation.y += indexmoonmesh*0.05
  }
}


function _Main() {
  _APP = new ProceduralTerrain_Demo();
}

_Main();