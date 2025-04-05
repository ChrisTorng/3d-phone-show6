/**
 * 手機模型類別，負責載入和管理 3D 手機模型
 */
// 從全域變數獲取 THREE 物件
const THREE = window.THREE;

export class PhoneModel {
    /**
     * 建立手機模型管理器
     * @param {SceneManager} sceneManager - 場景管理器實例
     * @param {Loader} loader - 資源載入器實例
     */
    constructor(sceneManager, loader) {
        this.sceneManager = sceneManager;
        this.loader = loader;
        this.currentModel = null;
        this.parts = {};
        this.highlightedPart = null;
        this.highlightMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x44aa44,
            emissiveIntensity: 0.3
        });
        this.originalMaterials = new Map();
    }

    /**
     * 載入手機模型
     * @param {string} modelPath - 模型檔案路徑
     * @param {Function} onLoad - 模型載入完成後的回呼函式
     */
    loadModel(modelPath, onLoad) {
        // 若存在舊模型，先清除
        if (this.currentModel) {
            this.clearModel();
        }

        // 使用全域 THREE.GLTFLoader 載入模型
        const GLTFLoader = window.THREE.GLTFLoader || THREE.GLTFLoader;
        const gltfLoader = new GLTFLoader(this.loader.manager);
        
        gltfLoader.load(modelPath, (gltf) => {
            this.currentModel = gltf.scene;
            
            // 設定模型初始位置和縮放
            this.currentModel.position.set(0, 0, 0);
            this.currentModel.scale.set(1, 1, 1);
            
            // 為陰影設置
            this.currentModel.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // 儲存模型部件的參考
                    if (node.name) {
                        this.parts[node.name] = node;
                    }
                }
            });
            
            // 將模型加入場景
            this.sceneManager.addObject(this.currentModel);
            
            // 若有提供回呼函式，呼叫它
            if (onLoad && typeof onLoad === 'function') {
                onLoad(this.currentModel);
            }
            
        }, 
        // 處理載入進度
        (xhr) => {
            const progress = (xhr.loaded / xhr.total) * 100;
            console.log(`模型載入進度: ${Math.round(progress)}%`);
        },
        // 處理載入錯誤
        (error) => {
            console.error('載入模型時發生錯誤:', error);
        });
    }

    /**
     * 清除目前的模型
     */
    clearModel() {
        if (this.currentModel) {
            this.sceneManager.removeObject(this.currentModel);
            this.currentModel = null;
            this.parts = {};
            this.highlightedPart = null;
            this.originalMaterials.clear();
        }
    }

    /**
     * 取得模型的部件名稱列表
     * @returns {string[]} - 部件名稱陣列
     */
    getPartNames() {
        return Object.keys(this.parts);
    }

    /**
     * 高亮顯示特定部件
     * @param {string} partName - 要高亮顯示的部件名稱
     */
    highlightPart(partName) {
        // 恢復先前高亮的部件
        this.resetHighlight();
        
        const part = this.parts[partName];
        if (part && part.isMesh) {
            // 儲存原始材質
            this.highlightedPart = part;
            this.originalMaterials.set(part, part.material);
            
            // 套用高亮材質
            part.material = this.highlightMaterial;
        }
    }

    /**
     * 重設高亮顯示
     */
    resetHighlight() {
        if (this.highlightedPart) {
            // 恢復原始材質
            const originalMaterial = this.originalMaterials.get(this.highlightedPart);
            if (originalMaterial) {
                this.highlightedPart.material = originalMaterial;
            }
            this.highlightedPart = null;
        }
    }

    /**
     * 設置模型的位置
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} z - Z 座標
     */
    setPosition(x, y, z) {
        if (this.currentModel) {
            this.currentModel.position.set(x, y, z);
        }
    }

    /**
     * 旋轉模型
     * @param {number} x - X 軸旋轉角度
     * @param {number} y - Y 軸旋轉角度
     * @param {number} z - Z 軸旋轉角度
     */
    rotate(x, y, z) {
        if (this.currentModel) {
            this.currentModel.rotation.set(x, y, z);
        }
    }

    /**
     * 縮放模型
     * @param {number} scalar - 縮放比例
     */
    scale(scalar) {
        if (this.currentModel) {
            this.currentModel.scale.set(scalar, scalar, scalar);
        }
    }
}