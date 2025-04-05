// tween-manager.js

/**
 * Tween 動畫管理器，負責處理平滑過渡動畫
 */
export class TweenManager {
    constructor() {
        this.tweens = [];
    }
    
    /**
     * 建立並啟動新的 tween 動畫
     * @param {Object} object - 要進行動畫的物件
     * @param {Object} targetValues - 動畫目標值
     * @param {number} duration - 動畫持續時間（毫秒）
     * @param {string} easing - 緩動函數名稱
     * @param {Function} onComplete - 動畫完成時的回呼函式
     * @returns {TWEEN.Tween} - 建立的 tween 實例
     */
    createTween(object, targetValues, duration = 1000, easing = 'Cubic.easeInOut', onComplete = null) {
        // 建立新的 tween
        const tween = new TWEEN.Tween(object)
            .to(targetValues, duration)
            .easing(TWEEN.Easing[easing.split('.')[0]][easing.split('.')[1]])
            .onComplete(() => {
                // 動畫完成時從陣列中移除
                const index = this.tweens.indexOf(tween);
                if (index !== -1) {
                    this.tweens.splice(index, 1);
                }
                
                // 如果有提供回呼函式，執行它
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
            });
        
        // 添加到 tweens 陣列並啟動
        this.tweens.push(tween);
        tween.start();
        
        return tween;
    }
    
    /**
     * 建立連續的動畫序列
     * @param {Array} tweenConfigs - tween 配置物件的陣列
     * @returns {TWEEN.Tween} - 序列中的第一個 tween
     */
    createSequence(tweenConfigs) {
        if (!tweenConfigs || tweenConfigs.length === 0) {
            return null;
        }
        
        let previousTween = null;
        
        for (let i = 0; i < tweenConfigs.length; i++) {
            const config = tweenConfigs[i];
            const tween = this.createTween(
                config.object,
                config.targetValues,
                config.duration,
                config.easing,
                config.onComplete
            );
            
            if (previousTween) {
                previousTween.chain(tween);
            }
            
            previousTween = tween;
        }
        
        return tweenConfigs[0]; // 回傳序列中的第一個 tween
    }
    
    /**
     * 停止特定的 tween
     * @param {TWEEN.Tween} tween - 要停止的 tween
     */
    stopTween(tween) {
        if (tween) {
            tween.stop();
            const index = this.tweens.indexOf(tween);
            if (index !== -1) {
                this.tweens.splice(index, 1);
            }
        }
    }
    
    /**
     * 停止所有 tween 動畫
     */
    stopAllTweens() {
        for (const tween of this.tweens) {
            tween.stop();
        }
        this.tweens = [];
    }
}