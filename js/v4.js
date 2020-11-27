/**
 * Importing
 */
import { AmbientLight, Scene, WebGLRenderer, PerspectiveCamera, Vector3, Mesh, CylinderGeometry, PointLight, MeshPhongMaterial, TorusGeometry, BoxGeometry } from 'three';
import { OrbitControls } from './OrbitControls';

/**
 * Scene initialization
 */
const scene = new Scene();
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
const cameraPos = [0, 0, 100];
camera.position.set(...cameraPos);
camera.lookAt(new Vector3(0, 0, 50));

const controls = new OrbitControls(camera, renderer.domElement);

/**
 * Lights
 */
const light = new PointLight(0xffffff, 1);
light.position.set(25, 25, 100);
scene.add(light);
scene.add(new AmbientLight(0xffffff, 0.7));

/**
 * v4 implementation
 */
// const cylinders = []; // array of cylinder objects
const cylindersCount = 4;
const pistonSize = 2;

const crankshaft = []; // array with crankshaft elements
const crankshaftBase = [];
const crankshaftBoxes = [];

const TIME_MULTIPLIER = 0.003;

function crankshaftInit() {
    const flywheel = new Mesh(
        new CylinderGeometry(8, 8, 1, 32, 1),
        new MeshPhongMaterial({color: 0x777777})
    );
    flywheel.position.set(0,0,0);
    flywheel.rotateX(Math.PI/2);

    const torus = new Mesh(
        new TorusGeometry(7.5, 0.8, 16, 32),
        new MeshPhongMaterial( { color: 0x777777 } )
    );
    torus.position.set(0,0,0);

    scene.add(flywheel);
    scene.add(torus);
    
    // base stick of crankshaft
    for (let i = 0; i < cylindersCount + 1; i++) {
        const part = new Mesh(
            new CylinderGeometry(1, 1, 1, 8, 1),
            new MeshPhongMaterial({color: 0x777777})
        );
        part.position.set(0, 0, i * 4 + 1);
        part.rotateX(Math.PI/2);

        scene.add(part);
        crankshaftBase.push(part);
    }
    
    // piston holders ???????
    for (let i = 0; i < cylindersCount; i++) {
        const x = Math.PI * (0.5 + i);
        const pos = Math.sin(x) * pistonSize;
        const part = new Mesh(
            new CylinderGeometry(1, 1, 1, 8, 1),
            new MeshPhongMaterial({color: 0x777777})
        );
        part.position.set(pos, 0, i * 4 + 3);
        part.rotateX(Math.PI/2);

        scene.add(part);
        crankshaft.push(part);
    }
    
    // boxes between piston holders ????? and base stick
    for (let i = 0; i < cylindersCount * 2; i++) {
        const x = Math.PI * (0.5 + i);
        const pos = Math.sin(x) * pistonSize;
        const part = new Mesh(
            new BoxGeometry(1.5, 1, pistonSize * 2),
            new MeshPhongMaterial({color: 0x777777})
        );
        part.position.set(pos, 0, i * 2 + 2);
        part.rotateX(Math.PI/2);

        scene.add(part);
        crankshaftBoxes.push(part);
    }
}

function pistonsInit() {

}

function crankshaftUpdate(time) {
    crankshaft.forEach((crank, i) => {
        const value = Math.PI * (0.5 + i) + time;
        const x = Math.sin(value) * pistonSize;
        const y = Math.cos(value) * pistonSize;
        crank.position.set(x, y, i * 4 + 3);
    });
    crankshaftBase.forEach((crank, i) => {
        const value = Math.PI * (0.5 + i) + time;
        crank.rotation.y = -value;
    });

    crankshaftBoxes.forEach((box, i) => {
        const value = Math.PI * (i + !(i % 2)) / 2 + time;
        const x = Math.sin(value) * pistonSize / 2;
        const y = Math.cos(value) * pistonSize / 2;
        box.position.set(x, y, i * 2 + 2);
        box.rotation.y = -value;
        // console.log(value);
    });
}

function pistonsUpdate() {
    
}

function init() {
    crankshaftInit();
    pistonsInit();
}

init();

/**
 * Rendering function
 */
export function render(time) {
    time *= TIME_MULTIPLIER;
    requestAnimationFrame( render );

    crankshaftUpdate(time);
    pistonsUpdate(time);

    controls.update();

    renderer.render(scene, camera);
}
