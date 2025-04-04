class PhoneModel {
    constructor(modelPath, texturePath) {
        this.modelPath = modelPath;
        this.texturePath = texturePath;
        this.model = null;
        this.texture = null;
    }

    loadModel(scene, onLoad) {
        const loader = new THREE.GLTFLoader();
        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            scene.add(this.model);
            if (onLoad) onLoad(this.model);
        }, undefined, (error) => {
            console.error('An error occurred while loading the model:', error);
        });
    }

    loadTexture(onLoad) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(this.texturePath, (texture) => {
            this.texture = texture;
            if (onLoad) onLoad(this.texture);
        }, undefined, (error) => {
            console.error('An error occurred while loading the texture:', error);
        });
    }

    applyTexture() {
        if (this.model && this.texture) {
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = this.texture;
                    child.material.needsUpdate = true;
                }
            });
        }
    }

    setPosition(x, y, z) {
        if (this.model) {
            this.model.position.set(x, y, z);
        }
    }

    rotate(x, y, z) {
        if (this.model) {
            this.model.rotation.set(x, y, z);
        }
    }

    scale(scalar) {
        if (this.model) {
            this.model.scale.set(scalar, scalar, scalar);
        }
    }
}