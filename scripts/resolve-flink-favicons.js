'use strict'

const LINK_TAG_PATTERN = /<link\b[^>]*>/gi
const REL_PATTERN = /\brel\s*=\s*["']([^"']+)["']/i
const HREF_PATTERN = /\bhref\s*=\s*["']([^"']+)["']/i
const iconCache = new Map()

hexo._flinkIconMap = {}
hexo.extend.helper.register('get_flink_icon', link => {
  const iconMap = hexo._flinkIconMap || {}
  return iconMap[link] || null
})

const getIconScore = relValue => {
  const normalized = relValue.toLowerCase().trim()

  if (normalized === 'icon') return 0
  if (normalized === 'shortcut icon') return 1
  if (normalized.includes('icon')) return 2
  if (normalized.includes('apple-touch-icon')) return 3
  return 99
}

const extractIconFromHtml = (html, pageUrl) => {
  const candidates = []
  const linkTags = html.match(LINK_TAG_PATTERN) || []

  for (const tag of linkTags) {
    const relMatch = tag.match(REL_PATTERN)
    const hrefMatch = tag.match(HREF_PATTERN)

    if (!relMatch || !hrefMatch) continue

    const relValue = relMatch[1].toLowerCase()
    if (!relValue.includes('icon')) continue

    try {
      candidates.push({
        score: getIconScore(relValue),
        href: new URL(hrefMatch[1], pageUrl).href
      })
    } catch (error) {
      continue
    }
  }

  candidates.sort((left, right) => left.score - right.score)
  return candidates[0] ? candidates[0].href : null
}

const fetchResolvedIcon = async link => {
  if (iconCache.has(link)) return iconCache.get(link)

  let resolvedIcon = null

  try {
    const response = await fetch(link, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; HexoFlinkIconResolver/1.0)'
      }
    })

    if (response.ok) {
      const html = await response.text()
      resolvedIcon = extractIconFromHtml(html, response.url || link)
    }
  } catch (error) {
    resolvedIcon = null
  }

  iconCache.set(link, resolvedIcon)
  return resolvedIcon
}

hexo.extend.filter.register('before_generate', async () => {
  const data = hexo.locals.get('data')
  const linkGroups = data && data.link
  const iconMap = {}

  if (!Array.isArray(linkGroups)) {
    hexo._flinkIconMap = iconMap
    return
  }

  for (const group of linkGroups) {
    const linkList = group && Array.isArray(group.link_list) ? group.link_list : []

    for (const item of linkList) {
      if (!item || !item.link) continue

      const resolvedIcon = await fetchResolvedIcon(item.link)
      if (resolvedIcon) {
        iconMap[item.link] = resolvedIcon
      }
    }
  }

  hexo._flinkIconMap = iconMap
})
