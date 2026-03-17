const fs = require('fs');
const path = require('path');

function isAudio(file) {
  return /\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(file);
}

function toTrack(filePath, publicPath) {
  const baseName = path.parse(filePath).name;
  let artist = 'FighterGodNemo';
  let name = baseName;
  if (baseName.includes(' - ')) {
    const parts = baseName.split(' - ');
    if (parts.length >= 2) {
      artist = parts[0].trim() || artist;
      name = parts.slice(1).join(' - ').trim() || name;
    }
  }
  return {
    name,
    artist,
    url: publicPath,
    cover: '/img/index-bg.jpg'
  };
}

function readAudioFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => isAudio(file))
    .map((file) => ({
      file,
      fullPath: path.join(dir, file)
    }));
}

hexo.extend.filter.register('before_generate', () => {
  const baseDir = hexo.base_dir;
  const musicDir = path.join(baseDir, 'source', 'music');
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
  }

  const entries = fs.readdirSync(musicDir, { withFileTypes: true });
  const rootFiles = entries.filter((e) => e.isFile()).map((e) => e.name);
  const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

  const map = {
    order: [],
    folders: {},
    all: []
  };

  const rootList = rootFiles.filter(isAudio).map((file) => {
    const url = `/music/${encodeURIComponent(file)}`;
    return toTrack(file, url);
  });
  if (rootList.length) {
    map.folders['default'] = rootList;
    map.order.push('default');
    map.all = map.all.concat(rootList);
  }

  folders.forEach((folder) => {
    const abs = path.join(musicDir, folder);
    const items = readAudioFiles(abs).map(({ file }) => {
      const url = `/music/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
      return toTrack(file, url);
    });
    if (items.length) {
      map.folders[folder] = items;
      map.order.push(folder);
      map.all = map.all.concat(items);
    }
  });

  const listPath = path.join(baseDir, 'source', 'music-list.json');
  fs.writeFileSync(listPath, JSON.stringify(map.all, null, 2));

  const mapPath = path.join(baseDir, 'source', 'music-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
});
