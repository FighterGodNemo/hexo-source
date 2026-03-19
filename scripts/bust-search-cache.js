'use strict';

// Cache-bust local search index without breaking JSON detection.
const path = require('path');

let originalSearchPath = null;

function joinRoot(root, rel) {
  if (root.endsWith('/') || rel.startsWith('/')) return `${root}${rel}`;
  return `${root}/${rel}`;
}

hexo.on('generateBefore', () => {
  const themeConfig = hexo.theme.config || {};
  const searchConfig = hexo.config.search || {};

  const root = hexo.config.root || '/';
  originalSearchPath = searchConfig.path || 'search.json';

  const searchPath = originalSearchPath.replace(/^\/+/, '');
  const ext = path.extname(searchPath) || '';
  const baseName = ext ? searchPath.slice(0, -ext.length) : searchPath;

  const version = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const versionedPath = `${baseName}.${version}${ext}`;

  // Update generator output path so the versioned file is produced directly.
  hexo.config.search = hexo.config.search || {};
  hexo.config.search.path = versionedPath;

  // Ensure theme uses the same versioned path.
  themeConfig.search = themeConfig.search || {};
  themeConfig.search.local_search = themeConfig.search.local_search || {};
  themeConfig.search.local_search.CDN = joinRoot(root, versionedPath);
});

hexo.extend.filter.register('after_generate', () => {
  if (!originalSearchPath) return;
  hexo.config.search = hexo.config.search || {};
  hexo.config.search.path = originalSearchPath;
});
