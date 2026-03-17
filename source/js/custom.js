(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function swapSidebarCards() {
    var sticky = document.querySelector('#aside-content .sticky_layout');
    if (!sticky) return;
    var recent = sticky.querySelector('.card-recent-post');
    var categories = sticky.querySelector('.card-categories');
    if (recent && categories && categories.nextElementSibling !== recent) {
      sticky.insertBefore(categories, recent);
    }
  }

  function applyBackground(bg) {
    var webBg = document.getElementById('web_bg');
    var pageHeader = document.getElementById('page-header');
    if (!bg) return;
    var isColor = /^(#|rgb|hsl|linear-gradient|radial-gradient)/i.test(bg);
    if (webBg) {
      if (isColor) {
        webBg.style.backgroundImage = 'none';
        webBg.style.background = bg;
      } else {
        webBg.style.background = '';
        webBg.style.backgroundImage = 'url(' + bg + ')';
      }
    }
    if (pageHeader) {
      if (isColor) {
        pageHeader.style.backgroundImage = 'none';
        pageHeader.style.background = bg;
      } else {
        pageHeader.style.background = '';
        pageHeader.style.backgroundImage = 'url(' + bg + ')';
      }
    }
  }

  async function initBgSwitcher() {
    if (document.getElementById('bg-switch-btn')) return;
    var rightside = document.getElementById('rightside-config-show') || document.getElementById('rightside');
    if (!rightside) return;

    var btn = document.createElement('button');
    btn.id = 'bg-switch-btn';
    btn.type = 'button';
    btn.title = '切换背景';
    btn.innerHTML = '<i class=\"fas fa-image\"></i>';
    rightside.appendChild(btn);

    var list = [];
    try {
      var res = await fetch('/bg-list.json', { cache: 'no-store' });
      if (res.ok) {
        list = await res.json();
      }
    } catch (e) {
      list = [];
    }

    if (!Array.isArray(list) || list.length === 0) {
      btn.style.display = 'none';
      return;
    }

    var idx = parseInt(localStorage.getItem('bgIndex') || '0', 10);
    if (isNaN(idx)) idx = 0;
    idx = idx % list.length;
    applyBackground(list[idx]);

    btn.addEventListener('click', function () {
      idx = (idx + 1) % list.length;
      localStorage.setItem('bgIndex', String(idx));
      applyBackground(list[idx]);
    });
  }

  async function initBgmPlayer() {
    if (document.getElementById('bgm-btn')) return;
    var rightside = document.getElementById('rightside-config-show') || document.getElementById('rightside');
    if (!rightside) return;

    var btn = document.createElement('button');
    btn.id = 'bgm-btn';
    btn.type = 'button';
    btn.title = 'BGM';
    btn.innerHTML = '<i class=\"fas fa-music\"></i>';
    rightside.appendChild(btn);

    var wrap = document.getElementById('bgm-player');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'bgm-player';
      wrap.className = 'bgm-player';
      wrap.innerHTML = '<div id=\"bgm-aplayer\"></div>';
      document.body.appendChild(wrap);
    }

    var list = [];
    try {
      var res = await fetch('/music-list.json', { cache: 'no-store' });
      if (res.ok) {
        list = await res.json();
      }
    } catch (e) {
      list = [];
    }

    if (!Array.isArray(list) || list.length === 0 || !window.APlayer) {
      btn.style.display = 'none';
      return;
    }

    var ap = new APlayer({
      container: document.getElementById('bgm-aplayer'),
      mini: true,
      autoplay: false,
      loop: 'all',
      order: 'random',
      preload: 'metadata',
      volume: 0.6,
      listFolded: true,
      listMaxHeight: 240,
      audio: list
    });

    var visible = false;
    btn.addEventListener('click', function () {
      visible = !visible;
      wrap.classList.toggle('active', visible);
    });
  }

  function initAll() {
    swapSidebarCards();
    initBgSwitcher();
    initBgmPlayer();
  }

  onReady(initAll);
  document.addEventListener('pjax:complete', initAll);
})();
