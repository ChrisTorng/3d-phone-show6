// auto-rotate.js

/**
 * 自動旋轉功能類別，控制模型的自動旋轉
 */
export class AutoRotate {
    /**
     * 建立自動旋轉控制器
     * @param {THREE.OrbitControls} controls - 軌道控制器實例
     */
    constructor(controls) {
        this.controls = controls;
        this.enabled = false;
        this.speed = 1.0;
    }
    
    /**
     * 啟用或停用自動旋轉
     * @param {boolean} enabled - 是否啟用自動旋轉
     */
    toggle(enabled) {
        if (enabled !== undefined) {
            this.enabled = enabled;
        } else {
            this.enabled = !this.enabled;
        }
        
        this.controls.autoRotate = this.enabled;
    }
    
    /**
     * 設定自動旋轉速度
     * @param {number} speed - 旋轉速度
     */
    setSpeed(speed) {
        this.speed = speed;
        this.controls.autoRotateSpeed = this.speed;
    }
    
    /**
     * 暫停自動旋轉(例如使用者操作時)
     */
    pause() {
        if (this.enabled) {
            this.controls.autoRotate = false;
        }
    }
    
    /**
     * 恢復自動旋轉(例如使用者操作結束時)
     */
    resume() {
        if (this.enabled) {
            this.controls.autoRotate = true;
        }
    }
    
    /**
     * 取得目前的啟用狀態
     * @returns {boolean} - 自動旋轉是否啟用
     */
    isEnabled() {
        return this.enabled;
    }
}