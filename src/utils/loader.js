// 從全域變數獲取 THREE 物件，而不是通過模組導入
const THREE = window.THREE;

/**
 * 資源載入器類別，負責處理 3D 模型和紋理的載入
 */
export class Loader {
    /**
     * 建立資源載入器
     * @param {THREE.LoadingManager} manager - Three.js 載入管理器
     */
    constructor(manager) {
        this.manager = manager || new THREE.LoadingManager();
    }

    /**
     * 載入 GLTF/GLB 模型
     * @param {string} url - 模型檔案 URL
     * @returns {Promise} - 包含載入模型的 Promise
     */
    loadGLTFModel(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader(this.manager);
            loader.load(url, (gltf) => {
                resolve(gltf);
            }, (progress) => {
                console.log(`模型載入進度: ${Math.round((progress.loaded / progress.total) * 100)}%`);
            }, (error) => {
                console.error('載入模型時發生錯誤:', error);
                reject(error);
            });
        });
    }

    /**
     * 載入紋理
     * @param {string} url - 紋理檔案 URL
     * @returns {Promise} - 包含載入紋理的 Promise
     */
    loadTexture(url) {
        return new Promise((resolve, reject) => {
            const textureLoader = new THREE.TextureLoader(this.manager);
            textureLoader.load(url, (texture) => {
                // 設定紋理參數
                texture.encoding = THREE.sRGBEncoding;
                texture.flipY = false; // 通常 GLTF 模型需要這個設定
                resolve(texture);
            }, (progress) => {
                console.log(`紋理載入進度: ${Math.round((progress.loaded / progress.total) * 100)}%`);
            }, (error) => {
                console.error('載入紋理時發生錯誤:', error);
                reject(error);
            });
        });
    }

    /**
     * 載入環境貼圖
     * @param {string} url - 環境貼圖 URL
     * @returns {Promise} - 包含載入環境貼圖的 Promise
     */
    loadEnvironmentMap(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.CubeTextureLoader(this.manager);
            loader.load([
                `${url}/px.jpg`, `${url}/nx.jpg`,
                `${url}/py.jpg`, `${url}/ny.jpg`,
                `${url}/pz.jpg`, `${url}/nz.jpg`
            ], (cubeTexture) => {
                resolve(cubeTexture);
            }, undefined, (error) => {
                console.error('載入環境貼圖時發生錯誤:', error);
                reject(error);
            });
        });
    }

    /**
     * 批次載入多個資源
     * @param {Array} resources - 要載入的資源陣列，每個項目包含 type 和 url
     * @returns {Promise} - 包含所有載入資源的 Promise
     */
    loadResources(resources) {
        const promises = resources.map(resource => {
            switch (resource.type) {
                case 'model':
                    return this.loadGLTFModel(resource.url).then(model => ({ id: resource.id, model }));
                case 'texture':
                    return this.loadTexture(resource.url).then(texture => ({ id: resource.id, texture }));
                case 'envMap':
                    return this.loadEnvironmentMap(resource.url).then(envMap => ({ id: resource.id, envMap }));
                default:
                    console.warn(`不支援的資源類型: ${resource.type}`);
                    return Promise.resolve(null);
            }
        });

        return Promise.all(promises);
    }
}