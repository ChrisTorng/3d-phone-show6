---
title: 3D 手機展示應用程式開發指南
description: Three.js 3D 手機展示平台的程式碼慣例、架構模式與最佳實踐說明
glob: "**/*.{js,html,css,json,md}"
alwaysApply: true
---

#file:../SPEC.md

# 3D 手機展示應用程式開發指南

## 引言與專案概述

本專案是一個使用 Three.js 建立的互動式 3D 手機展示平台，旨在提供使用者流暢的 3D 模型觀看與互動體驗。此指南定義了本專案的程式碼慣例、架構模式與開發最佳實踐，以確保程式碼品質與一致性。

本專案主要功能包括：
- 3D 手機模型展示與互動控制（旋轉、縮放、平移）
- 多種手機型號切換功能
- 零件高亮與資訊顯示
- 動畫展示（自動旋轉、部件分解視圖等）

## 核心技術與架構

專案採用模組化設計，將不同功能依責任分離到各自的目錄與檔案中：

```
/
├── assets/              # 靜態資源（模型、紋理、圖示）
├── src/
│   ├── core/            # 核心 3D 渲染引擎
│   ├── controls/        # 使用者輸入處理
│   ├── animation/       # 動畫系統
│   ├── ui/              # 使用者介面元素
│   └── utils/           # 工具函式
├── styles/              # CSS 樣式表
├── index.html           # 主 HTML 檔案
└── main.js              # 應用程式入口點
```

技術堆疊：
- 前端：原生 JavaScript (ES6+)
- 3D 渲染：Three.js
- 動畫效果：Tween.js
- 互動控制：OrbitControls、DragControls
- 使用者介面：HTML5、CSS3

## 專案特定指南

若有需要產出下列相關檔案，再參考以下提示檔:

- CSS: #file:prompts/css.prompt.md
- HTML: #file:prompts/html.prompt.md
- JavaScript: #file:prompts/javascript.prompt.md
- Python: #file:prompts/python.prompt.md

若有後續要求功能異動，請一併更新:

- 規格檔 #file:../SPEC.md
- 說明檔 #file:../README.md

## JavaScript/TypeScript 程式碼慣例

### 命名慣例

- **類別**：使用 PascalCase（例如 `PhoneModel`）
- **函式與變數**：使用 camelCase（例如 `rotatePhone`）
- **常數**：使用 UPPER_SNAKE_CASE（例如 `MAX_ZOOM_LEVEL`）
- **檔案名稱**：使用 kebab-case（例如 `phone-renderer.js`）

### 程式風格

```javascript
// 類別定義範例
class PhoneModel {
  // 私有屬性用 # 前綴（若支援）或 _ 前綴（次佳選擇）
  #model = null;
  #isLoaded = false;
  
  // 常數使用靜態屬性
  static MAX_ROTATION_SPEED = 0.1;
  
  constructor(modelPath) {
    this.modelPath = modelPath;
  }
  
  // 公開方法使用清晰的動詞開頭命名
  async loadModel() {
    // 非同步操作使用 async/await
    try {
      this.#model = await loadGLTF(this.modelPath);
      this.#isLoaded = true;
      return this.#model;
    } catch (error) {
      console.error('無法載入模型:', error);
      throw error;
    }
  }
  
  // 方法應具備明確的功能與回傳值
  rotateModel(angle, axis) {
    if (!this.#isLoaded) return false;
    
    // 實作旋轉邏輯
    this.#model.rotation[axis] += angle;
    return true;
  }
}
```

### 程式碼組織原則

1. **模組化**：相關功能應分組到各自的模組中
2. **單一職責**：每個類別/函式應專注於單一功能
3. **明確命名**：類別/函式名稱應清楚表達其功能
4. **註解風格**：
   - 使用 JSDoc 風格註解來說明複雜函式
   - 註解應解釋「為什麼」，而非「如何做」
5. **錯誤處理**：使用 try/catch 處理可能的例外

## Three.js 相關實踐指南

### 資源管理

```javascript
// 資源管理範例
class ResourceManager {
  #loader = new THREE.GLTFLoader();
  #cache = new Map();
  
  async loadModel(path) {
    // 檢查快取避免重複載入
    if (this.#cache.has(path)) {
      return this.#cache.get(path);
    }
    
    // 載入與快取
    const model = await this.#loader.loadAsync(path);
    this.#cache.set(path, model);
    
    return model;
  }
  
  // 釋放資源防止記憶體洩漏
  disposeResources(path = null) {
    if (path) {
      const resource = this.#cache.get(path);
      if (resource) {
        this.#disposeResource(resource);
        this.#cache.delete(path);
      }
    } else {
      // 釋放所有資源
      this.#cache.forEach(resource => this.#disposeResource(resource));
      this.#cache.clear();
    }
  }
  
  #disposeResource(resource) {
    // 釋放紋理、幾何體等
    if (resource.geometry) resource.geometry.dispose();
    if (resource.material) {
      if (Array.isArray(resource.material)) {
        resource.material.forEach(mat => this.#disposeMaterial(mat));
      } else {
        this.#disposeMaterial(resource.material);
      }
    }
  }
  
  #disposeMaterial(material) {
    Object.keys(material).forEach(prop => {
      if (material[prop] && typeof material[prop].dispose === 'function') {
        material[prop].dispose();
      }
    });
    material.dispose();
  }
}
```

### 渲染週期

```javascript
// 渲染週期範例
class Renderer {
  constructor(scene, camera) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.scene = scene;
    this.camera = camera;
    this.isRunning = false;
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }
  
  stop() {
    this.isRunning = false;
  }
  
  animate() {
    if (!this.isRunning) return;
    
    // 使用 requestAnimationFrame 進行渲染
    requestAnimationFrame(() => this.animate());
    
    // 執行更新邏輯
    this.update();
    
    // 進行渲染
    this.renderer.render(this.scene, this.camera);
  }
  
  update() {
    // 更新場景中物件的邏輯
    // 子類別應重寫此方法
  }
  
  resize(width, height) {
    // 回應視窗調整大小
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
```

## 效能最佳化指南

### 模型最佳化

1. **使用 LOD（Level of Detail）**：依據鏡頭距離顯示不同細節層級的模型
2. **減少多邊形數量**：使用已最佳化的低面數模型
3. **合理使用燈光**：優先使用烘焙紋理而非即時燈光

### 渲染效能

1. **限制渲染頻率**：當場景靜止時暫停渲染
2. **管理視野範圍**：僅渲染視野內物件
3. **材質共享**：相似物件應共享材質
4. **異步載入**：大型資源使用異步載入避免阻塞

```javascript
// 效能最佳化範例
class PerformanceOptimizer {
  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;
    this.lastActive = Date.now();
    this.isStatic = false;
  }
  
  update() {
    const now = Date.now();
    
    // 檢查是否有互動活動
    if (this.hasUserActivity()) {
      this.lastActive = now;
      this.isStatic = false;
    } else if (now - this.lastActive > 5000) {
      // 5秒無互動則判定為靜態
      this.isStatic = true;
    }
    
    // 靜態時降低渲染品質
    if (this.isStatic) {
      this.renderer.setPixelRatio(window.devicePixelRatio * 0.7);
    } else {
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    
    return !this.isStatic; // 回傳是否需要繼續高頻率渲染
  }
  
  hasUserActivity() {
    // 實作檢測使用者互動邏輯
    return false; // 子類別應重寫此方法
  }
}
```

## HTML/CSS 最佳實踐

### HTML 結構

```html
<!-- HTML 結構範例 -->
<div class="phone-viewer">
  <!-- 3D 畫布 -->
  <canvas id="phone-canvas"></canvas>
  
  <!-- 控制面板 -->
  <div class="control-panel">
    <button data-action="rotate">
      <img src="assets/icons/rotate.svg" alt="旋轉">
    </button>
    <button data-action="zoom">
      <img src="assets/icons/zoom.svg" alt="縮放">
    </button>
  </div>
  
  <!-- 資訊卡 -->
  <div class="info-card" id="phone-info">
    <h3 class="info-title">iPhone 16 Pro Max</h3>
    <div class="info-content">
      <!-- 動態內容 -->
    </div>
  </div>
</div>
```

### CSS 慣例

- 使用 BEM 方法論命名 CSS 類別
- 使用 CSS 變數定義主題與顏色
- 使用 flexbox 與 grid 進行排版
- 使用媒體查詢確保回應式設計

```css
/* CSS 範例 */
:root {
  --primary-color: #2563eb;
  --secondary-color: #f59e0b;
  --text-color: #171717;
  --background-color: #fafafa;
}

.phone-viewer {
  position: relative;
  width: 100%;
  height: 100vh;
}

.phone-viewer__canvas {
  width: 100%;
  height: 100%;
}

.control-panel {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
}

/* 回應式設計 */
@media (max-width: 768px) {
  .control-panel {
    bottom: 1rem;
    right: 1rem;
    flex-direction: column;
  }
}
```

## 實際運用範例

### 載入與初始化模型

```javascript
// 從 src/core/phone-model.js
class PhoneModel {
  // ... 其他程式碼

  // 正確的模型初始化方式
  async initialize() {
    const phoneData = await fetch('assets/phones-data.json').then(res => res.json());
    this.availableModels = phoneData.models;
    
    // 預載入第一個模型
    await this.loadModel(this.availableModels[0].path);
    
    // 設定初始位置與旋轉
    this.resetPosition();
    
    return this;
  }
  
  // ... 其他程式碼
}
```

### 互動控制實作

```javascript
// 從 src/controls/touch-controls.js
class TouchControls {
  constructor(camera, renderer, domElement) {
    this.camera = camera;
    this.renderer = renderer;
    this.domElement = domElement;
    
    // 綁定事件處理器
    this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
  }
  
  onTouchStart(event) {
    // 實作觸控開始處理邏輯
  }
  
  onTouchMove(event) {
    // 實作觸控移動處理邏輯
  }
  
  onTouchEnd(event) {
    // 實作觸控結束處理邏輯
  }
  
  // 釋放事件監聽器，避免記憶體洩漏
  dispose() {
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
  }
}
```

## 常見錯誤與反模式

### 記憶體洩漏

❌ **錯誤做法**：
```javascript
function setupScene() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // 未釋放資源
}
```

✅ **正確做法**：
```javascript
function setupScene() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  return function cleanup() {
    // 釋放資源
    scene.remove(cube);
    geometry.dispose();
    material.dispose();
  };
}
```

### 渲染週期錯誤

❌ **錯誤做法**：
```javascript
function animate() {
  // 重複創建請求
  requestAnimationFrame(animate);
  
  // 每幀進行複雜計算
  updatePhysics();
  
  renderer.render(scene, camera);
}
```

✅ **正確做法**：
```javascript
let animationId = null;

function animate() {
  animationId = requestAnimationFrame(animate);
  
  // 只在需要時計算
  if (needsUpdate) {
    updatePhysics();
  }
  
  renderer.render(scene, camera);
}

// 提供停止方法
function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
```

## 參考資源

- [Three.js 官方文件](https://threejs.org/docs/)
- [WebGL 最佳實踐](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [3D 模型最佳化指南](https://threejs.org/manual/#en/optimize-lots-of-objects)
