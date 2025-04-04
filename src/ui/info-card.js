// src/ui/info-card.js

class InfoCard {
    constructor(container) {
        this.container = container;
        this.cardElement = this.createCardElement();
        this.hide();
    }

    createCardElement() {
        const card = document.createElement('div');
        card.classList.add('info-card');
        card.innerHTML = `
            <h2 class="info-card-title">手機資訊</h2>
            <p class="info-card-description">選擇一個手機以查看詳細資訊。</p>
            <button class="info-card-close">關閉</button>
        `;
        card.querySelector('.info-card-close').addEventListener('click', () => this.hide());
        this.container.appendChild(card);
        return card;
    }

    show(title, description) {
        this.cardElement.querySelector('.info-card-title').textContent = title;
        this.cardElement.querySelector('.info-card-description').textContent = description;
        this.cardElement.style.display = 'block';
    }

    hide() {
        this.cardElement.style.display = 'none';
    }
}

// Export the InfoCard class for use in other modules
export default InfoCard;