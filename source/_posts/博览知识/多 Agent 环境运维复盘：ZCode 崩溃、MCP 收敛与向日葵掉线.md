---
title: 多 Agent 环境运维复盘：ZCode 崩溃、MCP 收敛与向日葵掉线
permalink: '/2026/11/05/博览知识/多 Agent 环境运维复盘/'
date: 2026-11-05 16:36
created: 2026-11-05T16:36
updated: 2026-11-05T16:36
categories:
  - 博览知识
tags:
  - Windows
  - 运维排障
  - MCP
  - ZCode
---

2026-11-05 一天内连续处理了四起互不相干的故障：ZCode 渲染进程 OOM 崩溃、消息队列不自动发送、Everything MCP 重复实例泛滥、向日葵被控端假在线。它们表面无关，内核却指向同一个主题：**多进程、多会话、多 agent 环境里的"状态不一致"**。这篇复盘把每起的证据、根因和处置固化下来，供以后复现时少走弯路。

## 四起故障一览

| # | 故障 | 表面现象 | 真正根因 |
|---|---|---|---|
| 1 | ZCode 灰屏崩溃 | 界面空白只剩灰底 | renderer JS 堆 1.03 GB + 4 GB 地址空间耗尽（会话路由堆积） |
| 2 | 排队消息不发送 | 输入框排队后无反应 | 会话恢复事件丢弃未投递队列（`session_resumed`） |
| 3 | Everything MCP 反复实例 | 十几个重复进程 | stdio MCP "每会话 spawn 一份"的模型 + 会话关闭不回收 |
| 4 | 向日葵手机端显示离线 | 电脑上客户端一切正常 | 到 Oray 服务器的连接被切断后重连全部失败 |

## 一、ZCode 渲染进程 OOM 崩溃

**证据**（崩溃转储 `~/.zcode/v2/crash/archive/*.dmp.json`）：

```
process_type:          renderer
oomKind:               js_heap_exhausted
v8-oom-location:       MarkCompactCollector: young object promotion failed
oldSpaceBytes:         1102997094      // 1.03 GB JS 堆打满
mainCageLastAllocStatus: ran out of reservation   // 4 GB 地址空间耗尽
memoryAllocatorBytes:  4249050153      // 4.05 GB
```

崩溃时挂着 205 条会话路由、49 个 ZCode.exe 进程、99 个 node 子进程。

**根因是三层累积器叠加**：

1. **列表条目 ≠ 进程**。会话库里 1136 条记录（其中 766 条是 workflow 子会话），每条几百字节，本身撑不死渲染进程；真正吃内存的是"打开过且没关"的会话视图状态（205 条路由）。
2. **会话恢复是默认行为**。ZCode 重启时会把之前打开的会话恢复，每个恢复的会话重新拉起引擎与各自的 MCP 子进程——重启后立刻又能看到上百个 node。
3. **"关闭"是最小化到托盘**。窗口 × 不等于退出，打开的会话只进不出，配合上一条就是只涨不跌的累积。

**处置**：强杀整棵进程树（ZCode.exe 49 个 + node 99 个）后干净重启，renderer 恢复为 1。

**一个容易误判的坑**：在 DSH 里替用户启动 ZCode 时连续报"立刻退出、退出码 0/9"，看起来像安装损坏。真相是 `ELECTRON_RUN_AS_NODE=1` 藏在进程环境里（注册表没有），带它启动 Electron 会退化成纯 Node 模式，把 `--remote-debugging-port` 当非法参数直接退出。**替别的进程拉起 Electron 应用前必须先剔除该环境变量**；用户自己双击快捷方式不受影响。

**长期解法**：定期归档旧会话 + 别让托盘驻留无限累积 + MCP 走共享实例（见第三节）。

## 二、消息队列的 `session_resumed` 丢弃机制

**现象**：在 ZCode 里排队（queue）的消息，对话结束后没有自动发送。

**证据**（会话库 `session_input` 表，全表统计）：

```
promoted（正常投递）  3811 条
cancelled（用户删除）  188 条，reason 全部 = user_removed
discarded（被丢弃）     10 条，reason 全部 = session_resumed   ← 零例外
```

且两条被怀疑"没发出去"的消息，`promoted_message_id` 在 `message` 表里都能查到——**它们其实已经作为用户消息进入会话了**。

**结论**：ZCode 的队列消息只在会话活跃时被消费；**会话一旦经历恢复（崩溃重启/手动 resume），队列里未投递的消息被一律丢弃，不补发**。设计上可以理解为"恢复后的上下文可能已变，重投旧指令有风险"，但对用户就是消息静默蒸发。

**操作建议**：崩溃或重启后，去队列里检查滞留消息、重要的重新发一次；跨重启的指令不要只靠排队。

## 三、Everything MCP 重复实例与全端共享收敛

**现象**：`everything-mcp` 在任务管理器里出现 11 份，每份 3 个进程（`everything-mcp.exe → python → python`）共 33 个进程、约 0.5–0.7 GB。

**关键证据**：追父进程链发现真相分两类——

- 10 份直接挂在 ZCode 主进程下（5 个不同 ZCode PID），每份对应一个打开的会话。**MCP 的 stdio 服务器是"每会话 spawn 一份"的设计，会话关闭不回收。**
- 1 份挂在 `mcp-proxy → python → uvx → uv → everything-mcp` 链下——这是 **8943 端口的共享 HTTP 实例本体**，服务着 Claude/Codex/DSH 等多个端，**不是浪费**。盘点重复实例时别把它算进去。

**处置**：把各端配置里"有共享 HTTP 等价物却还用 stdio"的项统一改指向共享实例：

| 端 | 改动 | 指向 |
|---|---|---|
| ZCode | everything | 8943 |
| Claude | memory / everything / playwright | 8941 / 8943 / 8931 |
| Codex | memory / everything / playwright（并删对应 `.env` 子表） | 8941 / 8943 / 8931 |
| CodeBuddy | everything | 8943 |
| OpenCode | everything（local → remote） | 8943 |

效果：everything-mcp 从 11 份降到 2 份，新会话不再各自 spawn npx 类 MCP。**三处刻意不动**：CodeBuddy 的 Playwright 是 `@executeautomation` 不同实现（换掉会整套工具变名）；AionUI 的配置在 sqlite 表里且没有 http 格式样本（按端 schema 写、不能猜）；chrome-devtools 的 8945 共享实例根本没在任何托管 profile 里（改了就是直接断）。

**事故教训（配置手术）**：改 Codex 的 TOML 时第一版用带 lookahead 的正则做块替换，**把 memory/playwright/burp/excel 等一连串块全吞掉了**——非贪婪匹配跨空行时 lookahead 会跳到更远的块头，中间的块就被替换掉。修复：立即从备份恢复，改用**逐行状态机**（跟踪当前 section，命中目标块就重写块体、跳过旧行），并用"块头清单前后对照"验收。最终 diff 精确 22 行、18 个块头完整。

## 四、Edge 接不了 reCAPTCHA：扩展排查

**现象**：同一网络下 Firefox 能正常完成 reCAPTCHA 验证，Edge 卡在验证环节。

**证据**（Edge 的 `Secure Preferences` 扩展清单）——Edge 上同时有 **4 个直接改造 Google/reCAPTCHA 加载路径的扩展**：

| 扩展 | 行为 |
|---|---|
| 在中国大陆不翻墙使用ReCAPTCHA（v0.0.0.2，极旧） | 改写 reCAPTCHA 加载域名/路径 |
| Gooreplacer | Google 域名重定向，可能覆盖 `gstatic`/`recaptcha` |
| Buster: Captcha Solver | 注入 recaptcha 挑战页，自动点音频挑战 |
| Captcha Solver（另一个） | 同功能，与 Buster 打架 |

**结论**：新版 reCAPTCHA 走行为分析与动态脚本加载，四层改造任何一层对不上就表现为"接不了手"；两个"自动解验证码"扩展更是主动把自己标记成机器人。**处置：删 3 个（两个 Captcha Solver + 与篡改猴重复的暴力猴）、停用 2 个域名改造类，InPrivate 窗口（默认禁用扩展）做交叉验证。** 根治思路：让 Edge 走和 Firefox 同一条代理线路，而不是靠扩展魔改域名。

## 五、向日葵 AweSun 被控端"假在线"

**现象**：电脑上 AweSun 客户端显示正常，手机 App 却显示"设备已离线"、无法发起远控，只能请人重启电脑才恢复。

**证据**（AweSun 服务日志，GBK 解码，时间线完整）：

| 时间 | 日志 |
|---|---|
| 16:11:19 | `[proactive::keepalive] ... disconnect by proactive keepalive timeout` —— 主通道心跳 30 秒无响应被主动断开 |
| 16:11:41 | `[online] online disconnected` → `[client] change status from online to offline` ← **手机上"离线"从这一刻开始** |
| 16:11:58 起 | 无限重试登录 `rc10biz.oray.com:443`，**每次 20 秒才失败**，errorcode `57349`，持续 12 分钟 |
| 16:23:57 | 服务器返回畸形登录响应 `invalid REMT_LOGIN_RES_STRUCT` |
| 16:24:15 | 人为重启，服务收到关机信号正常退出 |
| 16:25:19 | 重启后重新登录成功 |

**根因**：本地客户端界面亮的"在线"只是进程状态，实际 16:11 就已断线，之后 12 分钟重连全部失败。触发源两个候选：**内网/校园网防火墙对长连接做超时切断**（当时在内网 172.16 段，且到阿里云节点的连接 20 秒才失败），或 **aTrust 等零信任 VPN 的路由劫持**把 Oray 流量导去不通的路径。

**防复发**：配一条不依赖 Oray 服务器的备用通道——本机 Tailscale 常驻，手机装 Tailscale 后可用 RDP 直连；向日葵再离线也能从隧道进来自救。

## 横向经验

1. **"本地界面正常"不等于"服务在线"**。向日葵/微信类客户端的本地 UI 只反映进程和账号，不反映心跳。判断在线与否要看日志里的心跳/重连记录，或者换一个端点（手机、服务器侧）验证。
2. **会话恢复是隐形累积器**。恢复会话会重拉引擎与 MCP、丢弃未投递队列；崩溃重启前的状态不能默认可续。
3. **stdio MCP 是按会话计费的**。每开一个会话就 spawn 一套子进程，多窗口场景应改走共享 HTTP 端点；盘点时先追父进程链，避免把共享实例误当重复。
4. **配置手术禁用带 lookahead 的正则块替换**。TOML/YAML 的空行会让非贪婪匹配跨段吞块；用逐行状态机 + 块头清单校验。
5. **先挖日志与数据库，再谈猜测**。四起故障的结论都来自日志行、dmp 字段、DB 表统计和进程父子链——不是"感觉像"。日志里的 error code（如 57355/57349）比界面文案可信得多。
