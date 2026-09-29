---
title: SSH与sshd研究文章
date: 2026-09-29 09:30:23
permalink: /2026/09/29/博览知识/SSH与sshd研究文章/
categories:
  - 博览知识
tags:
  - SSH
  - OpenSSH
  - 网络安全
created: 2026-09-29T09:30
updated: 2026-09-29T11:01
---

# SSH 与 sshd 研究:协议演进、守护进程架构与安全实践

> **摘要**:SSH(Secure Shell)自 1995 年诞生以来,取代 telnet/rlogin/rsh 等明文协议,成为 Unix/Linux 远程管理的事实标准;sshd 作为其服务端守护进程,几乎运行在全球每一台 Linux 服务器上。本文基于 IETF RFC 文档、OpenSSH 官方发布说明、CVE 数据库与公开安全研究,对 SSH 协议与 sshd 实现进行系统性梳理:回溯其从个人项目到 IETF 标准、从商业软件到 OpenSSH 生态的历史;剖析协议三层架构与二进制分组协议;解析 sshd 的特权分离与二进制拆分架构;综述认证机制与密码算法的后量子演进;复盘三十年来标志性安全事件(SSH-1 CRC 攻击、Debian 熵缺陷、Terrapin、regreSSHion、XZ 供应链后门);给出服务器加固基线,并展望后量子迁移、证书化与零信任等趋势。

**关键词**:SSH;sshd;OpenSSH;特权分离;二进制分组协议;后量子密码;供应链安全

---

## 1 引言

远程管理是现代计算基础设施的神经中枢。服务器、容器节点、网络设备、嵌入式网关——几乎一切"不可到场"的机器,都需要一条加密、可认证、可审计的控制通道。SSH 协议正是这条通道的载体,而 sshd 就是通道的守门人:它监听端口、协商算法、验证身份、承运会话。

sshd 的特殊地位决定了研究它的价值:**它既是应用最广泛的安全服务之一,也是攻击面暴露最充分的服务之一**——默认监听 TCP 22 端口,直接暴露在公网的实例以百万计;它又是少数同时经历协议层攻击(Terrapin)、实现层漏洞(regreSSHion)与供应链攻击(XZ 后门)三种威胁形态、并存活至今仍持续演化的核心组件。研究 SSH/sshd,等于研究三十年网络安全的浓缩样本。

本文的结构如下:§2 历史演进,§3 协议体系,§4 sshd 架构,§5 认证机制,§6 密码算法演进,§7 功能特性,§8 安全事件复盘,§9 加固实践,§10 生态与替代方案,§11 趋势展望,§12 结论。

## 2 历史演进

### 2.1 起源:一次嗅探攻击催生的协议(1995)

1995 年,芬兰赫尔辛基理工大学(Helsinki University of Technology)研究员 **Tatu Ylönen** 在学校网络遭受密码嗅探攻击、数以万计的用户名口令被截获后,编写了 SSH 的第一个版本并于同年 7 月发布,免费供互联网使用,迅速取代 telnet、rlogin、rsh 等明文协议。

### 2.2 商业化与许可证危机(1995–1999)

Ylönen 于 1995 年创立 SSH Communications Security 公司,SSH 逐步商业化,自由使用的最后一个版本停在 **ssh 1.2.12**。许可证收紧让开源社区失去了可自由演进的 SSH 实现。

### 2.3 OpenSSH 的诞生(1999)

1999 年,Theo de Raadt 领导的 **OpenBSD 团队**以 ssh 1.2.12 为基础分支出 **OpenSSH**,坚持自由许可、最小依赖与持续代码审计。首个版本随 OpenBSD 2.6 发布,随后经 Portable 版本移植到 Linux、BSD、macOS 及各类 Unix,最终成为事实上的标准实现。今天绝大多数语境下的 "sshd" 指 OpenSSH 的 sshd。

### 2.4 SSH-1 → SSH-2 与 IETF 标准化(1996–2006)

SSH-2 于 1996–1997 年间完成整体重设计:以 **MAC 取代 SSH-1 的 CRC 校验**、以 **Diffie-Hellman 取代服务器公钥直接加密会话密钥**、支持**多通道复用**,且与 SSH-1 不兼容。IETF SECSH 工作组于 **2006 年 1 月**发布 RFC 4250–4256 系列标准,SSH 正式成为 Internet 标准。

### 2.5 关键时间线

| 年份 | 事件 |
|---|---|
| 1995 | Tatu Ylönen 发布 SSH-1;创立 SSH Communications Security |
| 1996 | SSH-2 协议重设计启动 |
| 1998 | SSH-1 CRC32 补偿攻击漏洞披露(CORE SDI) |
| 1999 | OpenBSD 团队分支出 OpenSSH(随 OpenBSD 2.6 发布) |
| 2001 | Provos/Friedl 引入特权分离;TESO 公开 SSH-1 CRC 漏洞利用工具 |
| 2006 | IETF 发布 RFC 4250–4256,SSH-2 标准化 |
| 2008 | Debian OpenSSL PRNG 缺陷(CVE-2008-0166)波及 SSH 密钥体系 |
| 2010 | OpenSSH 5.4/5.6 引入用户/主机证书(CA)体系 |
| 2015 | OpenSSH 7.0 移除 SSH-1 支持,默认禁用 DSA |
| 2016 | OpenSSH 7.3 引入 ProxyJump |
| 2020 | OpenSSH 8.2 支持 FIDO/U2F 硬件密钥(`ed25519-sk`) |
| 2022 | OpenSSH 9.0 默认启用后量子混合密钥交换;scp 默认改走 SFTP 协议 |
| 2023 | Terrapin 协议缺陷披露(CVE-2023-48795),OpenSSH 9.6 以 strict key exchange 缓解 |
| 2024 | XZ 供应链后门(CVE-2024-3094)针对 sshd;regreSSHion(CVE-2024-6387);9.8 将 sshd 拆分为 sshd + sshd-session |
| 2025 | OpenSSH 10.0 移除 DSA、ML-KEM-768 混合密钥交换成为默认;10.1/10.2 维护版本 |
| 2026 | OpenSSH 10.3(4 月)等持续迭代 |

## 3 SSH 协议体系

### 3.1 三层架构

RFC 4251 将 SSH-2 划分为三个自下而上的层次:

1. **传输层(RFC 4253)**:负责服务器认证、初始密钥交换、加密与完整性保护(可选压缩),建立全双工安全信道;
2. **用户认证层(RFC 4252)**:在安全信道之上验证客户端用户身份(密码、公钥、keyboard-interactive 等);
3. **连接层(RFC 4254)**:在单一安全连接上复用多条**通道(channel)**,提供交互式会话、端口转发、X11 转发等能力,并实现滑动窗口流控。

### 3.2 连接建立过程

一个典型的 SSH-2 握手序列:

1. **版本交换**:双方发送 `SSH-2.0-OpenSSH_10.0` 样式的版本字符串;
2. **算法协商**:`SSH_MSG_KEXINIT` 报文交换各算法类别的候选列表,取双方共同支持者优先者;
3. **密钥交换**:执行 DH/ECDH/混合后量子 KEX,同时服务器出示主机密钥签名,客户端据此完成**服务器身份认证**;
4. **NEWKEYS**:切换到协商出的对称加密与 MAC/AEAD;
5. **服务请求与用户认证**:`SSH_MSG_SERVICE_REQUEST` → 认证层报文往返;
6. **通道建立**:打开 session/forwarded-tcpip 等通道,承载 shell、命令或转发流量。

### 3.3 二进制分组协议(BPP)与它的隐患

传输层以**二进制分组协议**封包:每包由"长度(4 字节)+ 填充长度(1 字节)+ 载荷 + 随机填充"组成,后接 MAC;**序列号参与 MAC 计算**以防重放与乱序。AEAD 套件(如 ChaCha20-Poly1305、AES-GCM)则把认证标签并入密文。值得注意的是:**握手期(尚未启用加密前)的报文与序列号处理规则,正是 2023 年 Terrapin 攻击的根源**(§8.1)。

### 3.4 通道复用与扩展机制

连接层的通道类型包括 `session`(shell/exec/subsystem)、`direct-tcpip`(本地转发)、`forwarded-tcpip`(远程转发)、`x11` 等。SFTP 本质是一个名为 `sftp` 的 subsystem。RFC 8308 定义了 **ext-info** 扩展机制,允许双方在 KEX 后声明额外能力——后续的 strict key exchange(§8.1)正是借助该机制落地。

### 3.5 服务器认证与 TOFU 信任模型

SSH 的服务器认证依赖**主机密钥**:客户端将首次见到的主机公钥记入 `known_hosts`("信任并首次使用",TOFU),此后核对指纹;不符即告警。替代方案包括借助 DNSSEC 的 SSHFP 记录(RFC 4255)、企业 CA 签发的主机证书(§5.3),以及 `StrictHostKeyChecking` 的严格策略。TOFU 模型部署成本低,但首连时刻存在"盲区"。

## 4 sshd 守护进程架构

### 4.1 概览

sshd 由 OpenSSH 以 C 语言编写,在 OpenBSD 上原生开发,经 Portable 版本移植到各平台。它通常以独立守护进程监听 TCP 22,每个传入连接派生子进程处理。

### 4.2 特权分离(2001)

sshd 是业界最早大规模实施**特权分离(privilege separation)**的服务之一。Niels Provos 与 Markus Friedl 在 2001–2002 年间将其引入 OpenSSH,并在 USENIX Security 2003 发表论文《Preventing Privilege Escalation》。设计要点:

- **特权 monitor 进程**持有 root 权限,只做最小工作(认证结果裁决、fd 传递、资源管理);
- **无特权 pre-auth 子进程**(在 chroot 空目录中运行、使用专用无特权账户,如 Debian 的 `sshd` 用户)承担全部协议解析与网络 I/O;
- 两进程经 **socketpair** 通信,monitor 以 **fd 传递**将网络连接交给子进程;
- 认证完成后,子进程再降权为目标用户。

其目标是:任何协议解析阶段的内存缺陷,都被限制在无特权进程中,无法直接触及 root。这一"协议解析先降权"的思想此后深刻影响了 nginx、OpenSMTPD 等一系列服务的设计。

### 4.3 二进制拆分(2024–2025)

OpenSSH 9.8(2024 年 7 月 1 日,与 regreSSHion 修复同版)将运行近二十年的单体 sshd 拆分为两个二进制:

- **`sshd`**:轻量**监听器**,只负责监听、接受连接与派生子进程,不再承载 SSH 协议逻辑;
- **`sshd-session`**:**每连接一份**的会话进程,处理协议、认证与通道。

OpenSSH 10.0(2025 年 4 月)进一步把认证阶段独立为 **`sshd-auth`**。收益是攻击面收缩、崩溃隔离更强、监听器体积显著缩小;代价是打包与升级顺序复杂化——发行版(如 Debian 的 Freexian 团队)曾专门处理拆分带来的升级窗口问题。

### 4.4 配置体系

sshd 的行为由 `/etc/ssh/sshd_config` 控制,关键机制包括:

- **`Match` 条件块**:按用户/组/来源地址覆盖配置(如对 `git` 账户强制 `ForceCommand`);
- **`Include`**:引入子配置(OpenSSH 10.0 起支持环境变量展开);
- **`sshd -t`** 语法校验与 **`sshd -T`** 输出最终生效配置——两者是变更流程的必备工具。

常用指令示例(含义见 §9.1):

```text
Port / ListenAddress           监听端口与地址
PermitRootLogin                root 登录策略(no / prohibit-password)
PasswordAuthentication         是否允许密码登录
PubkeyAuthentication           公钥认证开关
AuthenticationMethods          强制的认证方法组合(可配多因素)
AllowGroups / AllowUsers       访问白名单
MaxAuthTries / MaxStartups     认证尝试与未认证连接上限
LoginGraceTime                 认证宽限期
PerSourceMaxStartups           每源地址并发未认证连接上限
AllowTcpForwarding / X11Forwarding
PermitOpen / PermitListen      转发目标白名单
DisableForwarding              一刀切禁用所有转发
TrustedUserCAKeys              信任的用户证书 CA
AuthorizedKeysFile             公钥存放路径
HostKey / HostCertificate      主机密钥与主机证书
Subsystem sftp internal-sftp   SFTP 子系统(可 chroot)
LogLevel                       日志级别(VERBOSE 记录密钥指纹)
```

### 4.5 跨平台与系统协同

- **Windows**:微软 PowerShell 团队维护 Win32-OpenSSH,自 Windows 10 1809 / Server 2019 起作为可选功能内置,sshd 以 Windows 服务运行,支持 Windows 凭据与文件 ACL 语义;
- **systemd socket activation**:OpenSSH 10.0 为 Portable 版加入 systemd 套接字激活支持,便于内核级连接限速与按需拉起;
- **SELinux/AppArmor、PAM**:sshd 通过 PAM 对接系统认证与账户策略,通过 syslog/audit 输出日志。

## 5 认证机制

### 5.1 方法全景

| 方法 | 机制 | 评注 |
|---|---|---|
| `password` | 用户口令(可经 PAM) | 暴力破解的头号目标,生产环境应禁用 |
| `publickey` | RSA / ECDSA / Ed25519 密钥对 | 默认推荐;`authorized_keys` 选项可做细粒度限制 |
| `keyboard-interactive` | 多轮提示(PAM 对接) | 与 OTP/双因素结合的标准途径 |
| `GSSAPI` | Kerberos/AD 票据 | 企业域环境;支持单点登录 |
| `hostbased` | 主机级信任(rsh 遗风) | 极少使用,风险高 |
| `certificate` | CA 签发的短时用户/主机证书 | 大规模管理与零信任演进方向 |
| `publickey` (FIDO2) | `ed25519-sk` / `ecdsa-sk` 硬件密钥 | 抗钓鱼,要求物理触摸(user presence) |

### 5.2 公钥认证与 authorized_keys 选项

公钥认证将客户端公钥登记于服务端 `authorized_keys`。OpenSSH 支持丰富的**每行选项**:`from="10.0.0.0/8"`(来源限制)、`no-pty`、`no-port-forwarding`、`command="…"`(强制固定命令)、`restrict`(全约束再逐项放行)——这是实现备份专用、隧道专用、Git 专用账户的基础设施。

### 5.3 SSH 证书体系(2010)

OpenSSH 5.4(用户证书,2010 年 3 月)与 5.6(主机证书,2010 年 8 月)引入了**内置 CA 证书体系**:`ssh-keygen` 以 CA 密钥签发用户/主机证书,证书携带 principal、有效期与扩展;服务端以 `TrustedUserCAKeys` 信任 CA,客户端以 `@cert-authority` 行信任主机 CA。

与 TOFU 相比,证书模式的优势:**消除首连信任盲区、天然支持短时凭证(小时级甚至分钟级)、吊销与审计更可控**。大型企业与云厂商普遍以此替代静态密钥分发,是 SSH 身份体系最重要的现代化方向。

### 5.4 FIDO2 硬件密钥(2020)

OpenSSH 8.2(2020 年 2 月)引入 `ecdsa-sk` 与 `ed25519-sk` 两种密钥类型,私钥驻留 FIDO/U2F 安全密钥(如 YubiKey),认证时要求物理触摸。`ed25519-sk` 需要固件 ≥ 5.2.3。硬件绑定 + 触摸确认使 SSH 登录具备**抗钓鱼**能力,可将私钥盗用从"复制文件"升级为"偷走实体钥匙"。

### 5.5 认证链组合

`AuthenticationMethods` 指令可强制认证链,如 `publickey,keyboard-interactive:pam` 要求"密钥 + 动态口令"双因素全部通过,是高价值主机的常用加固。

## 6 密码算法体系的演进

### 6.1 密钥类型:从 DSA 到 Ed25519

- **DSA**:1999 年代的支持遗存,安全性与工程缺陷并存——OpenSSH 7.0(2015)默认禁用,**10.0(2025)彻底移除**;
- **RSA**:仍受支持,但要求 ≥ 3072 位并使用 SHA-2 签名(`rsa-sha2-256/512`,RFC 8332);
- **ECDSA**:`nistp256/384/521`;
- **Ed25519**(RFC 8709):短密钥、快速、可预测实现,是当前默认首选——主机密钥与用户密钥均适用。

### 6.2 密钥交换:从 DH 到混合后量子

演进路径大致为:固定 DH 群(`diffie-hellman-group1/14…`)→ 群交换(`diffie-hellman-group-exchange`,RFC 4419)→ ECDH(`ecdh-sha2-nistp*`)→ **Curve25519**(`curve25519-sha256`,RFC 8731)→ **混合后量子 KEX**。

后量子阶段的两个节点:

- **OpenSSH 9.0(2022 年 4 月)**将 `sntrup761x25519-sha512@openssh.com`(Streamlined NTRU Prime + X25519 混合)设为默认 KEX——这是**主流安全协议中最早默认启用后量子算法的实现之一**;
- NIST 于 **2024 年 8 月**发布 FIPS 203(ML-KEM,前身 CRYSTALS-Kyber)后,OpenSSH 9.9 引入 `mlkem768x25519-sha256`,**10.0(2025 年 4 月)起设为默认**,对齐 IETF draft-ietf-ssh-pq-ke。

"混合"设计的意义:KEX 同时运行经典算法与 PQC 算法,共享密钥由两侧秘密共同派生——**只要任一侧算法未被攻破,会话即安全**,以对冲 PQC 算法尚年轻的风险。"先记录、后解密"的量子威胁由此被提前拦截。

### 6.3 对称加密与 MAC

- **AEAD 优先**:`chacha20-poly1305@openssh.com`(RFC 8268,无 AES 硬件加速的移动/嵌入式场景性能优异)与 `aes*-gcm@openssh.com`(RFC 5647);
- **CTR 模式**:`aes128/256-ctr` 仍广泛可用;
- **MAC**(非 AEAD 时):`hmac-sha2-256/512`、`umac-64/128@openssh.com`;SHA-1 家族已淘汰。

### 6.4 算法审计

服务端最终算法集合可用 `sshd -T | grep -iE 'kex|cipher|mac|hostkey'` 核查;社区工具 **ssh-audit** 可对照基线给出算法评级,并已支持 Terrapin(strict kex)检测。压缩功能默认关闭(历史上 `zlib@openssh.com` 曾关联时序侧信道研究)。

## 7 连接层功能

- **会话通道**:PTY/shell、`exec` 远程命令、subsystem(SFTP)。`internal-sftp` + `ChrootDirectory` 可搭建不暴露 shell 的受控文件服务;
- **端口转发**:`-L` 本地、`-R` 远程、`-D` 动态(SOCKS5);服务端可用 `PermitOpen`/`PermitListen` 白名单约束目标,`DisableForwarding` 一刀切关闭。转发能力是把双刃剑:既可安全穿透内网,也可能被用于绕过边界(如向云元数据端点外联);
- **跳板与代理**:OpenSSH 7.3(2016)引入 `ProxyJump`(`-J`),以单命令经跳板连接目标;相比 **agent forwarding**,ProxyJump 不把 agent 套接字暴露在跳板上,避免跳板 root 冒用密钥(§5、§8.2);
- **多路复用**:`ControlMaster/ControlPersist` 在一条 TCP 连接上复用多个会话,免重复握手;其复用路径复杂度高——OpenSSH 10.1 引入的 ControlPersist 回归曾导致 10.2(2025 年 10 月)紧急修复,可为一例;
- **文件传输**:OpenSSH 9.0(2022)起 `scp` 默认改用 SFTP 协议,弃用遗留 SCP/RCP 协议(消除其通配符扩展类缺陷),统一到经过持续审计的 SFTP 栈。

## 8 安全事件与漏洞史复盘

SSH 的三十年安全史,恰好覆盖了网络安全威胁的四种典型形态:协议设计缺陷、实现缺陷、供应链投毒与运营暴露。

### 8.1 协议层

- **SSH-1 CRC32 补偿攻击(1998)**:CORE SDI 研究者发现 SSH-1 的 CRC 完整性校验可被插入攻击利用(此后 TESO 于 2001 年公开成熟利用工具并在野外大规模使用)。这一缺陷直接催生了 SSH-2 的 MAC 设计——**协议层的教训最终以"换代"解决**。
- **Terrapin(CVE-2023-48795 / RogueExtension CVE-2023-48796,2023 年 12 月)**:攻击者处于主动 MITM 位置时,在握手早期截断/丢弃前缀报文、操纵序列号计数,导致双方在算法选择与安全特性(如击键时序混淆)上"错位"达成一致,实现**降级或去防护**。根因在于 RFC 4253 BPP 对握手期序列号的定义缺口,属**协议级缺陷,影响几乎所有实现**。缓解措施 "strict key exchange" 扩展(OpenSSH 9.6,2023 年 12 月)在双方均支持时将握手内容与序列号绑定。因需实时主动中间人,实际风险评级为中等,但作为协议缺陷的警示意义远大于单次利用价值。

### 8.2 实现层

- **Debian OpenSSL PRNG 缺陷(CVE-2008-0166,2008 年 5 月)**:Debian 维护者对 OpenSSL 的打包补丁意外削弱熵,生成的密钥只有极小的可能集合。大量 Debian/Ubuntu 主机的 SSH 主机密钥与用户密钥沦为可预测密钥,被迫全网轮换。教训:**上游正确性依赖整个构建与打包链条**——这条线索在十六年后以更戏剧化的方式重现(§8.3)。
- **roaming 缓冲区越界(CVE-2016-0777/0778,2016 年 1 月,Qualys)**:客户端 roam 功能的越界读,事件后 OpenSSH 移除了该试验特性;
- **用户名枚举(CVE-2018-15473,2018)**:认证时序差异泄露账户存在性;
- **ssh-agent PKCS#11 RCE(CVE-2023-38408,2023 年 7 月,Qualys)**:agent 转发场景下,受信主机可经 agent 远程代码执行,凸显**转发类功能的攻击面**;
- **regreSSHion(CVE-2024-6387,2024 年 7 月)**:sshd 信号处理器竞态条件——信号处理函数中调用非异步信号安全的内存管理函数,在 glibc 的 Linux 系统上可致**未经认证的远程代码执行(以 root 身份)**。影响 OpenSSH 8.5p1–9.7p1(以及更早的 < 4.4p1),本质是 2006 年老漏洞 CVE-2006-5051 的**回归**。Qualys 估计披露时全球约 70 万实例暴露于该漏洞;利用需要赢下竞态、难度高且不稳定,但概念验证已公开。**9.8p1 修复**(重构信号处理路径),`LoginGraceTime 0` 为部分缓解。regreSSHion 的 lesson 有二:长期演化代码的"旧病复发"风险,以及架构拆分(同版发布的 sshd/sshd-session 分离)作为系统性降低攻击面的价值。

### 8.3 供应链

**XZ Utils 后门(CVE-2024-3094,2024 年 3 月)**是迄今针对 sshd 最著名的供应链攻击:

- 攻击者以 "Jia Tan" 身份历时约两年(2021–2024)在 XZ Utils 开源项目中持续贡献、积累信任并最终取得维护权;
- 2024 年 2 月发布的 xz 5.6.0/5.6.1 携带混淆后门(藏于构建脚本与测试文件中);
- 在启用 systemd 的 x86-64 Linux 上,`libsystemd` 链接 `liblzma`,而 **sshd 恰好经此链路加载了被投毒的压缩库**——后门篡改 sshd 的认证数据结构,在特定公钥触发条件下实现**认证绕过/远程命令执行**(CVSS 10.0);
- PostgreSQL 开发者 **Andres Freund** 于 2024 年 3 月 29 日因 sshd 登录**慢了约 0.5 秒**、CPU 占用与 perf 剖析异常顺藤摸瓜揭露;受影响范围限于个别滚动发行版(Fedora Rawhide、Debian sid、openSUSE Tumbleweed、Kali),各稳定分支幸免;
- 事件直接推动开源供应链治理的关键角色审核、构建可复现性、依赖哈希固定与 SBOM 讨论全面升温。

XZ 事件对 sshd 研究的启示在于:**sshd 的攻击面不止于它自己的代码**,还包括一切被它加载的共享库、PAM 模块与动态链接链路。

### 8.4 运营层

公网长期存在数百万开放 22 端口的主机,暴力破解与凭据填充是持续性噪音;僵尸网络批量尝试弱口令与泄露密钥(如开发者误将私钥提交到代码仓库);远程转发(`-R`)被滥用为反向隧道与数据外泄通道。运营风险与协议/实现风险相互放大:密码认证暴露的每一台服务器,都在为攻击生态供给资源。

### 8.5 小结:四类风险,四种治理

| 风险类别 | 代表事件 | 治理手段 |
|---|---|---|
| 协议设计缺陷 | SSH-1 CRC、Terrapin | 标准修订、算法/机制更替(strict kex、AEAD) |
| 实现缺陷 | regreSSHion、Debian PRNG | 架构隔离(特权分离、二进制拆分)、快速响应、长期回归测试 |
| 供应链投毒 | XZ 后门 | 可复现构建、关键角色治理、依赖固定、SBOM |
| 运营暴露 | 暴力破解、密钥泄露 | 加固基线、密钥轮换、监控审计、零信任收敛暴露面 |

## 9 sshd 加固与运营实践

### 9.1 服务端配置基线

以下为一个互联网暴露面主机的参考基线(按需调整):

```text
# ---- 认证 ----
PermitRootLogin no                  # 禁止 root 直接登录(部署期可暂用 prohibit-password)
PasswordAuthentication no           # 关闭密码登录,强制密钥
KbdInteractiveAuthentication no     # 除非需要 PAM 双因素
PubkeyAuthentication yes
AuthenticationMethods publickey     # 需要时改为 publickey,keyboard-interactive:pam 构成双因素
PermitEmptyPasswords no
MaxAuthTries 3                      # 限制尝试次数
LoginGraceTime 30                   # 缩短认证宽限窗口(亦缓解 regreSSHion 类竞态)
MaxStartups 10:30:60                # 限制并发未认证连接
PerSourceMaxStartups 5              # 每源地址限速

# ---- 访问控制 ----
AllowGroups ssh-users               # 白名单化访问
Match User backup                   # 受限账户按需收紧
    ForceCommand internal-sftp      # 或固定命令
    DisableForwarding
    ChrootDirectory /srv/backup

# ---- 转发与会话 ----
X11Forwarding no
AllowTcpForwarding no               # 需要跳板时再按需开启,并配合 PermitOpen
ClientAliveInterval 300
ClientAliveCountMax 2

# ---- 日志 ----
LogLevel VERBOSE                    # 记录认证细节与密钥指纹,便于审计

Subsystem sftp internal-sftp
```

要点:每一项都对应 §8 中的一类真实威胁——关密码对应暴力破解生态,`LoginGraceTime`/`MaxStartups` 对应竞态与资源型攻击,`DisableForwarding` 对应隧道滥用,`LogLevel VERBOSE` 支撑事后取证。

### 9.2 密钥与身份管理

- 用户密钥:`ssh-keygen -t ed25519`(硬件场景 `-t ed25519-sk`),私钥必须设 passphrase;
- 以 **ssh-agent** 免重复解锁,但**谨慎使用 agent forwarding**——优先 ProxyJump;
- 规模化场景采用 **SSH 证书 + 短时凭证**(§5.3),辅以 principal 约束与有效期上限;
- 定期轮换主机密钥与用户密钥;在代码仓库与 CI 中扫描意外提交的私钥。

### 9.3 网络层收敛

- 防火墙/安全组白名单来源;或以 VPN/WireGuard/零信任代理前置,不把 22 端口直接暴露公网;
- `fail2ban` 类工具按失败日志自动封禁;systemd socket activation(OpenSSH 10.0+)可进一步在内核层限速;
- 修改端口可减少脚本噪音,但**不构成安全边界**——价值有限,不应作为主要手段。

### 9.4 监控、审计与变更流程

- 集中收集 `auth.log`/journal,`LogLevel VERBOSE` 提供密钥指纹级别的认证审计;
- 基线扫描:`sshd -T` 与 ssh-audit 定期比对算法与配置漂移;
- 高合规场景引入**会话录制**与命令级审批(tlog、Teleport 等,§10);
- 变更三步走:`sshd -t` 校验 → `systemctl reload sshd` → **新建会话验证成功后再断开旧会话**(防自锁)。

## 10 生态与替代方案

| 方案 | 定位 | 特点 |
|---|---|---|
| **OpenSSH** | 事实标准 | 功能最全、审计最充分、算法最前沿;几乎所有平台的默认选择 |
| **Dropbear** | 嵌入式 SSH | 体积小、依赖少,适合路由器/IoT;算法子集较小、无硬件加速支持(慢速 ARM 上性能差异明显) |
| **libssh / libssh2** | 嵌入库 | 供应用内嵌 SSH 能力;libssh 曾有认证绕过 CVE-2018-10933(2018),提醒"库级复用即风险扩散" |
| **wolfSSH** | 嵌入库 | 面向嵌入式/合规生态(wolfSSL 系) |
| **Teleport** | 企业访问平面 | 在 sshd 之上叠加 SSO、证书、审计与会话录制,是"管理面"的替代而非协议的替代 |
| **mosh** | 移动增强 | UDP + 漫游 + 本地回显,弱网/移动场景体验好;认证仍复用 SSH |
| **WireGuard** | 网络层底座 | 现代 VPN;与 SSH 叠加可将 22 端口从公网摘除,二者互补而非互斥 |
| **云原生通道** | 趋势补充 | 云 Bastion、AWS SSM Session Manager、`kubectl exec` 等正在分流部分交互式 SSH 用途 |

## 11 趋势展望

1. **后量子迁移深化**:ML-KEM-768 混合 KEX 成为默认(OpenSSH 10.0)只是第一步;draft-ietf-ssh-pq-ke 定稿、纯 PQC 方案与 SLH-DSA(ML-DSA)签名的引入将接力;"先存储后解密"威胁使这一迁移对所有长期敏感基础设施都是必答题。
2. **凭证现代化**:静态长期密钥 → CA 证书 + 短时凭证 + FIDO2 硬件绑定;TOFU 信任模型逐步被可吊销、可审计的证书体系补充或替代。
3. **sshd 架构持续解耦**:从特权分离(2001)到 sshd/sshd-session 拆分(9.8,2024)再到 sshd-auth 独立(10.0,2025),攻击面逐级收缩;未来可预期更细粒度的进程沙箱与能力最小化。
4. **供应链韧性制度化**:XZ 事件后,关键开源角色审核、可复现构建、依赖哈希固定、SBOM 等实践正在进入包括 SSH 生态在内的关键组件工具链;对 sshd 而言,动态链接链路本身(如 XZ 事件的注入路径)也在审视范围内。
5. **会话级零信任**:从"能否登录"转向"可审计的最小会话"——身份代理、命令级审批、会话录制与异常检测,将 sshd 嵌入更大的访问治理平面。
6. **边缘与嵌入式**:IoT 与网络设备上的 Dropbear 类轻量实现仍是安全洼地,需要设备级基线与固件更新通道。

## 12 结论

SSH/sshd 是一个罕见的完整样本:它从一次密码嗅探事故出发,经历商业化危机与开源重生,以 RFC 标准化定格协议形态,又在三十年的攻防中同时承受协议级、实现级与供应链级攻击,并持续以算法更替(Ed25519、AEAD、混合后量子)、架构演进(特权分离 → 二进制拆分)与身份体系升级(证书、FIDO2)自我刷新。

对运营者的建议可以浓缩为三句话:**用算法的新**(Ed25519 + ML-KEM 混合 KEX + AEAD)、**用身份的短**(证书化 + 短时凭证 + 硬件因子)、**把暴露面收窄**(禁密码、白名单、收敛公网 22 端口、VERBOSE 审计)。对研究者与建设者,sshd 的启示更深层:**安全不是一次性设计,而是一条持续的演化路径**——协议会过时,实现会回归,供应链会背叛,唯有"最小权限 + 最小攻击面 + 持续审计"的架构纪律与快速响应机制,才是跨越三十年的常量。

---

## 参考文献

1. T. Ylönen, *SSH — Secure Login Connections over the Internet*, 6th USENIX Security Symposium, 1996.
2. IETF SECSH WG, RFC 4250–4256(SSH-2 协议族),2006. https://www.rfc-editor.org/rfc/rfc4251
3. OpenSSH Release Notes(9.6/9.8/9.9/10.0–10.3 等). https://www.openssh.org/releasenotes.html
4. N. Provos, M. Friedl, P. Honeyman, *Preventing Privilege Escalation*, USENIX Security 2003;及 Privilege Separated OpenSSH 项目页. http://www.citi.umich.edu/u/provos/ssh/privsep.html
5. Terrapin Attack 官方研究站点(CVE-2023-48795/48796). https://terrapin-attack.com
6. Qualys TRU,regreSSHion / CVE-2024-6387 技术公告,2024-07. https://blog.qualys.com
7. A. Freund 等,oss-security 邮件列表:"backdoor in upstream xz/liblzma leading to ssh server compromise",2024-03-29. https://www.openwall.com/lists/oss-security/2024/03/29
8. Red Hat, *Urgent Security Alert: Fedora 41 and Rawhide users*(CVE-2024-3094). https://www.redhat.com/en/blog/urgent-security-alert-fedora-41-and-rawhide-users
9. NIST, *FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard*, 2024-08. https://csrc.nist.gov/pubs/fips/203/final
10. ssh-audit(SSH 服务器/客户端算法审计工具). https://github.com/jtesta/ssh-audit
11. Cyberciti.biz, *Top 20 OpenSSH Server Best Security Practices*. https://www.cyberciti.biz/tips/linux-unix-bsd-openssh-server-best-practices.html
12. Undeadly, *OpenSSH 10.2 released*, 2025-10-10. https://www.undeadly.org/cgi?action=article;sid=20251010131052
13. Win32-OpenSSH(Windows 移植). https://github.com/PowerShell/Win32-OpenSSH
14. Wikipedia, *Secure Shell*. https://en.wikipedia.org/wiki/Secure_Shell
15. Wikipedia, *Dropbear (software)*. https://en.wikipedia.org/wiki/Dropbear_(software)

> 注:文中版本行为以 OpenSSH 官方 Release Notes 为准;CVE 严重度以 NVD/厂商评估为准,个别条目(如 Terrapin 的 CVSS)不同评估口径略有差异。
