#!/bin/sh

# 构建
npm run build

# 获取最新HTML文件
HTML_FILE=$(ls public/*.html | head -n 1)
FILENAME=$(basename "$HTML_FILE")

# 显示信息
echo "✅ 生成文件: $FILENAME"
echo "🌐 访问URL: https://$(node -p 'require("./package.json").config.domain')/$FILENAME"

# Git提交
git add -A
git commit -m "Auto-deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "🚀 部署完成！Cloudflare 更新约需1-3分钟"