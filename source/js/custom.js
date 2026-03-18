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

  function isColorValue(val) {
    return /^(#|rgb|hsl|linear-gradient|radial-gradient)/i.test(val);
  }

  function applyBackground(bg) {
    var webBg = document.getElementById('web_bg');
    var pageHeader = document.getElementById('page-header');
    if (!bg) return;
    var preloadStyle = document.getElementById('bg-preload-style');
    if (preloadStyle && preloadStyle.parentNode) {
      preloadStyle.parentNode.removeChild(preloadStyle);
    }
    var isColor = isColorValue(bg);
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
    updateBgmCover();

    try {
      localStorage.setItem('bgUrl', String(bg));
    } catch (e) {}
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

  function getFileNameFromUrl(url) {
    if (!url) return '';
    var clean = url.split('?')[0].split('#')[0];
    var parts = clean.split('/');
    var last = parts[parts.length - 1] || '';
    try {
      last = decodeURIComponent(last);
    } catch (e) {}
    return last;
  }

  function normalizeFileName(name) {
    return String(name || '').replace(/\s+/g, ' ').trim();
  }

  function stripAudioExt(name) {
    return String(name || '').replace(/\.(mp3|m4a|aac|ogg|wav|flac)$/i, '');
  }

  function getBgUrlByName(name) {
    if (!name || !bgState.list || !bgState.list.length) return '';
    var target = normalizeFileName(name);
    for (var i = 0; i < bgState.list.length; i++) {
      var url = bgState.list[i];
      var base = normalizeFileName(getBasenameFromUrl(url));
      if (base === target) return url;
    }
    return '';
  }

  function setBgmCover(bg) {
    var root = document.documentElement;
    if (!root) return;
    if (!bg) {
      root.style.setProperty('--bgm-cover', 'none');
      return;
    }
    if (isColorValue(bg)) {
      root.style.setProperty('--bgm-cover', 'none');
    } else {
      root.style.setProperty('--bgm-cover', 'url(\"' + bg + '\")');
    }
  }

  function getCoverBg() {
    if (musicState.listKey && musicState.listKey !== '__bg__' && musicState.listKey !== '__all__') {
      var listBg = getBgUrlByName(musicState.listKey);
      if (listBg) return listBg;
    }
    return bgState.current || '';
  }

  function updateBgmCover() {
    setBgmCover(getCoverBg());
  }

  function addCacheBuster(url) {
    var ts = String(Date.now());
    return url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=' + ts;
  }

  function loadJson(url, fallback) {
    var requestUrl = addCacheBuster(url);
    return fetch(requestUrl, { cache: 'no-store' })
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

  var builtInDefaultMap = {
    '背景一': [
      '彼女は旅に出る - 鎖那.flac',
      '鎖那 - 彼女は旅に出る.flac',
      '鎖那 - 彼女は旅に出る.mp3',
      '彼女は旅に出る.flac',
      '彼女は旅に出る.mp3'
    ],
    '背景二': [
      '溯 (Reverse) - CORSAK胡梦周,马吟吟.flac',
      'CORSAK胡梦周,马吟吟 - 溯 (Reverse) .flac',
      'CORSAK胡梦周,马吟吟 - 溯 (Reverse) .mp3',
      '溯 (Reverse).flac',
      '溯 (Reverse).mp3'
    ],
    '背景三': [
      '虚妄与荣光 - 碧蓝航线.flac',
      '碧蓝航线 - 虚妄与荣光.flac',
      '碧蓝航线 - 虚妄与荣光.mp3',
      '虚妄与荣光.flac',
      '虚妄与荣光.mp3'
    ]
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
    switchBtn: null,
    defaultBtn: null
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

  function getSavedDefaultMap() {
    var raw = localStorage.getItem('bgmDefaultMap') || '';
    if (!raw) return {};
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return {};
  }

  function setSavedDefault(bgKey, fileName) {
    if (!bgKey || !fileName) return;
    var map = getSavedDefaultMap();
    map[bgKey] = fileName;
    localStorage.setItem('bgmDefaultMap', JSON.stringify(map));
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

  function getBgKey() {
    return getBgListName() || '';
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
    musicState.labelEl.textContent = '歌单：';
  }

  function getCurrentAudioItem() {
    if (!musicState.ap || !musicState.ap.list || !musicState.ap.list.audios) return null;
    var idx = typeof musicState.ap.list.index === 'number' ? musicState.ap.list.index : 0;
    return musicState.ap.list.audios[idx] || musicState.ap.list.audios[0] || null;
  }

  function updateDefaultBtnState() {
    if (!musicState.defaultBtn) return;
    var bgKey = getBgKey();
    var map = getSavedDefaultMap();
    var current = getCurrentAudioItem();
    var currentFile = current ? getFileNameFromUrl(current.url) : '';
    var saved = map[bgKey];
    var isSet = saved && currentFile &&
      normalizeFileName(saved) === normalizeFileName(currentFile);
    if (isSet) {
      musicState.defaultBtn.textContent = '默认 ✓';
      musicState.defaultBtn.classList.add('is-set');
    } else {
      musicState.defaultBtn.textContent = '设为默认';
      musicState.defaultBtn.classList.remove('is-set');
    }
  }

  function findDefaultIndex(list, bgKey) {
    if (!Array.isArray(list) || !list.length || !bgKey) return 0;
    var targets = [];
    var map = getSavedDefaultMap();
    if (map[bgKey]) targets.push(map[bgKey]);
    if (builtInDefaultMap[bgKey] && builtInDefaultMap[bgKey].length) {
      targets = targets.concat(builtInDefaultMap[bgKey]);
    }
    if (!targets.length) return 0;
    var normalizedTargets = targets.map(function (t) { return normalizeFileName(t); });
    var baseTargets = normalizedTargets.map(stripAudioExt);
    for (var i = 0; i < list.length; i++) {
      var file = getFileNameFromUrl(list[i].url || '');
      var norm = normalizeFileName(file);
      if (normalizedTargets.indexOf(norm) !== -1) return i;
      if (baseTargets.indexOf(stripAudioExt(norm)) !== -1) return i;
    }
    return 0;
  }

  function moveItemToFront(list, idx) {
    if (!Array.isArray(list) || idx <= 0 || idx >= list.length) return list;
    var copy = list.slice();
    var item = copy.splice(idx, 1)[0];
    copy.unshift(item);
    return copy;
  }

  function getDefaultKeyForList(key) {
    if (key === '__bg__') return getBgKey();
    if (key === '__all__') return '';
    return key || '';
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
    var defaultKey = getDefaultKeyForList(key);
    applyPlaylist(musicState.ap, items, defaultKey);
    musicState.listKey = key;
    if (save) setSavedMusicListKey(key);
    updateMusicListLabel();
    updateBgmCover();
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

  function applyPlaylist(ap, list, defaultKey) {
    if (!ap || !Array.isArray(list) || !list.length) return;
    var finalList = list;
    if (defaultKey) {
      var idx = findDefaultIndex(list, defaultKey);
      finalList = moveItemToFront(list, idx);
    }
    ap.list.clear();
    ap.list.add(finalList);
    ap.list.switch(0);
    ap.pause();
    updateDefaultBtnState();
  }

  async function initBgSwitcher() {
    if (document.getElementById('bg-switch-btn')) return;
    var rightside = document.getElementById('rightside-config-show') || document.getElementById('rightside');
    if (!rightside) return;

    var btn = document.createElement('button');
    btn.id = 'bg-switch-btn';
    btn.type = 'button';
    btn.title = '切换默认背景';
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
        applyPlaylist(musicState.ap, nextList, getBgKey());
        updateMusicListLabel();
      }
      updateDefaultBtnState();
    });
  }

  async function initBgmPlayer() {
    var rightside = document.getElementById('rightside-config-show') || document.getElementById('rightside');
    if (!rightside) {
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

    if (!btn.dataset.bound) {
      var visible = wrap.classList.contains('active');
      btn.addEventListener('click', function () {
        visible = !visible;
        wrap.classList.toggle('active', visible);
      });
      btn.dataset.bound = '1';
    }

    if (musicState.ready || musicState.initing) return;
    musicState.initing = true;

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
    updateBgmCover();
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

    var initialKey = getDefaultKeyForList(musicState.listKey);
    if (initialKey) {
      var initialIdx = findDefaultIndex(list, initialKey);
      list = moveItemToFront(list, initialIdx);
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
    // Prevent theme pjax handler from destroying our persistent player
    try {
      ap.options.fixed = true;
    } catch (e) {}
    musicState.ready = true;
    musicState.initing = false;

    var toolbar = wrap.querySelector('.bgm-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'bgm-toolbar';
      toolbar.innerHTML = '<span class="bgm-list-label"></span><div class="bgm-toolbar-actions"><button type="button" class="bgm-default-btn" title="设为默认">设为默认</button><button type="button" class="bgm-list-switch" title="切换歌单"><i class="fas fa-exchange-alt"></i><span>切换</span></button></div>';
      wrap.insertBefore(toolbar, wrap.firstChild);
    }
    wrap.classList.add('has-toolbar');
    musicState.labelEl = toolbar.querySelector('.bgm-list-label');
    musicState.switchBtn = toolbar.querySelector('.bgm-list-switch');
    musicState.defaultBtn = toolbar.querySelector('.bgm-default-btn');
    updateMusicListLabel();
    updateDefaultBtnState();

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

    if (musicState.defaultBtn) {
      musicState.defaultBtn.addEventListener('click', function () {
        var bgKey = getBgKey();
        var current = getCurrentAudioItem();
        if (!bgKey || !current || !current.url) return;
        var file = getFileNameFromUrl(current.url);
        if (!file) return;
        setSavedDefault(bgKey, file);
        updateDefaultBtnState();
      });
    }

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
