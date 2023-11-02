import * as THREE from 'three';
import '../src/index.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// scene
const scene = new THREE.Scene();

// sphere
const sphereGeometry = new THREE.SphereGeometry(3, 64, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: '#00ff83' });
const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(mesh);

// Define a raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Apply the CSS class to change the cursor style when the mouse hovers over the sphere
window.addEventListener('mousemove', (event) => {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(mesh);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer'; // Change cursor style
        canvas.classList.add('pointer-cursor'); // Add the CSS class to the canvas
    } else {
        document.body.style.cursor = 'auto'; // Reset cursor style
        canvas.classList.remove('pointer-cursor'); // Remove the CSS class from the canvas
    }
});

// Update the mouse position when moving the cursor
window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
});

// light
const pointLight = new THREE.PointLight(0xffffff, 70, 100, 1.7);
pointLight.position.set(0, 10, 10);
scene.add(pointLight);

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 10;
scene.add(camera);

// renderer
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;

// Resize function
const handleResize = () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera aspect ratio and projection matrix
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(sizes.width, sizes.height);
};

// Resize event listener
window.addEventListener('resize', handleResize);

const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};

handleResize(); // Call handleResize once to initialize the correct aspect ratio.
loop();

// timeline animation
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo('nav', { y: "-100%" }, { y: "0%", duration: 1, ease: "power2.out" })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

// mousemove animation colour
let mouseDown = false;
window.addEventListener('mousedown', () => mouseDown = true);
window.addEventListener('mouseup', () => mouseDown = false);

window.addEventListener('mousemove', (event) => {
    if (mouseDown) {
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        gsap.to(mesh.material.color, { r: color.r, g: color.g, b: color.b });
    }
});
