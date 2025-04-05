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
        this.container = document.getElementById('model-selector');
        
        // 模型資料，實際應用中可從外部配置或 API 載入
        this.models = [
            {
                id: 'model1',
                name: 'iPhone 16 Pro Max',
                path: 'assets/models/iphone_16_pro_max.glb',
                image: 'assets/textures/phone-texture-1.webp',
                info: {
                    screenSize: '6.1 吋',
                    processor: 'A17 Pro',
                    ram: '8GB',
                    camera: '5000萬像素',
                    storage: '256GB',
                    battery: '4,500mAh'
                }
            },
            {
                id: 'model2',
                name: 'Samsung Galaxy S22 Ultra',
                path: 'assets/models/samsung_galaxy_s22_ultra.glb',
                image: 'assets/textures/phone-texture-2.png',
                info: {
                    screenSize: '6.7 吋',
                    processor: '驍龍 8 Gen 2',
                    ram: '12GB',
                    camera: '4800萬像素',
                    storage: '512GB',
                    battery: '5,000mAh'
                }
            },
            {
                id: 'model3',
                name: 'Samsung Galaxy Z Flip 3',
                path: 'assets/models/Samsung_Galaxy_Z_Flip_3.glb',
                image: 'assets/textures/phone-texture-1.webp',
                info: {
                    screenSize: '6.7 吋',
                    processor: '驍龍 888',
                    ram: '8GB',
                    camera: '1200萬像素',
                    storage: '256GB',
                    battery: '3,300mAh'
                }
            }
        ];
        
        // 初始化選擇器
        this.initSelector();
    }
    
    /**
     * 初始化選擇器 UI
     */
    initSelector() {
        if (!this.container) {
            console.error('找不到模型選擇器的容器元素');
            return;
        }
        
        // 清空容器
        this.container.innerHTML = '';
        
        // 建立標題
        const title = document.createElement('h2');
        title.textContent = '選擇手機型號';
        this.container.appendChild(title);
        
        // 建立選擇下拉選單
        const select = document.createElement('select');
        select.id = 'phone-model-select';
        
        this.models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            select.appendChild(option);
        });
        
        // 當選擇變更時載入對應的模型
        select.addEventListener('change', (event) => {
            const selectedModel = this.getModelById(event.target.value);
            if (selectedModel) {
                this.selectModel(selectedModel);
            }
        });
        
        this.container.appendChild(select);
        
        // 添加模型預覽區域
        const previewContainer = document.createElement('div');
        previewContainer.className = 'model-preview';
        this.container.appendChild(previewContainer);
        
        // 預設載入第一個模型
        if (this.models.length > 0) {
            select.value = this.models[0].id;
            this.selectModel(this.models[0]);
        }
    }
    
    /**
     * 選擇指定的模型
     * @param {Object} model - 要載入的模型資訊
     */
    selectModel(model) {
        console.log(`選擇模型: ${model.name}`);
        
        // 更新預覽圖片
        const previewContainer = this.container.querySelector('.model-preview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
            
            if (model.image) {
                const img = document.createElement('img');
                img.src = model.image;
                img.alt = model.name;
                previewContainer.appendChild(img);
            }
        }
        
        // 載入模型
        this.phoneModel.loadModel(model.path, (loadedModel) => {
            console.log(`模型載入完成: ${model.name}`);
            
            // 發出模型變更事件，讓其他組件可以響應
            const modelChangedEvent = new CustomEvent('model-changed', { 
                detail: { ...model } 
            });
            window.dispatchEvent(modelChangedEvent);
            
            // 更新資訊卡的內容
            this.updateInfoCard(model);
        });
    }
    
    /**
     * 更新資訊卡的內容
     * @param {Object} model - 模型資訊
     */
    updateInfoCard(model) {
        const infoCard = document.getElementById('info-card');
        if (!infoCard) return;
        
        // 清空現有內容
        infoCard.innerHTML = '';
        
        // 添加標題
        const title = document.createElement('h2');
        title.textContent = model.name;
        infoCard.appendChild(title);
        
        // 添加描述
        const description = document.createElement('p');
        description.textContent = '手機規格資訊';
        infoCard.appendChild(description);
        
        // 創建規格列表
        const specsList = document.createElement('div');
        specsList.className = 'specs-list';
        
        // 添加各項規格
        for (const [key, value] of Object.entries(model.info)) {
            const specItem = document.createElement('div');
            specItem.className = 'specification';
            
            const specName = document.createElement('span');
            specName.className = 'spec-name';
            
            // 將駝峰式命名轉換為中文顯示名稱
            let displayName = key;
            switch (key) {
                case 'screenSize': displayName = '螢幕尺寸'; break;
                case 'processor': displayName = '處理器'; break;
                case 'ram': displayName = '記憶體'; break;
                case 'camera': displayName = '相機'; break;
                case 'storage': displayName = '儲存空間'; break;
                case 'battery': displayName = '電池'; break;
                default: displayName = key;
            }
            
            specName.textContent = displayName;
            
            const specValue = document.createElement('span');
            specValue.className = 'spec-value';
            specValue.textContent = value;
            
            specItem.appendChild(specName);
            specItem.appendChild(specValue);
            specsList.appendChild(specItem);
        }
        
        infoCard.appendChild(specsList);
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