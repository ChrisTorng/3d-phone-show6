import { Renderer } from './src/core/renderer.js';
import { SceneManager } from './src/core/scene-manager.js';
import { PhoneModel } from './src/core/phone-model.js';
import { OrbitControls } from './src/controls/orbit-controls.js';
import { TouchControls } from './src/controls/touch-controls.js';
import { KeyboardManager } from './src/controls/keyboard-manager.js';
import { AnimationManager } from './src/animation/animation-manager.js';
import { PerformanceMonitor } from './src/utils/performance-monitor.js';
import { ResponsiveHelper } from './src/utils/responsive-helper.js';

// Initialize the application
const renderer = new Renderer();
const sceneManager = new SceneManager(renderer);
const phoneModel = new PhoneModel(sceneManager);
const orbitControls = new OrbitControls(renderer.camera, renderer.canvas);
const touchControls = new TouchControls(renderer.canvas);
const keyboardManager = new KeyboardManager(sceneManager);
const animationManager = new AnimationManager(sceneManager);
const performanceMonitor = new PerformanceMonitor();
const responsiveHelper = new ResponsiveHelper();

// Load the initial phone model
phoneModel.loadModel('assets/models/phone-model-1.glb');

// Start the rendering loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(sceneManager.scene, renderer.camera);
    performanceMonitor.update();
}

animate();