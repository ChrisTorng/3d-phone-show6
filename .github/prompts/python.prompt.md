---
title: Python 程式碼慣例
description: 3D 手機展示專案中 Python 程式碼的風格、結構與最佳實踐指南
glob: "**/*.py"
alwaysApply: false
---

# Python 程式碼慣例與最佳實踐

## 引言

本規則定義了 3D 手機展示專案中 Python 程式碼的風格、結構與最佳實踐。遵循這些指引可確保程式碼的可讀性、可維護性與效能。Python 在本專案中主要用於資料處理、工具腳本與可能的伺服器端功能。

## 程式碼風格

### 命名慣例

- **類別名稱**：使用 PascalCase（例如 `PhoneDataProcessor`）
- **函式與變數**：使用 snake_case（例如 `process_model_data`）
- **常數**：使用 UPPER_SNAKE_CASE（例如 `MAX_POLYGON_COUNT`）
- **私有成員**：使用單底線前綴（例如 `_internal_method`）
- **模組名稱**：使用簡短、全小寫的名稱（例如 `model_utils.py`）

### 格式化

- 遵循 PEP 8 風格指南
- 使用 4 個空格進行縮排（不使用 Tab）
- 每行最大長度為 88 個字元（Black 格式化工具預設值）
- 使用空行分隔函式與類別定義（兩行）
- 在運算子周圍與逗號之後使用空格

```python
# 正確的格式範例
def calculate_polygon_reduction(model_data, target_percent=0.5, preserve_uv=True):
    """
    將模型多邊形數量減少到指定百分比。
    
    Args:
        model_data: 模型資料字典
        target_percent: 目標保留百分比 (0.0-1.0)
        preserve_uv: 是否保留 UV 映射
        
    Returns:
        減面後的模型資料字典
    """
    if target_percent <= 0 or target_percent > 1:
        raise ValueError("目標百分比必須在 0-1 之間")
    
    original_count = model_data["polygon_count"]
    target_count = int(original_count * target_percent)
    
    # 實作減面演算法
    reduced_data = _perform_reduction(model_data, target_count, preserve_uv)
    
    return reduced_data
```

## 程式碼架構

### 模組組織

- 相關函式應分組到專用模組中
- 每個模組應該專注於單一職責
- 模組應該有明確的公開介面（在 `__all__` 中定義）

```python
# 在 model_optimizer.py 中
"""模型最佳化工具集，用於減少多邊形數量與最佳化紋理。"""

__all__ = ["optimize_model", "reduce_polygons", "compress_textures"]

import numpy as np
from PIL import Image

def optimize_model(model_path, output_path, polygon_reduction=0.5, texture_quality=0.8):
    """對 3D 模型進行全面最佳化處理。"""
    # 實作程式碼
    pass

def reduce_polygons(model_data, target_ratio=0.5):
    """減少模型的多邊形數量。"""
    # 實作程式碼
    pass

def compress_textures(texture_paths, quality=0.8, convert_to_webp=True):
    """壓縮模型紋理並可選轉換為 WebP 格式。"""
    # 實作程式碼
    pass

# 私有輔助函式
def _calculate_mesh_importance(vertices, faces):
    """計算網格中每個面的重要性指標。"""
    # 實作程式碼
    pass
```

### 類別設計

- 使用類別封裝相關資料與功能
- 遵循單一職責原則
- 提供清晰的公開介面
- 使用 docstring 說明類別與方法的功能

```python
class ModelProcessor:
    """處理 3D 模型檔案的工具類別。"""
    
    def __init__(self, model_path, config=None):
        """
        初始化模型處理器。
        
        Args:
            model_path: 模型檔案路徑
            config: 處理設定字典
        """
        self.model_path = model_path
        self.config = config or {}
        self._model_data = None
        self._is_loaded = False
    
    def load(self):
        """載入模型到記憶體。"""
        # 實作載入邏輯
        self._model_data = self._load_model_file(self.model_path)
        self._is_loaded = True
        return self
    
    def optimize(self, target_quality=0.8):
        """最佳化模型以提高渲染效能。"""
        if not self._is_loaded:
            raise RuntimeError("必須先呼叫 load() 方法")
        
        # 實作最佳化邏輯
        return self
    
    def export(self, output_path, format="glb"):
        """匯出處理後的模型。"""
        if not self._is_loaded:
            raise RuntimeError("必須先呼叫 load() 方法")
        
        # 實作匯出邏輯
        return output_path
    
    def _load_model_file(self, path):
        """私有方法：載入並解析模型檔案。"""
        # 實作載入邏輯
        pass
```

## 錯誤處理

- 使用具體的例外類別而非通用 `Exception`
- 在適當的抽象層級捕捉例外
- 提供有意義的錯誤訊息
- 使用 `try/except/finally` 確保資源正確釋放

```python
def process_phone_model(model_path, output_path):
    """處理手機模型檔案並輸出最佳化版本。"""
    try:
        with open(model_path, 'rb') as f:
            model_data = parse_model_file(f)
        
        optimized_data = optimize_model(model_data)
        
        with open(output_path, 'wb') as f:
            write_model_file(optimized_data, f)
            
        return True
    except FileNotFoundError:
        logger.error(f"找不到模型檔案：{model_path}")
        raise ModelProcessingError(f"找不到模型檔案：{model_path}")
    except ParseError as e:
        logger.error(f"模型解析錯誤：{e}")
        raise ModelProcessingError(f"模型解析錯誤：{e}")
    except Exception as e:
        logger.exception(f"模型處理過程中發生未預期錯誤")
        raise ModelProcessingError(f"處理失敗：{str(e)}")
```

## 效能考量

- 使用適當的資料結構（字典查詢、集合操作）
- 避免不必要的深度複製
- 針對大型資料集使用生成器與迭代器
- 考慮使用 NumPy/SciPy 進行數值計算
- 關鍵效能路徑考慮使用 Cython 或多處理

```python
# 效能優化範例
def optimize_large_model(model_data):
    """處理大型模型資料的效能優化範例。"""
    # 使用生成器進行記憶體效率處理
    def vertex_processor(vertices):
        for vertex in vertices:
            # 進行處理
            yield process_vertex(vertex)
    
    # 使用 NumPy 進行批次處理
    import numpy as np
    vertices = np.array(model_data["vertices"])
    transformed = vertices * scaling_matrix
    
    # 平行處理
    from concurrent.futures import ProcessPoolExecutor
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_chunk, chunks(model_data["faces"], 1000)))
    
    return combine_results(results)
```

## 測試實踐

- 每個模組應有對應的測試模組
- 使用 pytest 作為測試框架
- 單元測試應關注單一功能單元
- 使用模擬物件隔離外部相依性
- 包含正向與邊緣案例測試

```python
# 在 test_model_optimizer.py 中
import pytest
from model_optimizer import reduce_polygons

def test_reduce_polygons_normal_case():
    """測試正常案例下的多邊形減少。"""
    test_model = {
        "polygon_count": 1000,
        "vertices": [...],  # 測試資料
        "faces": [...],     # 測試資料
    }
    
    result = reduce_polygons(test_model, target_ratio=0.5)
    
    assert result["polygon_count"] == 500
    assert len(result["faces"]) == 500
    # 更多斷言...

def test_reduce_polygons_invalid_ratio():
    """測試無效的減少比例。"""
    test_model = {
        "polygon_count": 1000,
        "vertices": [...],  # 測試資料
        "faces": [...],     # 測試資料
    }
    
    with pytest.raises(ValueError):
        reduce_polygons(test_model, target_ratio=2.0)
```

## 文件與註解

- 為所有公開函式、類別與模組編寫 docstring
- 使用 Google 風格的 docstring 格式
- 複雜邏輯應包含說明註解
- 保持註解與程式碼同步更新

```python
def convert_model_format(input_path, output_path, target_format="glb"):
    """
    將 3D 模型從一種格式轉換為另一種格式。
    
    支援的格式轉換：
    - OBJ -> GLB
    - FBX -> GLB
    - GLTF -> GLB
    
    Args:
        input_path (str): 輸入模型的檔案路徑
        output_path (str): 輸出模型的儲存路徑
        target_format (str, optional): 目標格式，預設為 "glb"
        
    Returns:
        bool: 轉換是否成功
        
    Raises:
        ValueError: 如果指定了不支援的格式
        FileNotFoundError: 如果輸入檔案不存在
    """
    # 實作轉換邏輯
```

## 常見錯誤與反模式

### 避免的做法

❌ **全域變數濫用**
```python
# 不良做法
MODELS = {}  # 全域字典

def load_model(name):
    global MODELS
    MODELS[name] = {"loaded": True}

def process_model(name):
    if name in MODELS:
        # 使用全域狀態
```

✅ **正確做法**
```python
# 較好的做法
class ModelRegistry:
    def __init__(self):
        self._models = {}
    
    def load_model(self, name):
        self._models[name] = {"loaded": True}
    
    def process_model(self, name):
        if name in self._models:
            # 使用封裝的狀態

# 使用單例或依賴注入
registry = ModelRegistry()
```

### 其他反模式

- 過度使用巢狀函式與複雜條件判斷
- 忽略函式回傳值型別一致性
- 使用過於籠統的例外捕捉
- 手動字串拼接而非使用格式化字串
- 忽略資源釋放與關閉檔案

## 專案特定實踐

### 模型處理工作流程

```python
# 模型處理工作流程範例
def process_phone_models(models_dir, output_dir):
    """處理所有手機模型的批次處理流程。"""
    # 設定記錄
    setup_logging()
    
    # 建立輸出目錄
    os.makedirs(output_dir, exist_ok=True)
    
    # 掃描模型
    model_files = glob.glob(os.path.join(models_dir, "*.glb"))
    logger.info(f"發現 {len(model_files)} 個模型檔案")
    
    # 處理每個模型
    results = []
    for model_file in model_files:
        model_name = os.path.basename(model_file).split('.')[0]
        output_file = os.path.join(output_dir, f"{model_name}_optimized.glb")
        
        try:
            # 處理模型
            processor = ModelProcessor(model_file)
            processor.load()
            processor.optimize()
            processor.export(output_file)
            
            # 記錄結果
            results.append({
                "name": model_name,
                "status": "成功",
                "output": output_file
            })
            logger.info(f"成功處理模型：{model_name}")
        except Exception as e:
            results.append({
                "name": model_name,
                "status": "失敗",
                "error": str(e)
            })
            logger.error(f"處理模型失敗：{model_name}, 錯誤：{e}")
    
    # 輸出摘要報告
    generate_report(results, os.path.join(output_dir, "processing_report.json"))
    
    return results
```

### 資料處理慣例

```python
# 資料處理慣例範例
def extract_phone_metadata(model_file):
    """從模型檔案中提取手機中繼資料。"""
    metadata = {}
    
    # 載入模型
    model = load_glb_model(model_file)
    
    # 提取基本資訊
    metadata["name"] = extract_model_name(model)
    metadata["dimensions"] = extract_dimensions(model)
    metadata["polygon_count"] = count_polygons(model)
    
    # 提取自訂屬性
    custom_props = extract_custom_properties(model)
    if "phoneSpecs" in custom_props:
        metadata["specs"] = parse_phone_specs(custom_props["phoneSpecs"])
    
    # 提取零件資訊
    metadata["parts"] = []
    for part in extract_model_parts(model):
        metadata["parts"].append({
            "id": part.id,
            "name": part.name,
            "material": extract_material_info(part.material)
        })
    
    return metadata
```

## 整合與相容性

### 與 JavaScript 前端整合

- 使用結構化 JSON 進行資料交換
- 確保命名慣例一致性
- 使用明確的 API 契約
- 提供適當的錯誤回應

```python
# Python 後端 API 範例
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/models', methods=['GET'])
def list_models():
    """列出所有可用的手機模型。"""
    try:
        models = ModelRegistry().get_all_models()
        return jsonify({
            "success": True,
            "models": models
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/models/<model_id>/optimize', methods=['POST'])
def optimize_model(model_id):
    """最佳化特定手機模型。"""
    try:
        params = request.json or {}
        quality = params.get('quality', 0.8)
        
        result = ModelProcessor().optimize_model(model_id, quality)
        
        return jsonify({
            "success": True,
            "result": result
        })
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
```

## 參考資源

- [PEP 8 -- Python 程式碼風格指南](https://www.python.org/dev/peps/pep-0008/)
- [Google Python 風格指南](https://google.github.io/styleguide/pyguide.html)
- [Effective Python: 90 Specific Ways to Write Better Python](https://effectivepython.com/)
- [Python 3D 模型處理庫](https://github.com/mikedh/trimesh)
