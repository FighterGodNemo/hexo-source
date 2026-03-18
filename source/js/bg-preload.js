(function(){
  try {
    var bg = localStorage.getItem('bgUrl') || '';
    if (!bg) return;
    var isColor = /^(#|rgb|hsl|linear-gradient|radial-gradient)/i.test(bg);
    var css = isColor
      ? '#web_bg{background:'+bg+'!important;background-image:none!important;}'
      : '#web_bg{background-image:url("'+bg+'")!important;}';
    css += '#page-header{background:transparent!important;background-image:none!important;--mark-bg:transparent!important;}';
    css += '#page-header::before{background:transparent!important;opacity:0!important;}';
    css += '#page-header::after{background:transparent!important;opacity:0!important;}';
    css += '#page-header.post-bg,#page-header.not-home-page,#page-header.full_page{background:transparent!important;background-image:none!important;}';
    css += '#page-header.post-bg::before,#page-header.post-bg::after,#page-header.not-home-page::before,#page-header.not-home-page::after,#page-header.full_page::before,#page-header.full_page::after{background:transparent!important;background-image:none!important;opacity:0!important;}';
    var style = document.createElement('style');
    style.id = 'bg-preload-style';
    style.textContent = css;
    document.head.appendChild(style);
  } catch (e) {}
})();
