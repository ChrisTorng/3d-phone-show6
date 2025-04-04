// auto-rotate.js

class AutoRotate {
    constructor(camera, target, speed = 0.01) {
        this.camera = camera;
        this.target = target;
        this.speed = speed;
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
    }

    animate() {
        if (this.isActive) {
            requestAnimationFrame(this.animate.bind(this));
            this.camera.position.x = this.target.position.x + Math.sin(Date.now() * this.speed) * 5;
            this.camera.position.z = this.target.position.z + Math.cos(Date.now() * this.speed) * 5;
            this.camera.lookAt(this.target.position);
        }
    }
}

export default AutoRotate;