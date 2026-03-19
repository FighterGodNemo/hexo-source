'use strict';

// Cache-bust local search index without breaking JSON detection.
const fs = require('fs');
const path = require('path');

let cacheInfo = null;

function joinRoot(root, rel) {
  if (root.endsWith('/') || rel.startsWith('/')) return `${root}${rel}`;
  return `${root}/${rel}`;
}

hexo.on('generateBefore', () => {
  const themeConfig = hexo.theme.config || {};
  const searchConfig = hexo.config.search || {};

  const root = hexo.config.root || '/';
  const rawSearchPath = searchConfig.path || 'search.json';
  const searchPath = rawSearchPath.replace(/^\/+/, '');
  const ext = path.extname(searchPath) || '';
  const baseName = ext ? searchPath.slice(0, -ext.length) : searchPath;

  const version = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const versionedPath = `${baseName}.${version}${ext}`;

  cacheInfo = { searchPath, versionedPath };

  themeConfig.search = themeConfig.search || {};
  themeConfig.search.local_search = themeConfig.search.local_search || {};
  themeConfig.search.local_search.CDN = joinRoot(root, versionedPath);
});

hexo.extend.filter.register('after_generate', () => {
  if (!cacheInfo) return;
  const publicDir = hexo.public_dir || path.join(hexo.base_dir, 'public');
  const src = path.join(publicDir, cacheInfo.searchPath);
  const dest = path.join(publicDir, cacheInfo.versionedPath);

  try {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  } catch (err) {
    console.log('[bust-search-cache] copy failed:', err.message);
  }
});
