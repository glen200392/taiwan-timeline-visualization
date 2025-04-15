# 停止可能正在運行的 Node 進程
taskkill /F /IM node.exe

# 清除緩存
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# 重新安裝依賴
npm install

# 初始化 Tailwind
npx tailwindcss init -p

# 啟動開發服務器
npm run dev