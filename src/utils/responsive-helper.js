// 這個檔案是用來提供確保 UI 在不同螢幕尺寸下響應式的輔助函式

const responsiveHelper = {
    // 設定 UI 元素的大小和位置以適應螢幕尺寸
    adjustUI: function() {
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
    },

    // 監聽視窗大小變化事件
    init: function() {
        window.addEventListener('resize', this.adjustUI);
        this.adjustUI(); // 初始調整
    }
};

// 初始化響應式輔助功能
responsiveHelper.init();