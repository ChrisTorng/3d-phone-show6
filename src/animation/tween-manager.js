// tween-manager.js
class TweenManager {
    constructor() {
        this.tweens = [];
    }

    addTween(tween) {
        this.tweens.push(tween);
    }

    update(deltaTime) {
        for (let i = this.tweens.length - 1; i >= 0; i--) {
            const tween = this.tweens[i];
            tween.update(deltaTime);
            if (tween.isComplete()) {
                this.tweens.splice(i, 1);
            }
        }
    }
}

class Tween {
    constructor(object, properties, duration, easingFunction) {
        this.object = object;
        this.properties = properties;
        this.duration = duration;
        this.easingFunction = easingFunction;
        this.startTime = null;
        this.startValues = {};
        this.isCompleted = false;

        for (const prop in properties) {
            this.startValues[prop] = object[prop];
        }
    }

    start() {
        this.startTime = performance.now();
        this.isCompleted = false;
    }

    update(currentTime) {
        if (this.startTime === null) return;

        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const easedProgress = this.easingFunction(progress);

        for (const prop in this.properties) {
            this.object[prop] = this.startValues[prop] + (this.properties[prop] - this.startValues[prop]) * easedProgress;
        }

        if (progress === 1) {
            this.isCompleted = true;
        }
    }

    isComplete() {
        return this.isCompleted;
    }
}

// Easing functions
const Easing = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export { TweenManager, Tween, Easing };