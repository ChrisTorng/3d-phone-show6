// model-selector.js

/**
 * 模型選擇器類別，用於在不同手機模型之間切換
 */
export class ModelSelector {
    /**
     * 建立模型選擇器
     * @param {PhoneModel} phoneModel - 手機模型管理器實例
     */
    constructor(phoneModel) {
        this.phoneModel = phoneModel;
        this.container = document.createElement('div');
        this.container.className = 'model-selector';
        
        // 模型資料，實際應用中可從外部配置或 API 載入
        this.models = [
            {
                id: 'model1',
                name: '手機型號 1',
                path: 'assets/models/iphone_16_pro_max.glb',
                image: 'assets/textures/phone-texture-1.webp',
                info: {
                    screenSize: '6.1 吋',
                    processor: '驍龍 8 Gen 2',
                    ram: '8GB',
                    camera: '5000萬像素'
                }
            },
            {
                id: 'model2',
                name: '手機型號 2',
                path: 'assets/models/samsung_galaxy_s22_ultra.glb',
                image: 'assets/textures/phone-texture-2.png',
                info: {
                    screenSize: '6.7 吋',
                    processor: 'A17 Pro',
                    ram: '12GB',
                    camera: '4800萬像素'
                }
            }
        ];
        
        // 初始化選擇器
        this.initSelector();
        this.appendToDOM();
    }
    
    /**
     * 初始化選擇器 UI
     */
    initSelector() {
        // 建立標題
        const title = document.createElement('h3');
        title.textContent = '選擇模型';
        title.className = 'selector-title';
        this.container.appendChild(title);
        
        // 建立模型列表
        const modelList = document.createElement('div');
        modelList.className = 'model-list';
        
        // 為每個模型建立選擇按鈕
        this.models.forEach(model => {
            const modelItem = document.createElement('div');
            modelItem.className = 'model-item';
            modelItem.dataset.modelId = model.id;
            
            const modelImage = document.createElement('div');
            modelImage.className = 'model-thumbnail';
            modelImage.style.backgroundImage = `url(${model.image})`;
            
            const modelName = document.createElement('div');
            modelName.className = 'model-name';
            modelName.textContent = model.name;
            
            modelItem.appendChild(modelImage);
            modelItem.appendChild(modelName);
            
            // 添加點擊事件，切換模型
            modelItem.addEventListener('click', () => {
                this.selectModel(model);
                
                // 更新 UI 顯示當前選擇的模型
                document.querySelectorAll('.model-item').forEach(item => {
                    item.classList.remove('selected');
                });
                modelItem.classList.add('selected');
            });
            
            modelList.appendChild(modelItem);
        });
        
        this.container.appendChild(modelList);
    }
    
    /**
     * 將選擇器添加到頁面
     */
    appendToDOM() {
        // 默認添加到控制面板下方
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel) {
            controlPanel.parentNode.insertBefore(this.container, controlPanel.nextSibling);
        } else {
            document.getElementById('app').appendChild(this.container);
        }
    }
    
    /**
     * 選擇指定的模型
     * @param {Object} model - 要載入的模型資訊
     */
    selectModel(model) {
        console.log(`選擇模型: ${model.name}`);
        
        // 載入模型
        this.phoneModel.loadModel(model.path, (loadedModel) => {
            console.log(`模型載入完成: ${model.name}`);
            
            // 發出模型變更事件，讓其他組件可以響應
            const modelChangedEvent = new CustomEvent('model-changed', { detail: model });
            window.dispatchEvent(modelChangedEvent);
            
            // 更新控制面板中的資訊
            const modelNameElement = document.getElementById('model-name');
            const screenSizeElement = document.getElementById('screen-size');
            const processorElement = document.getElementById('processor');
            const ramElement = document.getElementById('ram');
            
            if (modelNameElement) modelNameElement.textContent = model.name;
            if (screenSizeElement) screenSizeElement.textContent = model.info.screenSize;
            if (processorElement) processorElement.textContent = model.info.processor;
            if (ramElement) ramElement.textContent = model.info.ram;
        });
    }
    
    /**
     * 通過 ID 獲取模型資訊
     * @param {string} modelId - 模型 ID
     * @returns {Object|null} - 模型資訊物件
     */
    getModelById(modelId) {
        return this.models.find(model => model.id === modelId) || null;
    }
}