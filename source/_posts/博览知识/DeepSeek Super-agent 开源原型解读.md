---
title: DeepSeek Super-agent 开源原型解读
permalink: '/2026/11/03/博览知识/DeepSeek Super-agent 开源原型解读/'
date: 2026-11-03 16:00
created: 2026-11-03T16:00
updated: 2026-11-03T16:00
categories:
  - 博览知识
tags:
  - AI
  - DeepSeek
  - Agent
---

> 整理自程序员鱼皮公众号文章《DeepSeek 开源超级 Agent，牛逼！》（2026-11-03，[原文链接](https://mp.weixin.qq.com/s/GXO61gvQ09G_gZy2E3U25Q)），配图见原文；并补了本机下载开源原型的第一手信息。原文作者：程序员鱼皮。

## 一句话总结

DeepSeek Harness 团队提出 **Super-agent** 架构：把 Agent 从"单次会话"里解绑，让它像一个常驻的项目团队——跨渠道记上下文、同时推进多件事、被环境事件驱动、出问题能自恢复。研究原型已开源（MIT），几天 1.4 万+ Star。

- 仓库：<https://github.com/deepseek-ai/dsh-superagent-prototype>
- 定位：**研究原型，不是产品**；官方明说部分文章里的设计尚未实现。

## 为什么需要 Super-agent

现在的 Agent（Claude Code / Codex / DeepSeek Harness）都以会话为单位跑 **ReAct Loop**：想一步、做一步、看结果。单任务没问题，多任务就崩：

1. 会话之间互相隔离，跨任务信息全靠人肉搬运——人成了 AI 之间的传话筒。
2. 一个人同时只能跟进 3–5 个活跃会话。**单任务上限取决于模型，多任务上限取决于人的注意力。**
3. 给单会话接上飞书/GitHub 也不行，三个毛病：跑耗时命令时整个循环卡住；多需求堆一个会话上下文越来越乱；跑在本地电脑上，机器一休眠它就停。

作者的实测例子：让 Agent 跑 `sleep 45 && echo 构建完成`，期间问它"周会几点"，消息被排队 50 秒直到构建完成才回复。

## Super-agent 的四个特征

| 特征 | 含义 |
|---|---|
| 连续 | 飞书群说的方案 A，GitHub PR 里改成方案 B，它也能跟上 |
| 高效 | 上一件事没干完，也能接下一条指令 |
| 主动 | 自己盯群消息和工单，该处理的处理，不该管的安静 |
| 持久 | 一直在线，出问题能自恢复 |

和 **Agent Team** 的区别：Agent Team 解决"一个大任务怎么拆"，Team Lead 要亲自下场协调；Super-agent 解决"很多个任务怎么分"，领头的只管派活和关联判断。和 **Personal Agent** 的区别：后者是产品形态，Super-agent 是撑起它的底层架构。

## 架构五大模块

### 1. 双层架构：项目经理 + 工程师

- **Router 层**（项目经理）：常驻在线，收所有渠道消息，记住全局、跟人沟通、给 Worker 派活。只派活不干活——甚至可以不给它终端工具，且用轻量模型就够。
- **Worker 层**（工程师）：每个 Worker 独立上下文，专注一件事，干完汇报给 Router 统一对外回复。Worker 才需要最强模型。

Router 不会被消息压垮：消息**攒一批一起处理**（批处理），读 5 条和读 1 条耗时差不多，慢的是"写"，而 Router 每次只写几句派活的话——消息越多平均越快。

### 2. 事件驱动：Trigger + 两级过滤 + 直通

- 事件统一叫 **Trigger**：群消息、PR 评论、CI 失败。
- **门卫（快路径）**：纯代码判断来源（监听的群？白名单的人？），不花钱。
- **秘书（慢路径）**：大模型按规则判断内容要不要处理（闲聊"中午吃啥"→不管；"切换会话偶发白屏"→处理）。这就是系统的 Fast Path / Slow Path。
- **Thread 直通**：一个 PR/话题/邮件串=一个工单。Worker 接手后订阅它，后续消息程序直接送达，不再经过 Router。实测去掉直通：完成速度基本不变，但 Router 决策多 ~30%、token 多 ~37%。

### 3. 上下文供给：Inline / Spill / Chain of Recall

> "浪费上下文窗口，就是浪费模型的智能。"

借用编译器概念：**Inline**（内联，附前后几句关键上下文）与 **Spill**（溢出，只给摘要+"完整内容见 X"，DeepSeek Harness 终端输出超限转存临时文件就是这个思路）。全站给消息/工单/Worker 编号，卡片只写摘要+编号，跨平台追旧事顺着编号链式召回——**Chain of Recall**。

### 4. 投机执行：靠谱同事提前把活干了

CPU 的 Speculative Execution 用到协作上：收到会议邀请，先后台核对日程、查背景、备好草稿。DeepSeek 内部配了"静默复现并修复"规则：用户还在群里讨论波浪号渲染成删除线该修哪层，修复 PR 已经交上来了。

安全边界：主动行为必须有团队预设规则，且默认先开**观察模式**（只记录打算做什么，不真动手）。

### 5. 交互与部署：全双工 + 存算分离 + BYOM + Watchdog

- **全双工**：把 ReAct 的"对讲机"换成"电话"——耗时工具调用改异步，命令一启动就返回，Agent 边跑边聊，结果作为新消息回送。作者实测：同样 45 秒构建命令，这次 3 秒回复"已启动"，构建完成主动汇报。
- **渠道分级话术**：飞书只在需要拍板时说话、单次回复 ≤100 词；GitHub/邮件要写清背景、改动、验证。
- **存算分离**：计算放云端可替换容器，会话状态进数据库，容器挂了换一个，记录不丢。
- **BYOM**（Bring Your Own Machine）：环境搬不动就不搬——云端做大脑，本地只装一个轻 daemon 按指令执行、回传结果；笔记本今天没开机，上线后云端补做。
- **Watchdog**：独立"值班主管"会话定时巡查。重点不是"在不在岗"，而是**任务有没有进展**——Agent 出事常见形态不是进程挂了，而是模型原地打转/跑偏。

## 实验数据

约 300 条消息/次、其中只有 ~20 条正经活，对比 Super-agent vs 单会话+Subagent：

| 方案 | 中位完成 | 95% 完成 |
|---|---|---|
| Super-agent | 12.4 min | 15.7 min |
| 单会话·普通提示 | 5 次实验 0 次派活给 Subagent | 29.5 min |
| 单会话·劝它派活 | 5 次里 4 次照做 | ~29 min |

结论："靠制度管人，比靠自觉靠谱"——与其用提示词劝模型分工，不如架构上规定死。
代价：多会话并存使读缓存 token 是单会话的 **2–4 倍**；且是模拟环境，初步参考。

## 官方留下的开放问题

1. 规模再大、跑上几个月，一个 Router 还够吗？长期记忆怎么办？
2. 人不盯会话之后，用什么界面跟 Agent 协作？
3. 私人助理与团队共用 Super-agent 之间，怎么配合又不泄隐私？
4. Agent 越主动，接触的不可信信息越多——**提示词注入**怎么防？（作者认为安全是最大的坎：敢不敢让 AI 24 小时盯群、操作你的电脑？）

## 本机下载记录（2026-11-03 实测）

`git clone` 直连 `github.com` 被连接重置（`Recv failure: Connection was reset`），但 `api.github.com` 和 `codeload.github.com` 可达。于是走 codeload 拿 main 分支 tarball 快照解压到：

```
C:\Users\glj07\Desktop\琉璃幻彩的文件\23-AI与开发项目\dsh-superagent-prototype
```

- 仓库元数据（API 实测）：**14,742 stars**，size 775 KB，`main` 分支，MIT，简介 *"Towards a More Autonomous Agent System"*。
- 快照不含 `.git` 历史；热点/家里网络下可补全：`git clone https://github.com/deepseek-ai/dsh-superagent-prototype.git`。
- 结构：TypeScript + pnpm，`src/{core,app,client,executor,infra,sources}`、`prompts/team`、`skills/dsh-superagent-{feishu,github}`、`docs/000-008`（philosophy → architecture/cookbook 编号递进）、`tests`。
- README 关键信息：它是给**单个 GitHub 仓库**用的主动编码 Agent，作为 DeepSeek Harness 的 bundle 分发；监听 GitHub（可选飞书）；白名单的人提需求→开工作项→独立会话干活→在原会话答复（比如交 PR）；有 Web 面板显示"需要人拍板"的事。安装方式本身就很 Agent-first：让编码 Agent 读 `SETUP.md` 带着你一步步装。开发入口 `pnpm check`（typecheck+test+build）。
- 安全提醒：未审读的他人代码不要直接执行；本地只做静态阅读，跑之前先看 `docs/002-authorization.md` 和部署文档。

## 最后

DeepSeek 自己说没提出新理论，只是把计算机系统的经典思想（批处理、快慢路径、投机执行、存算分离、看门狗）搬到了 Agent 上。作者的落点更直白：**AI 不缺干活能力，缺的是组织能力。** 以后的人机分工可能是：你带着一个 AI 团队，只负责拍板和验收。
