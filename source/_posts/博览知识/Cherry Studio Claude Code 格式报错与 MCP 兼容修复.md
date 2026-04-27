---
title: Cherry Studio Claude Code 格式报错与 MCP 兼容修复
permalink: /2026/04/27/博览知识/Cherry Studio Claude Code 格式报错与 MCP 兼容修复/
date: 2026-04-27 21:20:00
categories:
  - 博览知识
tags:
  - CherryStudio
  - MCP
  - LMStudio
created: 2026-04-27T21:20
updated: 2026-04-27T21:38
---

## 问题现象

Cherry Studio 在使用本地 LM Studio 模型时，Agent/Code 通道报错：

```text
AI_ProviderSpecificError
Claude Code returned an error result: API Error: 400
request.messages.17.content.0.content.0.type: Invalid literal value, expected "text"
```

表面看起来像是 Claude 相关错误，但实际使用的是 LM Studio。原因是 Cherry 的 Agent/Code 能力底层复用了 Claude Code/Anthropic 消息协议栈，模型供应商可以是 LM Studio，只是错误来源仍会显示 `Claude Code`。

## 根因判断

这类错误不是模型能力不足，而是请求消息格式不被上游接受。

典型触发链路：

1. Cherry Agent 调用了 MCP、skill 或工具。
2. 工具结果被写入会话历史。
3. 历史中出现了非 Anthropic 标准 `text` 块，例如 `mcp_tool_result`、`server_tool_use`、图片块、嵌套工具结果数组、`thinking` 块等。
4. 下一轮请求重新带上这些历史内容。
5. Anthropic/Claude Code 兼容通道校验失败，返回 `expected "text"`。

另一个复发点是 Cherry 会保存 Claude Code SDK 的 `agent_session_id` 续接信息。旧 session 一旦保存过坏格式工具结果，换模型后仍可能继续复发，因为坏历史还在被续接。

## 修复思路

不能直接改 Cherry 安装目录，也不应该大范围改所有 provider 配置。比较稳的做法是：

1. 只在 LM Studio 的 Anthropic/Claude Code 兼容入口前加一层本地代理。
2. 代理只清洗 `/messages`、`/complete`、`/chat/completions` 这类 JSON 请求。
3. 把非 `text` 工具结果转换成普通文本说明或标准 `tool_result`。
4. 删除上游不兼容的字段，例如 `cache_control`。
5. 清理 Cherry 旧会话里的 `agent_session_id` 续接指针。
6. MCP 启动器统一放到 Codex 的通用目录，避免 Cherry 配置里残留桌面临时路径或明文环境变量。

## 本次实际配置

LM Studio 普通 OpenAI 兼容入口保持不变：

```text
http://localhost:1234
```

LM Studio 的 Anthropic/Claude Code 兼容入口改为：

```text
http://127.0.0.1:32123
```

本地兼容代理文件：

```text
C:\Users\glj07\.codex\cherry\anthropic_lmstudio_compat_proxy.mjs
```

代理启动器：

```text
C:\Users\glj07\.codex\cherry\start_cherry_lmstudio_proxy.cmd
```

代理日志：

```text
C:\Users\glj07\.codex\cherry\anthropic-compat-proxy.log
```

MySQL MCP 通用启动器：

```text
C:\Users\glj07\.codex\mcp\mysql_mcp_node.cmd
```

Cherry 中 MySQL MCP 的稳定启动方式：

```text
cmd.exe /d /c C:\Users\glj07\.codex\mcp\mysql_mcp_node.cmd
```

这样做可以绕过 Windows 下 Electron/Node 直接 spawn `.cmd` 不稳定的问题。

## MySQL MCP 的额外经验

这次还遇到 MySQL MCP 启动后 Cherry 报 `Not connected` 或 `Connection closed`。

排查结论：

- MySQL 本地端口能连。
- 数据库账号、库名可以通过 `mysql2` 连接自测。
- MCP 包本身能初始化。
- 问题主要在 Cherry 启动 Windows `.cmd` 的方式不稳定，以及 npm shim 多一层转发。

最终采用更薄的 wrapper：读取本地配置后，直接调用全局包的 `dist/index.js`。

关键点：

```text
node "%APPDATA%\npm\node_modules\@benborla29\mcp-server-mysql\dist\index.js"
```

并强制保持只读：

```text
ALLOW_INSERT_OPERATION=false
ALLOW_UPDATE_OPERATION=false
ALLOW_DELETE_OPERATION=false
ALLOW_DDL_OPERATION=false
MULTI_DB_WRITE_MODE=false
```

本地凭据放在：

```text
C:\Users\glj07\.codex\mcp\mysql_mcp.local.cmd
```

这个文件不要提交、不要贴到日志或笔记里。

## 验证方法

修复后做了几类验证。

### 代理健康检查

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:32123/v1/models'
```

返回 `200`，说明兼容代理正在工作。

### Cherry 进程检查

应能看到两个关键进程：

```text
lmstudio-proxy
mysql-mcp
```

### Cherry 日志回归检查

重启后检查以下关键字是否新增：

```text
expected "text"
AI_ProviderSpecificError
invalid_request_error
API Error: 400
stream_processing_failed
Error pinging server mysql
Connection closed
```

本次回归结果：测试时间之后这些错误计数均为 0。

### Cherry Claw 实测

通过 Cherry 本地 API 给 `Cherry Claw` 新建测试会话并发送短消息。结果：

- 请求完成，HTTP `200`
- 兼容代理日志出现 `sanitized request`
- 没有新增 `expected "text"`、`AI_ProviderSpecificError`、`invalid_request_error`
- MySQL MCP 仍保持运行

这说明当前 `Cherry Claw + LM Studio + 已配置 MCP/skill` 这条链路已经压住了原来的格式错误。

## 能保证什么，不能保证什么

可以比较有把握地说：

- Cherry Claw 继续使用当前 LM Studio/Claude Code 通道时，MCP、skill、工具产生非 `text` 内容块导致的旧报错已被代理兜住。
- 切换 LM Studio 里的不同模型，通常仍会走同一个代理入口，因此不会因为同一类工具结果格式再次炸掉。
- 旧 session 的续接指针已清理，减少坏历史反复带入请求的概率。

不能绝对保证：

- 任意第三方 provider 永远不会出现任何格式错误。
- 把 Cherry Claw 改成完全绕过该代理的 provider 后，仍然完全兼容。
- 其他类型错误不会发生，例如模型服务宕机、API key 失效、MCP 自身崩溃、网络失败等。

更准确的结论是：

> 本次旧病的核心路径已经被压住：LM Studio 的 Claude Code/Anthropic 兼容请求会经过本地清洗代理，坏工具内容不会再直接污染上游请求。

## 安全提醒

排查时发现 Cherry 历史日志可能出现过明文 API key 或数据库密码。后续建议：

- 轮换 Cherry 本地 API key。
- 轮换 MySQL 密码。
- 清理或妥善保管旧日志和备份。
- 不要在博客、skill、仓库、截图里记录完整密钥。

配置经验上，MCP 凭据应放在本地私有启动器或 `.local` 文件里，Cherry 配置里只保留通用启动命令，不直接写密码。

