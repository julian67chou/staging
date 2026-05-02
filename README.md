# 伊萊診所 — 實驗版 v2（日濟安風格改造）

> 以 jittsean.com（日濟安中醫診所）的版面結構為基礎，套用伊萊診所 Logo 配色系統

## 風格來源

版面結構參考 [日濟安中醫診所](https://jittsean.com/) 的 Elementor 佈局：
- **經典診所網站結構** — 滿版 Hero → 關於診所 → 服務項目網格 → 醫師介紹 → 門診時間表 → 聯絡資訊
- **配色源自伊萊診所 Logo** — Deep Teal `#104557` + Amber Gold `#e69430` + White `#f2f2f2`
- **乾淨、信任感、專業** — 以傳統診所網站的易讀性與信任感為核心

## 與其他版本的差異

| 項目 | 正式站 (elai) | 實驗站 v1 (elai-experiment) | 實驗站 v2 (staging) |
|------|--------------|-----------------------------|---------------------|
| 風格 | 日系侘寂 × 黃金比例 | Block Studio 動態特效 | 日濟安經典診所佈局 |
| 配色 | 墨黑 + 和紙白 + 金 | Medical Teal + Amber Gold | Logo 深青 + 琥珀金 + 白 |
| 動畫 | 淡入 | Loading + 視差 + scroll reveal | Loading + 淡入 reveal |
| 結構 | 自訂 | 動態優先 | 經典診所網格佈局 |

## 檔案結構

```
├── index.html          # 主頁面
├── css/style.css       # 設計系統
├── js/main.js          # 互動邏輯
└── assets/             # 圖片資源
```

## 部署

- GitHub: https://github.com/julian67chou/staging
- Vercel: https://staging-azure.vercel.app

> ⚠️ 原始 `/workspace/elai-clinic/` 完全未動
