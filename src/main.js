import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.5, 7);

const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ReinhardToneMapping;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// --- 1. SEMDY LOGO (Background/Header) ---
const logoGroup = new THREE.Group();
const logoTexture = textureLoader.load('/semdy_logo.png');
const logoMat = new THREE.MeshBasicMaterial({
  map: logoTexture,
  transparent: true,
  opacity: 0.9,
  depthWrite: false
});
const logoGeo = new THREE.PlaneGeometry(3.5, 1.2);
const logoMesh = new THREE.Mesh(logoGeo, logoMat);
logoMesh.position.set(0, 2.5, -2); // Position high up
logoGroup.add(logoMesh);
scene.add(logoGroup); // Add separately so it doesn't bob with the sub

// --- 2. WIREFRAME SUBMARINE (Sprite) ---
const subGroup = new THREE.Group();
const subTexture = textureLoader.load('/submarine_sprite.png');
subTexture.minFilter = THREE.LinearFilter;
subTexture.magFilter = THREE.LinearFilter;

const subMat = new THREE.MeshBasicMaterial({
  map: subTexture,
  transparent: true,
  opacity: 1.0,
  side: THREE.DoubleSide
});

// Create 2 planes to give it volume/pseudo-3D feel
const subGeo = new THREE.PlaneGeometry(6, 4); // Adjusted scale
const subMesh = new THREE.Mesh(subGeo, subMat);
subGroup.add(subMesh);

// Add a faint glow copy slightly behind
const glowMesh = new THREE.Mesh(subGeo, new THREE.MeshBasicMaterial({
  map: subTexture,
  transparent: true,
  opacity: 0.3,
  color: 0x00ffff,
  blending: THREE.AdditiveBlending
}));
glowMesh.position.z = -0.1;
glowMesh.scale.multiplyScalar(1.05);
subGroup.add(glowMesh);

subGroup.position.set(0, -0.5, 0);
scene.add(subGroup);

// --- 3. PARTICLES ---
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 18;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
  size: 0.03,
  color: 0x00f3ff,
  transparent: true,
  opacity: 0.6,
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
  1.5, // intensity
  0.5, // radius
  0.1  // threshold
);
composer.addPass(bloomPass);

// --- ANIMATION ---
const clock = new THREE.Clock();
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // Bobbing
  subGroup.position.y = -0.5 + Math.sin(time * 0.8) * 0.15;

  // Mouse Parallax / Tilt
  const targetY = mouseX * 0.3;
  const targetX = -mouseY * 0.2;

  subGroup.rotation.y += (targetY - subGroup.rotation.y) * 0.05;
  subGroup.rotation.x += (targetX - subGroup.rotation.x) * 0.05;

  // Sprite always faces slightly towards camera but tilts
  // No full rotation since it is a 2D sprite

  // Particles Drift
  particlesMesh.rotation.y = time * 0.04;

  composer.render();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
