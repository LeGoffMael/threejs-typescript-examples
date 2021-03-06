/* eslint-env browser */

/**
 * Example converted from
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing.html
 */

import {WebGLRenderer, PerspectiveCamera, Scene, Fog, Object3D, SphereBufferGeometry, MeshPhongMaterial, Mesh, AmbientLight, DirectionalLight} from 'three';
import {DotScreenShader} from 'three/examples/js/shaders/DotScreenShader';
import {RGBShiftShader} from 'three/examples/js/shaders/RGBShiftShader';
import {EffectComposer} from 'three/examples/js/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/js/postprocessing/RenderPass';
import {ShaderPass} from 'three/examples/js/postprocessing/ShaderPass';


const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 400;

const scene = new Scene();
scene.fog = new Fog(0x000000, 1, 1000);

const object = new Object3D();
scene.add(object);

const geometry = new SphereBufferGeometry(1, 4, 4);
const material = new MeshPhongMaterial({color: 0xffffff, flatShading: true});
for (let i = 0; i < 100; i++){
	const mesh = new Mesh(geometry, material);
	mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
	mesh.position.multiplyScalar(Math.random() * 400);
	mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
	mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50; // eslint-disable-line no-multi-assign
	object.add(mesh);
}
scene.add(new AmbientLight(0x222222));

const light = new DirectionalLight(0xffffff);
light.position.set(1, 1, 1);
scene.add(light);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const effect1 = new ShaderPass(DotScreenShader);
effect1.uniforms.scale.value = 4;
composer.addPass(effect1);

const effect2 = new ShaderPass(RGBShiftShader);
effect2.uniforms.amount.value = 0.0015;
effect2.renderToScreen = true;
composer.addPass(effect2);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

function animate() {
	requestAnimationFrame(animate);
	object.rotation.x += 0.005;
	object.rotation.y += 0.01;
	composer.render();
}
animate();
