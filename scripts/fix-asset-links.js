const path = require('path');

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripPostPrefixInMarkdown(content, postName) {
  if (!content) return content;
  const names = Array.from(new Set([postName, encodeURIComponent(postName)]));
  let out = content;

  for (const name of names) {
    const escaped = escapeRegExp(name);
    // Support optional angle brackets around destinations: ](<postName/xxx>)
    const mdLinkRe = new RegExp(`\\]\\(<?${escaped}\\/([^\\)]+?)>?\\)`, 'g');
    out = out.replace(mdLinkRe, ']($1)');

    const htmlImgRe = new RegExp(`(<img[^>]+src=["'])${escaped}\\/([^"']+)(["'])`, 'gi');
    out = out.replace(htmlImgRe, '$1$2$3');
  }

  return out;
}

function fixHtmlAssetLinks(html, postName, postDir) {
  if (!html || !postDir) return html;
  const encodedPostName = encodeURIComponent(postName);
  const names = Array.from(new Set([postName, encodedPostName]));
  let out = html;

  // Ensure postDir has trailing slash
  let base = postDir.replace(/\\/g, '/');
  if (!base.endsWith('/')) base += '/';

  for (const name of names) {
    const escaped = escapeRegExp(name);
    const re = new RegExp(`(src|href)=("|')\\/${escaped}\\/([^"']+)\\2`, 'g');
    out = out.replace(re, `$1=$2/${base}$3$2`);
  }

  return out;
}

function resolvePostDirFromData(data) {
  if (!data) return '';
  if (data.permalink) {
    try {
      const url = new URL(data.permalink);
      return url.pathname.replace(/^\/+/, '');
    } catch (_) {
      // fall through
    }
  }
  if (data.path) return data.path;
  return '';
}

// 1) Before render: strip "postName/" in markdown so Hexo post_asset_folder can resolve
hexo.extend.filter.register('before_post_render', function (data) {
  if (!data || !data.source || !data.content) return data;
  const postName = path.basename(data.source, path.extname(data.source));
  if (!postName) return data;
  data.content = stripPostPrefixInMarkdown(data.content, postName);
  return data;
});

// 2) After render: fix any remaining root-level asset links in HTML
hexo.extend.filter.register('after_post_render', function (data) {
  if (!data || !data.source || !data.content) return data;
  const postName = path.basename(data.source, path.extname(data.source));
  if (!postName) return data;

  const postDir = resolvePostDirFromData(data).replace(/index\.html$/i, '');
  data.content = fixHtmlAssetLinks(data.content, postName, postDir);
  return data;
});
