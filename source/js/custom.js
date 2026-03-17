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

  function getBasenameFromUrl(url) {
    if (!url) return '';
    var clean = url.split('?')[0].split('#')[0];
    var parts = clean.split('/');
    var last = parts[parts.length - 1] || '';
    try {
      last = decodeURIComponent(last);
    } catch (e) {}
    return last.replace(/\.(png|jpe?g|webp|gif)$/i, '');
  }

  function loadJson(url, fallback) {
    return fetch(url, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) return fallback;
        return res.json();
      })
      .catch(function () {
        return fallback;
      });
  }

  function waitForAPlayer(timeoutMs) {
    return new Promise(function (resolve) {
      if (window.APlayer) return resolve(true);
      var start = Date.now();
      var timer = setInterval(function () {
        if (window.APlayer) {
          clearInterval(timer);
          resolve(true);
          return;
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          resolve(false);
        }
      }, 200);
    });
  }

  var bgState = {
    list: [],
    index: 0,
    current: ''
  };

  var musicState = {
    map: null,
    ap: null,
    initing: false,
    ready: false
  };

  function getSavedBgIndex(list) {
    var idx = parseInt(localStorage.getItem('bgIndex') || '0', 10);
    if (isNaN(idx) || idx < 0) idx = 0;
    if (!list.length) return 0;
    return idx % list.length;
  }

  function setSavedBgIndex(idx) {
    localStorage.setItem('bgIndex', String(idx));
  }

  function pickMusicListForBg(bgUrl) {
    var map = musicState.map;
    if (!map || !map.folders) return [];
    var key = getBasenameFromUrl(bgUrl);
    if (key && map.folders[key] && map.folders[key].length) {
      return map.folders[key];
    }
    if (Array.isArray(map.order) && map.order.length && bgState.index < map.order.length) {
      var orderKey = map.order[bgState.index];
      if (map.folders[orderKey] && map.folders[orderKey].length) {
        return map.folders[orderKey];
      }
    }
    if (map.all && map.all.length) return map.all;
    return [];
  }

  function applyPlaylist(ap, list) {
    if (!ap || !Array.isArray(list) || !list.length) return;
    ap.list.clear();
    ap.list.add(list);
    ap.list.switch(0);
    ap.pause();
  }

  async function initBgSwitcher() {
    if (document.getElementById('bg-switch-btn')) return;
    var rightside = document.getElementById('rightside-config-show') || document.getElementById('rightside');
    if (!rightside) return;

    var btn = document.createElement('button');
    btn.id = 'bg-switch-btn';
    btn.type = 'button';
    btn.title = '切换背景';
    btn.innerHTML = '<i class="fas fa-image"></i>';
    rightside.appendChild(btn);

    var list = await loadJson('/bg-list.json', []);
    if (!Array.isArray(list)) list = [];

    if (!list.length) {
      btn.style.display = 'none';
      return;
    }

    var idx = getSavedBgIndex(list);
    bgState.list = list;
    bgState.index = idx;
    bgState.current = list[idx];
    applyBackground(bgState.current);

    btn.addEventListener('click', function () {
      idx = (idx + 1) % list.length;
      setSavedBgIndex(idx);
      bgState.index = idx;
      bgState.current = list[idx];
      applyBackground(bgState.current);
      if (musicState.ap) {
        var nextList = pickMusicListForBg(bgState.current);
        applyPlaylist(musicState.ap, nextList);
      }
    });
  }

  async function initBgmPlayer() {
    if (musicState.ready || musicState.initing) return;
    musicState.initing = true;

    var rightside = document.getElementById('rightside-config-show') || document.getElementById('rightside');
    if (!rightside) {
      musicState.initing = false;
      return;
    }

    var btn = document.getElementById('bgm-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'bgm-btn';
      btn.type = 'button';
      btn.title = 'BGM';
      btn.innerHTML = '<i class="fas fa-music"></i>';
      rightside.appendChild(btn);
    }

    var wrap = document.getElementById('bgm-player');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'bgm-player';
      wrap.className = 'bgm-player';
      wrap.innerHTML = '<div id="bgm-aplayer"></div>';
      document.body.appendChild(wrap);
    }

    var map = await loadJson('/music-map.json', null);
    if (map && map.folders) {
      musicState.map = map;
    } else {
      map = { all: await loadJson('/music-list.json', []) };
      musicState.map = map;
    }

    var list = pickMusicListForBg(bgState.current || '');
    if (!Array.isArray(list) || list.length === 0) {
      btn.style.display = 'none';
      musicState.initing = false;
      return;
    }

    var hasAPlayer = await waitForAPlayer(4000);
    if (!hasAPlayer) {
      musicState.initing = false;
      setTimeout(initBgmPlayer, 800);
      return;
    }

    var ap = new APlayer({
      container: document.getElementById('bgm-aplayer'),
      mini: false,
      autoplay: false,
      loop: 'all',
      order: 'random',
      preload: 'metadata',
      volume: 0.6,
      listFolded: false,
      listMaxHeight: 240,
      audio: list
    });

    musicState.ap = ap;
    musicState.ready = true;
    musicState.initing = false;

    var visible = false;
    btn.addEventListener('click', function () {
      visible = !visible;
      wrap.classList.toggle('active', visible);
    });
  }

  async function initAll() {
    swapSidebarCards();
    await initBgSwitcher();
    await initBgmPlayer();
  }

  onReady(function () {
    initAll();
  });
  document.addEventListener('pjax:complete', function () {
    initAll();
  });
})();
