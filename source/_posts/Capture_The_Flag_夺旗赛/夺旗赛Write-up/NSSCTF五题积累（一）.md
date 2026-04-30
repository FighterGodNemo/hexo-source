---
title: NSSCTF五题积累（一）
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/NSSCTF五题积累（一）/
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - NSSCTF
tags:
  - CTF
  - WriteUp
  - NSSCTF
  - 五题积累
created: 2026-03-15T16:49
updated: 2026-04-29T14:21
---

# 第一轮
## 1.Crypto

### [CryptoCTF_2020]One_Line_Crypto

![](<2025 NSSCTF/file-20260331130230861.png>)

```python
from Crypto.Util.number import *
from secret import m, n, x, y, flag

p, q = x**(m+1) - (x+1)**m, y**(n+1) - (y+1)**n
assert isPrime(p) and isPrime(q) and p < q < p << 3 and len(bin(p*q)[2:]) == 2048
enc = bytes_to_long(flag)
print(pow(enc, 0x10001, p*q))
```

enc文件：14608474132952352328897080717325464308438322623319847428447933943202421270837793998477083014291941466731019653023483491235062655934244065705032549531016125948268383108879698723118735440224501070612559381488973867339949208410120554358243554988690125725017934324313420395669218392736333195595568629468510362825066512708008360268113724800748727389663826686526781051838485024304995256341660882888351454147057956887890382690983135114799585596506505555357140161761871724188274546128208872045878153092716215744912986603891814964771125466939491888724521626291403272010814738087901173244711311698792435222513388474103420001421

## 2.Web

### [M1r4n]冰蝎的秘密

#### #流量分析 #Webshell流量
##### 题目描述：在一次网络安全的挑战中，你截获了一段神秘的冰蝎流量。据说这段流量中隐藏着重要的信息。你能解开这个谜团，找出隐藏在流量中的秘密吗？
解答：

![](<2025 NSSCTF/file-20260331130230820.png>)

流量包损坏。需要修复

 法一：CTFNetA修复

法二：使用pcapfix修复

法三：使用010 editor，与正常流量对照手动修复

## 3.Misc

### [陇剑杯_2021]签到

> 题目描述：
>
> 此时正在进行的可能是__________协议的网络攻击。（如有字母请全部使用小写，填写样例：http、dns、ftp）。得到的flag请使用NSSCTF{}格式提交。
>

![](<2025 NSSCTF/file-20260331130230769.png>)

NSSCTF{http}

## 4.Pwn

### [WUSTCTF 2020]getshell2 
#### #栈溢出 #ret2syscall #栈
附件：service

题目环境：

直接file+checksec

![](<2025 NSSCTF/file-20260331130228790.png>)

只开启了栈不可执行，应该是栈溢出题目。

使用ROPgadget

![](<2025 NSSCTF/file-20260331130228771.png>)

找到了sh地址：0x08048670 

直接写死：sh_addr = 0x08048670

![](<2025 NSSCTF/file-20260331130228763.png>)





栈溢出（Stack Overflow） 漏洞：

+ 程序执行完一个函数后，会跳回它被调用的地方，即返回地址（存于栈上）
+ 当攻击者输入超长数据后,会覆盖返回地址（Return Address）

![](<2025 NSSCTF/file-20260331130228754.png>)

+ `gets()`、`strcpy()` 等属于没有边界检查的函数。

🛠️ 六、完整攻击流程

1. **连接远程服务**
2. **p = remote('ip', port)**

**构造 payload**

    - 填充 28 字节到返回地址位置
    - 覆盖返回地址为 `system`
    - 提供 fake return 和 `"sh"` 地址
3. **发送 payload**

```plain
Python

编辑


1p.sendline(payload)
```

4. **进入交互模式，输入命令**

```plain
Python

编辑


1p.interactive()  # 之后你就可以输入 ls, cat flag.txt 等
```

Q1: 为什么不用 `"/bin/sh"`，而用 `"sh"`？

很多题目为了简化，只放了 `"sh"`。

在 Linux 中，`system("sh")` 和 `system("/bin/sh")` 效果几乎一样，都能弹 shell。

Q2: `0xdeadbeef` 是什么？会 crash 吗？

它只是一个“占位符”，表示“随便填个地址”。

只要你在 `system` 返回前已经拿到 shell，程序是否 crash 都不影响你读 flag。

Q3: 为什么偏移是 28（0x18+4）？

`0x18 = 24` 字节是 buffer 大小

`+4` 是 saved ebp（旧的栈基址指针）

总共 28 字节后，才是返回地址

## 5.Reverse

### [BJDCTF_2020]Easy

附件：easy.exe

无壳程序，直接分析即可

![](<2025 NSSCTF/file-20260331130230842.png>)


# 第二轮
## 1.Crypto

### [SWPUCTF_2021_新生赛]ez_caesar

#凯撒密码 #Base家族 #古典密码

```python
import base64
def caesar(plaintext):
    str_list = list(plaintext)
    i = 0
    while i < len(plaintext):
        if not str_list[i].isalpha():
            str_list[i] = str_list[i]
        else:
            a = "A" if str_list[i].isupper() else "a"
            str_list[i] = chr((ord(str_list[i]) - ord(a) + 5) % 26 + ord(a) or 5)
        i = i + 1

    return ''.join(str_list)

flag = "*************************"
str = caesar(flag)
print(str)

#str="U1hYSFlLe2R0em1mYWpwc3RiaGZqeGZ3fQ=="
```

NSSCTF{youhaveknowcaesar}
![](<2025 NSSCTF/file-20260331130230871.png>)

## 2.Web

### [SWPUCTF_2021_新生赛]easy_sql

[http://node4.anna.nssctf.cn:28049/](http://node4.anna.nssctf.cn:28049/)

## 3.Misc

### [强网拟态2021]BlueWhale

附件：
![](<2025 NSSCTF/file-20260331130230810.png>)

先分析外层流量包，追踪TCP流
![](<2025 NSSCTF/file-20260331130230852.png>)

获取密码：**th1sIsThEpassw0rD**

但似乎不是内层压缩包解压密码。

暴力破解：

## 4.Pwn

### [WUSTCTF 2020]getshell2 
#### #栈溢出 #ret2syscall #栈
附件：service

题目环境：

直接file+checksec

![](<2025 NSSCTF/file-20260331130228790.png>)

只开启了栈不可执行，应该是栈溢出题目。

使用ROPgadget

![](<2025 NSSCTF/file-20260331130228771.png>)

找到了sh地址：0x08048670 

直接写死：sh_addr = 0x08048670

![](<2025 NSSCTF/file-20260331130228763.png>)





栈溢出（Stack Overflow） 漏洞：

+ 程序执行完一个函数后，会跳回它被调用的地方，即返回地址（存于栈上）
+ 当攻击者输入超长数据后,会覆盖返回地址（Return Address）

![](<2025 NSSCTF/file-20260331130228754.png>)

+ `gets()`、`strcpy()` 等属于没有边界检查的函数。

🛠️ 六、完整攻击流程

1. **连接远程服务**
2. **p = remote('ip', port)**

**构造 payload**

    - 填充 28 字节到返回地址位置
    - 覆盖返回地址为 `system`
    - 提供 fake return 和 `"sh"` 地址
3. **发送 payload**

```plain
Python

编辑


1p.sendline(payload)
```

4. **进入交互模式，输入命令**

```plain
Python

编辑


1p.interactive()  # 之后你就可以输入 ls, cat flag.txt 等
```

Q1: 为什么不用 `"/bin/sh"`，而用 `"sh"`？

很多题目为了简化，只放了 `"sh"`。

在 Linux 中，`system("sh")` 和 `system("/bin/sh")` 效果几乎一样，都能弹 shell。

Q2: `0xdeadbeef` 是什么？会 crash 吗？

它只是一个“占位符”，表示“随便填个地址”。

只要你在 `system` 返回前已经拿到 shell，程序是否 crash 都不影响你读 flag。

Q3: 为什么偏移是 28（0x18+4）？

`0x18 = 24` 字节是 buffer 大小

`+4` 是 saved ebp（旧的栈基址指针）

总共 28 字节后，才是返回地址

## 5.Reverse

### [SEETF 2022]Magic 
#### #反调试 #REVERSE
题目描述：There might be a hidden gate to the magical land of flags...

![](<2025 NSSCTF/file-20260331130228709.png>)

默认值：

![](<2025 NSSCTF/file-20260331130228691.png>)

```plain
int __cdecl __noreturn main(int argc, const char **argv, const char **envp)
{
  _OWORD v3[2]; // [esp-C0h] [ebp-CCh] BYREF
  __int64 v4; // [esp-A0h] [ebp-ACh]
  int v5; // [esp-98h] [ebp-A4h]
  char v6[3]; // [esp-94h] [ebp-A0h] BYREF
  int v7; // [esp+4h] [ebp-8h]
  int retaddr; // [esp+Ch] [ebp+0h]

  v7 = retaddr;
  v5 = 1725917800;
  v3[0] = xmmword_403148;
  strcpy(v6, "h6");
  v3[1] = xmmword_403158;
  v4 = 0x7CE4457476DB4268i64;
  ((void (__thiscall __noreturn *)(_OWORD *))sub_401290)(v3);
```

重新用ida32打开magic.exe，进入`内核选项 kernel options`，**取消勾选** `进行"无返回"分析 perform no-return analysis`，这样分析`main` 函数内容会更完整。  ![](<2025 NSSCTF/file-20260331130228673.png>)

操作后：

```plain
int __cdecl main(int argc, const char **argv, const char **envp)
{
  int v3; // ebp
  char v4; // di
  int v5; // ecx
  FILE *v6; // eax
  int i; // edi
  DWORD TickCount; // eax
  HKEY v10; // [esp-13Ch] [ebp-148h] BYREF
  DWORD v11; // [esp-138h] [ebp-144h] BYREF
  __int16 v12; // [esp-134h] [ebp-140h]
  _OWORD v13[4]; // [esp-130h] [ebp-13Ch] BYREF
  char v14[24]; // [esp-F0h] [ebp-FCh] BYREF
  BYTE v15[24]; // [esp-D8h] [ebp-E4h] BYREF
  _OWORD v16[2]; // [esp-C0h] [ebp-CCh] BYREF
  __int64 v17; // [esp-A0h] [ebp-ACh]
  int v18; // [esp-98h] [ebp-A4h]
  char v19[3]; // [esp-94h] [ebp-A0h] BYREF
  _OWORD v20[2]; // [esp-90h] [ebp-9Ch] BYREF
  __int16 v21; // [esp-70h] [ebp-7Ch]
  char v22; // [esp-6Eh] [ebp-7Ah]
  _OWORD v23[2]; // [esp-54h] [ebp-60h] BYREF
  __int16 v24; // [esp-34h] [ebp-40h]
  __int128 v25; // [esp-30h] [ebp-3Ch] BYREF
  int v26; // [esp-20h] [ebp-2Ch]
  char v27; // [esp-1Ch] [ebp-28h]
  char v28[12]; // [esp-18h] [ebp-24h] BYREF
  int v29; // [esp-Ch] [ebp-18h] BYREF
  __int16 v30; // [esp-8h] [ebp-14h]
  int v31; // [esp+0h] [ebp-Ch]
  int v32; // [esp+4h] [ebp-8h]
  int retaddr; // [esp+Ch] [ebp+0h]

  v31 = v3;
  v32 = retaddr;
  v18 = 1725917800;
  v16[0] = xmmword_403148;
  strcpy(v19, "h6");
  v16[1] = xmmword_403158;
  v17 = 0x7CE4457476DB4268i64;
  sub_401290(v16);
  RegOpenKeyExA(HKEY_LOCAL_MACHINE, (LPCSTR)v16, 0, 0x101u, &v10);
  v29 = 1741189973;
  v30 = 96;
  sub_401290(&v29);
  v11 = 21;
  if ( RegQueryValueExA(v10, (LPCSTR)&v29, 0, 0, v15, &v11) )
    return -1;
  v12 = 20;
  sub_401170(v14);
  v26 = -405287383;
  v25 = xmmword_4031F0;
  v27 = 0;
  if ( strncmp(v14, (const char *)&v25, 0x14u) )
    return -1;
  v13[0] = xmmword_4031B0;
  v13[1] = xmmword_4031D0;
  v13[2] = xmmword_4031C0;
  v13[3] = xmmword_4031E0;
  sub_4012F0(v13, v15, v5);
  sub_4011D0("%s", (char)v13);
  v6 = _acrt_iob_func(0);
  fgets(v28, 9, v6);
  if ( !atoi(v28) )
  {
    sub_4011D0("nope", v4);
    return -1;
  }
  if ( sub_401360(v28) == -1339812568 )
  {
    if ( IsDebuggerPresent() )
      goto LABEL_13;
    v21 = 5692;
    v20[0] = xmmword_40318C;
    v22 = 0;
    v20[1] = xmmword_40319C;
    sub_401290(v20);
    sub_4011D0("%s", (char)v20);
    for ( i = 0; i < 8; ++i )
    {
      TickCount = GetTickCount();
      v28[i] -= 10;
      if ( GetTickCount() - TickCount > 0x5DC )
        goto LABEL_13;
    }
    v23[0] = xmmword_403200;
    v23[1] = xmmword_403210;
    v24 = -10010;
    sub_401170(v23);
    if ( IsDebuggerPresent() )
LABEL_13:
      ExitProcess(0xFFFFFFFF);
    sub_4011D0("%s", (char)v23);
    return 0;
  }
  else
  {
    sub_4011D0("nope", v4);
    return 0;
  }
}
```

原因：

部分函数直接调用 `ExitProcess` 退出而不返回，以阻碍动调。ida识别后认为是结束点，就不分析 `main` 函数剩下的代码了。

