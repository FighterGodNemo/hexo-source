const path = require('path');

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function isImage(file) {
  return /\.(png|jpe?g|webp|gif|avif)$/i.test(file);
}

function isAudio(file) {
  return /\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(file);
}

function getImageFormatRank(file) {
  switch (path.extname(String(file || '')).toLowerCase()) {
    case '.avif':
      return 5;
    case '.webp':
      return 4;
    case '.jpg':
    case '.jpeg':
      return 3;
    case '.png':
      return 2;
    case '.gif':
      return 1;
    default:
      return 0;
  }
}

function shouldPreferImageCandidate(currentFile, nextFile) {
  if (!nextFile) return false;
  if (!currentFile) return true;
  return getImageFormatRank(nextFile) > getImageFormatRank(currentFile);
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

const ORDER_TOKEN_RE = '(?:\\d{1,3}|[\\u4e00\\u4e8c\\u4e09\\u56db\\u4e94\\u516d\\u4e03\\u516b\\u4e5d\\u5341]+)';
const ORDER_PREFIX_RE = new RegExp(
  '^\\s*(?:[\\[(\\uFF08]\\s*)?(' + ORDER_TOKEN_RE + ')(?:\\s*[\\])\\uFF09])?\\s*(?:[-_. ]+)\\s*(.+?)\\s*$',
  'u'
);
const POST_SUFFIX_RE = /(?:[\s._-]+)?副图\s*$/u;
const LEGACY_DIGIT_RE = /(\d{1,3})/u;
const LEGACY_CN_RE = /[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341]+/u;

function parseOrderToken(token) {
  if (!token) return null;
  if (/^\d+$/.test(token)) return parseInt(token, 10);
  return cnToNumber(token);
}

function stripPostSuffix(name) {
  return normalizeText(String(name || '').replace(POST_SUFFIX_RE, ''));
}

function splitOrderPrefix(name) {
  const normalized = normalizeText(name);
  const match = normalized.match(ORDER_PREFIX_RE);
  if (!match) {
    return {
      order: null,
      name: normalized
    };
  }
  return {
    order: parseOrderToken(match[1]),
    name: normalizeText(match[2])
  };
}

function extractLegacyOrder(name) {
  const normalized = normalizeText(name);
  const digitMatch = normalized.match(LEGACY_DIGIT_RE);
  if (digitMatch) return parseInt(digitMatch[1], 10);
  const cnMatch = normalized.match(LEGACY_CN_RE);
  if (cnMatch) return cnToNumber(cnMatch[0]);
  return null;
}

function normalizeGroupName(name, options = {}) {
  const baseName = options.stripExtension === false
    ? normalizeText(name)
    : normalizeText(path.parse(String(name || '')).name);
  const isPostVariant = POST_SUFFIX_RE.test(baseName);
  const withoutPost = stripPostSuffix(baseName);
  const prefixed = splitOrderPrefix(withoutPost);
  const displayName = normalizeText(prefixed.name || withoutPost || baseName);
  const order = prefixed.order != null ? prefixed.order : extractLegacyOrder(displayName);

  return {
    key: displayName,
    displayName,
    order,
    isPostVariant,
    sourceName: String(name || '')
  };
}

function compareNamedEntries(a, b) {
  const aOrder = a && a.order != null ? a.order : null;
  const bOrder = b && b.order != null ? b.order : null;
  if (aOrder != null && bOrder != null && aOrder !== bOrder) return aOrder - bOrder;
  if (aOrder != null && bOrder == null) return -1;
  if (aOrder == null && bOrder != null) return 1;
  return String((a && (a.displayName || a.key || a.sourceName)) || '')
    .localeCompare(String((b && (b.displayName || b.key || b.sourceName)) || ''), 'zh-Hans-CN');
}

module.exports = {
  compareNamedEntries,
  cnDigitValue,
  cnToNumber,
  extractLegacyOrder,
  getImageFormatRank,
  isAudio,
  isImage,
  normalizeGroupName,
  normalizeText,
  splitOrderPrefix,
  stripPostSuffix,
  shouldPreferImageCandidate
};
