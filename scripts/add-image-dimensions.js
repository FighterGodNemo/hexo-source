const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const IMAGE_RE = /\.(png|jpe?g|gif|webp|bmp)$/i;
const sizeCache = new Map();

function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch (_) {
    return str;
  }
}

function splitUrl(rawUrl) {
  const match = String(rawUrl || '').match(/^([^?#]*)([?#].*)?$/);
  return match ? match[1] : '';
}

function isFile(absPath) {
  try {
    return fs.statSync(absPath).isFile();
  } catch (_) {
    return false;
  }
}

function resolvePostDir(data) {
  if (data.permalink) {
    try {
      return new URL(data.permalink).pathname
        .replace(/index\.html$/i, '')
        .replace(/^\/+|\/+$/g, '');
    } catch (_) {
      // fall through
    }
  }
  if (data.path) {
    return String(data.path).replace(/index\.html$/i, '').replace(/^\/+|\/+$/g, '');
  }
  return '';
}

function getSize(absPath) {
  if (sizeCache.has(absPath)) return sizeCache.get(absPath);

  let size = null;
  try {
    const result = sizeOf(absPath);
    if (result && result.width && result.height) {
      size = { width: result.width, height: result.height };
    }
  } catch (_) {
    size = null;
  }

  sizeCache.set(absPath, size);
  return size;
}

function resolveImagePath(rawSrc, context) {
  if (!rawSrc || /^(https?:|data:|javascript:|\/\/)/i.test(rawSrc)) return null;

  const pathname = splitUrl(rawSrc);
  if (!pathname) return null;

  const decoded = safeDecode(pathname);

  if (context.postDir) {
    const prefix = `/${context.postDir}/`;
    if (decoded.startsWith(prefix)) {
      const candidate = path.join(context.assetFolderAbs, decoded.slice(prefix.length));
      if (isFile(candidate)) return candidate;
    }
  }

  if (decoded.startsWith('/')) {
    const candidate = path.join(hexo.source_dir, decoded.replace(/^\/+/, ''));
    if (isFile(candidate)) return candidate;
  } else {
    const candidate = path.resolve(context.sourceDirAbs, decoded);
    if (isFile(candidate)) return candidate;

    const assetCandidate = path.resolve(context.assetFolderAbs, decoded.replace(/^\.\//, ''));
    if (isFile(assetCandidate)) return assetCandidate;
  }

  return null;
}

function addDimensions(html, data) {
  if (!html || !data || !data.source) return html;

  const sourceAbs = path.resolve(hexo.source_dir, data.source);
  const postName = path.basename(sourceAbs, path.extname(sourceAbs));
  const context = {
    postDir: resolvePostDir(data),
    assetFolderAbs: path.join(path.dirname(sourceAbs), postName),
    sourceDirAbs: path.dirname(sourceAbs)
  };

  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const hasWidth = /\bwidth\s*=/i.test(tag);
    const hasHeight = /\bheight\s*=/i.test(tag);
    if (hasWidth && hasHeight) return tag;

    const srcMatch = tag.match(/\bsrc\s*=\s*("|')([^"']+)\1/i);
    if (!srcMatch) return tag;

    const imagePath = resolveImagePath(srcMatch[2], context);
    if (!imagePath || !IMAGE_RE.test(imagePath)) return tag;

    const size = getSize(imagePath);
    if (!size) return tag;

    let out = tag;
    if (!hasWidth) out = out.replace(/<img\b/i, `<img width="${size.width}"`);
    if (!hasHeight) out = out.replace(/<img\b/i, `<img height="${size.height}"`);
    return out;
  });
}

hexo.extend.filter.register(
  'after_post_render',
  function (data) {
    if (!data || !data.content) return data;
    data.content = addDimensions(data.content, data);
    return data;
  },
  20
);

hexo.extend.filter.register('before_generate', function () {
  sizeCache.clear();
});
