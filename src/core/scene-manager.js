// scene-manager.js

// 從全域變數獲取 THREE 物件，而不是通過模組導入
const THREE = window.THREE;

/**
 * 場景管理器類別，負責管理 Three.js 場景和物件
 */
export class SceneManager {
    /**
     * 建立場景管理器
     * @param {Renderer} renderer - 渲染器實例
     */
    constructor(renderer) {
        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // 將光源添加到場景
        this.addLights(renderer);
        
        // 儲存場景中的物件
        this.objects = [];
    }
    
    /**
     * 將渲染器中的光源添加到場景
     * @param {Renderer} renderer - 含有光源的渲染器
     */
    addLights(renderer) {
        // 添加環境光
        this.scene.add(renderer.ambientLight);
        
        // 添加方向光
        this.scene.add(renderer.directionalLight);
    }
    
    /**
     * 添加物件到場景
     * @param {THREE.Object3D} object - 要添加的 3D 物件
     */
    addObject(object) {
        this.scene.add(object);
        this.objects.push(object);
        return object;
    }

    /**
     * 從場景中移除物件
     * @param {THREE.Object3D} object - 要移除的 3D 物件
     */
    removeObject(object) {
        this.scene.remove(object);
        this.objects = this.objects.filter(obj => obj !== object);
    }

    /**
     * 清除場景中除光源外的所有物件
     */
    clearScene() {
        // 保留原始陣列以便後續清理
        const objectsToRemove = [...this.objects];
        
        // 從場景中移除每個物件
        objectsToRemove.forEach(object => {
            this.removeObject(object);
        });
        
        // 確保陣列現在為空
        this.objects = [];
    }
    
    /**
     * 設置背景顏色
     * @param {string|number} color - 十六進位顏色值
     */
    setBackgroundColor(color) {
        this.scene.background = new THREE.Color(color);
    }
    
    /**
     * 取得目前場景中的物件
     * @returns {Array} - 目前場景中的物件陣列
     */
    getObjects() {
        return this.objects;
    }
}