# AGENTS.md · 琉璃幻彩博客项目指南

> 给接手这个博客的 AI/人类看的「地图 + 印记」。
> 上半部分讲项目当前结构与约定（少变动），下半部分是按时间倒序的变更日志（会持续追加）。
> 新会话开始时，先把「项目速览」「关键技术事实」「常用命令」读完，再翻最近的变更日志。

---

## 项目速览

- **站点**：[fightergodnemo.github.io](https://fightergodnemo.github.io/)（GitHub Pages 公开站点）
- **内容仓库**：[FighterGodNemo/hexo-source](https://github.com/FighterGodNemo/hexo-source)（GitHub，私有，写入用）
- **本地项目根**：`D:\TheBlogs`（Hexo 源码 + Obsidian Vault 同仓双用）
- **主题**：Butterfly（`themes/butterfly/`，`.pug` 模板而非 `.ejs`）
- **文章数量**：218 篇（CTF 夺旗赛 / 电子取证 / 工具进阶 / 博览知识 / 科技日报 / 游戏 6 大栏目）
- **认证**：HTTPS + Git Credential Manager（保留账号 `FighterGodNemo`），不要回退到 SSH（SSH 密钥曾与 GitHub 登记公钥不匹配导致推送失败的历史见旧文档）

## 关键技术事实（已验证，写完别再怀疑）

- 部署链路用 HTTPS。Pages 仓库地址位于 `_config.yml`，源码仓库是 `https://github.com/FighterGodNemo/hexo-source.git`。
- 本机 Git 全局代理可能仍配 `http://127.0.0.1:7890`，但代理不一定运行。已用 `git config --global 'http.https://github.com.proxy' ''` 让 GitHub 直连。**不要粗暴删除全部代理配置**，只设域空值即可。
- Obsidian 与 Hexo 共用同一个工作区，Obsidian Git 插件 (`obsidian-git`) 会在变更后自动提交：`autoSaveInterval: 1`、`autoBackupAfterFileChange: true`、`autoPushInterval: 1`、`autoPullOnBoot: true`、`pullBeforePush: true`。
- Obsidian 配置（来自 `.obsidian/`）：附件目录 `./${noteFileName}`、链接格式 `${noteFileName}/${generatedAttachmentFileName}`、文件名前缀 `file-${YYYYMMDDHHmmssSSS}`。
- 附件规范：图片放在与 Markdown 同名目录（`source/_posts/<层级>/文章名/图片`），正文写 `![](文章名/图片)`，由 `scripts/fix-asset-links.js` 在构建时改写。
- 永久链接：`scripts/auto-permalinks.js` + `tools/permalink-manager.js` 自动给缺 `permalink` 的文章补齐「当前真实 URL」；commit 计数与 `npm run permalink:check` 校验已纳入标准动作。
- 部署授权：`npx hexo d` **必须用户明确说部署/发布/上线才执行**。写文章、改配置、整理笔记时直接落盘，**不**自动部署。
- D 盘常紧张（<10 GB 多次告警），本地归档请放 `F:\博客备份\TheBlogs-<时间戳>\`。

## 常用命令

```bash
# 文章内容检查
npm run permalink:check           # 校验全部 218 篇 permalink
node scripts/build-tool-index.js   # 重建工具反向索引 source/tool-index.json

# 构建（不部署）
npx hexo clean && npx hexo g

# 本地预览
npx hexo server -p 4000

# 部署到 GitHub Pages（仅在用户明确说"部署/发布"时执行）
npx hexo deploy
```

## 上手指南（按场景）

### 写新文章
1. 落到对应栏目：`source/_posts/Capture_The_Flag_夺旗赛/`、`Forensic_电子取证/`、`博览知识/`、`工具进阶使用/`、`科技日报/`、`游戏Game/`。
2. 命名：文件名即文章标题，纯说明性标题不要（避免「对话总结」「学习笔记」）。
3. Frontmatter：`title` / `date` / `permalink` / `categories` / `tags` / `created` / `updated`，标签不带空格。
4. 图片附件：放在与 Markdown 同名的目录，正文用 `![](文章名/文件名)`。
5. **不要跑 `npx hexo d`**——Obsidian Git 会自动提交，部署按用户授权触发。

### 修改主题/UI
- 默认改 `D:\TheBlogs\_config.butterfly.yml`，**不要动 `themes/butterfly/`**。
- 注入资源走 `inject.head` / `inject.bottom`，**改 JS/CSS 后一定要同步递增 `?v=` 版本号**，否则浏览器缓存旧文件，调试时会误以为改动没生效。

### 排查推送被 GitHub 拒
- 报 `GH001 Large files detected`：历史里有 >100 MB blob，需用 `git filter-repo --invert-paths` 重写**仅未推送**范围 (`--refs "origin/main..main"`)。**先打回滚标签**（详见 `排查` 章节）。
- 报 `Permission denied (publickey)`：SSH 链路问题。本项目已迁移到 HTTPS，不要倒回。
- 报 `Cannot GET /xxx/` 且 URL 含中文：八成是测试脚本手抄 URL 时编码出错，**从首页 HTML 正则抓真实链接再访问**。

### 验证新功能
详见 `hexo-blog-deploy` 技能「验证新功能的可靠方法」章节。核心三条：宽泛选择器会骗你、版本号不递增会骗你、手抄中文路径会骗你。

---

## 变更日志

> 按时间倒序，新改动加到顶部。每条包含：**做了什么**、**为什么**、**验证方式**、**回滚方法**。

### 2026-10-03 · 备份 + 前端精修 + AGENTS.md

**做了什么**

1. **本地归档 + Git 远程同步**
   - 本地归档到 `F:\博客备份\TheBlogs-20261002-235820\`：完整 Git bundle（975 MB，`git bundle verify` 通过）+ 工作区快照（970 MB，3091 文件）。
   - 修掉了阻碍推送的 108 MB FLAC 历史：单次提交 `473c290..main` 用 `git filter-repo --invert-paths` 重写，提交数仍是 104、内容零丢失。
   - 最终将 104 个未推送提交推到 GitHub 源码仓库，`origin/main` 从 `87836f3` 更新到 `43e5086`。

2. **站点功能增强层（`refine.css` + `refine.js`）**
   - **阅读进度条**：视口顶部 2px 细条，按文章正文而非整页计算进度。
   - **工具反向索引**（核心）：文章末尾列出本文用到哪些工具 + 站内其他文章还写过哪些工具，每个标签可点跳到实战篇（自动跳过"工具索引"类目录页）。
   - **键盘快捷键**：`/` 聚焦搜索、`t` 回顶、`?` 帮助、`Esc` 关闭，输入框内自动让位。
   - `scripts/build-tool-index.js` 生成 `source/tool-index.json`（244 候选工具，命中 213，共 546 次引用），加了 `npm run tool-index`。
   - 通过 `_config.butterfly.yml` 的 `inject` 挂载：head 引 css，bottom 引 js。

3. **`AGENTS.md`**（本文件）：项目约定 + 上手指南 + 变更记录三位一体，让任何 AI/人接手时能快速进入状态。

**为什么**

- 备份：发现本地 `main` 领先 GitHub 源码仓库整整 104 个提交，远端备份停在 2026-09-08，已过期三周。
- 工具索引：观察到一个真正的教训——218 篇文章里只有 4 篇链接到工具索引。文章之间几乎不互通，读完一篇不知道还有哪些文章用到同一个工具。
- AGENTS.md：旧的 `工作日志.docx`（位于项目根目录，已 git 追踪）从 2026-04-15 后就没动过；当前没有任何机制变更记录交代人接手本次改动的工作。

**踩过的坑（重要）**

- **FLAC blob 卡历史**：「检查音乐」流程把 FLAC 转 MP3 时，FLAC 先被 Obsidian Git 自动提交、转成 MP3 后又提交删除，但**大 blob 留在历史**。只要它在待推送范围内，整批提交会被 `pre-receive` 阶段全部拒收。
- **「文字描述」误判为工具名**：第一版工具索引头部是 `环境`(66篇)、`Web`(40篇)、`Misc` —— 全是分类词不是工具。表格抓取还带进了 `**冰蝎 Behinder**` 这种 markdown 残留。从 857 次引用收敛到 546 次是加了 STOPWORDS 与 markdown 标记剥离的结果。
- **pjax 会替换 body 子节点**：挂在 `document.body` 上的 UI（进度条、快捷键）会随之消失。必须在每次 `pjax:complete` 重新 `ensure`，keydown 监听要用全局标志位防重复注册。
- **宽泛选择器骗我**：用 `body > div[id^="rf-"]` 判断"快捷键 UI 没渲染"是个错误，多元素匹配只返回第一个，看起来像其余缺失。改用确切 ID 查询后确认三个组件一直正常。几轮防御性加固（`withBody` 兜底、异常隔离）本身有价值，留着了。
- **PowerShell 中含 `=` 的中文注释行会被当赋值**、含反引号的正则会被截断。写完整脚本时避开。

**验证方式**

- 备份：`git ls-remote origin refs/heads/main` 与本地 `main` 哈希相同（`43e5086`）。
- 前端：
  - 文章页 `#rf-progress` 实测 3000px 滚动显示 28.59%。
  - 文章页底部出现 `#rf-toolbox`，冷青实心标本文实际用到的工具，空心标站内其他文章提过的工具。
  - 标签 `<a href>` 链接已抽查 12 个、全部 200；归档/分类等非文章页不误挂。
  - 进度条/快捷键 UI 三个组件按 ID 查询都正常渲染。
- 标准动作：`npm run permalink:check` 通过 218 篇；`git diff --check` 无空白错误。

**回滚方法**

- 前端精修：在 `_config.butterfly.yml` 的 `inject` 段删掉 `refine.css` 与 `refine.js` 那两行即可，其余文件留着不引用也无害。
- 工具索引：删 `source/tool-index.json`、删 `_config.butterfly.yml` inject 里的 refine 行；前端组件会优雅降级为「无相关工具」状态。
- 备份归档：删除 `F:\博客备份\TheBlogs-20261002-235820\`；如果想回滚 Git 重写，可 `git reset --hard backup/pre-flac-rewrite-20261003-000401`（**仅在远端没别人改过的情况下**）。
- 本次 `npx hexo d` **未执行**，线上仍是旧版本。等用户说部署再发布。