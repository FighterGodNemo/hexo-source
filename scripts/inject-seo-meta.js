function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function asList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value.toArray === 'function') return value.toArray();
  if (typeof value === 'string') {
    return value.split(/[,，]/).map(item => item.trim()).filter(Boolean);
  }
  return [];
}

function collectKeywords(page, config) {
  const own = asList(page && page.keywords).map(item => item.name || item);
  if (own.length) return own.join(',');

  const tags = asList(page && page.tags).map(item => item.name || item);
  if (tags.length) return tags.join(',');

  return asList(config.keywords).map(item => item.name || item).join(',');
}

hexo.extend.filter.register('after_render:html', function (html, locals) {
  if (!html || !locals || !locals.page) return html;

  const config = locals.config || hexo.config;

  if (locals.page.type === '404') {
    const siteTitle = config.title || '';
    const pageTitle = '页面未找到';
    const title = siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle;
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(title)}</title>`);
  }

  if (/<meta[^>]+name=["']keywords["']/i.test(html)) return html;

  const keywords = collectKeywords(locals.page, config);
  if (!keywords) return html;

  const tag = `<meta name="keywords" content="${escapeAttr(keywords)}">`;
  return html.replace(/<\/head>/i, match => `${tag}${match}`);
});
