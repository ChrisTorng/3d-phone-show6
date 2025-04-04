# GitHub Copilot 開發指南

本文件提供使用 GitHub Copilot 開發此專案時的指導原則。

## 專案概述

3D 手機展示應用程式是一個使用 Three.js 建立的互動式 3D 展示平台。完整的專案規格請參閱 [SPEC.md](../SPEC.md)。

## 程式碼風格指南

### JavaScript/TypeScript

- 使用現代 JavaScript (ES6+) 語法
- 使用有意義的命名，遵循駝峰式命名法（camelCase）
- 適當使用註解解釋複雜邏輯
- 模組化設計，將相關功能分組到各自的檔案中
- 使用非同步函式（async/await）處理非同步操作

### Three.js 相關準則

- 正確管理 Three.js 資源（材質、幾何體）的建立和銷毀
- 使用最佳實踐處理繪製循環和動畫
- 善用 OrbitControls、GLTFLoader 等內建工具
- 注意記憶體管理，避免洩漏

## 效能最佳化

- 使用紋理壓縮和模型最佳化
- 實作級別細節（LOD）技術
- 適當使用 requestAnimationFrame
- 最小化渲染過程中的 DOM 操作

## 命名規範

- 類別名稱：PascalCase（例如 PhoneModel）
- 函式和變數：camelCase（例如 rotatePhone）
- 常數：UPPER_SNAKE_CASE（例如 MAX_ZOOM_LEVEL）
- 檔案名稱：kebab-case（例如 phone-renderer.js）

## 參考資源

- [Three.js 官方文件](https://threejs.org/docs/)
- [WebGL 最佳實踐](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [完整專案規格](../SPEC.md)

請依照這些指導原則開發，確保程式碼品質和專案一致性。
