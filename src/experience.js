import * as THREE from 'three';
import * as dat from 'dat.gui';

// src
import Camera from './camera.js';
import Renderer from './renderer.js';

// utils
import Sizes from './utils/sizes.js';
import Time from './utils/time.js';
import Resources from './utils/resources.js';
import Debugger from './utils/debugger.js';

// config
import assets from './config/assets.js';

// world
import World from './scenes/world.js';

export default class Experience {
  static instance;

  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }

    Experience.instance = this;
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.sizes = new Sizes();
    this.time = new Time();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(assets);
    this.gui = new dat.GUI();
    this.debugger = new Debugger();

    this.world = new World();

    this.sizes.on('resize', () => {
      this.resize();
    });
    this.time.on('update', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }
}
