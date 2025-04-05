// src/ui/info-card.js

/**
 * 資訊卡類別，用於顯示模型部件的詳細資訊
 */
export class InfoCard {
    /**
     * 建立資訊卡
     */
    constructor() {
        this.container = document.getElementById('info-card');
        this.isVisible = false;
        
        // 初始化資訊卡
        this.initCard();
    }
    
    /**
     * 初始化資訊卡結構
     */
    initCard() {
        // 建立卡片標題
        const title = document.createElement('h3');
        title.className = 'info-card-title';
        title.textContent = '部件資訊';
        
        // 建立關閉按鈕
        const closeButton = document.createElement('button');
        closeButton.className = 'info-card-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => this.hide());
        
        // 建立標題列，包含標題和關閉按鈕
        const titleBar = document.createElement('div');
        titleBar.className = 'info-card-title-bar';
        titleBar.appendChild(title);
        titleBar.appendChild(closeButton);
        
        // 建立內容容器
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'info-card-content';
        
        // 添加元素到卡片
        this.container.appendChild(titleBar);
        this.container.appendChild(this.contentContainer);
        
        // 初始隱藏卡片
        this.hide();
    }
    
    /**
     * 顯示資訊卡並更新內容
     * @param {Object} partInfo - 部件資訊物件
     * @param {number} x - 卡片 X 座標位置
     * @param {number} y - 卡片 Y 座標位置
     */
    show(partInfo, x, y) {
        if (!partInfo) return;
        
        // 更新內容
        this.updateContent(partInfo);
        
        // 設定位置，確保不超出視窗邊界
        if (x !== undefined && y !== undefined) {
            const buffer = 20; // 邊緣緩衝區
            
            // 計算最大可用位置
            const maxX = window.innerWidth - this.container.offsetWidth - buffer;
            const maxY = window.innerHeight - this.container.offsetHeight - buffer;
            
            // 確保卡片不會超出視窗邊界
            const posX = Math.min(Math.max(x, buffer), maxX);
            const posY = Math.min(Math.max(y, buffer), maxY);
            
            this.container.style.left = `${posX}px`;
            this.container.style.top = `${posY}px`;
        }
        
        // 顯示卡片
        this.container.style.display = 'block';
        this.isVisible = true;
        
        // 添加顯示動畫
        setTimeout(() => {
            this.container.classList.add('visible');
        }, 10);
    }
    
    /**
     * 隱藏資訊卡
     */
    hide() {
        // 移除顯示類別以觸發過渡動畫
        this.container.classList.remove('visible');
        
        // 等待過渡完成後隱藏元素
        setTimeout(() => {
            this.container.style.display = 'none';
            this.isVisible = false;
        }, 300); // 需與 CSS 過渡時間匹配
    }
    
    /**
     * 切換資訊卡顯示狀態
     * @param {Object} partInfo - 部件資訊物件
     * @param {number} x - 卡片 X 座標位置
     * @param {number} y - 卡片 Y 座標位置
     */
    toggle(partInfo, x, y) {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(partInfo, x, y);
        }
    }
    
    /**
     * 更新資訊卡內容
     * @param {Object} partInfo - 部件資訊物件
     */
    updateContent(partInfo) {
        if (!partInfo) return;
        
        // 清空原有內容
        this.contentContainer.innerHTML = '';
        
        // 更新標題
        const titleElement = this.container.querySelector('.info-card-title');
        if (titleElement) {
            titleElement.textContent = partInfo.name || '部件資訊';
        }
        
        // 建立資訊內容
        const infoHTML = `
            <div class="part-image-container">
                <img src="${partInfo.image || '#'}" alt="${partInfo.name}" class="part-image" 
                     onerror="this.style.display='none'">
            </div>
            <div class="part-description">
                ${partInfo.description || '無可用的描述'}
            </div>
            <div class="part-specs">
                ${this.generateSpecsList(partInfo.specs)}
            </div>
        `;
        
        this.contentContainer.innerHTML = infoHTML;
    }
    
    /**
     * 從規格物件產生 HTML 規格列表
     * @param {Object} specs - 規格物件，鍵值對形式
     * @returns {string} - 規格 HTML 字串
     */
    generateSpecsList(specs) {
        if (!specs || Object.keys(specs).length === 0) {
            return '<p>無規格資訊可用</p>';
        }
        
        let html = '<ul class="specs-list">';
        
        for (const [key, value] of Object.entries(specs)) {
            html += `<li><span class="spec-name">${key}:</span> <span class="spec-value">${value}</span></li>`;
        }
        
        html += '</ul>';
        return html;
    }
}