const fs = require('fs');
const path = require('path');

function loadSharp() {
  try {
    return require('sharp');
  } catch (error) {
    const wrapped = new Error('缺少可选依赖 "sharp"，请先运行 `npm install sharp` 再执行背景图优化。');
    wrapped.cause = error;
    throw wrapped;
  }
}

async function optimizeImage(sharp, inputPath, outputPath, options = {}) {
  try {
    const originalSize = fs.statSync(inputPath).size;
    console.log(`🔄 优化 ${path.basename(inputPath)} (${Math.round(originalSize / 1024)}KB)`);

    await sharp(inputPath)
      .rotate()
      .resize(options.maxWidth || 2560, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: options.quality || 82,
        effort: 5
      })
      .toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    console.log(`✅ 优化完成: ${Math.round(newSize / 1024)}KB (${Math.round((1 - newSize / originalSize) * 100)}% 减少)`);
    return true;
  } catch (error) {
    console.error(`❌ 优化失败 ${path.basename(inputPath)}: ${error.message}`);
    return false;
  }
}

async function main() {
  const sharp = loadSharp();
  const bgDir = path.join(__dirname, '..', 'source', 'img', 'bg');
  const files = fs.readdirSync(bgDir);

  console.log('🚀 开始优化背景图片...\n');

  for (const file of files) {
    const inputPath = path.join(bgDir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isFile() && /\.(png|jpe?g)$/i.test(file)) {
      const outputPath = path.join(bgDir, file.replace(/\.(png|jpe?g)$/i, '.webp'));
      await optimizeImage(sharp, inputPath, outputPath);
    }
  }

  console.log('\n✅ 所有图片优化完成！');
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  main,
  optimizeImage
};
