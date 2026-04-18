---
title: 2025 NSSCTF
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/2025 NSSCTF/
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - NSSCTF
tags:
  - CTF
  - WriteUp
  - NSSCTF
created: 2026-03-15T16:49
updated: 2026-04-18T10:01
---

# 2025 NSSCTF 积累之（一）
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

### Do_you_know_http

_**一、看题目环境：**_

环境页面显示：  
Please use 'WLLM' browser!  
意思为：

```plain
请使用“ wllm”浏览器！
```

好看到这里都可以了，去用burp suite进行抓包改请求。

_**二、使用工具burp suite进行抓包，并对其中参数有所理解：**_

GET:到  
Host:来自  
User-Agent: 用户-代理  
Upgrade-Insecure-Requests: 升级-不安全的-请求  
Content-Length: 内容长度  
Cache-Control: 缓存-控制  
X-Forwarded-For: HTTP的请求端真实的IP  
Request: 请求  
Response: 响应

_**三、抓包分析改请求，拿flag：**_

打开环境用burp suite进行抓包  
返回数据：  
GET /hello.php HTTP/1.1

```plain
Host: node2.anna.nssctf.cn:28873

User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

题目环境中告诉我们说要用WLLM浏览器，所以我们须要改User-Agent的值为WLLM  
GET /hello.php HTTP/1.1

```plain
Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

鼠标右键Send to Repeater送去重放  
返回结果为：  
HTTP/1.1 302 Found #发现

```plain
Date: Fri, 21 Jul 2023 12:52:27 GMT            #日期

Server: Apache/2.4.25 (Debian)                 #服务器

X-Powered-By: PHP/5.6.40                       #动力来自于a

Location: ./a.php                              #位置

Content-Length: 7                              #内容长度

Connection: close                              #连接

Content-Type: text/html; charset=UTF-8         #内容类型

success                                        #成功
```

# 在Location位置发现关键PHP文件：a.php
在GET位置将hello.php文件修改为a.php并点击Send发送：  
GET /a.php HTTP/1.1

```plain
Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

返回结果为：  
HTTP/1.1 200 OK

```plain
Date: Fri, 21 Jul 2023 13:01:28 GMT

Server: Apache/2.4.25 (Debian)

X-Powered-By: PHP/5.6.40

Content-Length: 64

Connection: close

Content-Type: text/html; charset=UTF-8

You can only read this at local!<br>Your address123.9.161.232
最后一句话告诉我们只能在本地可以进行访问
```

所有我们要在Request请求中添加：X-Forwarded-For:127.0.0.1（需注意的是任意行都可以添加除了第一行，有时候也不对，有的位置可以，有的位置不可以，总之多试试。冒号:注意是英文冒号！）  
GET /a.php HTTP/1.1

```plain
X-Forwarded-For:127.0.0.1

Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

返回结果为：  
HTTP/1.1 302 Found

```plain
Date: Fri, 21 Jul 2023 13:14:35 GMT

Server: Apache/2.4.25 (Debian)

X-Powered-By: PHP/5.6.40

Location: ./secretttt.php

Content-Length: 60

Connection: close

Content-Type: text/html; charset=UTF-8

You can only read this at local!<br>Your address127.0.0.1
```

# 在Location位置发现重要的php文件：secretttt.php
在GET位置将a.php修改为secretttt.php并点击Send进行发送：  
GET /secretttt.php HTTP/1.1

```plain
X-Forwarded-For:127.0.0.1

Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

返回结果为：  
HTTP/1.1 200 OK

```plain
Date: Fri, 21 Jul 2023 13:28:23 GMT

Server: Apache/2.4.25 (Debian)

X-Powered-By: PHP/5.6.40

Content-Length: 44

Connection: close    

Content-Type: text/html; charset=UTF-8

NSSCTF{0bbd067c-24bd-454c-9111-6cd1b67b6da4}
```

# 拿到flag：
```plain
#NSSCTF{0bbd067c-24bd-454c-9111-6cd1b67b6da4}
```

## 3.Misc

### [NSSRound#12 Basic]坏东西 
#### #PDF隐写#压缩包分析
先尝试用文件名解压，发现确实是解压密码。

![](<2025 NSSCTF/file-20260331130228745.png>)

显然多层嵌套无底洞。

```python
import zipfile
name = '99020'
while True:
    fz = zipfile.ZipFile(name + '.zip', 'r')
    fz.extractall(pwd=bytes(name, 'utf-8'))
    name = fz.filelist[0].filename.rstrip('.zip')
    print(fz.filelist[0].filename)
    fz.close()
```

解压后得到破损PDF

![](<2025 NSSCTF/file-20260331130228718.png>)

放入010editor查看

![](<2025 NSSCTF/file-20260331130228727.png>)

很规律的一大块。发现其中Filter前面暗藏玄机。故Ctrl+F搜索Filter，在**Variables**变量表中获取flag

![](<2025 NSSCTF/file-20260331130228737.png>)

NSSCTF{25da50b7993c0db55867a5a51f32f35c}

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
