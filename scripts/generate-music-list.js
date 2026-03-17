const fs = require('fs');
const path = require('path');

function isAudio(file) {
  return /\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(file);
}

hexo.extend.filter.register('before_generate', () => {
  const baseDir = hexo.base_dir;
  const musicDir = path.join(baseDir, 'source', 'music');
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
  }

  const files = fs.readdirSync(musicDir).filter(isAudio);
  const list = files.map((file) => {
    const name = path.parse(file).name;
    return {
      name,
      artist: 'FighterGodNemo',
      url: `/music/${encodeURIComponent(file)}`,
      cover: '/img/index-bg.jpg'
    };
  });

  const outPath = path.join(baseDir, 'source', 'music-list.json');
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
});
