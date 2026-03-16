---
title: "Reverse"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- CTF知识
---

逆向工程：**<u>对程序进行反向分析，还原其功能或找到隐藏信息</u>**。常见形式有对可执行文件（如 Windows 的 .exe、Linux 的 ELF、Android 的 APK 等）进行反编译、动态调试，分析算法逻辑、破解注册码、找到程序中的 flag 等，需要掌握汇编语言、调试工具（如 IDA、GDB）、加解密算法等知识。

## <font style="color:rgba(0, 0, 0, 0.87);">常规逆向流程 </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_5)
1. <font style="color:rgba(0, 0, 0, 0.87);">使用</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">strings/file/binwalk/IDA</font>`<font style="color:rgba(0, 0, 0, 0.87);">等静态分析工具收集信息，并根据这些静态信息进行</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">google/github</font>`<font style="color:rgba(0, 0, 0, 0.87);">搜索</font>
2. <font style="color:rgba(0, 0, 0, 0.87);">研究程序的保护方法，如代码混淆，保护壳及反调试等技术，并设法破除或绕过保护</font>
3. <font style="color:rgba(0, 0, 0, 0.87);">反汇编目标软件，快速定位到关键代码进行分析</font>
4. <font style="color:rgba(0, 0, 0, 0.87);">结合动态调试，验证自己的初期猜想，在分析的过程中理清程序功能</font>
5. <font style="color:rgba(0, 0, 0, 0.87);">针对程序功能，写出对应脚本，求解出 flag</font>

### <font style="color:rgba(0, 0, 0, 0.87);">定位关键代码 tips</font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#tips)
1. <font style="color:rgba(0, 0, 0, 0.87);">分析控制流</font>

<font style="color:rgba(0, 0, 0, 0.87);">控制流可以参见 IDA 生成的控制流程图（CFG），沿着分支循环和函数调用，逐块地阅读反汇编代码进行分析。</font>

2. <font style="color:rgba(0, 0, 0, 0.87);">利用数据、代码交叉引用</font>

<font style="color:rgba(0, 0, 0, 0.87);">比如输出的提示字符串，可以通过数据交叉引用找到对应的调用位置，进而找出关键代码。代码交叉引用比如图形界面程序获取用户输入，就可以使用对应的 windowsAPI 函数，我们就可以通过这些 API 函数调用位置找到关键代码。</font>

### <font style="color:rgba(0, 0, 0, 0.87);">逆向 tips</font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#tips_1)
1. <font style="color:rgba(0, 0, 0, 0.87);">编码风格</font>

<font style="color:rgba(0, 0, 0, 0.87);">每个程序员的编码风格都有所不同，熟悉开发设计模式的同学能更迅速地分析出函数模块功能</font>

2. <font style="color:rgba(0, 0, 0, 0.87);">集中原则</font>

<font style="color:rgba(0, 0, 0, 0.87);">程序员开发程序时，往往习惯将功能相关的代码或是数据写在同一个地方，而在反汇编代码中也能显示出这一情况，因此在分析时可以查看关键代码附近的函数和数据。</font>

3. <font style="color:rgba(0, 0, 0, 0.87);">代码复用</font>

<font style="color:rgba(0, 0, 0, 0.87);">代码复用情况非常普遍，而最大的源代码仓库 </font><font style="color:#DF2A3F;">Github </font><font style="color:rgba(0, 0, 0, 0.87);">则是最主要的来源。在分析时可以找一些特征（如字符串，代码风格等）在 Github 搜索，可能会发现类似的代码，并据此恢复出分析时缺失的符号信息等。</font>

4. <font style="color:#DF2A3F;">七分逆向三分猜</font>

<font style="color:rgba(0, 0, 0, 0.87);">合理的猜测往往能事半功倍，遇到可疑函数却看不清里面的逻辑，不妨根据其中的蛛丝马迹猜测其功能，并依据猜测继续向下分析。</font>

5. <font style="color:rgba(0, 0, 0, 0.87);">区分代码</font>

<font style="color:rgba(0, 0, 0, 0.87);">拿到反汇编代码，必须</font><font style="color:#DF2A3F;">区分人为编写的代码</font><font style="color:#000000;">和</font><font style="color:#DF2A3F;">编译器自动附加的代码</font><font style="color:rgba(0, 0, 0, 0.87);">。人为编写的代码中，区分</font><font style="color:#DF2A3F;">库函数代码</font><font style="color:rgba(0, 0, 0, 0.87);">和</font><font style="color:#DF2A3F;">出题人自己写的代码</font><font style="color:rgba(0, 0, 0, 0.87);">。出题人的代码又怎样经过</font><font style="color:#DF2A3F;">编译器优化</font><font style="color:rgba(0, 0, 0, 0.87);">？须专注于出题人写的代码。</font>

6. <font style="color:rgba(0, 0, 0, 0.87);">耐心</font>

<font style="color:rgba(0, 0, 0, 0.87);"></font><font style="color:#DF2A3F;">分析透彻</font><font style="color:rgba(0, 0, 0, 0.87);">。</font>

### <font style="color:rgba(0, 0, 0, 0.87);">动态分析</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_6)
<font style="color:rgba(0, 0, 0, 0.87);">动态分析的目的在于</font><font style="color:#DF2A3F;">定位关键代码后，在程序运行的过程中，借由输出信息（寄存器，内存变化，程序输出）等来验证自己的推断或是理解程序功能</font>

<font style="color:rgba(0, 0, 0, 0.87);">主要方法有：</font><font style="color:#DF2A3F;">调试，符号执行，污点分析</font>

### <font style="color:rgba(0, 0, 0, 0.87);">算法和数据结构识别</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_7)
+ <font style="color:rgba(0, 0, 0, 0.87);">常用算法识别</font>

<font style="color:rgba(0, 0, 0, 0.87);">如</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">Tea/XTea/XXTea/IDEA/RC4/RC5/RC6/AES/DES/IDEA/MD5/SHA256/SHA1</font>`<font style="color:rgba(0, 0, 0, 0.87);">等加密算法，大数加减乘除、最短路等传统算法</font>

+ <font style="color:rgba(0, 0, 0, 0.87);">常用数据结构识别</font>

<font style="color:rgba(0, 0, 0, 0.87);">如</font><font style="color:#DF2A3F;">图、树、哈希表</font><font style="color:rgba(0, 0, 0, 0.87);">等高级数据结构在汇编代码中的识别。</font>

### <font style="color:rgba(0, 0, 0, 0.87);">代码混淆</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_8)
<font style="color:rgba(0, 0, 0, 0.87);">比如使用</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">OLLVM</font>`<font style="color:#DF2A3F;">，</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">movfuscator</font>`<font style="color:#DF2A3F;">，</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">花指令</font>`<font style="color:#DF2A3F;">，</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">虚拟化</font>`<font style="color:rgba(0, 0, 0, 0.87);">及</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">SMC</font>`<font style="color:rgba(0, 0, 0, 0.87);">等工具技术对代码进行混淆，使得程序分析十分困难。</font>

<font style="color:rgba(0, 0, 0, 0.87);">那么对应的也有反混淆技术，最主要的目的就是复原控制流。比如</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">模拟执行</font>`<font style="color:rgba(0, 0, 0, 0.87);">和</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">符号执行</font>`

### <font style="color:rgba(0, 0, 0, 0.87);">保护壳</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_9)
<font style="color:rgba(0, 0, 0, 0.87);">保护壳类型有许多，简单的压缩壳可以归类为如下几种</font>

+ <font style="color:#DF2A3F;">unpack -> execute</font>

<font style="color:rgba(0, 0, 0, 0.87);">直接将程序代码全部解压到内存中再继续执行程序代码</font>

+ <font style="color:#DF2A3F;">unpack -> execute -> unpack -> execute ...</font>

<font style="color:rgba(0, 0, 0, 0.87);">解压部分代码，再边解压边执行</font>

+ <font style="color:#DF2A3F;">unpack -> [decoder | encoded code] -> decode -> execute</font>

<font style="color:rgba(0, 0, 0, 0.87);">程序代码有过编码，在解压后再运行函数将真正的程序代码解码执行</font>

<font style="color:rgba(0, 0, 0, 0.87);">对于脱壳也有相关的方法，比如</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">单步调试法</font>`<font style="color:#DF2A3F;">，</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">ESP定律</font>`<font style="color:rgba(0, 0, 0, 0.87);">等等</font>

### <font style="color:rgba(0, 0, 0, 0.87);">反调试</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_10)
<font style="color:rgba(0, 0, 0, 0.87);">反调试意在</font><font style="color:#DF2A3F;">通过检测调试器等方法避免程序被调试分析</font><font style="color:rgba(0, 0, 0, 0.87);">。比如使用一些 </font><font style="color:#DF2A3F;">API 函数</font><font style="color:rgba(0, 0, 0, 0.87);">如</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">IsDebuggerPresent</font>`<font style="color:#DF2A3F;">检测调试器</font><font style="color:rgba(0, 0, 0, 0.87);">，使用</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">SEH异常处理</font>`<font style="color:rgba(0, 0, 0, 0.87);">，</font><font style="color:#DF2A3F;">时间差检测</font><font style="color:rgba(0, 0, 0, 0.87);">等方法。也可以通过</font><font style="color:#DF2A3F;">覆写调试端口、自调试</font><font style="color:rgba(0, 0, 0, 0.87);">等方法进行保护。</font>

## <font style="color:rgba(0, 0, 0, 0.87);">非常规逆向思路</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_11)
<font style="color:rgba(0, 0, 0, 0.87);">非常规逆向题设计的题目范围非常之广，可以是任意架构的任意格式文件。</font>

+ <font style="color:#DF2A3F;">lua/python/java/lua-jit/haskell/applescript/js/solidity/webassembly/etc..</font>
+ <font style="color:#DF2A3F;">firmware/raw bin/etc..</font>
+ <font style="color:#DF2A3F;">chip8/avr/clemency/risc-v/etc.</font>

### <font style="color:rgba(0, 0, 0, 0.87);">前期准备</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_12)
+ <font style="color:rgba(0, 0, 0, 0.87);">阅读文档。</font><font style="color:#DF2A3F;">快速学习平台语言的方法就是去阅读官方文档。</font>
+ <font style="color:rgba(0, 0, 0, 0.87);">官方工具。</font>
+ <font style="color:#DF2A3F;">教程。在逆向方面，也许有许多前辈写出了专门针对该平台语言的逆向教程，因此也可以快速吸收这其中的知识。</font>

### <font style="color:rgba(0, 0, 0, 0.87);">找工具</font><font style="color:rgba(0, 0, 0, 0.87);"> </font>[<font style="color:rgba(0, 0, 0, 0.32);">¶</font>](https://ctf-wiki.org/reverse/introduction/#_13)
<font style="color:rgba(0, 0, 0, 0.87);">主要找</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">文件解析工具</font>`<font style="color:#DF2A3F;">、</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">反汇编器</font>`<font style="color:#DF2A3F;">、</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">调试器</font>`<font style="color:rgba(0, 0, 0, 0.87);">和</font>`<font style="color:#DF2A3F;background-color:rgb(245, 245, 245);">反编译器</font>`<font style="color:rgba(0, 0, 0, 0.87);">。其中</font>`<font style="color:rgb(54, 70, 78);background-color:rgb(245, 245, 245);">反汇编器</font>`<font style="color:rgba(0, 0, 0, 0.87);">是必需的，</font>`<font style="color:rgb(54, 70, 78);background-color:rgb(245, 245, 245);">调试器</font>`<font style="color:rgba(0, 0, 0, 0.87);">也包含有相应的反汇编功能，而对于</font>`<font style="color:rgb(54, 70, 78);background-color:rgb(245, 245, 245);">反编译器</font>`<font style="color:rgba(0, 0, 0, 0.87);">则要自求多福了，得之我幸失之我命。</font>

<font style="color:rgba(0, 0, 0, 0.87);">找工具总结起来就是：合理利用 </font><font style="color:#DF2A3F;">Google</font><font style="color:rgba(0, 0, 0, 0.87);"> 搜索语法，进行关键字搜索可以帮助你更快更好地找到合适工具。</font>

