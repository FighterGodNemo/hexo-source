const fs = require('fs');
const path = require('path');

function isImage(file) {
  return /\.(png|jpe?g|webp|gif)$/i.test(file);
}

function cnDigitValue(ch) {
  const map = {
    '\u4e00': 1,
    '\u4e8c': 2,
    '\u4e09': 3,
    '\u56db': 4,
    '\u4e94': 5,
    '\u516d': 6,
    '\u4e03': 7,
    '\u516b': 8,
    '\u4e5d': 9
  };
  return map[ch] || 0;
}

function cnToNumber(cn) {
  if (!cn) return null;
  if (cn === '\u5341') return 10;
  if (cn.length === 1) return cnDigitValue(cn);
  if (cn.length === 2 && cn[0] === '\u5341') return 10 + cnDigitValue(cn[1]);
  if (cn.length === 2 && cn[1] === '\u5341') return cnDigitValue(cn[0]) * 10;
  if (cn.length === 3 && cn[1] === '\u5341') {
    return cnDigitValue(cn[0]) * 10 + cnDigitValue(cn[2]);
  }
  return null;
}

function extractOrder(name) {
  const base = path.parse(name).name;
  const mDigit = base.match(/(\d+)/);
  if (mDigit) return parseInt(mDigit[1], 10);
  const mCn = base.match(/[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341]+/);
  if (mCn) return cnToNumber(mCn[0]);
  return null;
}

function compareByOrder(a, b) {
  const aOrder = extractOrder(a);
  const bOrder = extractOrder(b);
  if (aOrder != null && bOrder != null && aOrder !== bOrder) return aOrder - bOrder;
  if (aOrder != null && bOrder == null) return -1;
  if (aOrder == null && bOrder != null) return 1;
  return a.localeCompare(b);
}

hexo.extend.filter.register('before_generate', () => {
  const baseDir = hexo.base_dir;
  const bgDir = path.join(baseDir, 'source', 'img', 'bg');
  let list = [];

  if (fs.existsSync(bgDir)) {
    const files = fs.readdirSync(bgDir).filter(isImage).sort(compareByOrder);
    list = files.map((f) => `/img/bg/${encodeURIComponent(f)}`);
  }

  if (!list.length) {
    const themeBg = hexo.theme?.config?.background;
    if (Array.isArray(themeBg)) list = themeBg;
    else if (typeof themeBg === 'string' && themeBg) list = [themeBg];
  }

  if (!list.length) list = ['/img/index-bg.jpg'];

  const outPath = path.join(baseDir, 'source', 'bg-list.json');
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
});
