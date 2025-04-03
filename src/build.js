const pkg = require('../package.json');
const fs = require('fs-extra');
const path = require('path');

// 配置 markdown-it 允许 HTML 标签
const md = require('markdown-it')({
  html: true,         // 关键：允许 HTML 标签
  linkify: true,
  breaks: true
});

// 清空并重建 public 目录
fs.emptyDirSync(path.join(__dirname, '../public'));

// 读取模板
const template = fs.readFileSync(path.join(__dirname, 'template.md'), 'utf-8');

// 处理内容：将纯URL转换为带按钮的HTML块
const processContent = (text) => {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    (url) => `
<div class="link-container">
  <a href="${url}" target="_blank">👉 点击查看微云PDF</a>
  <span class="url-display">${url}</span>
  <button class="copy-btn" onclick="copyToClipboard('${url.replace(/'/g, "\\'")}')">📋 复制链接</button>
</div>
    `
  );
};

// 生成HTML
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>资源下载</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    .link-container {
      margin: 15px 0;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 5px;
    }
    .url-display {
      display: block;
      word-break: break-all;
      font-family: monospace;
      font-size: 14px;
      color: #666;
      margin: 5px 0;
    }
    .copy-btn {
      background: #1a73e8;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
    }
    .divider {
      margin: 20px 0;
      text-align: center;
      color: #999;
    }
  </style>
</head>
<body>
  ${md.render(processContent(template))}
  <script>
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => alert('链接已复制！'))
        .catch(err => {
          // 兼容旧浏览器
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          alert('链接已复制！');
        });
    }
  </script>
</body>
</html>`;

// 生成随机文件名
const filename = require('crypto').randomBytes(4).toString('hex') + '.html';
fs.writeFileSync(path.join(__dirname, '../public', filename), html);

console.log(`✅ 生成文件: ${filename}`);
console.log(`🌐 访问URL: https://${pkg.config.domain}/${filename}`);