// 引入我們的模組
import { Renderer } from './src/core/renderer.js';
import { SceneManager } from './src/core/scene-manager.js';
import { PhoneModel } from './src/core/phone-model.js';
import { OrbitControlsWrapper } from './src/controls/orbit-controls.js';
import { TouchControls } from './src/controls/touch-controls.js';
import { KeyboardManager } from './src/controls/keyboard-manager.js';
import { AnimationManager } from './src/animation/animation-manager.js';
import { TweenManager } from './src/animation/tween-manager.js';
import { AutoRotate } from './src/animation/auto-rotate.js';
import { ControlPanel } from './src/ui/control-panel.js';
import { InfoCard } from './src/ui/info-card.js';
import { ModelSelector } from './src/ui/model-selector.js';
import { Loader } from './src/utils/loader.js';
import { PerformanceMonitor } from './src/utils/performance-monitor.js';
import { ResponsiveHelper } from './src/utils/responsive-helper.js';

// 確保可以在模組中訪問全域 TWEEN 物件
const TWEEN = window.TWEEN;

// 用於追蹤載入進度
let loadingManager = new THREE.LoadingManager();
let loadingScreen = document.getElementById('loading-screen');

loadingManager.onProgress = function(item, loaded, total) {
    console.log(`載入中... ${Math.round(loaded / total * 100)}%`);
};

loadingManager.onLoad = function() {
    console.log('載入完成!');
    loadingScreen.style.display = 'none';
};

// 初始化應用程式
const renderer = new Renderer('renderer-container');
const sceneManager = new SceneManager(renderer);
const loader = new Loader(loadingManager);
const phoneModel = new PhoneModel(sceneManager, loader);
const orbitControls = new OrbitControlsWrapper(renderer.camera, renderer.renderer.domElement);
const touchControls = new TouchControls(renderer.renderer.domElement, orbitControls.controls);
const keyboardManager = new KeyboardManager(sceneManager, orbitControls.controls);
const tweenManager = new TweenManager();
const animationManager = new AnimationManager(sceneManager, tweenManager);
const autoRotate = new AutoRotate(orbitControls.controls);
const performanceMonitor = new PerformanceMonitor();
const responsiveHelper = new ResponsiveHelper(renderer, sceneManager);
const controlPanel = new ControlPanel(animationManager, autoRotate);
const infoCard = new InfoCard();
const modelSelector = new ModelSelector(phoneModel);

// 載入初始手機模型
phoneModel.loadModel('assets/models/iphone_16_pro_max.glb');

// 啟動渲染循環
let animationId = null;

function animate() {
    animationId = requestAnimationFrame(animate);
    
    // 更新控制器
    orbitControls.controls.update();
    
    // 更新動畫
    TWEEN.update();
    animationManager.update();
    
    // 渲染場景
    renderer.render(sceneManager.scene);
    
    // 監控效能並根據場景活動狀態調整渲染頻率
    const needsHighFrequencyRendering = performanceMonitor.update();
    
    // 如果場景靜止且沒有執行中的動畫，可以降低渲染頻率
    if (!needsHighFrequencyRendering && !animationManager.hasActiveAnimations() && !autoRotate.isEnabled()) {
        // 取消目前的動畫循環並設定低頻率更新
        cancelAnimationFrame(animationId);
        animationId = setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 100); // 降低到約 10fps
    }
}

// 提供停止動畫的方法
function stopAnimation() {
    if (animationId !== null) {
        if (typeof animationId === 'number') {
            cancelAnimationFrame(animationId);
        } else {
            clearTimeout(animationId);
        }
        animationId = null;
    }
}

// 處理視窗大小變化
window.addEventListener('resize', () => {
    responsiveHelper.onWindowResize();
});

// 開始動畫循環
animate();