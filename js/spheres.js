import * as THREE from 'three';
import { PointLight } from 'three';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const spheres = [];

const colors = [
    0xff4444, // red
    0xff8044, // orange
    0xffff44, // yellow
    0x44ff44, // green
    0x4444ff, // blue
    0x8044ff  // purple
];

for (let i = 0; i < colors.length; i++) {
    const g = new THREE.SphereGeometry(5, 32, 32);
    const m = new THREE.MeshPhongMaterial({ color: colors[i]});
    spheres.push(new THREE.Mesh(g, m));
}

const light = new PointLight(0xffffff, 1.5);
light.position.set(0, 0, 50);

spheres.forEach(sp => scene.add(sp));
scene.add(light);

const l = spheres.length;
const ang = Math.PI * 2 / l;
const k = 20;


function render(time) {
    time *= 0.001;

    requestAnimationFrame( render );

    for (let i = 0; i < l; i++) {
        const sp = spheres[i];
        const x = Math.cos(ang * i + time) * k;
        const y = Math.sin(ang * i + time) * k;
        sp.position.set(x, y, 30);
    }

    renderer.render(scene, camera);
}

render();

export default render;
