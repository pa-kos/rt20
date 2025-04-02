#!/bin/bash

# 打印开始信息
echo "🚀 开始部署流程..."

# 1. 构建静态文件
echo "🛠️ 正在生成HTML文件..."
npm run build

# 2. Git操作
echo "📦 正在提交变更..."
git add -A
git commit -m "Auto-deploy $(date +'%Y-%m-%d %H:%M:%S')" || echo "🟡 无新变更可提交"
git push origin main

# 3. 输出结果
echo "✅ 部署完成！"
echo "⏳ Cloudflare Pages 通常需要 1-3 分钟完成自动部署"