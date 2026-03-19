---
title: "Volatility3"
date: 2026-03-15 13:28:28
categories:
- Forensic_电子取证
- Forensic解题妙具
---

#### 1. **提取与 BitLocker 相关的进程信息**
BitLocker 的核心功能由 `BDETL`（BitLocker Drive Encryption Tool）和 `WinDefend` 等服务实现。通过分析这些进程的状态，可以了解 BitLocker 是否正在运行或是否已加载加密密钥。

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 pslist
```

上述命令会列出所有运行中的进程。如果发现 `BDETL.exe` 或其他与 BitLocker 相关的进程，则说明系统可能启用了 BitLocker[^1]。

#### 2. **检查内核模块和驱动程序**
BitLocker 的功能依赖于内核驱动程序 `FveVol.sys` 和 `FeAuthentic.sys`。使用以下命令可以检查这些驱动程序是否已加载：

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 modscan
```

如果输出中包含 `FveVol.sys` 或 `FeAuthentic.sys`，则表明 BitLocker 正在使用中[^3]。

#### 3. **提取注册表键值**
BitLocker 的配置信息通常存储在 Windows 注册表中。Volatility 提供了 `hivelist` 和 `printkey` 模块来提取注册表信息。以下命令可以帮助找到与 BitLocker 相关的配置：

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 hivelist
vol.py -f memory.dmp --profile=Win7SP1x64 printkey -K "\SYSTEM\CurrentControlSet\Services\FveSvc"
```

`\SYSTEM\CurrentControlSet\Services\FveSvc` 是 BitLocker 驱动器加密服务的注册表路径。通过查看该路径下的键值，可以了解 BitLocker 的启用状态和其他配置信息[^1]。

#### 4. **查找恢复密钥**
如果系统启用了 BitLocker，并且用户曾经访问过恢复密钥，那么恢复密钥可能会临时存储在内存中。可以尝试使用 `strings` 或 `yara` 模块搜索内存中的字符串模式：

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 strings | grep "Recovery Password"
```

或者编写自定义的 YARA 规则来匹配恢复密钥的格式。例如，恢复密钥通常是 48 位数字，分为 8 组，每组 6 位数字[^2]。

#### 5. **分析加密卷的挂载状态**
BitLocker 加密卷的挂载状态可以通过分析 `FveVolume` 数据结构来确定。虽然 Volatility 没有内置的模块直接解析 `FveVolume`，但可以通过以下步骤进行手动分析：

+ 使用 `vadinfo` 模块查找与加密相关的虚拟地址描述符（VAD）。
+ 结合 `dumpfiles` 模块提取潜在的加密卷文件。

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 vadinfo
vol.py -f memory.dmp --profile=Win7SP1x64 dumpfiles -Q <vad_address>
```

