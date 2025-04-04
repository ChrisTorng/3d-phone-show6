// scene-manager.js

import * as THREE from 'three';

class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        this.objects = [];
    }

    addObject(object) {
        this.scene.add(object);
        this.objects.push(object);
    }

    removeObject(object) {
        this.scene.remove(object);
        this.objects = this.objects.filter(obj => obj !== object);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default SceneManager;