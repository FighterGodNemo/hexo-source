'use strict';

// Cache-bust local search index so deleted/updated posts don't linger in results.
hexo.on('generateBefore', () => {
  const themeConfig = hexo.theme.config || {};
  const searchConfig = hexo.config.search || {};

  const root = (hexo.config.root || '/');
  const searchPath = (searchConfig.path || 'search.json');
  const base = root.endsWith('/') || searchPath.startsWith('/')
    ? `${root}${searchPath}`
    : `${root}/${searchPath}`;

  const version = new Date().toISOString().replace(/[-:.TZ]/g, '');

  themeConfig.search = themeConfig.search || {};
  themeConfig.search.local_search = themeConfig.search.local_search || {};
  themeConfig.search.local_search.CDN = `${base}?v=${version}`;
});
