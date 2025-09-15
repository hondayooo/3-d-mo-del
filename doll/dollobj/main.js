import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { OBJLoader } from "OBJLoader";
import { TextureLoader } from "three";

// シーンのセットアップ
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ライティング
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// テクスチャ読み込み
const textureLoader = new TextureLoader();
const texture = textureLoader.load("./stacks_diffuse_no_ao.jpg");

// OBJ読み込み
const loader = new OBJLoader();
loader.load(
  "./doll.obj",
  (obj) => {
    // テクスチャをマテリアルとして手動で貼る
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({ map: texture });
      }
    });

    obj.scale.set(0.01, 0.01, 0.01); // 必要に応じてスケール
    scene.add(obj);
  },
  undefined,
  (error) => {
    console.error("OBJ読み込み失敗:", error);
  }
);

// リサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
