import './style.css';
import * as THREE from 'three';

// --- CONFIGURATION ---
const N8N_WEBHOOK_URL = 'https://YOUR-N8N-INSTANCE.railway.app/webhook/fly-submarine-signup'; 

// --- 3D SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
const directionalLight = new THREE.DirectionalLight(0x00ff41, 2);
directionalLight.position.set(2, 5, 5);
scene.add(ambientLight);
scene.add(directionalLight);

const geometry = new THREE.IcosahedronGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({ 
  color: 0x00ff41, wireframe: true, transparent: true, opacity: 0.3
});
const artifact = new THREE.Mesh(geometry, material);
scene.add(artifact);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  artifact.rotation.x += 0.003;
  artifact.rotation.y += 0.003;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- FORM SUBMISSION ---
const form = document.getElementById('vault-form');
const statusMsg = document.getElementById('status-message');
const emailInput = document.getElementById('email');
const btn = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalBtnText = btn.innerText;
  btn.innerText = "TRANSMITTING...";
  btn.disabled = true;
  statusMsg.innerText = "";

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: emailInput.value,
        source: 'flysubmarine_vault',
        timestamp: new Date().toISOString()
      }),
    });

    if (response.ok) {
      statusMsg.innerText = "ACCESS GRANTED. CHECK YOUR COMMS.";
      statusMsg.className = "success";
      form.reset();
    } else {
      throw new Error('Signal jammed');
    }
  } catch (error) {
    console.error('Transmission error:', error);
    statusMsg.innerText = "CONNECTION FAILED. RETRY.";
    statusMsg.className = "error";
  } finally {
    btn.innerText = originalBtnText;
    btn.disabled = false;
  }
});
