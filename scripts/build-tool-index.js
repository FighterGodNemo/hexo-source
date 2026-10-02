/**
 * prebuild 脚本：生成工具反向索引 source/tool-index.json
 *
 * 思路：把站点已有的「工具索引」类文章当作词表，
 * 再统计每个工具在哪些文章里出现过，产出倒排索引。
 * refine.js 在文末读取它，告诉读者「哪些工具本站还写过」。
 *
 * 运行：node scripts/build-tool-index.js
 * 由 package.json 的 prebuild 自动触发，也可手动执行。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'source', '_posts');
const OUT_FILE = path.join(ROOT, 'source', 'tool-index.json');

/** 站点里已存在的「工具索引」文章，作为工具词表来源 */
const TOOL_SEED_FILES = [
  'source/_posts/Capture_The_Flag_夺旗赛/CTF解题妙具/本机CTF工具索引.md',
  'source/_posts/Forensic_电子取证/Forensic解题妙具/本机Forensic工具索引.md',
];

/** 常见安全工具补全，保证词表不只依赖那两篇索引文章 */
const EXTRA_TOOLS = [
  // 逆向 / 动态分析
  'IDA', 'IDA Pro', 'Ghidra', 'x64dbg', 'x32dbg', 'WinDbg', 'dnSpy', 'ILSpy',
  'GDB', 'lldb', 'Frida', 'JADX', 'Apktool', 'Android Killer', 'RetDec',
  // 密码 / 破解
  'Hashcat', 'John the Ripper', 'Aircrack-ng', 'Hydra', 'medusa',
  // 取证
  'Volatility3', 'Autopsy', 'FTK Imager', 'X-Ways', 'Sleuth Kit', 'foremost',
  'binwalk', 'Bulk_extractor', 'photorec', 'testdisk', 'Scalpel',
  'RegRipper', 'Peewee', 'mimikatz', 'lazagne', 'chainsaw', 'Velociraptor',
  // 隐写 / 文件分析
  'Steghide', 'zsteg', 'ExifTool', 'CyberChef', '010 Editor',
  'strings', 'file', 'xxd', 'hexdump', 'Foca', 'Trinity',
  // 网络 / Web
  'Burp Suite', 'OWASP ZAP', 'sqlmap', 'Nmap', 'Wireshark', 'tcpdump',
  'Ffuf', 'Gobuster', 'Dirsearch', 'Nikto', 'Amass', 'masscan', 'Ettercap',
  // 无线
  'Wifite', 'Kismet', 'mdk4', 'airgeddon',
  // 杂项 / 平台
  'Anki', 'Docker', 'Python', 'Postman', 'Ciphey', 'bkcrack',
  'AntSword', 'Behinder', 'frp', 'ngrok', 'MSF', 'Metasploit',
  // 从本站实际内容中确认存在、且值得进索引的补充
  'checksec', 'ROPgadget', 'ROPper', 'pwntools', 'one_gadget',
  'Stegsolve', 'MP3Stego', 'DCode', 'Audacity', 'Sonic Visualiser',
  'DB Browser for SQLite', 'Arsenal Image Mounter', 'MobaXterm',
  'Recuva', 'R-Studio', 'Far Manager', 'WinHex', '010 Editor',
  'Ghidra', 'IDA', 'AndrOBD', 'JADX', 'Apktool', 'Frida',
  'lazagne', 'Responder', 'Impacket', 'Bloodhound', 'SharpHound',
  'Volatility', 'Velociraptor', 'Kali', 'Nessus', 'AWVS', 'Burp',
];

/** 归一化：用于大小写/分隔符不敏感的匹配 */
function norm(s) {
  return String(s).toLowerCase().replace(/[\s_\-.]+/g, '');
}

/** 转义正则元字符 */
function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 分类词 / 栏目词 / 说明性文字不是工具，必须剔除。
 * 这些词频高但无语义，混进索引会淹没真正的工具名。
 */
const STOPWORDS = new Set([
  '环境', '工具', '常用', '其他', '分类', '类别', '目录', '索引', 'misc',
  'web', 'reverse', 'reversing', 'pwn', 'crypto', 'forensics', '取证',
  '逆向', '密码', '隐写', '流量', '流量分析', '内存', '手机', '计算机',
  '服务器', 'u盘', '移动介质', '网络', '数据库', '日志', '压缩包', '杂项',
  'linux', 'windows', 'android', 'ios', '基础', '入门', '进阶', '实战',
  '案例', '命令', '参数', '说明', '用法', '示例', '参考', '简介', '概述',
  '总结', '安装', '配置', '使用', '功能', '特点', '优点', '缺点', '场景',
  'note', 'notes', 'index', 'list', 'tools', 'tool', 'basic', 'advanced',
  'getting', 'started', 'summary', 'overview', 'usage', 'example', 'install',
  'config', 'option', 'feature', 'type', 'name', 'desc', 'description',
  'file', 'files', 'readme', 'todo', 'test', 'demo', 'src', 'lib', 'bin',
]);

/**
 * 明显不是工具名的形态：路径、加粗残留、纯数字、纯符号、纯命令名
 * 以及过泛的英文单词（多半是正文常用词而非工具）。
 */
function looksLikeNoise(name) {
  if (!name) return true;
  if (name.length < 2 || name.length > 30) return true;
  if (/^[-:|\s*_#]+$/.test(name)) return true;
  if (/^[*_`~#>\[\]]/.test(name)) return true;      // markdown 残留
  if (/\*\*/.test(name)) return true;                 // 表格加粗没剥干净
  if (/^[A-Za-z]:\\|^\/|^\.\.?\\|^\/|\\{2}/.test(name)) return true; // 路径
  if (/^\d+$/.test(name)) return true;
  if (/^[\u4e00-\u9fa5]{4,}$/.test(name)) return true; // 长中文短语多半是说明
  // 纯小写英文单词（非专有名词）多半是正文用词，不是工具
  if (/^[a-z]+$/.test(name) && !/^(ida|binwalk|sqlmap|nikto|amass|nmap|hydra|john|xxd|docker|metasploit|msf|ngrok|frida|ghidra|gdb|lldb|sleuth|foremost|photorec|testdisk|scalpel|file|strings|hexdump|tcpdump|masscan|kismet|wifite|airgeddon|ettercap|postman|ciphey|bkcrack|retsieve|steghide|zsteg|cuckoo)/.test(name)) {
    return true;
  }
  return false;
}

/**
 * 语义去重：`IDA` 与 `IDA Pro` 指的是同一个工具，保留更具体的那个。
 * 只处理「短名是长名前缀」这一种最常见的关系。
 */
function dedupeSemantic(tools) {
  const byNorm = new Map();
  tools.forEach((t) => byNorm.set(norm(t), t));

  const drop = new Set();
  tools.forEach((t) => {
    const short = norm(t);
    for (const other of tools) {
      if (other === t) continue;
      const long = norm(other);
      // `ida` → `idapro`、`xways` → `xwaysforensics` 这类前缀包含
      if (long.startsWith(short) && long.length > short.length && long.length - short.length <= 12) {
        if (byNorm.has(long)) { drop.add(short); break; }
      }
    }
  });

  return tools.filter((t) => !drop.has(norm(t)));
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

/** 从一篇 Markdown 中提取 frontmatter 的 title 与 permalink */
function parseMeta(text) {
  const meta = { title: '', permalink: '' };
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return meta;

  const titleMatch = fm[1].match(/^title:\s*(.+)$/m);
  if (titleMatch) meta.title = titleMatch[1].trim().replace(/^["']|["']$/g, '');

  const permalinkMatch = fm[1].match(/^permalink:\s*(.+)$/m);
  if (permalinkMatch) meta.permalink = permalinkMatch[1].trim().replace(/^["']|["']$/g, '');

  return meta;
}

/** 读取文章正文（去掉 frontmatter 与代码块，避免命令示例造成误命中） */
function readBody(text) {
  const noFm = text.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
  return noFm.replace(/```[\s\S]*?```/g, ' ');
}

function main() {
  // ---- 1. 汇总工具词表 ----
  const toolSet = new Set();

  /** 清理抓到的候选词：剥 markdown 标记 */
  const clean = (raw) =>
    String(raw)
      .replace(/[*_`~]/g, '')        // 加粗/斜体/代码标记
      .replace(/^#+\s*/, '')          // 标题井号
      .replace(/\s+/g, ' ')
      .trim();

  for (const rel of TOOL_SEED_FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const text = fs.readFileSync(abs, 'utf8');

    // 工具索引文章里用 #### 或表格列出工具名
    const headings = text.match(/^#{2,6}\s+(.+)$/gm) || [];
    headings.forEach((h) => {
      const name = clean(h.replace(/^#{2,6}\s+/, ''));
      if (name) toolSet.add(name);
    });

    // 表格首列：| Hashcat | 说明 |
    const rows = text.match(/^\|\s*([^|]+?)\s*\|/gm) || [];
    rows.forEach((r) => {
      const cell = clean(r.replace(/^\|\s*/, '').replace(/\s*\|$/, ''));
      if (cell) toolSet.add(cell);
    });
  }

  EXTRA_TOOLS.forEach((t) => toolSet.add(clean(t)));

  const seen = new Set();
  const cleaned = [...toolSet].filter((t) => {
    if (looksLikeNoise(t)) return false;
    if (STOPWORDS.has(t) || STOPWORDS.has(t.toLowerCase())) return false;
    const k = norm(t);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // 语义去重：IDA / IDA Pro 只保留一个
  const uniqueTools = dedupeSemantic(cleaned);

  // 预编译匹配器：词边界，避免 bin 命中 combine
  const matchers = uniqueTools.map((tool) => {
    const escTool = esc(tool);
    // 工具名常带点或连字符，前后用非字母数字作边界更稳
    const re = new RegExp('(^|[^A-Za-z0-9])' + escTool + '(?![A-Za-z0-9])', 'i');
    return { tool, re };
  });

  // ---- 2. 扫描全部文章 ----
  const files = walk(POSTS_DIR);
  const index = {};

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const body = readBody(text);
    const meta = parseMeta(text);

    const permalink =
      meta.permalink ||
      '/' + path.relative(POSTS_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '') + '/';
    const title = meta.title || path.basename(file, '.md');

    for (const { tool, re } of matchers) {
      if (!re.test(body)) continue;
      if (!index[tool]) index[tool] = { count: 0, posts: [] };
      index[tool].posts.push({ url: permalink, title: title });
    }
  }

  // 汇总计数，按提及数降序
  const out = {};
  Object.keys(index)
    .sort((a, b) => {
      const d = index[b].posts.length - index[a].posts.length;
      return d !== 0 ? d : a.localeCompare(b);
    })
    .forEach((tool) => {
      out[tool] = { count: index[tool].posts.length, posts: index[tool].posts };
    });

  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 0), 'utf8');

  const total = Object.keys(out).length;
  const mentions = Object.values(out).reduce((s, e) => s + e.count, 0);
  console.log(
    `[tool-index] 词表 ${uniqueTools.length} 个工具 → 命中 ${total} 个工具，` +
    `共 ${mentions} 次引用；已写入 source/tool-index.json`
  );
}

main();
