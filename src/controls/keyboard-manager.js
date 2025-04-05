/**
 * 鍵盤控制管理類別，負責處理鍵盤快捷鍵
 */
export class KeyboardManager {
    /**
     * 建立鍵盤控制管理器
     * @param {SceneManager} sceneManager - 場景管理器實例
     * @param {THREE.OrbitControls} controls - 軌道控制器實例
     */
    constructor(sceneManager, controls) {
        this.sceneManager = sceneManager;
        this.controls = controls;
        this.autoRotateEnabled = false;
        this.fullscreenEnabled = false;
        
        // 綁定鍵盤事件處理函式
        this.keyDownHandler = this.onKeyDown.bind(this);
        
        // 註冊事件監聽器
        window.addEventListener('keydown', this.keyDownHandler);
    }
    
    /**
     * 處理鍵盤按鍵事件
     * @param {KeyboardEvent} event - 鍵盤事件
     */
    onKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'r':
                // R 鍵：重設視圖
                this.resetView();
                break;
                
            case 'a':
                // A 鍵：切換自動旋轉
                this.toggleAutoRotate();
                break;
                
            case 'f':
                // F 鍵：切換全螢幕
                this.toggleFullscreen();
                break;
                
            default:
                // 其他按鍵不處理
                break;
        }
    }
    
    /**
     * 重設視圖到初始狀態
     */
    resetView() {
        this.controls.reset();
        console.log('視圖已重設');
    }
    
    /**
     * 切換自動旋轉
     */
    toggleAutoRotate() {
        this.autoRotateEnabled = !this.autoRotateEnabled;
        this.controls.autoRotate = this.autoRotateEnabled;
        console.log(`自動旋轉: ${this.autoRotateEnabled ? '開啟' : '關閉'}`);
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
            this.fullscreenEnabled = true;
            console.log('進入全螢幕模式');
        } else {
            // 退出全螢幕
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.fullscreenEnabled = false;
            console.log('退出全螢幕模式');
        }
    }
    
    /**
     * 移除事件監聽器
     */
    dispose() {
        window.removeEventListener('keydown', this.keyDownHandler);
    }
}