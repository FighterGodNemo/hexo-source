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
updated: 2026-04-28T12:49
---

## 核心结论

Codex 多窗口重复拉起 MCP 进程，根源通常是 stdio MCP 由每个 Codex 窗口或会话各自启动。窗口越多，本地 MCP 进程越容易成倍增加。

解决思路是把适合共享的 MCP 改成常驻 HTTP 服务：本机只启动一个 daemon，所有 Codex 窗口都连接同一个 `127.0.0.1:端口`。这样做到“开过一次就复用”，而不是每个窗口重复拉起一套 stdio 进程。

不适合共享的 MCP 继续保留按需 stdio，例如 Serena、Word、Excel、PowerPoint。它们往往和项目状态、语言服务器、Office COM 或桌面状态强相关，强行共享可能造成跨窗口状态污染。

## 最终采用的方案

MCP 服务不再绑定 Codex 进程。最终方案是把共享型 MCP 做成本机独立 HTTP daemon，由手动命令或 Windows 登录自启动统一拉起；Codex、Cherry Studio 或其他客户端都连接同一组 `127.0.0.1` 端口。

日常默认 profile 是 `shared`，它包含所有适合跨客户端复用的 MCP：

```text
context7        远程 HTTP MCP
playwright      http://127.0.0.1:8931/mcp
playwright_cherry http://127.0.0.1:8937/mcp
memory          http://127.0.0.1:8941/sse
filesystem      http://127.0.0.1:8942/sse
everything      http://127.0.0.1:8943/sse
markitdown      http://127.0.0.1:8944/sse
chrome-devtools http://127.0.0.1:8945/sse
sqlite          http://127.0.0.1:8946/sse
```

`playwright_cherry` 只给 Cherry Studio 使用，不写入 Codex 的 `config.toml`。`chrome-devtools` 默认不启用，只在 `debug-browser` profile 中按需打开。

数据文件保持原路径：

```text
memory:
C:\Users\glj07\AppData\Roaming\Codex_Assistant\memory.jsonl

sqlite:
C:\Users\glj07\AppData\Roaming\Codex_Assistant\mcp-data\codex-mcp.sqlite
```

本地 daemon 统一绑定 `127.0.0.1`，不开放到局域网。

## 一键控制命令

最终控制器放在用户目录：

```text
C:\Users\glj07\mcpctl.py
```

常用快捷命令：

```cmd
mcp-start
mcp-status
mcp-stop
mcp-restart
```

等价的总入口写法：

```cmd
mcp start
mcp status
mcp stop
mcp restart
```

`mcp-start` 默认等价于：

```cmd
mcp start shared
```

也可以指定 profile：

```cmd
mcp-start browser
mcp-start db
mcp-start debug-browser
mcp-start full
```

直接运行 Python 脚本也可用：

```cmd
python C:\Users\glj07\mcpctl.py
python C:\Users\glj07\mcpctl.py start
python C:\Users\glj07\mcpctl.py status
```

无参数时默认显示 `status`，避免报缺少 command。

这些快捷脚本同时放在：

```text
C:\Users\glj07\
C:\Users\glj07\.local\bin\
```

`C:\Users\glj07` 已加入用户 PATH。新开的 cmd 可直接输入 `mcp-start`。

## 双击行为

快捷 `.cmd` 支持双击使用：

```text
mcp.cmd
mcp-start.cmd
mcp-stop.cmd
mcp-status.cmd
mcp-restart.cmd
mcp-auto-on.cmd
mcp-auto-off.cmd
```

双击时窗口会停在最后的 `Press any key to continue . . .`，不会闪退。

其中 `mcp.cmd` 是总入口。双击无参数时默认执行 `status`；在命令行中带参数调用时不会强制暂停。

## Profile 策略

日常不要默认长期使用 `full`。按任务选择最小 profile：

```text
minimal        只保留 context7，适合多窗口长期闲置
core           context7 + memory_http + filesystem_http
research       core + everything_http + markitdown_http
browser        core + playwright_http
debug-browser  browser + chrome-devtools_http_proxy
office         research + word/excel/powerpoint stdio
code           core + serena stdio
db             research + sqlite_http
shared         共享型 HTTP MCP 全开，不含 stdio 状态型服务；含 Cherry 专用 playwright_cherry
full           shared + word/excel/powerpoint/serena stdio
```

`shared` 是最佳日常档，适合 Codex 和 Cherry Studio 共用。它只启用可复用的 HTTP/SSE MCP，不会因为多开窗口而重复拉 memory、filesystem、everything、markitdown、playwright、sqlite。Cherry 专用的 `playwright_cherry` 也由 shared 一起维护，但 Codex 不连接它。

`full` 不是日常默认档。它会额外带上 `word/excel/powerpoint/serena`，这些是 stdio 或状态型 MCP，多窗口、多客户端场景下仍可能按窗口各起一套。只有确实需要 Office 或 Serena 时再切到 `full`。

## 开机自启动

如果希望登录 Windows 后自动启动共享 MCP 服务，使用：

```cmd
mcp-auto-on
```

当前采用的是启动文件夹方案，不使用计划任务：

```text
C:\Users\glj07\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\Shared-MCP-HTTP-Daemons.vbs
```

该 VBS 登录后隐藏执行：

```powershell
Ensure-CodexMcpHttpDaemons.ps1 -Profile shared -StopUnused
```

关闭开机自启动：

```cmd
mcp-auto-off
```

它会删除启动文件夹中的 VBS，并清理旧的 Codex Pulse/Watcher 任务。

旧的 Codex 绑定监听任务应保持不存在：

```text
Shared MCP HTTP Daemons Autostart: absent
Codex MCP HTTP Daemon Pulse: absent
Codex MCP HTTP Daemon Watcher: absent
```

`mcp-status` 中若显示：

```text
Startup folder
ON  ...\Startup\Shared-MCP-HTTP-Daemons.vbs
```

表示开机自启动已启用。

## 当前客户端连接方式

Codex 的 `config.toml` 仍然指向这些 HTTP/SSE endpoint。Cherry Studio 或其他客户端也应优先连接同一组端口，而不是再配置 stdio 版本重复拉进程。

推荐流程：

```text
Windows 登录
-> 若启用 mcp-auto-on，shared MCP 自动隐藏启动

打开 Codex / Cherry Studio
-> 客户端连接已有 127.0.0.1 端口
-> 不再为共享型 MCP 重复拉起一套进程
```

如果没有启用开机自启动，就在使用客户端前手动运行：

```cmd
mcp-start
```

## Codex 与 Cherry 的 Playwright 分流

Playwright MCP 的截图返回格式需要分流处理。Codex 自己应保留完整能力，Cherry Studio 则需要 text-only 兼容输出，避免 Claude/Cherry 历史里出现 `image`、base64、`tool_reference`、`resource_link` 等非文本 content block 导致格式报错。

最终边界如下：

```text
Codex:
playwright -> http://localhost:8931/mcp
启动参数 -> @playwright/mcp ... --shared-browser-context --image-responses allow
截图返回 -> text,image

Cherry Studio:
codex-playwright -> http://localhost:8937/mcp
启动参数 -> @playwright/mcp ... --isolated --image-responses omit
截图返回 -> text
```

关键原则：不要为了 Cherry 的格式兼容去修改 Codex 的 8931 服务。Cherry 只改自己的用户 MCP 配置，让 `codex-playwright` 指向 8937；Codex 的 `config.toml` 继续只指向 8931。8937 必须用 `--isolated`，否则两个 Playwright MCP 会争用同一个 shared browser profile，反过来影响 Codex 截图。

这意味着看到两个 Playwright MCP 服务时不一定是重复误启动：

```text
8931 = Codex 完整截图能力
8937 = Cherry text-only 兼容截图能力
```

二者是有意分流，因为同一个 Playwright MCP 进程不能同时满足“Codex 需要图片 content block”和“Cherry 只能稳定吃文本 content block”这两种输出要求。复核时要看 8931 截图是否返回 `text,image`，8937 截图是否只返回 `text`。

## 验证方法

查看共享 MCP 状态：

```cmd
mcp-status
```

典型结果：

```text
ON  playwright      http://127.0.0.1:8931/mcp
ON  playwright_cherry http://127.0.0.1:8937/mcp
ON  memory          http://127.0.0.1:8941/sse
ON  filesystem      http://127.0.0.1:8942/sse
ON  everything      http://127.0.0.1:8943/sse
ON  markitdown      http://127.0.0.1:8944/sse
OFF chrome_devtools http://127.0.0.1:8945/sse
ON  sqlite          http://127.0.0.1:8946/sse
```

检查端口监听也可以用 PowerShell：

```powershell
Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 8931,8937,8941,8942,8943,8944,8945,8946 -State Listen
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

重复执行：

```cmd
mcp-start shared
```

如果只显示 `already listening`，说明没有重复拉新进程。

## 常见误区

第一个误区是把所有 MCP 都改成共享 HTTP。Serena 和 Office 类 MCP 不建议强行共享，因为它们有项目状态、语言服务器状态或桌面状态。

第二个误区是认为 `full` 越全越好。真正适合日常多客户端共用的是 `shared`。`full` 适合需要 Office 或 Serena 的阶段，不适合每个长期闲置窗口都默认打开。

第三个误区是看到端口被占用就杀进程。端口被占用可能正是“已启动可复用”的正常状态，应先看命令行确认是不是预期 daemon。

第四个误区是手工猜 endpoint。有些 proxy 服务实际验证可用的是 `/sse`，Playwright 使用 `/mcp`。应以脚本验证成功的配置为准。

第五个误区是用 `mcp-all-in-one` 作为默认聚合层。它可以做聚合展示，但如果聚合 stdio MCP，可能重新引入重复子进程和工具名歧义。当前最佳默认是让客户端直连现有 HTTP/SSE daemon。

第六个误区是为了解决 Cherry 的截图格式报错，把全局 Playwright MCP 都改成 `--image-responses omit`。这会折损 Codex 自己的截图能力。正确做法是保留 8931 完整输出，另起 8937 给 Cherry。

第七个误区是让 8931 和 8937 都使用 `--shared-browser-context`。这样两个服务可能抢同一个浏览器 profile，导致 8931 报 `Browser is already in use`。8931 用 shared，8937 用 isolated。

## 记忆要点

稳定方案不是“只给 Codex 开 MCP”，而是“共享项 HTTP 化，复杂项按需 stdio，服务独立于具体客户端”。

真正要检查的是：

```text
mcp-status 是否正常
shared HTTP daemon 是否只启动一份
端口是否监听在 127.0.0.1
memory/sqlite 是否仍指向原数据文件
旧 Codex Pulse/Watcher 是否 absent
启动文件夹自启动是否按需 ON/OFF
客户端配置是否连接同一组 HTTP/SSE endpoint
Codex Playwright 是否仍走 8931 完整输出
Cherry codex-playwright 是否走 8937 text-only 输出
```

这样既能保留 MCP 能力，又能避免 Codex、Cherry Studio 或其他客户端把本地 MCP 进程重复拉满。
