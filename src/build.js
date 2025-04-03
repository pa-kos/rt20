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

// 读取模板并智能处理
const template = fs.readFileSync(path.join(__dirname, 'template.md'), 'utf-8');

// 改进的链接处理逻辑
const processContent = (text) => {
  // 保留原始段落结构
  const lines = text.split('\n');
  let inLinkSection = false;
  
  return lines.map(line => {
    // 跳过分隔线处理
    if (line.startsWith('————————')) {
      inLinkSection = !inLinkSection;
      return line;
    }

    // 仅处理包含http的普通文本行
    if (line.match(/https?:\/\//) && !line.match(/\[.*\]\(http/)) {
      const url = line.match(/https?:\/\/[^\s]+/)[0];
      const beforeText = line.split(url)[0];
      
      return `
        ${beforeText}
        <div class="link-container">
          <a href="${url}" target="_blank">👉 点击查看</a>
          <span class="url-display">${url}</span>
          <button class="copy-btn" onclick="copyToClipboard('${url}')">📋 复制链接</button>
        </div>
      `;
    }
    return line;
  }).join('\n');
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
      font-size: 16px;
      color: #333;
    }
    .link-container {
      margin: 10px 0;
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
      font-size: 14px;
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
        .then(() => alert('链接已复制到剪贴板！'))
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