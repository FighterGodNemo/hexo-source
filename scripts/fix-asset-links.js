const fs = require('fs');
const path = require('path');

let assetFolderMapCache = null;
let sharedPostAssetsToCopy = new Map();

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizePosix(str) {
  return String(str || '').replace(/\\/g, '/');
}

function trimSlashes(str) {
  return normalizePosix(str).replace(/^\/+|\/+$/g, '');
}

function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch (_) {
    return str;
  }
}

function splitUrl(rawUrl) {
  const match = String(rawUrl || '').match(/^([^?#]*)([?#].*)?$/);
  return {
    pathname: match ? match[1] : '',
    suffix: match && match[2] ? match[2] : ''
  };
}

function buildPublicPath(baseDir, relativePath) {
  const baseParts = trimSlashes(baseDir).split('/').filter(Boolean);
  const relParts = trimSlashes(relativePath)
    .split('/')
    .filter(Boolean)
    .map(part => encodeURIComponent(part));

  return `/${baseParts.concat(relParts).join('/')}`;
}

function getPostsSourceDirAbs() {
  return path.resolve(hexo.source_dir, '_posts');
}

function resolveSharedPostAsset(absPath) {
  const relativePath = normalizePosix(path.relative(getPostsSourceDirAbs(), absPath));
  if (!relativePath || relativePath.startsWith('..')) return null;

  return {
    relativePath,
    publicUrl: buildPublicPath('', relativePath)
  };
}

function isFilePath(absPath) {
  try {
    return fs.statSync(absPath).isFile();
  } catch (_) {
    return false;
  }
}

function stripPostPrefixInMarkdown(content, postName) {
  if (!content) return content;

  const names = Array.from(new Set([postName, encodeURIComponent(postName)]));
  let out = content;

  for (const name of names) {
    const escaped = escapeRegExp(name);
    const mdLinkRe = new RegExp(`\\]\\(<?${escaped}\\/([^\\)]+?)>?\\)`, 'g');
    out = out.replace(mdLinkRe, ']($1)');

    const htmlImgRe = new RegExp(`(<img[^>]+src=["'])${escaped}\\/([^"']+)(["'])`, 'gi');
    out = out.replace(htmlImgRe, '$1$2$3');
  }

  return out;
}

function resolvePostDirFromData(data) {
  if (!data) return '';

  if (data.permalink) {
    try {
      const url = new URL(data.permalink);
      return trimSlashes(url.pathname.replace(/index\.html$/i, ''));
    } catch (_) {
      // fall through
    }
  }

  if (data.path) {
    return trimSlashes(String(data.path).replace(/index\.html$/i, ''));
  }

  return '';
}

function buildAssetFolderMap() {
  if (assetFolderMapCache) return assetFolderMapCache;

  const postsModel = hexo.locals && hexo.locals.get ? hexo.locals.get('posts') : null;
  const posts = postsModel && typeof postsModel.toArray === 'function' ? postsModel.toArray() : [];

  assetFolderMapCache = posts
    .map(post => {
      if (!post || !post.source) return null;

      const sourceAbs = path.resolve(hexo.source_dir, post.source);
      const postName = path.basename(sourceAbs, path.extname(sourceAbs));
      const publicDir = resolvePostDirFromData(post);

      if (!postName || !publicDir) return null;

      return {
        assetFolderAbs: path.normalize(path.join(path.dirname(sourceAbs), postName)),
        publicDir
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.assetFolderAbs.length - a.assetFolderAbs.length);

  return assetFolderMapCache;
}

function mapSourceAssetToPublicUrl(absPath) {
  if (!absPath || !isFilePath(absPath)) return null;

  const normalizedPath = path.normalize(absPath);

  for (const entry of buildAssetFolderMap()) {
    if (
      normalizedPath === entry.assetFolderAbs ||
      normalizedPath.startsWith(`${entry.assetFolderAbs}${path.sep}`)
    ) {
      const relativePath = normalizePosix(path.relative(entry.assetFolderAbs, normalizedPath));
      if (!relativePath || relativePath.startsWith('..')) return null;
      return buildPublicPath(entry.publicDir, relativePath);
    }
  }

  const sharedPostAsset = resolveSharedPostAsset(normalizedPath);
  if (sharedPostAsset) {
    sharedPostAssetsToCopy.set(normalizedPath, sharedPostAsset.relativePath);
    return sharedPostAsset.publicUrl;
  }

  return null;
}

function fixHtmlAssetLinks(html, postName, postDir) {
  if (!html || !postDir) return html;

  const encodedPostName = encodeURIComponent(postName);
  const names = Array.from(new Set([postName, encodedPostName]));
  let out = html;

  for (const name of names) {
    const escaped = escapeRegExp(name);
    const re = new RegExp(`(src|href)=("|')\\/${escaped}\\/([^"']+)\\2`, 'g');
    out = out.replace(re, (_, attr, quote, relativePath) => {
      return `${attr}=${quote}${buildPublicPath(postDir, safeDecode(relativePath))}${quote}`;
    });
  }

  return out;
}

function rewriteAssetUrl(rawUrl, context) {
  if (!rawUrl || /^(https?:|mailto:|data:|javascript:|#|\/\/)/i.test(rawUrl)) {
    return rawUrl;
  }

  const { pathname, suffix } = splitUrl(rawUrl);
  if (!pathname) return rawUrl;

  const decodedPath = safeDecode(pathname);

  const tryCurrentPostAsset = relativePath => {
    if (!relativePath) return null;
    const normalizedRelativePath = relativePath.replace(/^\.\//, '');
    if (!normalizedRelativePath || /^\.\.\//.test(normalizedRelativePath)) return null;

    const candidate = path.join(context.currentAssetFolderAbs, normalizedRelativePath);
    if (!fs.existsSync(candidate)) return null;
    return buildPublicPath(context.currentPostDir, normalizedRelativePath);
  };

  const tryResolvedSourceAsset = relativePath => {
    if (!relativePath || !/^(?:\.\.\/|\.\/)/.test(relativePath)) return null;
    const candidate = path.resolve(context.currentSourceDirAbs, relativePath);
    return mapSourceAssetToPublicUrl(candidate);
  };

  let rewritten = null;

  if (pathname.startsWith('/')) {
    const strippedPath = decodedPath.replace(/^\/+/, '');
    rewritten = tryCurrentPostAsset(strippedPath) || tryResolvedSourceAsset(strippedPath);
  } else {
    rewritten = tryCurrentPostAsset(decodedPath) || tryResolvedSourceAsset(decodedPath);
  }

  return rewritten ? `${rewritten}${suffix}` : rawUrl;
}

function rewriteHtmlAssetUrls(html, data) {
  if (!html || !data || !data.source) return html;

  const sourceAbs = path.resolve(hexo.source_dir, data.source);
  const postName = path.basename(sourceAbs, path.extname(sourceAbs));
  const currentPostDir = resolvePostDirFromData(data);
  if (!postName || !currentPostDir) return html;

  const context = {
    currentAssetFolderAbs: path.join(path.dirname(sourceAbs), postName),
    currentPostDir,
    currentSourceDirAbs: path.dirname(sourceAbs)
  };

  let out = fixHtmlAssetLinks(html, postName, currentPostDir);

  out = out.replace(/(src|href)=("|')([^"']+)\2/g, (match, attr, quote, url) => {
    const rewritten = rewriteAssetUrl(url, context);
    return rewritten === url ? match : `${attr}=${quote}${rewritten}${quote}`;
  });

  return out;
}

hexo.extend.filter.register('before_generate', function () {
  assetFolderMapCache = null;
  sharedPostAssetsToCopy = new Map();
});

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data || !data.source || !data.content) return data;

  const postName = path.basename(data.source, path.extname(data.source));
  if (!postName) return data;

  data.content = stripPostPrefixInMarkdown(data.content, postName);
  return data;
});

hexo.extend.filter.register('after_post_render', function (data) {
  if (!data || !data.source || !data.content) return data;

  data.content = rewriteHtmlAssetUrls(data.content, data);
  return data;
});

hexo.extend.filter.register('after_generate', function () {
  if (!sharedPostAssetsToCopy.size) return;

  for (const [sourceAbs, relativePath] of sharedPostAssetsToCopy.entries()) {
    const targetAbs = path.join(hexo.public_dir, ...normalizePosix(relativePath).split('/'));
    fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
    fs.copyFileSync(sourceAbs, targetAbs);
  }
});
