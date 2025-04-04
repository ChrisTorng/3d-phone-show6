import * as THREE from 'three';

export function loadGLTFModel(url) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        loader.load(url, (gltf) => {
            resolve(gltf);
        }, undefined, (error) => {
            reject(error);
        });
    });
}

export function loadTexture(url) {
    return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(url, (texture) => {
            resolve(texture);
        }, undefined, (error) => {
            reject(error);
        });
    });
}