---
title: 腾讯 Marvis 客户端“扫盘”与隐私风险取证分析
permalink: '/2026/07/30/Forensic_电子取证/Tencent-Marvis-Privacy-Analysis/'
date: 2026-07-30 15:30:00
updated: 2026-07-30 17:20:00
categories:
  - Forensic_电子取证
tags:
  - 电子取证
  - Forensic
  - 隐私分析
  - 网络取证
  - Windows安全
  - 腾讯Marvis
description: 基于 Windows 本机进程、服务、数字签名、网络连接、本地数据库结构与腾讯官方隐私政策，对 Marvis 文件访问、知识库索引和云端传输边界进行证据分级分析。
keywords: Marvis, 腾讯, 扫盘, 隐私, 本地知识库, 文件索引, 网络取证, Windows取证
cover: https://cdn.jsdelivr.net/gh/FighterGodNemo/CDN/img/forensic-analysis.jpg
---

# 腾讯 Marvis 客户端“扫盘”与隐私风险取证分析

## 前言

我在使用腾讯 Marvis 时观察到持续的磁盘访问，同时发现多个知识库、Agent、Host 和系统服务进程常驻。由于 Marvis 的核心卖点之一就是“理解本地文件”和“构建个人知识库”，文件遍历既可能是正常的索引行为，也可能形成较大的隐私暴露面。

本文不把“扫描文件”“进程联网”和“上传文件”混为一谈，而是按以下证据等级展开：

- **已证实事实**：能够由本机命令、文件结构、数字签名或官方政策直接确认；
- **合理推断**：与产品功能和组件命名一致，但仍缺少文件级监控或协议内容证明；
- **尚未证实**：例如是否无差别扫描全部磁盘、是否批量上传文件原文。

> 本文取证快照时间为 **2026 年 7 月 30 日**，软件和隐私政策更新后，行为可能变化。

<!-- more -->

## 一、先说结论

**Marvis 存在真实的文件访问与本地数据处理能力，但当前证据不足以证明它正在恶意“偷文件”或批量外传整盘内容。**

更准确的判断是：

1. Marvis 为实现文件搜索、文档理解和个人知识库功能，确实会访问并处理文件内容、路径和元数据；
2. 官方隐私政策明确区分“效率模式”和“本地模式”：效率模式可能把摘要或部分数据发送给云端模型，本地模式则声称由本机模型处理；
3. 本机发现了知识库进程、索引构建组件、本地数据库以及持续网络连接，证明其具备“本地处理 + 联网协同”的完整技术链路；
4. 仅凭高内存占用、数据库体积或 `ESTABLISHED` 网络连接，不能推出“正在上传大量文件”；
5. 对存有密钥、聊天记录、取证镜像、案件材料或企业机密的主力电脑来说，即使没有恶意行为，过宽的扫描范围本身也属于**中高风险暴露面**。

综合评级：

- 普通个人电脑、仅授权普通资料目录：**中等风险**；
- 默认或效率模式，并允许访问大范围用户目录：**中高风险**；
- 存有敏感案件材料、密钥、客户数据且未隔离：**高风险**。

---

## 二、取证范围与方法

本次分析采用只读取证，不修改 Marvis 配置，主要检查：

```powershell
# 进程与命令行
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -match '^Marvis' }

# 服务配置
Get-CimInstance Win32_Service -Filter "Name='MarvisSvr'"

# 数字签名
Get-AuthenticodeSignature "D:\Program Files\Tencent\Marvis\Application\1.60.1900.122\Marvis.exe"

# 当前已建立连接
Get-NetTCPConnection -State Established

# 本地数据文件，仅检查路径、体积和 SQLite 表结构
Get-ChildItem "$env:APPDATA\Tencent\Marvis" -Recurse -File
```

### 2.1 本文的取证限制

本次没有执行以下操作：

- 没有用 Process Monitor/ETW 完整记录每一次文件打开；
- 没有对 TLS 流量进行中间人解密；
- 没有逆向全部可执行文件或私有协议；
- 没有读取用户对话、附件或被索引文件的正文内容。

因此，文章可以确认“能访问什么、何时可能上云、当前建立了哪些连接”，但不能仅凭现有证据确定每个网络包的实际载荷。

---

## 三、本机组件与进程结构

### 3.1 运行进程

取证时观察到以下 Marvis 相关进程：

```text
Marvis.exe
MarvisKnowledgebase.exe
MarvisDlSvr.exe
MarvisSvr.exe
MarvisAgent.exe
MarvisHost.exe
MarvisMCP.exe
```

其中 `MarvisKnowledgebase.exe` 出现了两个实例。该多进程结构更符合桌面 AI 产品的模块化设计：主界面、知识库、Agent 执行、下载更新、进程间通信和网络服务各自独立。

需要纠正一个常见误区：

> **进程数量多或内存占用高，不等于恶意监控，也不能单独作为“正在扫盘”的证据。**

`MarvisKnowledgebase.exe` 曾占用约 408 MB 内存，这与本地模型、向量检索、文本解析或缓存都可能有关。真正证明文件遍历范围，需要结合 Process Monitor、ETW 或文件系统审计日志。

### 3.2 安装组件

本机安装位置为：

```text
D:\Program Files\Tencent\Marvis\
```

可见组件包括：

```text
Application\1.60.1900.122\Marvis.exe
Application\1.60.1900.122\MarvisSvr.exe
Application\1.60.1900.122\MarvisHost.exe
Application\1.60.1900.122\MarvisMCP.exe
Application\1.60.1900.122\LocalModelService.exe
Application\1.60.1900.122\GameInfoMCP.exe
Knowledgebase\1.0.1000.215\MarvisKnowledgebase.exe
Knowledgebase\1.0.1000.215\knowledgebase\index_build\
MarvisAgent\1.0.1100.360\MarvisAgent.exe
```

`Knowledgebase` 和 `index_build` 目录直接表明产品包含知识库索引构建能力；但它们仍不能单独证明索引覆盖了所有磁盘。

### 3.3 数字签名

抽查以下核心程序：

- `Marvis.exe`
- `MarvisSvr.exe`
- `MarvisHost.exe`
- `MarvisKnowledgebase.exe`
- `MarvisAgent.exe`

其 Authenticode 状态均为 `Valid`，签名主体为：

```text
Tencent Technology (Shenzhen) Company Limited
```

这说明本机样本来自腾讯签名的软件发布链，降低了“被同名木马替换”的可能性。但数字签名只证明发布者和文件完整性，**不代表软件不存在隐私风险或设计缺陷**。

---

## 四、系统服务与权限边界

### 4.1 MarvisSvr 服务

本机服务配置为：

```text
Name      : MarvisSvr
State     : Running
StartMode : Manual
StartName : LocalSystem
PathName  : D:\Program Files\Tencent\Marvis\Application\1.60.1900.122\MarvisSvr.exe
```

结论：

- 服务为按需启动，不是自动启动；
- `MarvisSvr` 以 `LocalSystem` 身份运行，具有很高的本机权限；
- 但不能据此断言所有 Marvis 进程都以 `LocalSystem` 运行；普通桌面进程仍可能运行在当前用户会话中；
- 高权限服务扩大了潜在影响面，因此服务端 IPC、参数校验、更新机制和文件访问边界值得重点关注。

### 4.2 权限风险的正确理解

风险不只取决于“它现在做了什么”，还取决于：

1. 高权限组件是否能被低权限进程调用；
2. IPC 接口是否验证调用者身份和参数；
3. Agent 是否可执行文件写入、程序启动、系统设置修改等动作；
4. 自动更新链是否保持签名校验；
5. 第三方 Skill、MCP 或插件是否继承了过宽权限。

本文尚未完成上述攻击面验证，因此只将其列为后续审计方向，不直接判定存在漏洞。

---

## 五、“扫盘”行为到底确认到了什么

### 5.1 官方产品功能

Marvis 官网将“文件智能整理搜索”和“个人知识库”作为核心能力，称其可以理解文档、图片内容、图片内文字，并按人物、主题、地点等维度检索。

从功能实现角度看，要做到这些，客户端通常至少需要：

- 枚举被授权目录；
- 读取文件路径、扩展名、大小、时间等元数据；
- 对支持的文档和图片读取内容；
- 生成全文索引、OCR 结果或语义向量；
- 监控文件变化，以便增量更新索引。

因此，用户观察到持续磁盘读取，与知识库初始化或增量索引是相符的。

### 5.2 官方隐私政策明确披露的文件处理

腾讯《Marvis 隐私保护政策（PC 端）》在“文件操作和文档处理功能”中明确表示：当用户使用文件查找、浏览、读写、编辑、整理和搜索功能时，软件会访问、收集和处理本地文件系统中的：

- **文件内容**；
- **文件路径**；
- **文件元数据**。

政策同时说明，文件操作通常在本地环境进行；但当需要 AI 辅助分析、用户主动选择效率模式或分享功能时，相关内容可能发送到云端服务器。

这意味着“扫盘”不能只理解为读取文件名。只要启用了内容搜索、文档理解或图库分类，客户端就可能读取文件正文或图片内容。

### 5.3 尚未证实的部分

当前仍不能确认：

- 是否默认遍历 C、D、E 等全部磁盘；
- 是否只扫描用户选择或系统推荐的目录；
- 是否有明确且完整的排除目录机制；
- 是否会读取 `.ssh`、`.env`、浏览器配置、聊天数据库等敏感位置；
- 是否在后台空闲时持续建立内容级索引；
- 是否把完整文件、文本片段、摘要、向量或仅遥测数据发往云端。

所以，本文使用“文件访问/索引能力”和“可能的大范围扫描”描述，不把“全盘无差别上传”写成既定事实。

---

## 六、效率模式、本地模式与云端边界

### 6.1 效率模式

按 2026 年 7 月 21 日更新、2026 年 7 月 28 日生效的 PC 端隐私政策：

> 效率模式会优先在本地处理用户输入，但本地模型可能把某些摘要或部分数据传输给云端大模型，以便完成指令。

因此，“优先本地处理”不等于“绝不出设备”。当提示词、剪贴板、文件内容或自动化上下文中包含敏感信息时，摘要或片段本身也可能构成泄露。

### 6.2 本地模式

政策称，纯本地模式下，用户主动发送或授权获取的输入内容由部署在本机的大模型处理并返回。

这能显著降低文件内容上云风险，但仍需区分：

- **推理数据**是否上云；
- 登录、更新、崩溃上报、性能遥测等**辅助通信**是否继续发生；
- 第三方服务、插件或用户主动分享是否适用同一承诺。

因此，“本地模式文件 0 上传”应理解为对特定处理链路的产品承诺，不等于客户端完全离线或没有任何网络流量。

### 6.3 隐私政策披露的其他输入

官方政策还提到 AI 对话与自动化执行可能处理：

- 对话输入；
- 用户上传的文件；
- 剪贴板信息；
- 使用时间；
- 对话历史。

这类信息与本地文件索引叠加后，会形成比普通聊天机器人更完整的用户画像和工作上下文。

---

## 七、网络连接分析

### 7.1 本地回环通信

本机观察到多个 `127.0.0.1` 回环连接，例如知识库、Host 与 Agent 之间的通信。这通常用于本地 IPC 或本机 HTTP/RPC 服务。

回环连接本身不代表数据外传，但应关注监听地址：若服务绑定 `0.0.0.0` 或局域网地址，而非仅绑定 `127.0.0.1`，则需要进一步检查防火墙和鉴权。

### 7.2 外部连接

取证时观察到 Marvis 相关进程存在外部连接，例如：

```text
MarvisHost.exe  -> 124.223.136.123:20017
MarvisHost.exe  -> 121.233.239.x:443
MarvisSvr.exe   -> 180.109.156.157:443
```

这些连接证明客户端并非完全离线，但不能仅凭目标 IP、端口或 `ESTABLISHED` 状态判断实际传输了什么。

原始文章中“两个并发连接说明数据传输量可能较大”的说法并不成立。并发连接数量与传输量没有直接对应关系：它们可能用于长连接、消息推送、设备联动、认证、模型请求或遥测。

### 7.3 为什么现有证据不能证明文件外传

1. HTTPS/TLS 隐藏了应用层载荷；
2. 长连接可能长期空闲，不能用连接持续时间代替流量大小；
3. 文件上传、摘要上传和普通遥测在网络层可能使用相同域名或端口；
4. 需要把“文件被读取”的时间线与“出站字节突增”的时间线进行关联，才有更强证据；
5. 即使抓到传输内容，也要区分用户主动发起和后台自动行为。

要进一步确认，应在隔离测试机中使用 Process Monitor、Windows Filtering Platform/ETW、Wireshark 和受控测试文件进行关联实验。

---

## 八、本地数据留存分析

### 8.1 主要数据目录

本机发现的主要目录包括：

```text
%APPDATA%\Tencent\Marvis\
%LOCALAPPDATA%\Tencent\Marvis\
%LOCALAPPDATA%\Marvis\
%LOCALAPPDATA%\Temp\Tencent\Marvis\
%LOCALAPPDATA%\Temp\MarvisUpdate\
```

其中包含：

- CEF 浏览器缓存和 IndexedDB；
- 用户会话工作区与附件；
- SQLite 数据库及 WAL 文件；
- 文档预览缓存；
- 日志、崩溃报告和更新缓存；
- Skill、Agent 与临时工具执行结果。

### 8.2 数据库结构核验

本机用户数据目录中发现：

| 数据库 | 取证时体积 | 表结构所反映的用途 |
|---|---:|---|
| `data.db` | 约 1.32 GB | 会话、消息、Agent 检查点、AGUI 事件、审批和 Token 使用记录 |
| `memory.db` | 约 32.66 MB | 对话明细、用户画像、键值存储和记忆数据 |
| `memory_vector.db` | 约 2.73 MB | 经验记忆等向量索引 |
| `local_app_info.db` | 约 3.35 MB | 本地应用信息和应用行为事件 |

特别需要纠正：**`data.db` 体积很大，但从表名和记录数来看，它主要是 Agent/会话事件数据库，不能直接当作“全盘文件索引库”的证据。**

取证时 `data.db` 中 `agui_events` 记录超过 200 万条，这可以解释数据库膨胀，却不能说明其中保存了整个磁盘的文件内容。

### 8.3 本地留存本身也是风险

即使数据从未上传，本地集中存储仍会带来风险：

- 其他高权限软件、恶意程序或本机账户可能读取这些数据库；
- 会话、附件、工具执行结果和文档预览缓存可能保留敏感内容副本；
- 卸载程序不一定自动删除全部用户数据；
- 备份、同步或取证镜像会连同这些缓存一起保存。

所以隐私评估不能只问“有没有上云”，还应问“本地留下了什么、保存多久、能否删除”。

---

## 九、证据矩阵与风险评级

### 9.1 证据矩阵

| 判断 | 证据强度 | 结论 |
|---|---|---|
| 软件来自腾讯发布链 | 强 | 核心文件数字签名有效 |
| 客户端具备文件内容读取能力 | 强 | 官网功能和隐私政策明确披露 |
| 客户端具备知识库/索引构建能力 | 强 | `Knowledgebase`、`index_build` 组件与产品功能相互印证 |
| 本机存在持续联网 | 强 | 进程连接快照可复现 |
| 效率模式可能向云端传输摘要或部分数据 | 强 | 官方隐私政策明确披露 |
| 当前正在无差别扫描所有磁盘 | 不足 | 缺少 Procmon/ETW 文件访问时间线 |
| 当前正在批量上传完整文件 | 不足 | 缺少流量内容、字节量和文件读取关联证据 |
| 1.32 GB 数据库就是文件索引 | 反证较强 | 表结构主要指向会话和 Agent 事件 |

### 9.2 风险矩阵

| 风险维度 | 评级 | 原因 |
|---|---|---|
| 本地文件访问范围 | 中高 | 功能需要读取内容、路径和元数据，实际边界取决于授权目录和排除机制 |
| 效率模式云端处理 | 中高 | 摘要或部分数据可能离开设备，敏感文本的摘要同样可能敏感 |
| 本地数据留存 | 中高 | 会话、附件、事件、记忆和预览缓存集中保存 |
| 高权限服务 | 中 | `MarvisSvr` 为 LocalSystem，但尚未发现可利用漏洞 |
| 网络通信 | 中 | 已确认联网，未确认批量文件外传 |
| 软件来源完整性 | 低 | 抽查核心文件均为腾讯有效签名 |
| 恶意软件概率 | 低 | 当前行为与官方声明的产品功能一致，暂无恶意证据 |

---

## 十、不同用户的实际风险

### 10.1 普通用户

若电脑中主要是公开资料、影音和普通办公文件，且只授权特定目录，风险通常可控。主要代价是本地缓存、资源占用和部分云端处理。

### 10.2 开发者和安全研究人员

应重点排除：

```text
%USERPROFILE%\.ssh
%USERPROFILE%\.gnupg
%USERPROFILE%\.aws
%USERPROFILE%\.azure
%USERPROFILE%\.kube
%USERPROFILE%\.codex
%USERPROFILE%\.claude
项目中的 .env、*.key、*.pem、凭据配置和数据库备份
浏览器用户数据目录
聊天软件数据目录
```

代码仓库里还可能存在测试 Token、内网地址、漏洞复现数据和未公开报告。即使软件只上传摘要，也可能暴露关键上下文。

### 10.3 取证、法务与企业场景

不建议让 Marvis 接触：

- 原始取证镜像；
- 案件材料与证人信息；
- 客户个人信息；
- 企业源代码和未公开文档；
- 医疗、金融和身份数据；
- 受保密协议或数据驻留要求约束的资料。

这类场景应使用隔离环境、专用工作账号或虚拟机，并让敏感证据目录保持在 Marvis 可访问范围之外。

---

## 十一、防护与控制建议

### 11.1 首选：缩小授权范围

如果客户端支持知识库目录管理：

1. 关闭“自动发现”“全盘扫描”或类似选项；
2. 仅添加专门的低敏感目录，例如：

```text
D:\MarvisPublicFiles
```

3. 明确排除密钥、聊天、浏览器、取证材料、代码仓库和备份目录；
4. 定期检查知识库目录列表和新增文件来源。

如果产品不能展示扫描范围，也没有排除目录能力，则不应在敏感主机上启用文件知识库。

### 11.2 优先使用本地模式

处理本地文件时优先选择纯本地模式，并避免：

- 在效率模式中直接分析密钥、合同、案件材料；
- 把剪贴板中的 Token 或密码发送给 Agent；
- 将敏感目录交给自动整理、批量总结或分享功能；
- 默认信任第三方 Skill、MCP 或插件。

### 11.3 临时停止，而不是立即破坏安装

以管理员 PowerShell 执行：

```powershell
# 停止系统服务
Stop-Service -Name MarvisSvr -ErrorAction SilentlyContinue

# 结束当前用户会话中的 Marvis 进程
Get-Process -Name 'Marvis*' -ErrorAction SilentlyContinue | Stop-Process -Force
```

这只是临时停止。再次启动 Marvis 时，相关组件可能恢复。

### 11.4 网络隔离测试

如果想观察纯本地模式是否仍能工作，可以先记录现状，再使用 Windows 防火墙为核心联网组件建立可撤销规则：

```powershell
$base = 'D:\Program Files\Tencent\Marvis\Application\1.60.1900.122'

New-NetFirewallRule -DisplayName 'Test Block MarvisHost Outbound' `
  -Direction Outbound -Action Block `
  -Program "$base\MarvisHost.exe"

New-NetFirewallRule -DisplayName 'Test Block MarvisSvr Outbound' `
  -Direction Outbound -Action Block `
  -Program "$base\MarvisSvr.exe"
```

测试结束后撤销：

```powershell
Remove-NetFirewallRule -DisplayName 'Test Block MarvisHost Outbound'
Remove-NetFirewallRule -DisplayName 'Test Block MarvisSvr Outbound'
```

版本升级后程序目录可能变化，旧规则也可能失效。按单个 IP 修改 `hosts` 并不可靠，因为服务地址可能变化或使用 CDN。

### 11.5 卸载与残留检查

优先使用系统“已安装的应用”或官方卸载程序：

```text
D:\Program Files\Tencent\Marvis\Application\Uninstall.exe
```

卸载后先检查，不要直接删除：

```powershell
$paths = @(
  'D:\Program Files\Tencent\Marvis',
  "$env:APPDATA\Tencent\Marvis",
  "$env:LOCALAPPDATA\Tencent\Marvis",
  "$env:LOCALAPPDATA\Marvis",
  "$env:LOCALAPPDATA\Temp\Tencent\Marvis",
  "$env:LOCALAPPDATA\Temp\MarvisUpdate"
)

$paths | ForEach-Object {
  Get-Item -LiteralPath $_ -Force -ErrorAction SilentlyContinue
}
```

确认不再需要会话、附件、Skill、缓存和本地记忆后，再手动清理残留。不要在卸载前直接删除安装目录或数据库，否则可能导致卸载失败或丢失仍需导出的数据。

---

## 十二、如何进一步做严格验证

### 12.1 用 Process Monitor 确认扫描范围

建议过滤：

```text
Process Name is MarvisKnowledgebase.exe
OR Process Name is MarvisHost.exe
OR Process Name is MarvisAgent.exe
```

重点关注：

```text
CreateFile
ReadFile
QueryDirectory
QueryInformationFile
```

验证步骤：

1. 准备一个隔离测试目录和若干带唯一标记的文本文件；
2. 清空 Procmon 事件；
3. 分别测试“未启用知识库”“添加测试目录”“效率模式”“本地模式”；
4. 检查是否访问测试目录之外的敏感路径；
5. 导出 PML/CSV，保留时间戳、进程、路径、操作和结果。

### 12.2 关联文件读取与网络流量

仅看 `netstat` 不够。应同时记录：

- 文件读取时间；
- 进程级发送/接收字节变化；
- DNS 查询和目标域名；
- 网络包时间线；
- 模式切换与用户操作时间。

若添加一个唯一标记文件后，客户端读取该文件，并立即出现与内容规模相关的出站流量变化，证据强度才会明显提高。

### 12.3 使用隔离样本而非真实秘密

不要用真实密码或 Token 测试。可以创建蜂蜜标记：

```text
MARVIS_TEST_MARKER_20260730_7F3A9C
```

然后观察本地日志、缓存、请求载荷或导出数据中是否出现该标记。

---

## 十三、最终结论

Marvis 的“扫盘”争议，本质上不是一个简单的“安全/不安全”二选一问题。

**已能确认：**

- 它是腾讯签名的官方客户端；
- 它具备读取文件内容、路径和元数据的产品能力；
- 它包含知识库、索引构建、Agent、本地模型和高权限服务组件；
- 它会在本地保存大量会话、事件、记忆、附件和缓存数据；
- 它存在持续网络通信；
- 效率模式可能把摘要或部分数据发送给云端模型。

**仍不能确认：**

- 它是否默认无差别扫描所有磁盘；
- 当前外部连接中是否包含完整文件或敏感文件内容；
- 每类本地缓存的具体保留期限和删除效果；
- 第三方 Skill/MCP 的实际权限边界是否足够严格。

因此，我的使用建议是：

> **普通资料可以在限制目录、优先本地模式的前提下使用；敏感主机必须最小化授权。若客户端无法清楚展示扫描范围、排除目录和云端处理边界，就不要让它接触密钥、聊天记录、取证材料或企业机密。**

“文件 0 上传”不应被理解为软件完全不联网；“存在网络连接”也不应被夸大为已经批量窃取文件。可信的隐私分析，应始终把产品声明、本机行为、实际网络载荷和证据强度分开讨论。

---

## 参考资料

1. [腾讯 Marvis 官网](https://marvis.qq.com/)
2. [Marvis 隐私保护政策（PC 端）](https://privacy.qq.com/document/preview/6c3760b1810e436ca8bd122984cd5183)
3. [Marvis 算法及模型备案信息说明](https://rule.tencent.com/rule/202604270001)
4. [Microsoft：Get-NetTCPConnection](https://learn.microsoft.com/powershell/module/nettcpip/get-nettcpconnection)
5. [Microsoft：Windows 服务账户与 LocalSystem](https://learn.microsoft.com/windows/win32/services/localsystem-account)
6. [Microsoft Sysinternals：Process Monitor](https://learn.microsoft.com/sysinternals/downloads/procmon)
7. [Wireshark 官方文档](https://www.wireshark.org/docs/)

---

**取证信息：**

```text
分析日期：2026-07-30
系统：Windows 11 Home China 10.0.26200
Marvis 显示版本：1.60.12.12
核心程序版本：1.60.1900.122
Knowledgebase 版本：1.0.1000.215
MarvisAgent 版本：1.0.1100.360
官方隐私政策更新日期：2026-07-21
官方隐私政策生效日期：2026-07-28
```