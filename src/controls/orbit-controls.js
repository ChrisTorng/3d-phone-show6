// orbit-controls.js

// 從全域變數獲取 THREE 物件
const THREE = window.THREE;

/**
 * 軌道控制器包裝類別，提供相機控制功能
 */
export class OrbitControlsWrapper {
    /**
     * 建立軌道控制器
     * @param {THREE.Camera} camera - Three.js 相機
     * @param {HTMLElement} domElement - DOM 元素，用於接收滑鼠事件
     */
    constructor(camera, domElement) {
        // 建立 Three.js 的 OrbitControls 實例
        this.controls = new THREE.OrbitControls(camera, domElement);
        this.initControls();
    }

    /**
     * 初始化控制器設定
     */
    initControls() {
        // 啟用阻尼效果，使相機移動更平滑
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        
        // 設定縮放限制
        this.controls.minDistance = 2;
        this.controls.maxDistance = 20;
        
        // 設定旋轉限制
        this.controls.maxPolarAngle = Math.PI / 1.5;
        
        // 啟用平移
        this.controls.enablePan = true;
        this.controls.screenSpacePanning = true;
        
        // 設置自動旋轉（預設關閉）
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 1.0;
    }

    /**
     * 更新控制器狀態，每幀呼叫
     */
    update() {
        this.controls.update();
    }

    /**
     * 重設控制器到預設狀態
     */
    reset() {
        this.controls.reset();
    }

    /**
     * 啟用/禁用自動旋轉
     * @param {boolean} enabled - 是否啟用自動旋轉
     */
    setAutoRotate(enabled) {
        this.controls.autoRotate = enabled;
    }

    /**
     * 設定自動旋轉速度
     * @param {number} speed - 旋轉速度
     */
    setAutoRotateSpeed(speed) {
        this.controls.autoRotateSpeed = speed;
    }

    /**
     * 啟用/禁用縮放功能
     * @param {boolean} enabled - 是否啟用縮放
     */
    setZoomEnabled(enabled) {
        this.controls.enableZoom = enabled;
    }

    /**
     * 啟用/禁用旋轉功能
     * @param {boolean} enabled - 是否啟用旋轉
     */
    setRotateEnabled(enabled) {
        this.controls.enableRotate = enabled;
    }

    /**
     * 啟用/禁用平移功能
     * @param {boolean} enabled - 是否啟用平移
     */
    setPanEnabled(enabled) {
        this.controls.enablePan = enabled;
    }
}