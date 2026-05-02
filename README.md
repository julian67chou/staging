# 伊萊診所 — 實驗版 (Block Studio Style)

> 以動態特效為核心、品牌思維為起點的網站體驗

## 風格來源

設計靈感來自 [版塊 Block Studio](https://blockstudio.tw/) 的設計語言：
- **動態特效為核心** — Loading screen、hero 滑鼠視差、scroll reveal 動畫
- **品牌思維延伸** — Medical Teal + Amber Gold 配色，從品牌 DNA 出發
- **乾淨但有力** — 留白與視覺衝擊的平衡

## 與原版的差異

| 項目 | 原版 (elai) | 實驗版 (elai-experiment) |
|------|------------|------------------------|
| 風格 | 日系侘寂 × 黃金比例 | Block Studio 動態特效 |
| 動畫 | 淡入 | Loading screen + 視差 + scroll reveal |
| 配色 | 墨黑 + 和紙白 + 金 | Medical Teal + Deep Teal + Amber Gold |
| 互動 | 靜態 | Hero mouse parallax, hover 動畫 |
| 技術 | HTML + CSS | HTML + CSS + Vanilla JS Motion Engine |

## 檔案結構

```
├── index.html          # 主頁面
├── css/style.css       # 設計系統 + 動畫
├── js/main.js          # Motion Engine
└── assets/             # 圖片資源（僅 4 張核心圖片）
```

## 部署

- GitHub: https://github.com/julian67chou/elai-experiment
- Vercel: 自動部署

> ⚠️ 原始 `/workspace/elai-clinic/` 完全未動
