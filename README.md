# 台灣發展時間軸視覺化 (1965-2025)

這個專案是一個互動式的視覺化工具，用於展示台灣從1965年到2025年在不同領域的發展歷程。

## 功能特色

- 時間軸視圖：展示各領域發展的時間脈絡
- 關聯圖：呈現不同領域之間的互動關係
- Miro視圖：整合 Miro board 提供更豐富的視覺化呈現
- 互動功能：支援懸停查看詳細資訊
- 響應式設計：適應不同螢幕大小
- 跨頁面導航：輕鬆切換不同視圖模式

## 支援領域

- 科技發展
- 經濟發展
- 政治發展
- 社會發展
- 環境發展
- 教育發展

## 使用技術

- HTML5
- CSS3
- JavaScript
- D3.js
- Miro Embed SDK

## 線上展示

您可以通過以下方式訪問專案：

- GitHub Pages: [https://glen200392.github.io/taiwan-timeline-visualization/](https://glen200392.github.io/taiwan-timeline-visualization/)
- Vercel: [即將推出]


## 本地開發

### 環境需求
- 現代網頁瀏覽器（Chrome, Firefox, Safari, Edge等）
- 基本的網頁伺服器（可選）

### 安裝步驟

1. 克隆專案：
```bash
git clone https://github.com/glen200392/taiwan-timeline-visualization.git
cd taiwan-timeline-visualization
```

2. 運行專案：

方法一：直接開啟
- 使用瀏覽器開啟 `index.html` 檔案

方法二：使用本地伺服器（推薦）
- 使用 Python 建立簡單的 HTTP 伺服器：
```bash
# Python 3.x
python -m http.server 8000
```
- 或使用 Node.js 的 live-server：
```bash
npx live-server
```
- 開啟瀏覽器訪問 `http://localhost:8000`

## 專案結構

```
/
├── index.html          # 時間軸主頁面
├── relationships.html  # 關係圖頁面
├── miro-view.html     # Miro 整合頁面
├── styles.css         # 共用樣式表
├── data.js            # 資料定義
├── timeline.js        # 時間軸邏輯
├── relationship.js    # 關係圖邏輯
└── tooltipManager.js  # 工具提示管理
```

## 開發指南

### 添加新數據
1. 在 `data.js` 中按照既定格式添加新的資料點
2. 確保包含必要欄位：日期、類型、描述等

### 修改視覺效果
1. 樣式修改在 `styles.css` 中進行
2. 時間軸視覺化邏輯在 `timeline.js` 中
3. 關係圖視覺化邏輯在 `relationship.js` 中

### Miro 整合
- Miro board 嵌入在 `miro-view.html` 中
- 使用 Miro Embed SDK 實現互動功能
- 支持自動播放和視圖定位

### Vercel 部署
1. 安裝 Vercel CLI：
```bash
npm install -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署專案：
```bash
npm run deploy
```

或直接使用 Vercel CLI：
```bash
vercel --prod
```

部署完成後，Vercel 會提供一個線上訪問的 URL。

## 資料來源

本專案資料整理自公開資料，包含：
- 政府公開資料
- 歷史文獻記錄
- 新聞報導資料

## 貢獻指南

我們歡迎任何形式的貢獻，包括但不限於：
- 新功能建議
- Bug 報告
- 代碼優化
- 文檔改進
- 數據更新

請遵循以下步驟：
1. Fork 本專案
2. 創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 授權

本專案採用 MIT 授權條款。查看 [LICENSE](LICENSE) 檔案了解更多信息。
