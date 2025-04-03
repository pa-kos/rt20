const pkg = require('../package.json');
const fs = require('fs-extra');
const path = require('path');
const md = require('markdown-it')({
  html: true,         // 允许HTML标签
  linkify: true,      // 自动转换链接
  breaks: true        // 保留换行符
});
const Chance = require('chance');
const chance = new Chance();

// 清空并重建 public 目录
fs.emptyDirSync(path.join(__dirname, '../public'));

// 读取模板
const template = fs.readFileSync(path.join(__dirname, 'template.md'), 'utf-8');

// 生成HTML
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- 响应式视口设置 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${pkg.name}</title>
  <style>
    /* 基础样式 - 适中字体比例 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      max-width: 100%;
      margin: 0;
      padding: 15px;
      font-size: 16px; /* 适中基础字体大小 */
      color: #333;
      background: #f9f9f9;
      -webkit-text-size-adjust: 100%;
    }

    /* 容器约束 */
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 15px;
    }

    /* 链接样式 */
    a {
      color: #1a73e8;
      text-decoration: none;
      word-break: break-all;
    }
    a:hover {
      text-decoration: underline;
    }

    /* 按钮样式 */
    .copy-btn {
      display: inline-block;
      background: #1a73e8;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px; /* 适中按钮字体 */
      margin: 8px 0;
      cursor: pointer;
      text-align: center;
      -webkit-tap-highlight-color: transparent;
    }

    /* 分隔线 */
    .divider {
      border-top: 1px solid #eee;
      margin: 20px 0;
    }

    /* 手机端优化 */
    @media (max-width: 480px) {
      body {
        font-size: 15px; /* 手机端稍小 */
        padding: 12px;
      }
      .copy-btn {
        display: block;
        width: 100%;
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${md.render(template)}
  </div>

  <script>
    // 复制功能
    function copyToClipboard(text) {
      const success = () => {
        const alertBox = document.createElement('div');
        alertBox.style = 'position:fixed; top:20px; left:0; right:0; background:#4CAF50; color:white; padding:10px; text-align:center; z-index:9999; font-size:14px;';
        alertBox.textContent = '✓ 链接已复制！';
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 1500);
      };

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(success).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }

      function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        success();
      }
    }
  </script>
</body>
</html>`;

// 生成随机文件名
const filename = chance.string({ 
  length: 8, 
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' 
}) + '.html';

// 写入文件
fs.writeFileSync(path.join(__dirname, '../public', filename), html);

console.log(`✅ 生成文件: ${filename}`);
console.log(`🌐 访问URL: https://${pkg.config.domain}/${filename}`);