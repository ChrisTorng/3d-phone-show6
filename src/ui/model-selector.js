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
        this.models = []; // 將初始化為空陣列，稍後從 JSON 檔案載入
        
        // 載入手機資料
        this.loadPhonesData();
    }
    
    /**
     * 從 JSON 檔案載入手機資料
     */
    async loadPhonesData() {
        try {
            const response = await fetch('assets/phones-data.json');
            if (!response.ok) {
                throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
            }
            
            this.models = await response.json();
            
            // 轉換資料結構以符合現有應用程式的需求
            this.models = this.models.map(phone => ({
                id: phone.id,
                name: `${phone.brand} ${phone.model}`,
                path: `assets/models/${phone.modelFile}`,
                image: `assets/textures/${phone.thumbnailImage}`,
                info: this.extractPhoneInfo(phone),
                fullSpecs: phone // 保留完整規格資訊供日後使用
            }));
            
            // 初始化選擇器 UI
            this.initSelector();
            
        } catch (error) {
            console.error('載入手機資料時發生錯誤:', error);
        }
    }
    
    /**
     * 從完整規格資料中提取主要資訊
     * @param {Object} phone - 完整手機規格資料
     * @returns {Object} - 簡化的手機資訊
     */
    extractPhoneInfo(phone) {
        const info = {
            screenSize: this.formatScreenSize(phone),
            processor: this.formatProcessor(phone),
            ram: this.formatRAM(phone),
            camera: this.formatCamera(phone),
            storage: this.formatStorage(phone),
            battery: this.formatBattery(phone)
        };
        
        return info;
    }
    
    /**
     * 格式化螢幕尺寸資訊
     */
    formatScreenSize(phone) {
        if (phone.display.main) { // 摺疊手機
            return `${phone.display.main.size} 吋 (展開) / ${phone.display.cover.size} 吋 (封面)`;
        }
        return `${phone.display.size} 吋`;
    }
    
    /**
     * 格式化處理器資訊
     */
    formatProcessor(phone) {
        return phone.processor.chipset;
    }
    
    /**
     * 格式化記憶體資訊
     */
    formatRAM(phone) {
        return phone.memory.ram;
    }
    
    /**
     * 格式化相機資訊
     */
    formatCamera(phone) {
        if (phone.camera.rear && phone.camera.rear.length > 0) {
            const mainCamera = phone.camera.rear[0];
            return `${mainCamera.megapixels} 萬畫素 ${mainCamera.type}`;
        }
        return '資訊不詳';
    }
    
    /**
     * 格式化儲存空間資訊
     */
    formatStorage(phone) {
        if (phone.memory.storageOptions && phone.memory.storageOptions.length > 0) {
            return phone.memory.storageOptions.join(' / ');
        }
        return '資訊不詳';
    }
    
    /**
     * 格式化電池資訊
     */
    formatBattery(phone) {
        if (typeof phone.battery.capacity === 'string') {
            return phone.battery.capacity;
        }
        return `${phone.battery.capacity} mAh`;
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
        
        // 添加一個查看詳細資訊的按鈕
        const detailsButton = document.createElement('button');
        detailsButton.textContent = '查看更多規格';
        detailsButton.className = 'details-button';
        detailsButton.addEventListener('click', () => {
            this.showFullSpecs(model);
        });
        
        infoCard.appendChild(detailsButton);
    }
    
    /**
     * 顯示手機的完整規格資訊
     * @param {Object} model - 包含完整規格的模型資訊
     */
    showFullSpecs(model) {
        const fullSpecsModal = document.getElementById('full-specs-modal') || this.createFullSpecsModal();
        
        // 更新模態視窗內容
        const modalContent = fullSpecsModal.querySelector('.modal-content');
        modalContent.innerHTML = '';
        
        // 標題
        const title = document.createElement('h2');
        title.textContent = `${model.name} 詳細規格`;
        modalContent.appendChild(title);
        
        // 關閉按鈕
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-modal';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            fullSpecsModal.style.display = 'none';
        };
        modalContent.appendChild(closeBtn);
        
        // 獲取完整規格
        const fullSpecs = model.fullSpecs;
        
        // 建立各個規格區塊
        this.createSpecSection(modalContent, '基本資訊', {
            '品牌': fullSpecs.brand,
            '型號': fullSpecs.model,
            '發布日期': fullSpecs.releaseDate
        });
        
        // 顯示螢幕資訊
        if (fullSpecs.display.main) { // 摺疊手機
            this.createSpecSection(modalContent, '主螢幕', {
                '尺寸': `${fullSpecs.display.main.size} 吋`,
                '解析度': fullSpecs.display.main.resolution,
                '類型': fullSpecs.display.main.type,
                '更新率': `${fullSpecs.display.main.refreshRate}Hz`,
                '特色': fullSpecs.display.main.features.join(', ')
            });
            
            this.createSpecSection(modalContent, '副螢幕', {
                '尺寸': `${fullSpecs.display.cover.size} 吋`,
                '解析度': fullSpecs.display.cover.resolution,
                '類型': fullSpecs.display.cover.type,
                '特色': fullSpecs.display.cover.features.join(', ')
            });
        } else {
            this.createSpecSection(modalContent, '顯示螢幕', {
                '尺寸': `${fullSpecs.display.size} 吋`,
                '解析度': fullSpecs.display.resolution,
                '像素密度': `${fullSpecs.display.ppi} ppi`,
                '類型': fullSpecs.display.type,
                '更新率': `${fullSpecs.display.refreshRate}Hz`,
                '特色': fullSpecs.display.features.join(', ')
            });
        }
        
        // 顯示尺寸資訊
        if (fullSpecs.dimensions.unfolded) { // 摺疊手機
            this.createSpecSection(modalContent, '尺寸與重量', {
                '展開高度': `${fullSpecs.dimensions.unfolded.height} mm`,
                '展開寬度': `${fullSpecs.dimensions.unfolded.width} mm`,
                '展開厚度': `${fullSpecs.dimensions.unfolded.thickness} mm`,
                '摺疊高度': `${fullSpecs.dimensions.folded.height} mm`,
                '摺疊寬度': `${fullSpecs.dimensions.folded.width} mm`,
                '摺疊厚度': `${fullSpecs.dimensions.folded.thickness} mm`,
                '重量': `${fullSpecs.dimensions.weight} g`
            });
        } else {
            this.createSpecSection(modalContent, '尺寸與重量', {
                '高度': `${fullSpecs.dimensions.height} mm`,
                '寬度': `${fullSpecs.dimensions.width} mm`,
                '厚度': `${fullSpecs.dimensions.thickness} mm`,
                '重量': `${fullSpecs.dimensions.weight} g`
            });
        }
        
        // 處理器資訊
        this.createSpecSection(modalContent, '處理器與記憶體', {
            '晶片組': fullSpecs.processor.chipset,
            'CPU': fullSpecs.processor.cpu,
            'GPU': fullSpecs.processor.gpu,
            '記憶體': fullSpecs.memory.ram,
            '儲存選項': fullSpecs.memory.storageOptions.join(', ')
        });
        
        // 相機資訊
        const cameraDetails = {};
        
        // 後置鏡頭
        if (fullSpecs.camera.rear && fullSpecs.camera.rear.length > 0) {
            fullSpecs.camera.rear.forEach((camera, index) => {
                cameraDetails[`後置鏡頭 ${index + 1}`] = `${camera.megapixels} 萬畫素 ${camera.type}，${camera.aperture}`;
                if (camera.features && camera.features.length > 0) {
                    cameraDetails[`後置鏡頭 ${index + 1} 特色`] = camera.features.join(', ');
                }
            });
        }
        
        // 前置鏡頭
        if (fullSpecs.camera.front) {
            cameraDetails['前置鏡頭'] = `${fullSpecs.camera.front.megapixels} 萬畫素，${fullSpecs.camera.front.aperture}`;
            if (fullSpecs.camera.front.features && fullSpecs.camera.front.features.length > 0) {
                cameraDetails['前置鏡頭特色'] = fullSpecs.camera.front.features.join(', ');
            }
        }
        
        // 影片錄製
        if (fullSpecs.camera.videoRecording) {
            cameraDetails['影片錄製'] = fullSpecs.camera.videoRecording.join(', ');
        }
        
        this.createSpecSection(modalContent, '相機系統', cameraDetails);
        
        // 電池資訊
        this.createSpecSection(modalContent, '電池與充電', {
            '電池容量': fullSpecs.battery.capacity,
            '充電技術': fullSpecs.battery.charging.join(', ')
        });
        
        // 連接與安全性
        this.createSpecSection(modalContent, '連接與安全性', {
            'USB': fullSpecs.connectivity.usb,
            'Wi-Fi': fullSpecs.connectivity.wifi,
            '藍牙': fullSpecs.connectivity.bluetooth,
            '行動網路': fullSpecs.connectivity.cellular,
            '安全性': fullSpecs.security.join(', ')
        });
        
        // 特色功能
        this.createSpecSection(modalContent, '特色功能', {
            '特色': fullSpecs.features.join(', '),
            '材質': `框架: ${fullSpecs.materials.frame}, 背板: ${fullSpecs.materials.backPanel}, 前板: ${fullSpecs.materials.frontPanel}`
        });
        
        // 顯示模態視窗
        fullSpecsModal.style.display = 'block';
    }
    
    /**
     * 建立規格區塊
     * @param {HTMLElement} container - 容器元素
     * @param {string} title - 區塊標題
     * @param {Object} specs - 規格鍵值對
     */
    createSpecSection(container, title, specs) {
        const section = document.createElement('div');
        section.className = 'spec-section';
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = title;
        section.appendChild(sectionTitle);
        
        const specList = document.createElement('div');
        specList.className = 'full-spec-list';
        
        for (const [key, value] of Object.entries(specs)) {
            if (value) { // 只顯示有值的項目
                const specRow = document.createElement('div');
                specRow.className = 'spec-row';
                
                const specKey = document.createElement('div');
                specKey.className = 'spec-key';
                specKey.textContent = key;
                
                const specValue = document.createElement('div');
                specValue.className = 'spec-value';
                specValue.textContent = value;
                
                specRow.appendChild(specKey);
                specRow.appendChild(specValue);
                specList.appendChild(specRow);
            }
        }
        
        section.appendChild(specList);
        container.appendChild(section);
    }
    
    /**
     * 建立完整規格的模態視窗
     * @returns {HTMLElement} - 模態視窗元素
     */
    createFullSpecsModal() {
        const modal = document.createElement('div');
        modal.id = 'full-specs-modal';
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        modal.appendChild(modalContent);
        
        // 點擊外部時關閉模態視窗
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        document.body.appendChild(modal);
        return modal;
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