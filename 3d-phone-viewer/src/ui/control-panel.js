const controlPanel = (() => {
    const panel = document.createElement('div');
    panel.className = 'control-panel';

    const title = document.createElement('h2');
    title.textContent = '控制面板';
    panel.appendChild(title);

    const rotateButton = document.createElement('button');
    rotateButton.innerHTML = '<img src="../assets/icons/rotate.svg" alt="Rotate" /> 旋轉';
    rotateButton.addEventListener('click', () => {
        // 呼叫旋轉模型的函式
    });
    panel.appendChild(rotateButton);

    const zoomButton = document.createElement('button');
    zoomButton.innerHTML = '<img src="../assets/icons/zoom.svg" alt="Zoom" /> 縮放';
    zoomButton.addEventListener('click', () => {
        // 呼叫縮放模型的函式
    });
    panel.appendChild(zoomButton);

    const infoButton = document.createElement('button');
    infoButton.innerHTML = '<img src="../assets/icons/info.svg" alt="Info" /> 資訊';
    infoButton.addEventListener('click', () => {
        // 顯示模型資訊
    });
    panel.appendChild(infoButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = '重設視圖';
    resetButton.addEventListener('click', () => {
        // 呼叫重設視圖的函式
    });
    panel.appendChild(resetButton);

    const autoRotateButton = document.createElement('button');
    autoRotateButton.textContent = '自動旋轉';
    autoRotateButton.addEventListener('click', () => {
        // 切換自動旋轉狀態
    });
    panel.appendChild(autoRotateButton);

    document.body.appendChild(panel);
})();