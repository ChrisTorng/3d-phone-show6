// 這個檔案是用來提供確保 UI 在不同螢幕尺寸下響應式的輔助函式

export class ResponsiveHelper {
    /**
     * 建立響應式輔助工具
     * @param {Renderer} renderer - 渲染器實例
     * @param {SceneManager} sceneManager - 場景管理器實例
     */
    constructor(renderer, sceneManager) {
        this.renderer = renderer;
        this.sceneManager = sceneManager;
        
        // 綁定方法到實例
        this.adjustUI = this.adjustUI.bind(this);
        
        // 監聽視窗大小變化
        window.addEventListener('resize', this.adjustUI);
        this.adjustUI(); // 初始調整
    }

    // 設定 UI 元素的大小和位置以適應螢幕尺寸
    adjustUI() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 根據螢幕寬度調整控制面板的大小
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel) {
            controlPanel.style.width = width > 768 ? '300px' : '100%';
            controlPanel.style.height = height > 768 ? '100%' : 'auto';
        }

        // 根據螢幕尺寸調整 3D 渲染區域
        const renderArea = document.querySelector('#render-area');
        if (renderArea) {
            renderArea.style.width = width + 'px';
            renderArea.style.height = height + 'px';
        }
    }
    
    /**
     * 處理視窗大小變化
     */
    onWindowResize() {
        // 更新相機投影矩陣
        if (this.renderer && this.renderer.camera) {
            this.renderer.camera.aspect = window.innerWidth / window.innerHeight;
            this.renderer.camera.updateProjectionMatrix();
        }
        
        // 更新渲染器大小
        if (this.renderer && this.renderer.renderer) {
            this.renderer.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        // 調整 UI
        this.adjustUI();
    }
}