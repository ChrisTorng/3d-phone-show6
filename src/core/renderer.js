/**
 * 3D 渲染器類別，負責處理 Three.js 渲染功能
 */
// 從全域變數獲取 THREE 物件
const THREE = window.THREE;

export class Renderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        // 建立渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            precision: 'highp'
        });
        
        // 獲取容器尺寸，而非使用整個視窗尺寸
        const containerRect = this.container.getBoundingClientRect();
        
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(containerRect.width, containerRect.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // 將渲染器附加到 DOM
        this.container.appendChild(this.renderer.domElement);
        
        // 建立相機
        this.camera = new THREE.PerspectiveCamera(
            45, 
            containerRect.width / containerRect.height, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 10);
        
        // 基本光源設置
        this.setupLights();
        
        // 監聽視窗大小變化
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    /**
     * 處理視窗大小變化
     */
    handleResize() {
        const containerRect = this.container.getBoundingClientRect();
        this.resize(containerRect.width, containerRect.height);
    }
    
    /**
     * 設置場景光源
     */
    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(1, 1, 1);
        this.directionalLight.castShadow = true;
        
        // 設置陰影屬性
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        
        // 不需要回傳這些光源，它們將在 SceneManager 中被添加到場景
    }
    
    /**
     * 渲染場景
     * @param {THREE.Scene} scene - Three.js 場景
     */
    render(scene) {
        this.renderer.render(scene, this.camera);
    }
    
    /**
     * 調整渲染器和相機以適應視窗大小
     * @param {number} width - 容器寬度
     * @param {number} height - 容器高度
     */
    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}