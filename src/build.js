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

// 生成完整HTML
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- 关键：响应式viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${pkg.name}</title>
  <style>
    /* 基础样式 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.8;
      max-width: 100%;
      margin: 0;
      padding: 15px;
      font-size: 18px;
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

    /* 标题样式 */
    h1 {
      font-size: 22px;
      color: #1a73e8;
      margin-bottom: 20px;
      text-align: center;
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
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 16px;
      margin: 10px 0;
      cursor: pointer;
      text-align: center;
      -webkit-tap-highlight-color: transparent;
    }

    /* 分隔线 */
    .divider {
      border-top: 1px dashed #ddd;
      margin: 25px 0;
    }

    /* 手机端优化 */
    @media (max-width: 480px) {
      body {
        font-size: 20px;
        padding: 10px;
      }
      .copy-btn {
        display: block;
        width: 100%;
        padding: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>😊 ${pkg.name}</h1>
    ${md.render(template)}
  </div>

  <script>
    // 增强版复制功能
    function copyToClipboard(text) {
      const success = () => {
        const alertBox = document.createElement('div');
        alertBox.style = 'position:fixed; top:20px; left:0; right:0; background:#4CAF50; color:white; padding:12px; text-align:center; z-index:9999;';
        alertBox.textContent = '✓ 链接已复制到剪贴板！';
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 2000);
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