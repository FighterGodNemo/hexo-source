---
title: 搜狗输入法的两类问题：RCE漏洞与Burp内置浏览器闪退实录
date: 2026-09-20 21:33:00
permalink: posts/sogou-ime-security-and-burp-browser-exit/
categories:
  - 博览知识
tags:
  - 搜狗输入法
  - BurpSuite
  - Windows
created: 2026-09-20 21:33:00
updated: 2026-09-20 21:33:00
description: 从一次 Burp 内置浏览器启动即退出的排查说起，记录搜狗输入法异常的调用栈证据，并区分客户端兼容性缺陷与远程代码执行漏洞。
---

Burp 能打开，内置浏览器却打不开。以前一直能用，这次点了按钮，窗口就是不出现。

起初我怀疑的是 Burp 自带的 Chromium：文件是不是被杀毒软件删了，缓存是不是坏了，或者显卡加速又出了问题。逐项检查后，线索却落到了平时几乎不会想到的地方：搜狗输入法。

后来我又读到一篇介绍搜狗输入法远程代码执行漏洞的文章。两件事都涉及搜狗，也都出现了 Chromium，但不能把它们当成同一个问题。这篇文章把安全披露与本机排障分开记录，避免一句“输入法有漏洞”掩盖真正发生的事情。

> 本次现场已确认：Burp 自带的 Chromium 在初始化输入法组件时，出现来自 `SogouPY.ime` 的异常，随后执行了进程退出路径。尚未完成的验证是：正常卸载搜狗、重启后，Burp 内置浏览器是否恢复。本文不会把修复建议写成已经验证成功的结果。

<!-- more -->

## 先分清：安全漏洞和这次闪退是两件事

用户能直接感受到的现象都是“软件有问题”，技术上却需要不同的证据。

安全漏洞关注的是：攻击者能否控制输入、突破预期边界，最终获得代码执行、信息访问或其他能力。本次浏览器启动失败，已经证实的是可用性问题：进程还没显示窗口就退出了。

单凭闪退、一个 C++ 异常，或者调用栈中出现第三方模块，都不能宣布发现了远程代码执行漏洞。反过来，一款软件修复了某个 RCE，也不代表它不会再出现输入法初始化或兼容性缺陷。

## 公开披露的 RCE：问题出在另一条组件链上

参考的 CSDN 文章介绍了 `CVE-2026-51990`。继续查到的一手来源是 Gen Threat Labs 在 2026 年 9 月 10 日发表的《Gray Rabbits and the Tale of a One-Click Backdoor》，作者为 Alexandru-Cristian Bardaș；该编号也能在 CVE 官方记录中查到。

据 Gen 的调查，攻击者利用搜狗注册的 `sgbiz:` 自定义 URL 协议，将可控参数交给 `biz_helper.exe`，再让搜狗自己的设置组件打开攻击者控制的网页。承载网页的皮肤中心使用了旧版 CEF／Chromium，攻击链随后利用浏览器漏洞执行代码。

只看组件关系，大致是：

```text
用户触发特制链接
    ↓
sgbiz: 协议处理与 biz_helper.exe
    ↓
SGMyInput.exe 的 skincenter 功能
    ↓
SGWebRender.exe 内嵌的旧版 CEF / Chromium
    ↓
结合 CVE-2021-38003 执行代码
```

这不是“输入一个词就中招”，也不是攻击者隔空扫描电脑就能直接执行命令。报告描述了用户点击链接；Gen 引述的腾讯回应还提到，需要用户主动批准浏览器弹窗。标题中的“一键”不能理解成零点击、无确认，更不等于直接拿到管理员或 SYSTEM 权限。

### 能从原始披露确认什么

| 项目 | 核对后的信息 |
| --- | --- |
| 搜狗协议处理相关漏洞 | CVE-2026-51990，涉及 `biz_helper.exe` 参数处理 |
| 官方记录的受影响范围 | 搜狗输入法版本低于 `16.3.0.3498` |
| 修复版本 | `16.3.0.3498` |
| Gen 分析的内嵌浏览器 | CEF `80.1.16`，Chromium `80.0.3987.163` |
| 后续浏览器漏洞 | CVE-2021-38003 |
| 攻击效果 | 在相关利用条件满足后，执行当前用户权限下的代码 |

Gen 报告称，UNC3569 已在实际攻击中使用这条链，后续部署 GRAYRABBIT 后门。这是研究机构的调查归因，本文没有独立分析该攻击样本，也没有在本机运行利用代码。

时间线同样应标清来源：Gen 记载其于 2026 年 4 月 9 日向腾讯报告，4 月 21 日收到修复及通过自动更新部署 `16.3.0.3498` 的确认。这里没有找到可单独引用的腾讯公开公告，所以不把研究报告引用的厂商回复写成另一份独立来源。

Gen 还指出，分析时的内嵌 Chromium 关闭了沙箱。这会削弱浏览器漏洞发生后的隔离保护。报告描述的修复主要限制了入口和导航目标，不意味着旧 Chromium 的所有安全问题都随之消失；具体版本仍应以厂商支持情况和组件更新为准。

### 一个值得纠正的分类细节

CSDN 文章将 `CVE-2021-38003` 称为 V8“类型混淆”，Gen 原文也使用了这个说法。但 Chrome CNA 提交的官方 CVE 描述是 V8 的 **Inappropriate implementation**，CISA 补充分类为异常条件处理不当（CWE-755）。本文采用官方分类，不把“类型混淆”当作已核实的漏洞类型。

这也提醒我：有 CVE 编号的文章仍然需要核对原始记录。二手文章和研究报告重复同一个说法，并不自动解决分类差异。

### 为什么不能拿这条漏洞解释我的 Burp 闪退

两个问题触及的组件不同。

公开 RCE 使用的是搜狗协议处理程序、皮肤中心以及搜狗内嵌的旧 Chromium；我遇到的是 `SogouPY.ime`／`SogouTSF.ime` 被加载进 **Burp 自带 Chromium** 后，进程在初始化阶段退出。

本机搜狗模块是 `16.6.0.4952`，也不是官方记录所列的低于 `16.3.0.3498` 的版本范围。这不能代替完整的补丁与残留组件审计，但足以说明，不能看到“搜狗＋Chromium”就将两起问题合并。现场没有捕获 `sgbiz:` 攻击链、GRAYRABBIT 或本次远程代码执行的证据。

## 本机现象与测试环境

排查发生在 2026 年 9 月 20 日。现场版本如下：

| 组件 | 现场版本 |
| --- | --- |
| Windows | Windows 11 25H2，内部版本 26200.9457 |
| Burp Suite | 2025.9.4 |
| Burp 自带 Chromium | 140.0.7339.208 |
| 搜狗输入法相关模块 | 16.6.0.4952 |

Burp 的 Java 主进程正常响应。没有浏览器窗口持续存在，单独启动它自带的 `chrome.exe` 也会很快结束。

这里的 Chromium 位于当前用户目录：

```text
%APPDATA%\BurpSuite\burpbrowser\140.0.7339.208\chrome.exe
```

它不是日常浏览器，也不是搜狗皮肤中心自带的浏览器组件。后面讨论公开安全漏洞时，这个区别很重要。

## 先排除文件缺失、配置和显卡加速

这次没有一上来重装 Burp，也没有关闭杀毒软件、删除缓存或关掉浏览器沙箱。前面的检查主要是为了缩小范围。

### 浏览器文件没有缺失，版本也对得上

将已解压的浏览器目录与当前 Burp JAR 内的资源清单进行核对，结果是：

- 252 个资源文件的大小和 MD5 与清单一致。
- 已安装清单与 JAR 内浏览器压缩包中的清单一致。
- `chrome.exe`、`chrome.dll` 的 CRC32 也与包内对应条目一致。
- JAR 标记、压缩包和浏览器文件版本均为 `140.0.7339.208`。

这些检查支持“当前浏览器资源与本地安装包一致”，不等于对安装包来源做了官方真实性认证。不过，对“杀毒软件删掉了某个浏览器文件”这个猜测，已经没有直接支持。

检查到的火绒隔离记录和 Windows 相关安全事件中，也没有找到对应的 Burp 浏览器拦截记录。日志没命中不能排除所有防护软件影响，所以后面仍然要看进程实际如何退出。

### 全新的临时配置仍然失败

随后用独立临时目录保存浏览器配置，只打开 `about:blank`。没有动 Burp 原来的浏览器历史、缓存和设置。

| 测试条件 | 结果 |
| --- | --- |
| 新配置，headless 模式读取空白页 | 启动后迅速退出，退出码 3 |
| 新配置，普通窗口打开空白页 | 启动后迅速退出，退出码 3 |
| 新配置，增加 `--disable-gpu` | 仍然退出，退出码 3 |

这说明原来的用户配置不是复现故障的必要条件，Java 启动器也不是必要条件；禁用 GPU 的测试没有改善现象。到这里，再反复清缓存或调整 Java 参数，就缺少依据了。

旧配置里确实有一个 `profile.exit_type=Crashed`，但文件修改时间是几个月前。我没有把这个旧标记当作本次故障的证据。

## 真正有用的证据：是谁让进程退出

Chromium 的普通日志只留下了启动早期信息，没有直接写出“搜狗输入法出错”。退出码 `3` 本身也不足以定位原因。

于是使用 Windows Debugging Tools 中的 CDB，启动一个专门用于诊断的 Chromium 实例，在异常和进程退出位置观察调用栈。没有附加到用户日常浏览器，也没有调试正在工作的 Burp 主进程。

第一次抓到的退出栈，关键部分如下。这里省略地址和重复帧，只保留原始日志中的函数符号：

```text
=== RtlExitUserProcess ===
rcx=0000000000000003

ntdll!RtlExitUserProcess
KERNEL32!FatalExit+0xb
SogouPY!ImeExtension+0x10d8319
SogouPY!ImeExtension+0x10d82e4
...
SogouPY!ImeInquire+0x19
SogouTSF!DllRegisterServer+0xb0c27
```

`RtlExitUserProcess` 的第一个参数在这里是 `3`。调用它的退出路径来自搜狗模块，而不是仅仅在进程里“碰巧加载了搜狗”。

后续重新测试时，又同时记录到了异常与退出：

```text
=== C++ exception ===
ExceptionCode: e06d7363 (C++ EH exception)

KERNELBASE!RaiseException+0x8a
SogouPY!ImeExtension+0x10c2560
SogouPY!ImeExtension+0xa30fba
...

=== Exit status ===
rcx=0000000000000003

ntdll!RtlExitUserProcess
KERNEL32!FatalExit+0xb
SogouPY!ImeExtension+0x10d8319
...
```

更深层的栈中还能看到 `SogouTSF`、Windows 文本服务框架的 `MSCTF`，以及 Chromium 的调用帧。两次诊断均加载了：

```text
C:\Windows\System32\SogouPY.ime
C:\Windows\System32\SogouTSF.ime
```

两个模块的文件版本都是 `16.6.0.4952`，Authenticode 签名检查结果为有效。

这里有两个容易误读的地方：

1. `0xe06d7363` 是 C++ 异常码。程序可能正常抛出并处理这种异常，单独看它不能认定发生了致命错误。本次判断同时依赖了后续退出栈和已复现的进程结束。
2. 没有搜狗的私有调试符号时，`ImeExtension+偏移`、`DllRegisterServer+偏移` 是调试器显示的导出符号附近位置，不能照字面理解成正在执行某个注册操作。

因此，可以把结论写到这个程度：**在这台机器上，观察到搜狗模块抛出 C++ 异常，随后记录到经搜狗模块进入 `FatalExit`／`RtlExitUserProcess(3)` 的调用栈；独立启动测试也得到退出码 3。** 搜狗模块参与并发起退出调用有直接证据，但异常与退出之间的内部处理机制还没有确定。现有栈也不足以判断最底层是配置、词库、组件缺陷，还是搜狗与当前系统／Chromium 的某种兼容条件。

## 为什么切换了输入法，还是打不开

查到搜狗后，最直观的想法是切到微软拼音或英文键盘，再打开浏览器。我实际试了，依然打不开。

这一步看上去像是否定了前面的判断，其实它没有做到“让 Chromium 不加载搜狗”。

Windows 的当前输入法状态、默认输入法设置，以及新进程初始化时实际加载的文本服务组件，不是同一个概念。只看任务栏当前显示哪款输入法，不足以证明某个模块没有进入进程。

复查时，系统的“默认输入法覆盖设置”仍然指向搜狗。这个结果不代表当前窗口没有切换成功；真正决定判断的是，重新创建的 Chromium 测试进程中，仍然出现了 `SogouTSF.ime` 和 `SogouPY.ime`，并再次走到了相同退出路径。

所以，“切换输入法后仍失败”与“搜狗模块导致本次退出”可以同时成立。前者说明切换没有隔离掉组件，后者有调用栈支持。

最初把“切换后重开”当作简单验证办法，考虑得不够完整。要完成因果对照，应该在不再加载搜狗模块的环境中重复测试，而不是只切换任务栏上的输入法图标。

## 遇到类似问题，可以怎样收集证据

以下命令是给复查用的示例，不是通用修复脚本。浏览器版本目录需要按本机实际情况调整。

先确认模块版本和默认输入法：

```powershell
Get-WinDefaultInputMethodOverride

Get-Item "$env:WINDIR\System32\SogouPY.ime",
         "$env:WINDIR\System32\SogouTSF.ime" |
    Select-Object FullName,
        @{Name='Version'; Expression={$_.VersionInfo.FileVersion}}
```

用新建的临时配置打开空白页，可以将“原来的配置有问题”和“程序初始化就失败”分开。示例会写入一个新的临时目录，不改现有浏览器配置：

```powershell
$exe = Join-Path $env:APPDATA `
    'BurpSuite\burpbrowser\140.0.7339.208\chrome.exe'
$work = Join-Path $env:TEMP ('burp-browser-check-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $work | Out-Null

$browserArgs = @(
    '--headless=new'
    '--disable-background-networking'
    '--no-first-run'
    '--no-default-browser-check'
    '--enable-logging=stderr'
    "--user-data-dir=`"$(Join-Path $work 'profile')`""
    '--dump-dom'
    'about:blank'
)

Write-Host "本次日志目录：$work"
$p = Start-Process -FilePath $exe -ArgumentList $browserArgs `
    -PassThru `
    -RedirectStandardOutput (Join-Path $work 'stdout.txt') `
    -RedirectStandardError (Join-Path $work 'stderr.txt')

if ($p.WaitForExit(20000)) {
    $p.Refresh()
    Write-Host "退出码：$($p.ExitCode)"
} else {
    Write-Warning "诊断进程 PID=$($p.Id) 未在 20 秒内结束；不能当作退出码 3。"
    # 仅清理本次新建的诊断实例及其子进程，不按 chrome.exe 名称批量结束。
    & "$env:WINDIR\System32\taskkill.exe" /PID $p.Id /T /F
}
```

如果普通日志没有解释退出原因，再考虑用 CDB／WinDbg。仅在自己创建的诊断进程中，下面的断点可以记录退出状态和调用栈：

```text
bu ntdll!RtlExitUserProcess ".echo === Exit status ===; r rcx; k 40; lmv m Sogou*; q"
g
```

这段命令以 x64 进程为例。断点处的 `rcx=3` 是传给退出函数的状态值；`q` 对由调试器启动的诊断进程会执行终止，不只是关掉调试窗口。因此，带 `q` 的断点记录本身不能单独证明进程自然结束；本文的实际退出码来自前面的独立启动测试。不要将这段命令用于正在使用的重要程序，也不要把本文总结成“退出码 3 总是搜狗问题”。

## 处理建议，以及目前没有完成的验证

两次栈都指向搜狗后，正常卸载搜狗再测试，是有依据的下一步。不过，卸载之前还有词库和输入环境要保留。

建议顺序是：

1. 确认微软拼音或其他系统内置输入方式可用，并设置合适的默认输入法。
2. 从搜狗导出需要保留的个人词库、自定义短语。
3. 通过 Windows“已安装的应用”正常卸载搜狗，而不是手动删除系统目录中的 `.ime` 文件。
4. 保存工作并重启电脑，使已经加载到其他进程中的组件退出。
5. 暂时不安装新的第三方输入法，先测试同一个 Burp 版本和内置浏览器。

如果恢复，可以记录“卸载并重启后恢复”作为对照结果。如果仍然失败，应重新检查模块列表和退出栈，判断是搜狗残留还是另一个问题，不能继续凭旧结论归因。

写下本文时，我已经完成词库备份，但还没有收到卸载、重启后的恢复结果。因此，这一节是处置建议，不是修复成功记录。

### 顺带确认：词库备份不是加密保险箱

导出的搜狗 `.bin` 备份带有 `SGPU` 格式标识。本地解析能够读出其中的 UTF-16LE 词条，这说明至少这份备份里的词语没有做内容加密。

开源词库转换器也支持这种格式。记录中的词频字段用于词库权重，不能直接当作准确的历史输入次数；词频为零，也不应直接解释成“已删除”。

文章不附个人词库、私人词条清单或完整原始日志。备份可能包含人名、联系方式和常用短语，把它上传到不明“在线转换网站”之前，需要先想清楚这些内容是否愿意交给对方。这里也没有证据证明词库就是此次异常的根因。

## 这次排查留下的结论

目前能确认的，是一个具体环境中的输入法组件异常及其退出路径。浏览器资源完整，新配置仍能复现，关闭 GPU 没有改善，两次调试均把线索指向搜狗模块。

不能确认的部分也需要保留：内部异常究竟因何触发，是否存在跨版本影响，卸载后是否恢复。这些都不能用“搜狗有安全漏洞”来代替验证。

对我来说，这次最实用的经验是：遇到浏览器没窗口、也没明显错误提示时，先看看进程有没有被创建、以什么状态退出。真正让它结束的组件，未必就是窗口标题上写的那个软件。

## 参考资料

- [CSDN：CVE-2026-51990：搜狗输入法“一键 RCE”漏洞深度分析与企业排查处置建议](https://aisec.blog.csdn.net/article/details/165483745)。本文据此寻找原始安全披露，不把二手描述当作本机故障的证明。
- [Gen Threat Labs：Gray Rabbits and the Tale of a One-Click Backdoor](https://www.gendigital.com/blog/insights/research/one-click-backdoor-sogou)。2026-09-10，原始攻击链分析、归因及厂商沟通时间线。
- [CVE-2026-51990 官方记录](https://www.cve.org/CVERecord?id=CVE-2026-51990)／[机器可读 JSON](https://cveawg.mitre.org/api/cve/CVE-2026-51990)。用于核对受影响范围和修复版本。
- [CVE-2021-38003 官方记录](https://www.cve.org/CVERecord?id=CVE-2021-38003)／[机器可读 JSON](https://cveawg.mitre.org/api/cve/CVE-2021-38003)。用于核对 V8 漏洞描述及分类。
- [imewlconverter：搜狗 SGPU 词库解析器](https://github.com/studyzy/imewlconverter/blob/50f735fec2d4f3171f2bfa6596295795e5b20421/src/ImeWlConverter.Formats/SougouBin/SougouBinParser.cs)。用于核对词条字段及词频解释。
- 本机 2026 年 9 月 20 日两次 CDB 诊断日志。文中只摘录相关调用栈，已去掉用户名、具体个人目录及无关内容。
