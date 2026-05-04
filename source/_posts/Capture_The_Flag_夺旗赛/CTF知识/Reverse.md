---
title: Reverse
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/CTF知识/Reverse/
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - CTF知识
tags:
  - CTF
  - CTF知识
  - Reverse
created: 2026-03-15T16:49
updated: 2026-05-04T11:09
---

逆向工程：**<u>对程序进行反向分析，还原其功能或找到隐藏信息</u>**。常见形式有对可执行文件（如 Windows 的 .exe、Linux 的 ELF、Android 的 APK 等）进行反编译、动态调试，分析算法逻辑、破解注册码、找到程序中的 flag 等，需要掌握汇编语言、调试工具（如 IDA、GDB）、加解密算法等知识。

## 常规逆向流程 [¶](https://ctf-wiki.org/reverse/introduction/#_5)
1. 使用`strings/file/binwalk/IDA`等静态分析工具收集信息，并根据这些静态信息进行`google/github`搜索
2. 研究程序的保护方法，如代码混淆，保护壳及反调试等技术，并设法破除或绕过保护
3. 反汇编目标软件，快速定位到关键代码进行分析
4. 结合动态调试，验证自己的初期猜想，在分析的过程中理清程序功能
5. 针对程序功能，写出对应脚本，求解出 flag

### 定位关键代码 tips[¶](https://ctf-wiki.org/reverse/introduction/#tips)
1. 分析控制流

控制流可以参见 IDA 生成的控制流程图（CFG），沿着分支循环和函数调用，逐块地阅读反汇编代码进行分析。

2. 利用数据、代码交叉引用

比如输出的提示字符串，可以通过数据交叉引用找到对应的调用位置，进而找出关键代码。代码交叉引用比如图形界面程序获取用户输入，就可以使用对应的 windowsAPI 函数，我们就可以通过这些 API 函数调用位置找到关键代码。

### 逆向 tips[¶](https://ctf-wiki.org/reverse/introduction/#tips_1)
1. 编码风格

每个程序员的编码风格都有所不同，熟悉开发设计模式的同学能更迅速地分析出函数模块功能

2. 集中原则

程序员开发程序时，往往习惯将功能相关的代码或是数据写在同一个地方，而在反汇编代码中也能显示出这一情况，因此在分析时可以查看关键代码附近的函数和数据。

3. 代码复用

代码复用情况非常普遍，而最大的源代码仓库 Github 则是最主要的来源。在分析时可以找一些特征（如字符串，代码风格等）在 Github 搜索，可能会发现类似的代码，并据此恢复出分析时缺失的符号信息等。

4. 七分逆向三分猜

合理的猜测往往能事半功倍，遇到可疑函数却看不清里面的逻辑，不妨根据其中的蛛丝马迹猜测其功能，并依据猜测继续向下分析。

5. 区分代码

拿到反汇编代码，必须区分人为编写的代码和编译器自动附加的代码。人为编写的代码中，区分库函数代码和出题人自己写的代码。出题人的代码又怎样经过编译器优化？须专注于出题人写的代码。

6. 耐心

分析透彻。

### 动态分析 [¶](https://ctf-wiki.org/reverse/introduction/#_6)
动态分析的目的在于定位关键代码后，在程序运行的过程中，借由输出信息（寄存器，内存变化，程序输出）等来验证自己的推断或是理解程序功能

主要方法有：调试，符号执行，污点分析

### 算法和数据结构识别 [¶](https://ctf-wiki.org/reverse/introduction/#_7)
+ 常用算法识别

如`Tea/XTea/XXTea/IDEA/RC4/RC5/RC6/AES/DES/IDEA/MD5/SHA256/SHA1`等加密算法，大数加减乘除、最短路等传统算法

+ 常用数据结构识别

如图、树、哈希表等高级数据结构在汇编代码中的识别。

### 代码混淆 [¶](https://ctf-wiki.org/reverse/introduction/#_8)
比如使用`OLLVM`，`movfuscator`，`花指令`，`虚拟化`及`SMC`等工具技术对代码进行混淆，使得程序分析十分困难。

那么对应的也有反混淆技术，最主要的目的就是复原控制流。比如`模拟执行`和`符号执行`

### 保护壳 [¶](https://ctf-wiki.org/reverse/introduction/#_9)
保护壳类型有许多，简单的压缩壳可以归类为如下几种

+ unpack -> execute

直接将程序代码全部解压到内存中再继续执行程序代码

+ unpack -> execute -> unpack -> execute ...

解压部分代码，再边解压边执行

+ unpack -> [decoder | encoded code] -> decode -> execute

程序代码有过编码，在解压后再运行函数将真正的程序代码解码执行

对于脱壳也有相关的方法，比如`单步调试法`，`ESP定律`等等

### 反调试 [¶](https://ctf-wiki.org/reverse/introduction/#_10)
反调试意在通过检测调试器等方法避免程序被调试分析。比如使用一些 API 函数如`IsDebuggerPresent`检测调试器，使用`SEH异常处理`，时间差检测等方法。也可以通过覆写调试端口、自调试等方法进行保护。

## 非常规逆向思路 [¶](https://ctf-wiki.org/reverse/introduction/#_11)
非常规逆向题设计的题目范围非常之广，可以是任意架构的任意格式文件。

+ lua/python/java/lua-jit/haskell/applescript/js/solidity/webassembly/etc..
+ firmware/raw bin/etc..
+ chip8/avr/clemency/risc-v/etc.

### 前期准备 [¶](https://ctf-wiki.org/reverse/introduction/#_12)
+ 阅读文档。快速学习平台语言的方法就是去阅读官方文档。
+ 官方工具。
+ 教程。在逆向方面，也许有许多前辈写出了专门针对该平台语言的逆向教程，因此也可以快速吸收这其中的知识。

### 找工具 [¶](https://ctf-wiki.org/reverse/introduction/#_13)
主要找`文件解析工具`、`反汇编器`、`调试器`和`反编译器`。其中`反汇编器`是必需的，`调试器`也包含有相应的反汇编功能，而对于`反编译器`则要自求多福了，得之我幸失之我命。

找工具总结起来就是：合理利用 Google 搜索语法，进行关键字搜索可以帮助你更快更好地找到合适工具。

