---
title: Codex 多窗口 MCP 进程复用方案
date: 2026-04-27 20:01:15
permalink: /2026/04/27/博览知识/Codex-多窗口-MCP-进程复用方案/
categories:
  - 博览知识
tags:
  - 博览知识
  - Codex
  - MCP
created: 2026-04-27T20:01
updated: 2026-04-27T20:01
---

## 核心结论

Codex 多窗口重复拉起 MCP 进程，根源通常是 stdio MCP 由每个 Codex 窗口或会话各自启动。窗口越多，本地 MCP 进程越容易成倍增加。

解决思路是把适合共享的 MCP 改成常驻 HTTP 服务：本机只启动一个 daemon，所有 Codex 窗口都连接同一个 `127.0.0.1:端口`。这样做到“开过一次就复用”，而不是每个窗口重复拉起一套 stdio 进程。

不适合共享的 MCP 继续保留按需 stdio，例如 Serena、Word、Excel、PowerPoint。它们往往和项目状态、语言服务器、Office COM 或桌面状态强相关，强行共享可能造成跨窗口状态污染。

## 当前采用的方案

共享型 MCP 使用 HTTP daemon：

```text
context7        远程 HTTP MCP
playwright      http://127.0.0.1:8931/mcp
memory          http://127.0.0.1:8941/sse
filesystem      http://127.0.0.1:8942/sse
everything      http://127.0.0.1:8943/sse
markitdown      http://127.0.0.1:8944/sse
chrome-devtools http://127.0.0.1:8945/sse
sqlite          http://127.0.0.1:8946/sse
```

数据文件保持原路径：

```text
memory:
C:\Users\glj07\AppData\Roaming\Codex_Assistant\memory.jsonl

sqlite:
C:\Users\glj07\AppData\Roaming\Codex_Assistant\mcp-data\codex-mcp.sqlite
```

本地 daemon 统一绑定 `127.0.0.1`，不开放到局域网。

## 管理脚本

MCP profile 和 daemon 管理集中在：

```text
C:\Users\glj07\.codex\mcp\Set-CodexMcpProfile.ps1
C:\Users\glj07\.codex\mcp\Ensure-CodexMcpHttpDaemons.ps1
C:\Users\glj07\.codex\mcp\Stop-CodexMcpHttpDaemons.ps1
```

查看当前 MCP 配置：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\glj07\.codex\mcp\Set-CodexMcpProfile.ps1 -Profile status
```

切到 full：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\glj07\.codex\mcp\Set-CodexMcpProfile.ps1 -Profile full
```

含 HTTP MCP 的 profile 会先调用 Ensure 脚本。Ensure 脚本的关键逻辑是先检查端口和 pid：端口已被对应服务占用时直接复用，端口未监听时才隐藏启动 daemon。重复运行不应新增同类 daemon 进程。

## Profile 策略

不要默认长期全开 full。按任务选择最小 profile：

```text
minimal        只保留 context7，适合多窗口长期闲置
core           context7 + memory_http + filesystem_http
research       core + everything_http + markitdown_http
browser        core + playwright_http
debug-browser  browser + chrome-devtools_http_proxy
office         research + word/excel/powerpoint stdio
code           core + serena stdio
full           共享型 HTTP MCP 全开，状态复杂项仍按需 stdio
```

原则是：任务需要什么就开到什么程度。需要本地记忆和文件访问时用 core；需要本机搜索和文档转换时用 research；需要浏览器自动化时用 browser；需要广覆盖时才用 full。

## Codex 重启后的效果

如果当前 profile 已配置为包含 HTTP MCP，Codex 启动后会通过配置连接这些本机 HTTP endpoint。daemon 没启动时由 Ensure 脚本拉起；已经启动时直接复用。

实际效果是：

```text
开第一个 Codex 窗口
-> HTTP MCP daemon 被启动

再开第二、第三个 Codex 窗口
-> 连接已有 127.0.0.1 端口
-> 不再为 memory/filesystem/everything/markitdown/playwright/sqlite 各自重复拉起一套进程
```

不开 Codex 时，不需要主动开启 MCP。Codex 相关 profile 或 watcher 触发时再按需确保 daemon。

## 验证方法

检查 profile：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\glj07\.codex\mcp\Set-CodexMcpProfile.ps1 -Profile status
```

检查端口监听：

```powershell
Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 8931,8941,8942,8943,8944,8945,8946 -State Listen
```

检查对应进程命令行：

```powershell
Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 8941 -State Listen |
  ForEach-Object {
    Get-CimInstance Win32_Process -Filter "ProcessId=$($_.OwningProcess)" |
      Select-Object ProcessId,CommandLine
  }
```

重点确认：

```text
8941 memory 命令行包含：
C:\Users\glj07\AppData\Roaming\Codex_Assistant\memory.jsonl

8946 sqlite 命令行包含：
C:\Users\glj07\AppData\Roaming\Codex_Assistant\mcp-data\codex-mcp.sqlite
```

## 常见误区

第一个误区是把所有 MCP 都改成共享 HTTP。Serena 和 Office 类 MCP 不建议强行共享，因为它们有项目状态、语言服务器状态或桌面状态。

第二个误区是认为 full 越全越好。full 适合需要广覆盖的阶段，不适合每个长期闲置窗口都默认打开。

第三个误区是看到端口被占用就杀进程。端口被占用可能正是“已启动可复用”的正常状态，应先看命令行确认是不是预期 daemon。

第四个误区是手工猜 endpoint。有些 proxy 服务实际验证可用的是 `/sse`，Playwright 使用 `/mcp`。应以脚本验证成功的配置为准。

## 记忆要点

稳定方案不是“每个窗口都少开 MCP”，而是“共享项 HTTP 化，复杂项按需 stdio”。

真正要检查的是：

```text
profile 是否正确
HTTP daemon 是否只启动一份
端口是否监听在 127.0.0.1
memory/sqlite 是否仍指向原数据文件
切换 profile 后是否重启或新开窗口生效
```

这样既能保留 MCP 能力，又能避免 Codex 多窗口把本地进程重复拉满。
