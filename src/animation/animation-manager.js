// animation-manager.js

class AnimationManager {
    constructor(model) {
        this.model = model;
        this.animations = [];
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    playAnimations() {
        this.animations.forEach(animation => {
            animation.play();
        });
    }

    stopAnimations() {
        this.animations.forEach(animation => {
            animation.stop();
        });
    }

    update(deltaTime) {
        this.animations.forEach(animation => {
            animation.update(deltaTime);
        });
    }
}

export default AnimationManager;