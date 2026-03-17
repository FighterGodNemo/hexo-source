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
    ready: false,
    lists: [],
    listKey: '__bg__',
    listIndex: 0,
    labelEl: null,
    switchBtn: null
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

  function getSavedMusicListKey(lists) {
    var key = localStorage.getItem('bgmListKey') || '__bg__';
    if (!lists || !lists.length) return '__bg__';
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].key === key) return key;
    }
    return lists[0].key;
  }

  function setSavedMusicListKey(key) {
    localStorage.setItem('bgmListKey', key);
  }

  function buildMusicLists(map) {
    var lists = [];
    var seen = {};
    if (map && (map.all && map.all.length || (map.folders && Object.keys(map.folders).length))) {
      lists.push({ key: '__bg__', name: '跟随背景' });
    }

    var order = [];
    if (map && Array.isArray(map.order)) order = map.order.slice();
    if (map && map.folders) {
      Object.keys(map.folders).forEach(function (k) {
        if (order.indexOf(k) === -1) order.push(k);
      });
      order.forEach(function (k) {
        if (seen[k]) return;
        var items = map.folders[k];
        if (Array.isArray(items) && items.length) {
          lists.push({ key: k, name: k });
          seen[k] = true;
        }
      });
    }

    if (map && Array.isArray(map.all) && map.all.length) {
      lists.push({ key: '__all__', name: '全部' });
    }

    return lists;
  }

  function getListItemsByKey(key) {
    if (key === '__bg__') return pickMusicListForBg(bgState.current || '');
    if (key === '__all__') return musicState.map && musicState.map.all ? musicState.map.all : [];
    if (musicState.map && musicState.map.folders && musicState.map.folders[key]) {
      return musicState.map.folders[key];
    }
    return [];
  }

  function getBgListName() {
    if (musicState.map && Array.isArray(musicState.map.order) && bgState.index < musicState.map.order.length) {
      return musicState.map.order[bgState.index];
    }
    return getBasenameFromUrl(bgState.current || '');
  }

  function getMusicListDisplayName(key) {
    if (key === '__bg__') {
      var bgName = getBgListName();
      return bgName ? ('跟随背景：' + bgName) : '跟随背景';
    }
    if (key === '__all__') return '全部';
    return key || '歌单';
  }

  function updateMusicListLabel() {
    if (!musicState.labelEl) return;
    musicState.labelEl.textContent = '歌单：' + getMusicListDisplayName(musicState.listKey);
  }

  function syncMusicListIndex() {
    var lists = musicState.lists || [];
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].key === musicState.listKey) {
        musicState.listIndex = i;
        return;
      }
    }
    musicState.listIndex = 0;
  }

  function applyMusicListByKey(key, save) {
    var items = getListItemsByKey(key);
    if (!Array.isArray(items) || !items.length) return false;
    applyPlaylist(musicState.ap, items);
    musicState.listKey = key;
    if (save) setSavedMusicListKey(key);
    updateMusicListLabel();
    return true;
  }

  function applyMusicListByIndex(idx, save) {
    if (!musicState.lists || !musicState.lists.length) return;
    var start = idx;
    var tries = 0;
    while (tries < musicState.lists.length) {
      var list = musicState.lists[idx];
      if (applyMusicListByKey(list.key, save)) {
        musicState.listIndex = idx;
        return;
      }
      idx = (idx + 1) % musicState.lists.length;
      tries += 1;
      if (idx === start) break;
    }
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
      if (musicState.ap && musicState.listKey === '__bg__') {
        var nextList = pickMusicListForBg(bgState.current);
        applyPlaylist(musicState.ap, nextList);
        updateMusicListLabel();
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

    musicState.lists = buildMusicLists(musicState.map);
    if (!musicState.lists.length) {
      btn.style.display = 'none';
      musicState.initing = false;
      return;
    }

    var savedKey = getSavedMusicListKey(musicState.lists);
    musicState.listKey = savedKey;
    syncMusicListIndex();
    var list = getListItemsByKey(musicState.listKey);
    if (!Array.isArray(list) || list.length === 0) {
      for (var i = 0; i < musicState.lists.length; i++) {
        var tryKey = musicState.lists[i].key;
        var tryList = getListItemsByKey(tryKey);
        if (Array.isArray(tryList) && tryList.length) {
          list = tryList;
          musicState.listKey = tryKey;
          musicState.listIndex = i;
          break;
        }
      }
    }

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

    var toolbar = wrap.querySelector('.bgm-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'bgm-toolbar';
      toolbar.innerHTML = '<span class="bgm-list-label"></span><button type="button" class="bgm-list-switch" title="切换歌单"><i class="fas fa-exchange-alt"></i><span>切换</span></button>';
      wrap.insertBefore(toolbar, wrap.firstChild);
    }
    wrap.classList.add('has-toolbar');
    musicState.labelEl = toolbar.querySelector('.bgm-list-label');
    musicState.switchBtn = toolbar.querySelector('.bgm-list-switch');
    updateMusicListLabel();

    if (musicState.switchBtn) {
      if (musicState.lists.length <= 1) {
        musicState.switchBtn.disabled = true;
        musicState.switchBtn.style.display = 'none';
      } else {
        musicState.switchBtn.style.display = '';
        musicState.switchBtn.addEventListener('click', function () {
          var next = (musicState.listIndex + 1) % musicState.lists.length;
          applyMusicListByIndex(next, true);
        });
      }
    }

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
