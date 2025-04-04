// performance-monitor.js
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.frames = 0;
        this.lastTime = this.startTime;
        this.fps = 0;
    }

    update() {
        this.frames++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            this.fps = this.frames;
            this.frames = 0;
            this.lastTime = currentTime;
        }
    }

    getFPS() {
        return this.fps;
    }

    getElapsedTime() {
        return (performance.now() - this.startTime) / 1000; // in seconds
    }
}

export default PerformanceMonitor;