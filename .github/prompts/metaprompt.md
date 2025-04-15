---
title: 建立有效的 GitHub Copilot 專案規則  
description: 建立結構良好的 GitHub Copilot 專案規則（`.md` 檔案）的完整指南，協助 AI 理解您的程式碼庫與程式風格。  
glob: "**/*.{md}"  
alwaysApply: true  
---

# 建立有效的 GitHub Copilot 專案規則

這條中繼規則提供了建立有效 GitHub Copilot 專案規則的完整指引。這些是儲存在專案的 `.github/prompts` 目錄中的 `.md` 檔案，用來幫助 AI 理解您特定的程式碼庫、慣例與偏好。遵循這些指引可以讓您撰寫出更容易被人類與 AI 理解的規則，進而產生更一致、更有幫助的 AI 回應。

## 什麼是 GitHub Copilot 專案規則？

專案規則是向 GitHub Copilot 的 AI 提供持久且專案特定指令的推薦方式。這些規則與您的程式碼共存（放在 `.github/prompts/` 中），當聊天或其他 AI 功能參考到符合其 `glob` 模式的檔案時，這些規則會自動啟用。

可以將它們想像成您專案的結構化知識庫，讓 AI 學習：

* 程式風格與命名慣例
* 架構模式
* API 使用與介面
* 領域知識
* 您個人或團隊的偏好

## 規則檔案結構

雖然結構彈性很高，但良好組織的規則檔更容易讓人與 AI 理解。建議包含以下元素：

### 1. YAML 前置標頭（極為重要）

**位置：** YAML 前置標頭區塊（`--- ... ---`）**必須**是檔案的絕對第一行內容。任何前導空格、空行或其他字元都可能導致規則無法正確載入。

```yaml
---
title: 規則的簡短標題（例如：React 元件指南）
description: 指南內容（例如：結構化 Functional React Components 的方式）
glob: "[pattern/to/match/files/**/*.{ext}]" # 參見下方範例
alwaysApply: false # 可選：設為 true 代表此規則總是啟用
---
```

* **`title`**：清晰具描述性的標題（建議 5~7 個字）
* **`description`**：簡潔、有語意的說明。建議以「指南...」、「說明...」等語句開頭。這有助於 GitHub Copilot 在多個規則同時符合時自動選擇最相關的。
* **`glob`**：觸發此規則自動啟用的檔案模式。請具體定義。
  * 範例：
    * `src/components/**/_.{tsx,jsx}`（React 元件）
    * `src/server/api/**/_.ts`（後端 API 路由）
    * `_.{json,yaml,yml}`（設定檔）
    * `src/utils/!(test).ts`（工具函式，排除測試）
    * `{package.json,pnpm-lock.yaml}`（特定根目錄檔案）
* **`alwaysApply`**（選填，預設為 `false`）：若為 `true`，此規則會無論上下文內容為何皆被套用。

### 2. 內容區段（建議結構）

使用 Markdown 標題（`##`, `###`）來組織規則內容，邏輯清晰。

#### 引言 / 問題背景

* 簡要說明此規則解決「什麼」問題或定義「什麼」樣式。
* 解釋「為什麼」此模式或慣例對此專案而言重要。
* 提及此規則通常在「何時」適用。

#### 模式說明

* 清楚說明推薦的模式或慣例。
* 搭配清楚的程式碼範例（使用語言指定的區塊）與文字說明。
* 強調關鍵元件、函式或概念。
* 如有需要，連結其他相關規則：`[參見 API 慣例](api-conventions.md)`

#### 實作步驟（如適用）

* 若此規則為某種流程，請以條列方式提供明確步驟。
* 使用有序清單。
* 標明決策點與變化處。

#### 實際範例（強烈建議）

* 使用相對路徑連結目前 repo 中的 _實際程式碼_：`[Button 範例](../src/components/ui/Button.tsx)`
* 簡述為何這是該規則的良好實作。
* 保持範例聚焦於規則本身。

#### 常見錯誤 / 反模式

* 列出常見錯誤或偏離此規則的做法。
* 解釋如何辨識這些問題。
* 建議如何修正或避免。

**注意：** 請依據規則複雜程度調整內容結構。簡單規則可能只需要前置標頭與簡要說明或幾個重點。

## 進階功能

### 檔案參考（`#file:`）

使用 `#file:` 指令可以直接在規則中包含關鍵背景檔案。放置位置建議為前置標頭之後、主內容開始之前。

```markdown
#file:../tsconfig.json
#file:../package.json
#file:./docs/ARCHITECTURE.md
```

* 路徑為從 `.github/prompts/` 起始的相對路徑。
* 每當此規則被啟用時，這些檔案會一併載入 AI 上下文中，提供穩定的背景資訊。
* 建議僅包含必要檔案（設定檔、核心型別、架構概述），以避免上下文過大。

### 程式碼區塊

請務必使用有語言標記的區塊（使用三個反引號的程式碼區塊）來正確呈現與語法高亮，協助 AI 理解：

````markdown
```typescript
function greet(name: string): string {
 // 正確格式的 TypeScript
 return `Hello, ${name}!`;
}
```
````

## 規則啟用與互動方式

* **自動啟用：** 當上下文中包含符合其 `glob` 模式的檔案（如開啟檔案、@ 參考、#codebase 搜尋結果）時，規則會自動啟用。
* **語意選擇：** `description` 欄位可能會協助 GitHub Copilot 在多條符合的規則中挑選最相關的。
* **手動啟用：** 你可以在聊天中透過 `#file:` 顯式指定啟用某條規則，例如：`#file:react-component-guide.md`
* **具體性：** 優先使用具體的 `glob` 模式以避免不必要的規則重疊。若有重疊，實際的選擇邏輯未明確說明，但越清楚的描述與越具體的模式會導致較好的結果。
* **模組化：** 將大型領域（如整個後端）拆成小型、聚焦的規則（例如 `api-routing.md`、`database-models.md`、`auth-middleware.md`），比寫成一條龐大的規則更佳。

## 實務建議

* **從簡開始、逐步迭代：** 不需一開始就完美。先建立針對核心慣例的基本規則，隨著觀察 AI 表現與發現缺口再持續補強。
* **具體但保有彈性：** 提供清楚、可行的指引與具體範例。使用建議語氣（例如：「建議」、「可考慮」、「通常」），除非是必要慣例，才使用強制語氣（例如：「必須」、「總是」）。說明規則背後的原因。
* **聚焦在模式：** 規則應該定義可重複使用的模式、慣例或專案知識，不是用來修正特定 bug。
* **維持規則更新：** 定期檢視規則。若慣例變動或程式碼演進，應更新內容。若規則已經過時，或 AI 已能正確推論時，應*刪除*該規則。
* **信任 LLM（在合理範圍內）：** 雖然規則提供指引，但也讓 LLM 保有部分自由，它通常能從現有程式碼庫中推論出模式，尤其隨著程式規模成長。
* **疑難排解：** 若規則未如預期啟用，請檢查：
  * YAML 前置標頭是否為檔案最前面
  * `glob` 模式是否正確匹配目標檔案
  * `#file` 指令的路徑是否正確
  * `.md` 檔案的編碼是否為標準 UTF-8

## 團隊協作

* **版本控制：** 請將 `.github/prompts` 資料夾納入 Git，以便規則能與程式碼一起共享與版本控管。
* **命名與慣例：** 建立團隊共識的命名方式、結構與更新流程。
* **審查流程：** 對重要規則的變更進行程式碼審查。
* **新手培訓：** 使用這些規則作為「活的文件」，協助新進成員了解專案慣例。
* **共享與個人化：** 如有需要，可建立命名慣例（例如 `_personal-_.md`），並可透過 `.gitignore` 在 `.github/prompts/` 下排除個人規則。

## 完整規則範例

````markdown
---
title: React Functional Component Structure
description: 使用 TypeScript 撰寫的 React 函式元件結構指引，包括 props 定義、狀態管理與 hooks 的使用。
glob: "src/components/**/_.tsx"
alwaysApply: false
---

#file:../../tsconfig.json
#file:../../tailwind.config.js

# React 函式元件結構

## 簡介

此規則定義了本專案中 React 函式元件的標準結構，以確保一致性、可讀性與可維護性。我們使用 TypeScript 提供型別安全，並偏好使用 hooks 來處理狀態與副作用。

## 模式說明

元件應遵循以下順序進行撰寫：

1. `'use client'` 指令（如有需要）
2. 匯入（React、函式庫、內部模組、型別、樣式）
3. Props 介面定義（例如 `ComponentNameProps`）
4. 元件函式定義（例如 `function ComponentName(...)`）
5. 狀態 hooks（`useState`）
6. 其他 hooks（`useMemo`、`useCallback`、`useEffect`、自訂 hooks）
7. 輔助函式（定義於元件外部，或以 memo 化方式定義於內部）
8. `useEffect` 區塊
9. 回傳語句（JSX）

```typescript
'use client' // 僅當需要使用瀏覽器 API 或 hooks（如 useState/useEffect）時才加入

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils'; // 範例內部工具
import { type VariantProps, cva } from 'class-variance-authority';

// 定義 props 介面
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
 isLoading?: boolean;
}

// 定義元件
function Button({ className, variant, size, isLoading, children, ...props }: ButtonProps): React.ReactElement {
 // 狀態 hooks
 const [isMounted, setIsMounted] = useState(false);

 // 其他 hooks
 const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
 if (isLoading) {
 event.preventDefault();
 return;
 }
 props.onClick?.(event);
 }, [isLoading, props.onClick]);

 // 副作用
 useEffect(() => {
 setIsMounted(true);
 }, []);

 // 可加入條件式渲染邏輯

 // 回傳 JSX
 return (
 <button
 className={cn(buttonVariants({ variant, size, className }))}
 disabled={isLoading}
 onClick={handleClick}
 {...props}
 >
 {isLoading ? 'Loading...' : children}
 </button>
 );
}

// Variant 定義範例（可放於同檔案或匯入使用）
const buttonVariants = cva(
 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
 {
 variants: {
 variant: {
 default: 'bg-primary text-primary-foreground hover:bg-primary/90',
 // ... 其他 variants
 },
 size: {
 default: 'h-10 py-2 px-4',
 // ... 其他尺寸
 },
 },
 defaultVariants: {
 variant: 'default',
 size: 'default',
 },
 }
);

export { Button, buttonVariants }; // 建議使用具名匯出
```

## 實作步驟

1. 定義明確的 `interface` 作為 props。
2. 使用標準的 React hooks 管理狀態與副作用。
3. 保持元件專注於單一職責。
4. 使用具名匯出元件。

## 實際範例

* [標準按鈕元件](../src/components/ui/button.tsx)
* [複雜卡片元件](../src/components/ui/card.tsx)

## 常見陷阱

* 使用 `useState` 或 `useEffect` 卻忘記加上 `'use client'`。
* 在元件函式內部直接定義輔助函式而未使用 `useCallback`（可能導致不必要的重新渲染）。
* 元件過於複雜；建議拆分為較小元件。
* 未使用 TypeScript 定義 props 或狀態。
````

## 最小規則模板

用於快速建立新規則的範本：

```markdown
---
title: [規則名稱]
description: 指南內容
glob: "[pattern]"
alwaysApply: false
---

# [規則名稱]

## 引言 / 問題背景

[為什麼需要這條規則，以及解決什麼問題]

## 模式說明

[搭配程式碼範例，解釋這個模式]

## 實際範例

* [程式碼連結](../path/to/example.ts)

## 常見錯誤

* [常見錯誤 1]  
* [常見錯誤 2]
```
