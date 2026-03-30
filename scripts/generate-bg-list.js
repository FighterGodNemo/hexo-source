const fs = require('fs');
const path = require('path');
const {
  compareNamedEntries,
  isImage,
  normalizeGroupName
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

function buildPreloadCssRule(selector, bg) {
  if (!selector) return '';
  if (!bg) return selector + '{background:none transparent!important;background-image:none!important;}';
  if (/^(#|rgb|hsl|linear-gradient|radial-gradient)/i.test(bg)) {
    return selector + '{background:' + bg + '!important;background-image:none!important;}';
  }
  return selector + '{background-color:transparent!important;background-image:url("' + bg + '")!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;}';
}

function buildBgPreloadScript(defaultBg, items) {
  const postMap = {};
  (items || []).forEach((item) => {
    if (!item || !item.main || !item.post) return;
    postMap[item.main] = item.post;
  });

  return `(function(){
  try {
    var defaultBg = ${JSON.stringify(defaultBg || '')};
    var postBgMap = ${JSON.stringify(postMap)};
    var bg = localStorage.getItem('bgUrl') || defaultBg || '';
    if (!bg) return;
    var postBg = postBgMap[bg] || bg;
    var css = '';
    css += ${JSON.stringify(buildPreloadCssRule('#web_bg', '__BG__'))}.replace('__BG__', bg);
    css += '#page-header{--mark-bg:transparent!important;}';
    css += '#page-header.full_page,#page-header.not-home-page{background:none transparent!important;background-image:none!important;}';
    css += '#page-header.full_page::before,#page-header.full_page::after,#page-header.not-home-page::before,#page-header.not-home-page::after{background:transparent!important;background-image:none!important;opacity:0!important;}';
    css += ${JSON.stringify(buildPreloadCssRule('#page-header.post-bg[data-has-custom-post-top-img="0"]', '__POST_BG__'))}.replace('__POST_BG__', postBg);
    css += '#page-header.post-bg[data-has-custom-post-top-img="0"]::before,#page-header.post-bg[data-has-custom-post-top-img="0"]::after{background:transparent!important;background-image:none!important;opacity:0!important;}';
    var style = document.createElement('style');
    style.id = 'bg-preload-style';
    style.textContent = css;
    document.head.appendChild(style);
  } catch (e) {}
})();\n`;
}

hexo.extend.filter.register('before_generate', () => {
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
        post: ''
      };

      const publicPath = '/img/bg/' + encodeURIComponent(file);
      if (parsed.isPostVariant) {
        if (item.post) {
          warnings.push('[bg] duplicate post background for "' + parsed.key + '": ' + file);
        } else {
          item.post = publicPath;
        }
      } else if (item.main) {
        warnings.push('[bg] duplicate main background for "' + parsed.key + '": ' + file);
      } else {
        item.main = publicPath;
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
      items.push(item);
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

  const bgMap = {
    order: items.map((item) => item.key),
    items,
    byKey: items.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {})
  };

  const listPath = path.join(baseDir, 'source', 'bg-list.json');
  fs.writeFileSync(listPath, JSON.stringify(list, null, 2));

  const mapPath = path.join(baseDir, 'source', 'bg-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(bgMap, null, 2));

  const defaultBg = items[0] && items[0].main ? items[0].main : (list[0] || '/img/index-bg.jpg');
  const preloadPath = path.join(baseDir, 'source', 'js', 'bg-preload.js');
  fs.mkdirSync(path.dirname(preloadPath), { recursive: true });
  fs.writeFileSync(preloadPath, buildBgPreloadScript(defaultBg, items));

  warnings.forEach((warning) => hexo.log.warn(warning));
});
