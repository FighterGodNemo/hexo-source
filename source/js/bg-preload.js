(function(){
  try {
    var bg = localStorage.getItem('bgUrl') || '';
    if (!bg) return;
    var isColor = /^(#|rgb|hsl|linear-gradient|radial-gradient)/i.test(bg);
    var css = isColor
      ? '#web_bg{background:'+bg+'!important;background-image:none!important;}#page-header{background:'+bg+'!important;background-image:none!important;}'
      : '#web_bg{background-image:url("'+bg+'")!important;}#page-header{background-image:url("'+bg+'")!important;}';
    var style = document.createElement('style');
    style.id = 'bg-preload-style';
    style.textContent = css;
    document.head.appendChild(style);
  } catch (e) {}
})();
