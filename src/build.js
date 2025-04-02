const fs = require('fs-extra');
const path = require('path');
const md = require('markdown-it')();
const Chance = require('chance');
const chance = new Chance();

// 确保 public 目录存在
fs.ensureDirSync(path.join(__dirname, '../public'));

// 读取模板文件
const templatePath = path.join(__dirname, 'template.md');
const templateContent = fs.readFileSync(templatePath, 'utf-8');

// 转换为 HTML
const htmlContent = md.render(templateContent);

// 生成完整的 HTML 文档
const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        a { color: #0070f3; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

// 生成 8 位随机文件名（大小写字母加数字）
const filename = chance.string({ length: 8, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }) + '.html';

// 写入文件
const outputPath = path.join(__dirname, '../public', filename);
fs.writeFileSync(outputPath, fullHtml);

console.log(`File generated: ${filename}`);
console.log(`URL will be: https://rt20.pages.dev/${filename}`);
