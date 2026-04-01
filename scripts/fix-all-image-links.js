const fs = require('fs');
const path = require('path');

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fixImageLinksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, path.extname(filePath));
  const dirName = path.basename(path.dirname(filePath));
  
  let newContent = content;
  
  // 1. 修复格式: ![](文件夹名/图片.png) -> ![](图片.png)
  const patterns = [
    // Markdown 链接格式
    new RegExp(`\\]\\(<?${escapeRegExp(fileName)}\\/([^\\)]+?)>?\\)`, 'g'),
    new RegExp(`\\]\\(<?${escapeRegExp(dirName)}\\/([^\\)]+?)>?\\)`, 'g'),
    // HTML img 标签格式
    new RegExp(`(<img[^>]+src=["'])${escapeRegExp(fileName)}\\/([^"']+)(["'])`, 'gi'),
    new RegExp(`(<img[^>]+src=["'])${escapeRegExp(dirName)}\\/([^"']+)(["'])`, 'gi'),
  ];
  
  for (const pattern of patterns) {
    newContent = newContent.replace(pattern, (match, ...args) => {
      if (match.startsWith('](')) {
        return `](${args[0]})`;
      } else {
        return `${args[0]}${args[1]}${args[2]}`;
      }
    });
  }
  
  // 2. 修复相对路径格式 (../../文件夹名/图片.png)
  // 这种通常是跨文章引用，我们需要检查是否有对应的资源文件夹
  const relativePathPattern = /\]\((?:\.\.\/)+([^\/]+)\/([^\)]+)\)/g;
  newContent = newContent.replace(relativePathPattern, (match, folderName, imageName) => {
    // 对于跨文章引用，暂时保持原样，但提醒用户
    console.log(`  发现跨文章引用: ${match} in ${filePath}`);
    return match;
  });
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ 修复了: ${filePath}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixedCount += processDirectory(fullPath);
    } else if (file.endsWith('.md')) {
      if (fixImageLinksInFile(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

function main() {
  console.log('🚀 开始修复博客文章图片链接...\n');
  const postsDir = path.join(__dirname, '..', 'source', '_posts');
  const totalFixed = processDirectory(postsDir);

  console.log(`\n✅ 修复完成！共修复了 ${totalFixed} 个文件。`);
}

if (require.main === module) {
  main();
}

module.exports = {
  fixImageLinksInFile,
  processDirectory,
  main
};
