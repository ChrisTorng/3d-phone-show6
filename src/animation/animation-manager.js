// animation-manager.js

// 從全域變數獲取 THREE 物件
const THREE = window.THREE;

/**
 * 動畫管理器類別，負責處理模型的各種動畫效果
 */
export class AnimationManager {
    /**
     * 建立動畫管理器
     * @param {SceneManager} sceneManager - 場景管理器實例
     * @param {TweenManager} tweenManager - Tween 管理器實例
     */
    constructor(sceneManager, tweenManager) {
        this.sceneManager = sceneManager;
        this.tweenManager = tweenManager;
        this.animations = new Map();
        this.activeAnimations = [];
    }
    
    /**
     * 更新所有活動動畫
     * 應在每一幀調用此方法
     */
    update() {
        // 如果有使用 requestAnimationFrame 和 THREE.AnimationMixer
        // 這裡會更新混合器
        this.activeAnimations.forEach(animation => {
            if (animation.mixer) {
                animation.mixer.update(0.016); // 假設 60fps
            }
        });
    }
    
    /**
     * 註冊動畫
     * @param {string} name - 動畫名稱
     * @param {Object} animationData - 動畫資料
     */
    registerAnimation(name, animationData) {
        this.animations.set(name, animationData);
    }
    
    /**
     * 播放動畫
     * @param {string} name - 動畫名稱
     * @param {Object} options - 附加選項
     * @returns {Object} - 動畫控制物件
     */
    playAnimation(name, options = {}) {
        const animationData = this.animations.get(name);
        if (!animationData) {
            console.warn(`動畫 "${name}" 未找到`);
            return null;
        }
        
        // 根據動畫類型使用不同的播放方法
        let animationControl;
        
        switch (animationData.type) {
            case 'tween':
                animationControl = this.playTweenAnimation(animationData, options);
                break;
            case 'keyframe':
                animationControl = this.playKeyframeAnimation(animationData, options);
                break;
            default:
                console.warn(`不支援的動畫類型: ${animationData.type}`);
                return null;
        }
        
        this.activeAnimations.push(animationControl);
        return animationControl;
    }
    
    /**
     * 播放 Tween 動畫
     * @param {Object} animationData - 動畫資料
     * @param {Object} options - 附加選項
     * @returns {Object} - Tween 控制物件
     */
    playTweenAnimation(animationData, options) {
        const { target, properties, duration, easing } = animationData;
        
        // 合併選項和預設值
        const finalDuration = options.duration || duration || 1000;
        const finalEasing = options.easing || easing || 'Cubic.easeInOut';
        
        // 創建 tween
        const tween = this.tweenManager.createTween(
            target,
            properties,
            finalDuration,
            finalEasing,
            () => {
                // 動畫完成時從活動列表移除
                const index = this.activeAnimations.findIndex(a => a.id === tween.id);
                if (index !== -1) {
                    this.activeAnimations.splice(index, 1);
                }
                
                // 執行完成回呼
                if (options.onComplete) {
                    options.onComplete();
                }
            }
        );
        
        return {
            id: tween._id,
            type: 'tween',
            tween: tween,
            stop: () => {
                this.tweenManager.stopTween(tween);
                const index = this.activeAnimations.findIndex(a => a.id === tween._id);
                if (index !== -1) {
                    this.activeAnimations.splice(index, 1);
                }
            }
        };
    }
    
    /**
     * 播放關鍵幀動畫
     * @param {Object} animationData - 動畫資料
     * @param {Object} options - 附加選項
     * @returns {Object} - 關鍵幀動畫控制物件
     */
    playKeyframeAnimation(animationData, options) {
        const { clip, object } = animationData;
        
        // 創建動畫混合器
        const mixer = new THREE.AnimationMixer(object);
        const action = mixer.clipAction(clip);
        
        // 設定動畫參數
        if (options.loop !== undefined) {
            action.loop = options.loop ? THREE.LoopRepeat : THREE.LoopOnce;
        }
        
        if (options.clampWhenFinished !== undefined) {
            action.clampWhenFinished = options.clampWhenFinished;
        }
        
        // 播放動畫
        action.play();
        
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        
        return {
            id: id,
            type: 'keyframe',
            action: action,
            mixer: mixer,
            stop: () => {
                action.stop();
                const index = this.activeAnimations.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.activeAnimations.splice(index, 1);
                }
            }
        };
    }
    
    /**
     * 檢查是否有活動中的動畫
     * @returns {boolean} - 是否有動畫正在播放
     */
    hasActiveAnimations() {
        return this.activeAnimations.length > 0;
    }
    
    /**
     * 停止所有動畫
     */
    stopAllAnimations() {
        // 複製陣列，因為在迴圈中會修改原陣列
        const animations = [...this.activeAnimations];
        
        animations.forEach(animation => {
            animation.stop();
        });
        
        // 確保陣列清空
        this.activeAnimations = [];
    }
    
    /**
     * 註冊部件爆炸視圖動畫
     * @param {THREE.Object3D} model - 要執行爆炸視圖的模型
     * @param {number} expansionFactor - 爆炸擴張係數
     */
    registerExplodeAnimation(model, expansionFactor = 1.5) {
        const originalPositions = new Map();
        const explodedPositions = new Map();
        
        // 儲存原始位置並計算爆炸後位置
        model.traverse(child => {
            if (child.isMesh && child !== model) {
                // 儲存原始位置
                originalPositions.set(child, child.position.clone());
                
                // 計算從中心向外的方向
                const direction = child.position.clone().normalize();
                const explodedPosition = child.position.clone().add(
                    direction.multiplyScalar(expansionFactor)
                );
                explodedPositions.set(child, explodedPosition);
            }
        });
        
        // 註冊爆炸和重組動畫
        this.registerAnimation('explode', {
            type: 'tween',
            target: { value: 0 },
            properties: { value: 1 },
            duration: 1000,
            easing: 'Cubic.easeInOut',
            onUpdate: (obj) => {
                const value = obj.value;
                model.traverse(child => {
                    if (child.isMesh && child !== model) {
                        const original = originalPositions.get(child);
                        const exploded = explodedPositions.get(child);
                        
                        if (original && exploded) {
                            child.position.lerpVectors(original, exploded, value);
                        }
                    }
                });
            }
        });
        
        this.registerAnimation('implode', {
            type: 'tween',
            target: { value: 1 },
            properties: { value: 0 },
            duration: 1000,
            easing: 'Cubic.easeInOut',
            onUpdate: (obj) => {
                const value = obj.value;
                model.traverse(child => {
                    if (child.isMesh && child !== model) {
                        const original = originalPositions.get(child);
                        const exploded = explodedPositions.get(child);
                        
                        if (original && exploded) {
                            child.position.lerpVectors(original, exploded, value);
                        }
                    }
                });
            }
        });
    }
}