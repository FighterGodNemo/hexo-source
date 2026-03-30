(function(){
  try {
    var defaultBg = "/img/bg/%E8%83%8C%E6%99%AF%E4%B8%80.png";
    var postBgMap = {"/img/bg/%E8%83%8C%E6%99%AF%E4%B8%89.png":"/img/bg/%E8%83%8C%E6%99%AF%E4%B8%89-%E5%89%AF%E5%9B%BE.jpg"};
    var bg = localStorage.getItem('bgUrl') || defaultBg || '';
    if (!bg) return;
    var postBg = postBgMap[bg] || bg;
    var css = '';
    css += "#web_bg{background-color:transparent!important;background-image:url(\"__BG__\")!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;}".replace('__BG__', bg);
    css += '#page-header{--mark-bg:transparent!important;}';
    css += '#page-header.full_page,#page-header.not-home-page{background:none transparent!important;background-image:none!important;}';
    css += '#page-header.full_page::before,#page-header.full_page::after,#page-header.not-home-page::before,#page-header.not-home-page::after{background:transparent!important;background-image:none!important;opacity:0!important;}';
    css += "#page-header.post-bg[data-has-custom-post-top-img=\"0\"]{background-color:transparent!important;background-image:url(\"__POST_BG__\")!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;}".replace('__POST_BG__', postBg);
    css += '#page-header.post-bg[data-has-custom-post-top-img="0"]::before,#page-header.post-bg[data-has-custom-post-top-img="0"]::after{background:transparent!important;background-image:none!important;opacity:0!important;}';
    var style = document.createElement('style');
    style.id = 'bg-preload-style';
    style.textContent = css;
    document.head.appendChild(style);
  } catch (e) {}
})();
