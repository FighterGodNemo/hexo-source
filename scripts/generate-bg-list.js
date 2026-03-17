const fs = require('fs');
const path = require('path');

function isImage(file) {
  return /\.(png|jpe?g|webp|gif)$/i.test(file);
}

hexo.extend.filter.register('before_generate', () => {
  const baseDir = hexo.base_dir;
  const bgDir = path.join(baseDir, 'source', 'img', 'bg');
  let list = [];

  if (fs.existsSync(bgDir)) {
    const files = fs.readdirSync(bgDir).filter(isImage).sort();
    list = files.map((f) => `/img/bg/${encodeURIComponent(f)}`);
  }

  if (!list.length) {
    const themeBg = hexo.theme?.config?.background;
    if (Array.isArray(themeBg)) list = themeBg;
    else if (typeof themeBg === 'string' && themeBg) list = [themeBg];
  }

  if (!list.length) list = ['/img/index-bg.jpg'];

  const outPath = path.join(baseDir, 'source', 'bg-list.json');
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
});
