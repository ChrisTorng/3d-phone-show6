// keyboard-manager.js
class KeyboardManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.init();
    }

    init() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'r':
                this.resetView();
                break;
            case 'a':
                this.toggleAutoRotate();
                break;
            case 'f':
                this.toggleFullScreen();
                break;
            default:
                break;
        }
    }

    resetView() {
        // Logic to reset the view of the 3D model
        console.log('View reset');
        this.viewer.resetCamera();
    }

    toggleAutoRotate() {
        // Logic to toggle auto-rotation of the model
        console.log('Auto-rotation toggled');
        this.viewer.toggleAutoRotate();
    }

    toggleFullScreen() {
        // Logic to toggle full-screen mode
        console.log('Full-screen mode toggled');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}

// Export the KeyboardManager class
export default KeyboardManager;