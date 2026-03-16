---
title: "Volatility3"
date: 2026-03-15 13:28:28
categories:
- Forensic_电子取证
- Forensic解题妙具
---

#### <font style="color:rgb(79, 79, 79);">1. </font>**<font style="color:rgb(79, 79, 79);">提取与 BitLocker 相关的进程信息</font>**
<font style="color:rgb(77, 77, 77);">BitLocker 的核心功能由</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">BDETL</font>`<font style="color:rgb(77, 77, 77);">（BitLocker Drive Encryption Tool）和</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">WinDefend</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">等服务实现。通过分析这些进程的状态，可以了解 BitLocker 是否正在运行或是否已加载加密密钥。</font>

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 pslist
```

<font style="color:rgb(77, 77, 77);">上述命令会列出所有运行中的进程。如果发现</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">BDETL.exe</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">或其他与 BitLocker 相关的进程，则说明系统可能启用了 BitLocker[^1]。</font>

#### <font style="color:rgb(79, 79, 79);">2.</font><font style="color:rgb(79, 79, 79);"> </font>**<font style="color:rgb(79, 79, 79);">检查内核模块和驱动程序</font>**
<font style="color:rgb(77, 77, 77);">BitLocker 的功能依赖于内核驱动程序</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">FveVol.sys</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">和</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">FeAuthentic.sys</font>`<font style="color:rgb(77, 77, 77);">。使用以下命令可以检查这些驱动程序是否已加载：</font>

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 modscan
```

<font style="color:rgb(77, 77, 77);">如果输出中包含</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">FveVol.sys</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">或</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">FeAuthentic.sys</font>`<font style="color:rgb(77, 77, 77);">，则表明 BitLocker 正在使用中[^3]。</font>

#### <font style="color:rgb(79, 79, 79);">3.</font><font style="color:rgb(79, 79, 79);"> </font>**<font style="color:rgb(79, 79, 79);">提取注册表键值</font>**
<font style="color:rgb(77, 77, 77);">BitLocker 的配置信息通常存储在 Windows 注册表中。Volatility 提供了</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">hivelist</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">和</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">printkey</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">模块来提取注册表信息。以下命令可以帮助找到与 BitLocker 相关的配置：</font>

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 hivelist
vol.py -f memory.dmp --profile=Win7SP1x64 printkey -K "\SYSTEM\CurrentControlSet\Services\FveSvc"
```

`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">\SYSTEM\CurrentControlSet\Services\FveSvc</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">是 BitLocker 驱动器加密服务的注册表路径。通过查看该路径下的键值，可以了解 BitLocker 的启用状态和其他配置信息[^1]。</font>

#### <font style="color:rgb(79, 79, 79);">4.</font><font style="color:rgb(79, 79, 79);"> </font>**<font style="color:rgb(79, 79, 79);">查找恢复密钥</font>**
<font style="color:rgb(77, 77, 77);">如果系统启用了 BitLocker，并且用户曾经访问过恢复密钥，那么恢复密钥可能会临时存储在内存中。可以尝试使用</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">strings</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">或</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">yara</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">模块搜索内存中的字符串模式：</font>

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 strings | grep "Recovery Password"
```

<font style="color:rgb(77, 77, 77);">或者编写自定义的 YARA 规则来匹配恢复密钥的格式。例如，恢复密钥通常是 48 位数字，分为 8 组，每组 6 位数字[^2]。</font>

#### <font style="color:rgb(79, 79, 79);">5.</font><font style="color:rgb(79, 79, 79);"> </font>**<font style="color:rgb(79, 79, 79);">分析加密卷的挂载状态</font>**
<font style="color:rgb(77, 77, 77);">BitLocker 加密卷的挂载状态可以通过分析</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">FveVolume</font>`<font style="color:rgb(77, 77, 77);"> </font><font style="color:rgb(77, 77, 77);">数据结构来确定。虽然 Volatility 没有内置的模块直接解析</font><font style="color:rgb(77, 77, 77);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">FveVolume</font>`<font style="color:rgb(77, 77, 77);">，但可以通过以下步骤进行手动分析：</font>

+ <font style="color:rgb(34, 34, 38);">使用</font><font style="color:rgb(34, 34, 38);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">vadinfo</font>`<font style="color:rgb(34, 34, 38);"> </font><font style="color:rgb(34, 34, 38);">模块查找与加密相关的虚拟地址描述符（VAD）。</font>
+ <font style="color:rgb(34, 34, 38);">结合</font><font style="color:rgb(34, 34, 38);"> </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">dumpfiles</font>`<font style="color:rgb(34, 34, 38);"> </font><font style="color:rgb(34, 34, 38);">模块提取潜在的加密卷文件。</font>

```plain
vol.py -f memory.dmp --profile=Win7SP1x64 vadinfo
vol.py -f memory.dmp --profile=Win7SP1x64 dumpfiles -Q <vad_address>
```

