// touch-controls.js

class TouchControls {
    constructor(camera, renderer, model) {
        this.camera = camera;
        this.renderer = renderer;
        this.model = model;

        this.init();
    }

    init() {
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
            this.isDragging = true;
        } else if (event.touches.length === 2) {
            this.startDistance = this.getDistance(event.touches);
            this.isZooming = true;
        }
    }

    onTouchMove(event) {
        if (this.isDragging && event.touches.length === 1) {
            const deltaX = event.touches[0].clientX - this.startX;
            const deltaY = event.touches[0].clientY - this.startY;

            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;

            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
        } else if (this.isZooming && event.touches.length === 2) {
            const distance = this.getDistance(event.touches);
            const zoomFactor = distance / this.startDistance;

            this.camera.position.z *= zoomFactor;
            this.startDistance = distance;
        }
    }

    onTouchEnd(event) {
        if (event.touches.length === 0) {
            this.isDragging = false;
            this.isZooming = false;
        }
    }

    getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}