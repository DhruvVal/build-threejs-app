import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
import { csvParse } from '/d3-dsv';

class Visualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.dataPoints = [];

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 50;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        new OrbitControls(this.camera, this.renderer.domElement);

        this.loadCSVData('/data/TorontoTest.csv');
    }

    loadCSVData(filename) {
        fetch(filename)
            .then(response => response.text())
            .then(csvText => {
                const data = csvParse(csvText);
                this.processData(data);
                this.createArt();
            })
            .catch(error => console.error('Error loading CSV file: ' + error));
    }

    processData(data) {
        this.dataPoints = data.map(row => ({
            year: parseInt(row.Year, 10),
            dailyRidership: parseFloat(row.DailyRidership),
            trainSpeed: parseFloat(row.TrainSpeed)
        }));
    }

    createArt() {
        const particleMaterial = new THREE.PointsMaterial({ size: 15, vertexColors: true });
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        this.dataPoints.forEach((point, index) => {
            const x = index * 5;
            const y = point.dailyRidership / 1000;
            const z = 0;

            positions.push(x, y, z);

            const color = new THREE.Color().setHSL(point.trainSpeed / 100, 1.0, 0.5);
            colors.push(color.r, color.g, color.b);
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const particles = new THREE.Points(geometry, particleMaterial);
        this.scene.add(particles);

        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }
}

const visualization = new Visualization();

// Exporting functions to allow external access to scene and camera
export function getTorontoScene() {
    return visualization.scene;
}

export function getTorontoCamera() {
    return visualization.camera;
}
