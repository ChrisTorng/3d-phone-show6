/**
 * 控制面板類別，提供使用者控制 3D 模型的界面
 */
export class ControlPanel {
    /**
     * 建立控制面板
     * @param {AnimationManager} animationManager - 動畫管理器實例
     * @param {AutoRotate} autoRotate - 自動旋轉控制器實例
     */
    constructor(animationManager, autoRotate) {
        this.animationManager = animationManager;
        this.autoRotate = autoRotate;
        this.container = document.getElementById('control-panel');
        
        // 初始化面板
        this.initPanel();
    }
    
    /**
     * 初始化控制面板元件
     */
    initPanel() {
        // 建立面板標題
        const title = document.createElement('h2');
        title.textContent = '控制面板';
        title.className = 'panel-title';
        this.container.appendChild(title);
        
        // 建立控制按鈕容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        // 建立旋轉按鈕
        const rotateBtn = this.createButton('旋轉', 'rotate-btn', () => {
            this.autoRotate.toggle();
            rotateBtn.classList.toggle('active', this.autoRotate.isEnabled());
        });
        rotateBtn.innerHTML = `<img src="assets/icons/rotate.svg" alt="旋轉"> 自動旋轉`;
        
        // 建立重設視圖按鈕
        const resetViewBtn = this.createButton('重設視圖', 'reset-btn', () => {
            // 重設視圖的邏輯將在 main.js 中處理
            const resetEvent = new CustomEvent('reset-view');
            window.dispatchEvent(resetEvent);
        });
        
        // 建立爆炸視圖按鈕
        const explodeBtn = this.createButton('爆炸視圖', 'explode-btn', () => {
            // 啟動爆炸視圖動畫
            if (explodeBtn.classList.contains('active')) {
                this.animationManager.playAnimation('implode');
                explodeBtn.classList.remove('active');
            } else {
                this.animationManager.playAnimation('explode');
                explodeBtn.classList.add('active');
            }
        });
        
        // 建立全螢幕按鈕
        const fullscreenBtn = this.createButton('全螢幕', 'fullscreen-btn', () => {
            this.toggleFullscreen();
            fullscreenBtn.classList.toggle('active', document.fullscreenElement !== null);
        });
        
        // 添加按鈕到容器
        buttonContainer.appendChild(rotateBtn);
        buttonContainer.appendChild(resetViewBtn);
        buttonContainer.appendChild(explodeBtn);
        buttonContainer.appendChild(fullscreenBtn);
        
        // 添加容器到面板
        this.container.appendChild(buttonContainer);
        
        // 建立模型資訊區域
        const infoSection = document.createElement('div');
        infoSection.className = 'model-info';
        infoSection.innerHTML = `
            <h3>目前模型</h3>
            <p id="model-name">手機型號 1</p>
            <div class="model-stats">
                <div class="stat">
                    <span class="stat-label">螢幕尺寸:</span>
                    <span id="screen-size">6.1 吋</span>
                </div>
                <div class="stat">
                    <span class="stat-label">處理器:</span>
                    <span id="processor">驍龍 8 Gen 2</span>
                </div>
                <div class="stat">
                    <span class="stat-label">記憶體:</span>
                    <span id="ram">8GB</span>
                </div>
            </div>
        `;
        this.container.appendChild(infoSection);
    }
    
    /**
     * 建立控制按鈕
     * @param {string} text - 按鈕文字
     * @param {string} className - CSS 類別名稱
     * @param {Function} clickHandler - 點擊事件處理函式
     * @returns {HTMLButtonElement} - 按鈕元素
     */
    createButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `control-btn ${className}`;
        button.addEventListener('click', clickHandler);
        return button;
    }
    
    /**
     * 切換全螢幕模式
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            // 進入全螢幕
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // 退出全螢幕
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    /**
     * 更新模型資訊
     * @param {Object} modelInfo - 模型資訊物件
     */
    updateModelInfo(modelInfo) {
        if (!modelInfo) return;
        
        document.getElementById('model-name').textContent = modelInfo.name || '未知型號';
        document.getElementById('screen-size').textContent = modelInfo.screenSize || '未知';
        document.getElementById('processor').textContent = modelInfo.processor || '未知';
        document.getElementById('ram').textContent = modelInfo.ram || '未知';
    }
}