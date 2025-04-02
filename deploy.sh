#!/bin/bash
npm run build

# 使用 package.json 中的域名
DOMAIN=$(node -p "require('./package.json').config.domain")
NEW_FILE=$(ls public/*.html | head -n 1)
echo "🌐 正确访问URL: https://${DOMAIN}/${NEW_FILE##*/}"

git add -A
git commit -m "Auto-deploy $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main