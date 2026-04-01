const fs = require('fs');
const path = require('path');
const {
  compareNamedEntries,
  isImage,
  normalizeGroupName,
  shouldPreferImageCandidate
} = require('./media-naming');

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (err) {
    return value;
  }
}

function compareBgItems(a, b) {
  return compareNamedEntries(
    { order: a.order, displayName: a.name },
    { order: b.order, displayName: b.name }
  );
}

function createFallbackBgItems(list) {
  return (list || []).map((url, index) => {
    const cleanUrl = String(url || '').split('?')[0].split('#')[0];
    const fileName = safeDecode(path.basename(cleanUrl));
    const parsed = normalizeGroupName(fileName);
    return {
      key: parsed.key || ('fallback-' + index),
      name: parsed.displayName || parsed.key || ('背景' + (index + 1)),
      order: parsed.order != null ? parsed.order : index,
      main: url,
      post: ''
    };
  });
}

function collectBgData(hexo) {
  const baseDir = hexo.base_dir;
  const bgDir = path.join(baseDir, 'source', 'img', 'bg');
  const musicDir = path.join(baseDir, 'source', 'music');
  const buckets = new Map();
  const warnings = [];
  let list = [];
  let items = [];

  if (fs.existsSync(bgDir)) {
    const files = fs.readdirSync(bgDir).filter(isImage);
    files.forEach((file) => {
      const parsed = normalizeGroupName(file);
      if (!parsed.key) {
        warnings.push('[bg] skipped unnamed background file: ' + file);
        return;
      }

      const item = buckets.get(parsed.key) || {
        key: parsed.key,
        name: parsed.displayName || parsed.key,
        order: parsed.order,
        main: '',
        post: '',
        mainSourceName: '',
        postSourceName: ''
      };

      const publicPath = '/img/bg/' + encodeURIComponent(file);
      if (parsed.isPostVariant) {
        return;
      } else if (!item.main || shouldPreferImageCandidate(item.mainSourceName, file)) {
        item.main = publicPath;
        item.mainSourceName = file;
      } else if (item.mainSourceName !== file) {
        warnings.push('[bg] ignored lower-priority main background for "' + parsed.key + '": ' + file);
      }

      if (item.order == null && parsed.order != null) {
        item.order = parsed.order;
      }
      buckets.set(parsed.key, item);
    });

    buckets.forEach((item) => {
      if (!item.main) {
        warnings.push('[bg] post background exists without main background: ' + item.key);
        return;
      }
      items.push({
        key: item.key,
        name: item.name,
        order: item.order,
        main: item.main,
        post: item.post
      });
    });

    items = items.sort(compareBgItems);
    list = items.map((item) => item.main);
  }

  if (!list.length) {
    const themeBg = hexo.theme && hexo.theme.config ? hexo.theme.config.background : null;
    if (Array.isArray(themeBg)) list = themeBg.slice();
    else if (typeof themeBg === 'string' && themeBg) list = [themeBg];
  }

  if (!list.length) list = ['/img/index-bg.jpg'];
  if (!items.length) items = createFallbackBgItems(list);

  if (fs.existsSync(musicDir)) {
    const folderKeys = new Set(
      fs.readdirSync(musicDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => normalizeGroupName(entry.name, { stripExtension: false }).key)
        .filter(Boolean)
    );

    items.forEach((item) => {
      if (!folderKeys.has(item.key)) {
        warnings.push('[bg] no matching music folder for background "' + item.name + '"');
      }
    });
  }

  return {
    list,
    bgMap: {
      order: items.map((item) => item.key),
      items,
      byKey: items.reduce((acc, item) => {
        acc[item.key] = item;
        return acc;
      }, {})
    },
    warnings
  };
}

hexo.extend.generator.register('bg-data', function() {
  const { list, bgMap, warnings } = collectBgData(hexo);
  warnings.forEach((warning) => hexo.log.warn(warning));
  return [
    {
      path: 'bg-list.json',
      data: JSON.stringify(list, null, 2)
    },
    {
      path: 'bg-map.json',
      data: JSON.stringify(bgMap, null, 2)
    }
  ];
});
