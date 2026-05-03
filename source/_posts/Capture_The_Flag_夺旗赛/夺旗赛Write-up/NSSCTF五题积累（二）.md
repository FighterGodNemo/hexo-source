---
title: NSSCTF五题积累（二）
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/NSSCTF五题积累（二）/
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
updated: 2026-05-03T08:52
---

# 第一轮
## 1.Crypto

### [强网拟态_2021]拟态签到题

ZmxhZ3tHYXFZN0t0RXRyVklYMVE1b1A1aUVCUkNZWEVBeThyVH0=

flag{GaqY7KtEtrVIX1Q5oP5iEBRCYXEAy8rT}
![](<2025 NSSCTF/file-20260331130230831.png>)

## 2.Web

### [SWPUCTF_2021_新生赛]jicao

```php
<?php
  highlight_file('index.php');
include("flag.php");
$id=$_POST['id'];// 从 POST 请求中获取 id 参数
$json=json_decode($_GET['json'],true);// 从 GET 请求的 json 参数中解析 JSON 数据为数组
// 判断条件：
if ($id=="wllmNB"&&$json['x']=="wllm")
{echo $flag;}
  ?>
```

要让程序输出 `$flag`，必须同时满足：

1. **POST 参数**** **`**id**`** ****的值为**** **`**"wllmNB"**`
2. **GET 参数 **`**json**`** 是一个合法的 JSON 字符串，且解析后是一个数组，其中键 **`**'x'**`** 的值为 **`**"wllm"**`
3. **使用 URL 编码，避免任何歧义**

```php
curl -X POST "http://node7.anna.nssctf.cn:27541/index.php?json=%7B%22x%22%3A%22wllm%22%7D" -d "id=wllmNB"
```

NSSCTF{5e3b5793-b1f6-488a-bac4-53e9c4889ed7}
![](<2025 NSSCTF/file-20260331130230800.png>)

## 3.Misc

### 无标题文档

![](<2025 NSSCTF/file-20260331130230758.png>)
![](<2025 NSSCTF/file-20260331130230727.png>)

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

### [MoeCTF 2021]midpython
#### #Python #自定义逻辑 #REVERSE
![](<2025 NSSCTF/file-20260331130228640.png>)

[https://cn.bing.com/search?q=pyinstxtractor](https://cn.bing.com/search?q=pyinstxtractor)

这个工具可以将PyInstaller编译的.exe文件反编译回源代码.py文件

```plain
python pyinstxtractor.py 文件名
```

![](<2025 NSSCTF/file-20260331130228597.png>)

获得大量文件。寻找核心的Midpython.pyc，使用**pycdc**

![](<2025 NSSCTF/file-20260331130228623.png>)

![](<2025 NSSCTF/file-20260331130228615.png>)

```python
key = [
    69,
    70,
    79,
    72,
    88,
    75,
    85,
    127,
    89,
    85,
    74,
    19,
    74,
    122,
    107,
    103,
    75,
    77,
    9,
    73,
    29,
    28,
    67] 
xxor = lambda x, y: x ^ y ^ 11
xoor = lambda x, y: xxor(x, y) ^ 45
xorr = lambda x, y: xoor(x, y) ^ 14
length = len(key)
ipt = input('>>>input your flag:\n>>>')
flag = 1
if len(ipt) == length:
    for i in range(length):
        if xorr(ord(ipt[i]), i) != key[i]:
            flag = 0
flag = 0
if flag == 1:
    print('>>>Right!!')
else:
    print('>>>Wrong!!')
```

```plain
xorr(x, y) = xoor(x, y) ^ 14 = ((x ^ y ^ 11) ^ 45) ^ 14
```

```python
key = [69,70,79,72,88,75,85,127,89,85,74,19,74,122,107,103,75,77,9,73,29,28,67]
#定义一个名为 key 的列表，包含23个整数，这些整数是加密后的密文数据
xxor = lambda x, y: x ^ y ^ 11
xoor = lambda x, y: xxor(x, y) ^ 45
xorr = lambda x, y: xoor(x, y) ^ 14
flag= [] #定义空列表 flag ，用于存储解密后的字符
for i in range(len(key)): #外层循环：遍历 key 列表的每个元素， i 是当前元素的索引
    for x in range(32, 127): #range() 函数左闭右开 # 内层循环：遍历ASCII码32到126的所有可打印字符
        if xorr(x, i) == key[i]:#- 条件判断：如果将当前字符 x 和索引 i 传入 xorr 函数的结果等于 key[i]，即找到了解密当前位置字符的正确ASCII码
            flag.append(chr(x))#如果条件成立，将ASCII码 x 转换为对应字符，添加到 flag 列表
            break #跳出内层循环，继续处理 key 列表的下一个元素
print(''.join(flag))
```

> 选择32~126的原因：
>
> ASCII（美国标准信息交换码）将字符分为几个主要范围：
>
> 0-31 ：控制字符（不可打印），如换行符（\n）、制表符（\t）、回车符（\r）等，这些字符在屏幕上无法正常显示为可见字符。
>
> 32 ：空格字符，是唯一可打印的控制字符。
>
> 33-126 ：可打印字符，包括所有常用字符：标点符号（如!、@、#、$等）、数字（0-9）、大写字母（A-Z）、小写字母（a-z）、其他符号（如=、+、-、*等）。
>

moectf{Pyth0n_M@st3r!!}


# 第二轮
## 1.Crypto

### [羊城杯_2022]签个到

附件：231.txt

> ZMJTPM33TL4TRMYRZD3JXAGOZVMJRLWEZMFGFAEIZV2GVMOMZZ3JTZ3RUR2U2===
>

法一：ciphey一把梭

NSSCTF{68bedd7e6ab3ba1fe965b54d9c7c3d94}
![](<2025 NSSCTF/file-20260331130230747.png>)

法二：脑筋急转弯

+ 文末三个“=”显然不是base64编码。
+ 文件名提示：倒着看13和32
+ rot13和base32解密即可

NSSCTF{68bedd7e6ab3ba1fe965b54d9c7c3d94}
![](<2025 NSSCTF/file-20260331130230779.png>)
![](<2025 NSSCTF/file-20260331130230789.png>)

## 2.Web

### [陇剑杯_2021]jwt（问1）

追踪http流

![](<2025 NSSCTF/file-20260331130230881.png>)

> token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwODYsIk1hcENsYWltcyI6eyJhdWQiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4ifX0.dJArtwXjas3_Cg9a3tr8COXF7DRsuX8UjmbC1nKf8fc
>

![](<2025 NSSCTF/file-20260331130230890.png>)

NSSCTF{jwt}

## 3.Misc

### 喜欢我的压缩包么__初级_

题目：可恶，学习资料的密码忘了！！！  
几位数来着，哦哦，6位

1. 使用Hashcat暴力破解。















2. 使用Advanced Archive Password Recovery暴力破解。
![](<2025 NSSCTF/file-20260331130230628.jpeg>)

得到口令114514，解出压缩包中的flag。

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

### [SWPUCTF 2021 新生赛]非常简单的逻辑题
#### #Python #语言逆向 #逆向技术
```python
flag = 'xxxxxxxxxxxxxxxxxxxxx'
s = 'wesyvbniazxchjko1973652048@$+-&*<>'#s是一个字符集，包含34个字符
result = ''
for i in range(len(flag)):#对于flag中的每个字符，执行以下操作
    s1 = ord(flag[i])//17
    s2 = ord(flag[i])%17
    result += s[(s1+i)%34]+s[-(s2+i+1)%34]# 结果字符串result添加两个字符：
print(result)
# result = 'v0b9n1nkajz@j0c4jjo3oi1h1i937b395i5y5e0e$i'
#给了个结果，让我们逆向原本的flag
```

```python
# 已知的加密结果
result = 'v0b9n1nkajz@j0c4jjo3oi1h1i937b395i5y5e0e$i'
# 字符集
s = 'wesyvbniazxchjko1973652048@$+-&*<>'
# 逆向解密过程
flag = ''
# 遍历result中的每两个字符
for i in range(0, len(result), 2):
    # 获取当前两个字符
    c1 = result[i]
    c2 = result[i+1]
    # 计算字符在s中的索引
    idx1 = s.index(c1)
    idx2 = s.index(c2)
    # 计算实际的s1和s2
    # 对于第一个字符：idx1 = (s1 + i//2) % 34
    # 对于第二个字符：idx2 = (34 - (s2 + i//2 + 1) % 34) % 34
    # 注意：第二个字符的索引计算是因为s[-(s2+i+1)%34]相当于s[(34 - (s2+i+1)%34) % 34]
    pos = i // 2
    # 计算s1的可能值
    s1 = (idx1 - pos) % 34
    # 计算s2的可能值
    # 因为 idx2 = (34 - (s2 + pos + 1) % 34) % 34
    # 所以 (s2 + pos + 1) % 34 = (34 - idx2) % 34
    # 所以 s2 = (34 - idx2 - pos - 1) % 34
    s2 = (34 - idx2 - pos - 1) % 34
    # 计算原始字符的ASCII值
    ascii_val = s1 * 17 + s2
    # 将ASCII值转换为字符
    flag_char = chr(ascii_val)
    # 添加到flag中
    flag += flag_char
print(f"解密得到的flag: {flag}")
```

NSSCTF{Fake_RERE_QAQ}

