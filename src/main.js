import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Variáveis globais
let scene, camera, renderer, controls;
let sphere, cube, cylinder;

// Inicializar a cena
function init() {
  // Criando a cena
  scene = new THREE.Scene();

  // Definindo o fundo azul para o céu
  scene.background = new THREE.Color(0x87CEEB); // Cor azul clara (Sky Blue)

  // Configuração da câmera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 20); // Ajustado para ver todos os objetos de forma clara

  // Renderizador com suavização
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controles de órbita para movimentar a câmera
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  // Criando objetos 3D com distâncias ajustadas
  sphere = createTexturedObject(new THREE.SphereGeometry(2, 32, 32), '/textures/Rock056_Color.jpg', '/textures/Rock056_NormalGL.jpg', '/textures/Rock056_Roughness.jpg', -10, 0, 0);
  cube = createColoredObject(new THREE.BoxGeometry(3, 3, 3), 0x00ff00, 0, 0, 0); // Cubo verde
  cylinder = createColoredObject(new THREE.CylinderGeometry(2, 2, 4, 32), 0xff0000, 10, 0, 0); // Cilindro vermelho

  // Adicionando iluminação
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Luz ambiente suave
  scene.add(ambientLight);

  // Luz direcional (fonte de luz)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Luz direcional
  directionalLight.position.set(10, 10, 10).normalize();
  scene.add(directionalLight);

  // Luz pontual
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(-10, 10, -10);
  scene.add(pointLight);

  // Responsividade
  window.addEventListener("resize", onWindowResize);

  // Iniciar animação
  animate();
}

// Função para criar o objeto com textura (apenas para a esfera)
function createTexturedObject(geometry, colorTexture, normalMap, roughnessMap, x, y, z) {
  const textureLoader = new THREE.TextureLoader();

  // Carregar as texturas
  const color = textureLoader.load(colorTexture);
  const normal = textureLoader.load(normalMap);
  const roughness = textureLoader.load(roughnessMap);

  // Criar o material com as texturas
  const material = new THREE.MeshStandardMaterial({
    map: color,
    normalMap: normal,
    roughnessMap: roughness,
    roughness: 0.5, // Ajuste de rugosidade
    metalness: 0.2 // Ajuste para deixar o material não metálico
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

// Função para criar o objeto colorido (cubo e cilindro)
function createColoredObject(geometry, color, x, y, z) {
  const material = new THREE.MeshStandardMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

// Função de escalonamento
function scaleObject(object, factor) {
  object.scale.set(factor, factor, factor);
}

// Função de rotação
function rotateObject(object, angle) {
  object.rotation.set(THREE.MathUtils.degToRad(angle), THREE.MathUtils.degToRad(angle), 0);
}

// Função para lidar com mudanças de tamanho da janela
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Atualizar os controles de órbita
  renderer.render(scene, camera); // Renderizar a cena
}

// Função para atualizar a cena com os valores dos sliders
function updateTransforms() {
  // Esfera
  const sphereScaleValue = document.getElementById("sphereScale").value;
  const sphereRotationValue = document.getElementById("sphereRotation").value;
  scaleObject(sphere, sphereScaleValue);
  rotateObject(sphere, sphereRotationValue);

  // Cubo
  const cubeScaleValue = document.getElementById("cubeScale").value;
  const cubeRotationValue = document.getElementById("cubeRotation").value;
  scaleObject(cube, cubeScaleValue);
  rotateObject(cube, cubeRotationValue);

  // Cilindro
  const cylinderScaleValue = document.getElementById("cylinderScale").value;
  const cylinderRotationValue = document.getElementById("cylinderRotation").value;
  scaleObject(cylinder, cylinderScaleValue);
  rotateObject(cylinder, cylinderRotationValue);
}

// Configuração de eventos dos sliders
document.getElementById("sphereScale").addEventListener("input", updateTransforms);
document.getElementById("sphereRotation").addEventListener("input", updateTransforms);
document.getElementById("cubeScale").addEventListener("input", updateTransforms);
document.getElementById("cubeRotation").addEventListener("input", updateTransforms);
document.getElementById("cylinderScale").addEventListener("input", updateTransforms);
document.getElementById("cylinderRotation").addEventListener("input", updateTransforms);

// Inicializar a cena
init();
