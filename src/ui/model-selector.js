// model-selector.js

class ModelSelector {
    constructor(models) {
        this.models = models; // Array of model names
        this.selectedModel = null; // Currently selected model
        this.init();
    }

    init() {
        this.createModelSelector();
    }

    createModelSelector() {
        const selectorContainer = document.createElement('div');
        selectorContainer.classList.add('model-selector');

        this.models.forEach(model => {
            const modelOption = document.createElement('button');
            modelOption.innerText = model;
            modelOption.addEventListener('click', () => this.selectModel(model));
            selectorContainer.appendChild(modelOption);
        });

        document.body.appendChild(selectorContainer);
    }

    selectModel(model) {
        this.selectedModel = model;
        this.loadModel(model);
    }

    loadModel(model) {
        // Logic to load the selected model
        console.log(`Loading model: ${model}`);
        // Here you would typically call a function from the phone-model.js to load the model
    }
}

// Example usage
const models = ['phone-model-1', 'phone-model-2'];
const modelSelector = new ModelSelector(models);