// orbit-controls.js

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class PhoneOrbitControls {
    constructor(camera, renderer) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.initControls();
    }

    initControls() {
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false; // pan the camera up and down
        this.controls.maxPolarAngle = Math.PI / 2; // limit vertical rotation
    }

    update() {
        this.controls.update(); // call this to update the controls
    }

    reset() {
        this.controls.reset(); // reset the controls to their initial state
    }
}

export default PhoneOrbitControls;