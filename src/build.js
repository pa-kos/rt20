const pkg = require('../package.json');
const fs = require('fs-extra');
const path = require('path');
const md = require('markdown-it')();
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
  <title>My Page</title>
  <style>
    body { font-family: Arial, max-width: 800px; margin: 0 auto; padding: 20px; }
    a { color: #0070f3; }
  </style>
</head>
<body>
  ${md.render(template)}
  <!-- Build at: ${new Date().toISOString()} -->
</body>
</html>`;

// 生成随机文件名
const filename = chance.string({ length: 8, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }) + '.html';

// 写入文件
fs.writeFileSync(path.join(__dirname, '../public', filename), html);

console.log(`✅ 生成文件: ${filename}`);
console.log(`🌐 访问URL: https://${pkg.config.domain}/${filename}`);