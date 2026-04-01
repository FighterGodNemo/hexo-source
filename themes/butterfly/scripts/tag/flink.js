/**
 * flink
 */

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)
const getErrorFlinkImg = () => {
  const errorImg = hexo.theme && hexo.theme.config && hexo.theme.config.error_img
    ? hexo.theme.config.error_img.flink
    : '/img/friend_404.gif'

  return urlFor(errorImg)
}

const getFlinkIcon = (link, flinkIconMap = {}) => {
  const resolvedAvatar = flinkIconMap[link.link] || link.resolved_avatar || link.avatar
  const errorFlinkImg = getErrorFlinkImg()

  try {
    const siteIcon = resolvedAvatar || new URL(link.link).origin + '/favicon.ico'
    return {
      src: siteIcon,
      fallback: link.avatar && link.avatar !== siteIcon ? link.avatar : errorFlinkImg
    }
  } catch (error) {
    return {
      src: resolvedAvatar || errorFlinkImg,
      fallback: errorFlinkImg
    }
  }
}

const flinkFn = (args, content) => {
  const data = hexo.render.renderSync({ text: content, engine: 'yaml' })
  const flinkIconMap = hexo._flinkIconMap || {}
  let result = ''

  data.forEach(item => {
    const className = item.class_name ? `<div class="flink-name">${item.class_name}</div>` : ''
    const classDesc = item.class_desc ? `<div class="flink-desc">${item.class_desc}</div>` : ''

    const listResult = item.link_list.map(link => {
      const { src, fallback } = getFlinkIcon(link, flinkIconMap)
      return `
      <div class="flink-list-item">
        <a href="${link.link}" title="${link.name}" target="_blank">
          <div class="flink-item-icon">
            <img class="no-lightbox" src="${src}" onerror='this.onerror=null;this.src=${JSON.stringify(fallback)}' alt="${link.name}" />
          </div>
          <div class="flink-item-name">${link.name}</div>
          <div class="flink-item-desc" title="${link.descr}">${link.descr}</div>
        </a>
      </div>`
    }).join('')

    result += `${className}${classDesc}<div class="flink-list">${listResult}</div>`
  })

  return `<div class="flink">${result}</div>`
}

hexo.extend.tag.register('flink', flinkFn, { ends: true })
