const fs = require('fs');
const path = require('path');
const {
  cnToNumber,
  compareNamedEntries,
  isAudio,
  isImage,
  normalizeGroupName,
  stripPostSuffix
} = require('./media-naming');

function filterPreferred(files) {
  const lowerSet = new Set(files.map((file) => file.toLowerCase()));
  return files.filter((file) => {
    if (/\.flac$/i.test(file)) {
      const mp3 = file.replace(/\.flac$/i, '.mp3');
      if (lowerSet.has(mp3.toLowerCase())) return false;
    }
    return true;
  });
}

const CN_NUM_RE = '[\\u4e00\\u4e8c\\u4e09\\u56db\\u4e94\\u516d\\u4e03\\u516b\\u4e5d\\u5341]+';
const ORDER_TOKEN_RE = '(?:\\d{1,3}|' + CN_NUM_RE + ')';
const ORDER_CAPTURE_RE = '(' + ORDER_TOKEN_RE + ')';
const LEAD_SEP_RE = '(?:[\\s._-]+)';
const LEAD_RE = new RegExp('^\\s*' + ORDER_TOKEN_RE + LEAD_SEP_RE, 'u');
const LEAD_BRACKET_RE = new RegExp('^\\s*[\\(\\uFF08\\[]\\s*' + ORDER_TOKEN_RE + '\\s*[\\)\\uFF09\\]]\\s*', 'u');
const TRAIL_RE = new RegExp('(?:[\\s._-]+)' + ORDER_TOKEN_RE + '\\s*$', 'u');
const TRAIL_BRACKET_RE = new RegExp('\\s*[\\(\\uFF08\\[]\\s*' + ORDER_TOKEN_RE + '\\s*[\\)\\uFF09\\]]\\s*$', 'u');
const LEAD_CAPTURE_RE = new RegExp('^\\s*' + ORDER_CAPTURE_RE + LEAD_SEP_RE, 'u');
const LEAD_BRACKET_CAPTURE_RE = new RegExp('^\\s*[\\(\\uFF08\\[]\\s*' + ORDER_CAPTURE_RE + '\\s*[\\)\\uFF09\\]]\\s*', 'u');
const TRAIL_CAPTURE_RE = new RegExp('(?:[\\s._-]+)' + ORDER_CAPTURE_RE + '\\s*$', 'u');
const TRAIL_BRACKET_CAPTURE_RE = new RegExp('\\s*[\\(\\uFF08\\[]\\s*' + ORDER_CAPTURE_RE + '\\s*[\\)\\uFF09\\]]\\s*$', 'u');
const TRAIL_CN_CAPTURE_RE = new RegExp('(' + CN_NUM_RE + ')\\s*$', 'u');

function stripOrderToken(name) {
  let out = String(name || '').trim();
  if (!out) return out;
  out = out.replace(LEAD_BRACKET_RE, '');
  out = out.replace(LEAD_RE, '');
  out = out.replace(TRAIL_BRACKET_RE, '');
  out = out.replace(TRAIL_RE, '');
  out = stripPostSuffix(out);
  return out.trim();
}

function extractOrder(name) {
  const base = path.parse(name).name;
  const tokenMatches = [
    base.match(TRAIL_BRACKET_CAPTURE_RE),
    base.match(TRAIL_CAPTURE_RE),
    base.match(LEAD_BRACKET_CAPTURE_RE),
    base.match(LEAD_CAPTURE_RE),
    base.match(TRAIL_CN_CAPTURE_RE)
  ].filter(Boolean);

  for (const match of tokenMatches) {
    const token = match[1];
    if (!token) continue;
    if (/^\d+$/.test(token)) return parseInt(token, 10);
    const cn = cnToNumber(token);
    if (cn != null) return cn;
  }
  return null;
}

function compareByOrder(a, b) {
  const aOrder = extractOrder(a);
  const bOrder = extractOrder(b);
  if (aOrder != null && bOrder != null && aOrder !== bOrder) return aOrder - bOrder;
  if (aOrder != null && bOrder == null) return -1;
  if (aOrder == null && bOrder != null) return 1;
  return a.localeCompare(b, 'zh-Hans-CN');
}

function toTrack(filePath, publicPath) {
  const baseName = path.parse(filePath).name;
  const cleanedBase = stripOrderToken(baseName) || baseName;
  let artist = 'FighterGodNemo';
  let name = cleanedBase;
  const splitBase = cleanedBase.includes(' - ') ? cleanedBase : baseName;
  if (splitBase.includes(' - ')) {
    const parts = splitBase.split(' - ');
    if (parts.length >= 2) {
      artist = parts[0].trim() || artist;
      name = parts.slice(1).join(' - ').trim() || name;
    }
  }
  artist = stripOrderToken(artist) || artist;
  name = stripOrderToken(name) || name;
  return {
    name,
    artist,
    url: publicPath,
    cover: '/img/index-bg.jpg'
  };
}

function readAudioFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((file) => isAudio(file));
  return filterPreferred(files)
    .sort(compareByOrder)
    .map((file) => ({
      file,
      fullPath: path.join(dir, file)
    }));
}

hexo.extend.filter.register('before_generate', () => {
  const baseDir = hexo.base_dir;
  const musicDir = path.join(baseDir, 'source', 'music');
  const bgDir = path.join(baseDir, 'source', 'img', 'bg');
  const warnings = [];

  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
  }

  const entries = fs.readdirSync(musicDir, { withFileTypes: true });
  const rootFiles = filterPreferred(entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isAudio))
    .sort(compareByOrder);
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => normalizeGroupName(entry.name, { stripExtension: false }))
    .sort(compareNamedEntries);

  const map = {
    order: [],
    labels: {},
    sources: {},
    folders: {},
    all: []
  };

  const bgKeys = new Set();
  if (fs.existsSync(bgDir)) {
    fs.readdirSync(bgDir)
      .filter(isImage)
      .map((file) => normalizeGroupName(file))
      .filter((item) => item.key && !item.isPostVariant)
      .forEach((item) => bgKeys.add(item.key));
  }

  const rootList = rootFiles.map((file) => {
    const url = '/music/' + encodeURIComponent(file);
    return toTrack(file, url);
  });
  if (rootList.length) {
    map.folders.default = rootList;
    map.order.push('default');
    map.labels.default = '默认歌单';
    map.sources.default = 'default';
    map.all = map.all.concat(rootList);
  }

  folders.forEach((folder) => {
    if (!folder.key) {
      warnings.push('[music] skipped unnamed folder: ' + folder.sourceName);
      return;
    }

    const abs = path.join(musicDir, folder.sourceName);
    const items = readAudioFiles(abs).map(({ file }) => {
      const url = '/music/' + encodeURIComponent(folder.sourceName) + '/' + encodeURIComponent(file);
      return toTrack(file, url);
    });
    if (!items.length) return;

    if (!map.folders[folder.key]) {
      map.folders[folder.key] = [];
      map.order.push(folder.key);
      map.labels[folder.key] = folder.displayName || folder.key;
      map.sources[folder.key] = folder.sourceName;
    } else {
      warnings.push('[music] merged duplicate folder key "' + folder.key + '" from ' + folder.sourceName);
    }

    map.folders[folder.key] = map.folders[folder.key].concat(items);
    map.all = map.all.concat(items);

    if (!bgKeys.has(folder.key) && folder.key !== 'default') {
      warnings.push('[music] no matching main background for music folder "' + folder.sourceName + '"');
    }
  });

  const listPath = path.join(baseDir, 'source', 'music-list.json');
  fs.writeFileSync(listPath, JSON.stringify(map.all, null, 2));

  const mapPath = path.join(baseDir, 'source', 'music-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));

  warnings.forEach((warning) => hexo.log.warn(warning));
});
