import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05); // Fade into void

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 6);

const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); // Antialias false for performance with bloom
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ReinhardToneMapping;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- PROCEDURAL SUBMARINE ---
const subGroup = new THREE.Group();

// Materials
const wireMat = new THREE.MeshBasicMaterial({
  color: 0x00f3ff,
  wireframe: true,
  transparent: true,
  opacity: 0.8
});
const glassMat = new THREE.MeshBasicMaterial({
  color: 0x00a8ff,
  transparent: true,
  opacity: 0.05,
  side: THREE.DoubleSide,
  depthWrite: false
});

// 1. Main Hull (Cylinder)
const hullGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.5, 16, 4, true);
hullGeo.rotateZ(Math.PI / 2);
const hull = new THREE.Mesh(hullGeo, wireMat);
const hullInner = new THREE.Mesh(hullGeo, glassMat);
subGroup.add(hull, hullInner);

// 2. Nose Cone (Sphere)
const noseGeo = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
noseGeo.rotateZ(-Math.PI / 2);
noseGeo.translate(2.25, 0, 0); // Position at front
const nose = new THREE.Mesh(noseGeo, wireMat);
subGroup.add(nose);

// 3. Tail Cone (Cylinder tapered)
const tailGeo = new THREE.CylinderGeometry(0.8, 0.1, 1.5, 16, 2, true);
tailGeo.rotateZ(Math.PI / 2);
tailGeo.translate(-3, 0, 0);
const tail = new THREE.Mesh(tailGeo, wireMat);
subGroup.add(tail);

// 4. Conning Tower (Sail) - Box
const towerGeo = new THREE.BoxGeometry(1.2, 0.8, 1.8, 4, 2, 4);
towerGeo.translate(0.5, 0.9, 0);
const tower = new THREE.Mesh(towerGeo, wireMat);
const towerInner = new THREE.Mesh(towerGeo, glassMat);
subGroup.add(tower, towerInner);

// 5. Periscopes / Antenna
const scopeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
scopeGeo.translate(0.8, 1.6, 0.2);
const scope = new THREE.Mesh(scopeGeo, wireMat);
subGroup.add(scope);

const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8);
antennaGeo.translate(0.4, 1.8, -0.4);
const antenna = new THREE.Mesh(antennaGeo, wireMat);
subGroup.add(antenna);


// 6. Rear Fins
const finGeo = new THREE.BoxGeometry(1.2, 0.05, 1.2);
const finH = new THREE.Mesh(finGeo, wireMat);
finH.position.set(-3.2, 0, 0);
subGroup.add(finH);

const finV = new THREE.Mesh(finGeo, wireMat);
finV.rotation.x = Math.PI / 2;
finV.position.set(-3.2, 0, 0);
subGroup.add(finV);

// 7. Propeller
const propGroup = new THREE.Group();
const propBladeGeo = new THREE.BoxGeometry(0.1, 1.4, 0.2);
const blade1 = new THREE.Mesh(propBladeGeo, wireMat);
const blade2 = new THREE.Mesh(propBladeGeo, wireMat);
blade2.rotation.x = Math.PI / 2;
propGroup.add(blade1, blade2);
propGroup.position.set(-3.8, 0, 0);
subGroup.add(propGroup);

scene.add(subGroup);

// --- PARTICLES (Digital Dust) ---
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20; // Spread wide
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
  size: 0.03,
  color: 0x00f3ff,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// --- POST PROCESSING (BLOOM) ---
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2, // Strength
  0.5, // Radius
  0.1  // Threshold
);
composer.addPass(bloomPass);

// --- ANIMATION & INTERACTION ---
let mouseX = 0;
let mouseY = 0;

// Smooth interaction targets
let targetRotX = 0;
let targetRotY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX) * 0.001;
  mouseY = (event.clientY - windowHalfY) * 0.001;
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // 1. Submarine Idle Float (Bobbing)
  subGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
  subGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.05;

  // 2. Propeller Spin
  propGroup.rotation.x += 0.15;

  // 3. Mouse Interaction (Lerp for smoothness)
  targetRotY = mouseX * 2; // Look left/right
  targetRotX = mouseY * 1.5; // Look up/down

  subGroup.rotation.y += (targetRotY - subGroup.rotation.y) * 0.05;
  subGroup.rotation.x += (targetRotX - subGroup.rotation.x) * 0.05;

  // 4. Particles visual drift
  particlesMesh.rotation.y = elapsedTime * 0.02;
  particlesMesh.rotation.x = mouseY * 0.2;

  // Render using composer for bloom
  composer.render();
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
