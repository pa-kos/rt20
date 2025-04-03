const pkg = require('../package.json');
const fs = require('fs-extra');
const path = require('path');

// 简易版 markdown-it 配置
const md = require('markdown-it')({
  html: true,
  linkify: true,
  breaks: true
});

// 清空并重建 public 目录
fs.emptyDirSync(path.join(__dirname, '../public'));

// 读取模板并预处理链接
const template = fs.readFileSync(path.join(__dirname, 'template.md'), 'utf-8');
const processedContent = template.replace(
  /(https?:\/\/[^\s]+)/g, 
  (match) => `
    <div class="link-container">
      <a href="${match}" target="_blank">👉 点击查看</a>
      <span class="url-display">${match}</span>
      <button class="copy-btn" onclick="copyToClipboard('${match}')">📋 复制链接</button>
    </div>
  `
);

// 生成HTML
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>资源下载</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .link-container { margin: 15px 0; }
    .url-display { display: block; word-break: break-all; color: #666; }
    .copy-btn { 
      background: #1a73e8; 
      color: white; 
      border: none; 
      padding: 5px 10px; 
      border-radius: 3px; 
      cursor: pointer; 
    }
  </style>
</head>
<body>
  ${md.render(processedContent)}
  <script>
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => alert('链接已复制！'))
        .catch(err => console.error('复制失败:', err));
    }
  </script>
</body>
</html>`;

// 生成随机文件名
const filename = require('crypto').randomBytes(4).toString('hex') + '.html';
fs.writeFileSync(path.join(__dirname, '../public', filename), html);

console.log(`✅ 生成文件: ${filename}`);
console.log(`🌐 访问URL: https://${pkg.config.domain}/${filename}`);