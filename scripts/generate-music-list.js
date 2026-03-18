const fs = require('fs');
const path = require('path');

function isAudio(file) {
  return /\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(file);
}

function cnDigitValue(ch) {
  const map = {
    '\u4e00': 1,
    '\u4e8c': 2,
    '\u4e09': 3,
    '\u56db': 4,
    '\u4e94': 5,
    '\u516d': 6,
    '\u4e03': 7,
    '\u516b': 8,
    '\u4e5d': 9
  };
  return map[ch] || 0;
}

function cnToNumber(cn) {
  if (!cn) return null;
  if (cn === '\u5341') return 10;
  if (cn.length === 1) return cnDigitValue(cn);
  if (cn.length === 2 && cn[0] === '\u5341') return 10 + cnDigitValue(cn[1]);
  if (cn.length === 2 && cn[1] === '\u5341') return cnDigitValue(cn[0]) * 10;
  if (cn.length === 3 && cn[1] === '\u5341') {
    return cnDigitValue(cn[0]) * 10 + cnDigitValue(cn[2]);
  }
  return null;
}

function extractOrder(name) {
  const base = path.parse(name).name;
  const mDigit = base.match(/(\d+)/);
  if (mDigit) return parseInt(mDigit[1], 10);
  const mCn = base.match(/[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341]+/);
  if (mCn) return cnToNumber(mCn[0]);
  return null;
}

function compareByOrder(a, b) {
  const aOrder = extractOrder(a);
  const bOrder = extractOrder(b);
  if (aOrder != null && bOrder != null && aOrder !== bOrder) return aOrder - bOrder;
  if (aOrder != null && bOrder == null) return -1;
  if (aOrder == null && bOrder != null) return 1;
  return a.localeCompare(b);
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
  const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort(compareByOrder);

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
