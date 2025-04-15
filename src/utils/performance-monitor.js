// performance-monitor.js
/**
 * 效能監控類別，用於追蹤幀率和執行時間
 */
export class PerformanceMonitor {
    /**
     * 建立效能監控器
     */
    constructor() {
        this.startTime = performance.now();
        this.frames = 0;
        this.lastTime = this.startTime;
        this.fps = 0;
        this.lastActivity = this.startTime;
        this.isStatic = false;
    }

    /**
     * 更新效能統計資料，每幀呼叫
     * @returns {boolean} 是否需要繼續高頻率渲染
     */
    update() {
        this.frames++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            this.fps = this.frames;
            this.frames = 0;
            this.lastTime = currentTime;
        }
        
        // 檢查場景是否靜態（5秒無變化）
        if (this.hasUserActivity()) {
            this.lastActivity = currentTime;
            this.isStatic = false;
        } else if (currentTime - this.lastActivity > 5000) {
            this.isStatic = true;
        }
        
        return !this.isStatic; // 回傳是否需要繼續高頻率渲染
    }

    /**
     * 取得目前的每秒幀數
     * @returns {number} - 每秒幀數
     */
    getFPS() {
        return this.fps;
    }

    /**
     * 取得應用程式啟動後的執行時間（秒）
     * @returns {number} - 執行時間（秒）
     */
    getElapsedTime() {
        return (performance.now() - this.startTime) / 1000; // 轉換為秒
    }
    
    /**
     * 檢查是否有使用者互動
     * 此方法應由子類別重寫以實作實際的檢測邏輯
     * @returns {boolean} - 是否有使用者互動
     */
    hasUserActivity() {
        // 預設實作，子類別應重寫
        return false;
    }
}