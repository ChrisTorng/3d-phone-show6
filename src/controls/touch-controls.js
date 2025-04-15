// touch-controls.js

// 從全域變數獲取 THREE 物件
const THREE = window.THREE;

/**
 * 觸控控制器類別，處理行動裝置上的觸控互動
 */
export class TouchControls {
    /**
     * 建立觸控控制器
     * @param {HTMLElement} domElement - 接收觸控事件的 DOM 元素
     * @param {THREE.OrbitControls} orbitControls - 軌道控制器實例
     */
    constructor(domElement, orbitControls) {
        this.domElement = domElement;
        this.orbitControls = orbitControls;
        this.touchStartPos = new THREE.Vector2();
        this.touchEndPos = new THREE.Vector2();
        this.multiTouchStartDistance = 0;
        this.multiTouchEndDistance = 0;
        this.isMultiTouch = false;
        this.isPinching = false;
        this.isRotating = false;
        
        // 綁定觸控事件處理器
        this.bindEvents();
    }
    
    /**
     * 綁定必要的觸控事件
     */
    bindEvents() {
        this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }
    
    /**
     * 觸控開始事件處理
     * @param {TouchEvent} event - 觸控事件
     */
    onTouchStart(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            // 單指觸控 - 旋轉
            this.isRotating = true;
            this.isMultiTouch = false;
            this.isPinching = false;
            
            this.touchStartPos.x = event.touches[0].pageX;
            this.touchStartPos.y = event.touches[0].pageY;
            
        } else if (event.touches.length === 2) {
            // 雙指觸控 - 縮放或平移
            this.isMultiTouch = true;
            this.isRotating = false;
            
            // 計算兩指間的距離
            const dx = event.touches[1].pageX - event.touches[0].pageX;
            const dy = event.touches[1].pageY - event.touches[0].pageY;
            this.multiTouchStartDistance = Math.sqrt(dx * dx + dy * dy);
            
            // 判斷是否為縮放手勢
            this.isPinching = true;
        }
    }
    
    /**
     * 觸控移動事件處理
     * @param {TouchEvent} event - 觸控事件
     */
    /**
     * 觸控移動事件處理，使用 throttle 防止過頻繁呼叫
     * @param {TouchEvent} event - 觸控事件
     */
    onTouchMove(event) {
        event.preventDefault();

        // 使用節流技術避免過於頻繁的處理
        if (!this._throttleTimer) {
            this._throttleTimer = setTimeout(() => {
                this._throttleTimer = null;
            }, 16); // 約 60fps
        } else {
            return;
        }
        
        // 記錄用戶活動，重置效能監控的靜態計時器
        this.lastUserActivity = Date.now();
        
        if (this.isRotating && event.touches.length === 1) {
            // 單指拖動 - 旋轉
            this.touchEndPos.x = event.touches[0].pageX;
            this.touchEndPos.y = event.touches[0].pageY;
            
            // 將觸控移動轉換為模擬滑鼠移動，讓 OrbitControls 處理
            // 此處不需要額外的邏輯，因為 OrbitControls 已經在監聽滑鼠事件
            
        } else if (this.isMultiTouch && event.touches.length === 2) {
            if (this.isPinching) {
                // 雙指捏合 - 縮放
                const dx = event.touches[1].pageX - event.touches[0].pageX;
                const dy = event.touches[1].pageY - event.touches[0].pageY;
                this.multiTouchEndDistance = Math.sqrt(dx * dx + dy * dy);
                
                // 計算縮放比例
                const pinchRatio = this.multiTouchEndDistance / this.multiTouchStartDistance;
                
                // 更新起始距離以便連續縮放
                this.multiTouchStartDistance = this.multiTouchEndDistance;
                
                // 進行縮放操作，使用門檻值避免微小變化觸發縮放
                if (pinchRatio > 1.05) {
                    // 放大
                    this.orbitControls.dollyOut(0.95);
                } else if (pinchRatio < 0.95) {
                    // 縮小
                    this.orbitControls.dollyIn(0.95);
                }
                
                // 告知 OrbitControls 需要更新
                this.orbitControls.update();
            }
        }
    }
    
    /**
     * 觸控結束事件處理
     * @param {TouchEvent} event - 觸控事件
     */
    onTouchEnd(event) {
        this.isRotating = false;
        this.isMultiTouch = false;
        this.isPinching = false;
    }
    
    /**
     * 清除所有事件監聽器
     */
    dispose() {
        this.domElement.removeEventListener('touchstart', this.onTouchStart);
        this.domElement.removeEventListener('touchmove', this.onTouchMove);
        this.domElement.removeEventListener('touchend', this.onTouchEnd);
    }
}