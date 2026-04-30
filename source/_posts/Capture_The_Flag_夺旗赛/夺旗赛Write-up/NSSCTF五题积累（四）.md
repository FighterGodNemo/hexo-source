---
title: NSSCTF五题积累（四）
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/NSSCTF五题积累（四）/
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

### [TCTF 2019]babyrsa 
#### #AMM #Crypto #RSA
RSA challs are always easy, right? Even if N is not a integer.

## 2.Web

### [鹤城杯 2021]流量分析
#### #流量分析 #日志审计 #脚本编写
抢分做法：一把梭

![](<2025 NSSCTF/file-20260331130228782.png>)

回顾：

![](<2025 NSSCTF/file-20260331130228799.png>)

1. 发现大量HTTP请求包含SQL盲注特征

2. 攻击者使用ASCII逐字符提取技术，通过判断每个位置字符的ASCII值来获取flag

3. 这种技术是典型的基于响应的SQL盲注攻击

攻击者通过盲注技术获取了存储在数据库表 t 中的flag字段内容。

flag{w1reshARK_ez_1sntit}

## 3.Misc

### [BJDCTF 2020]鸡你太美  
#### #编码分析 #脚本编写 #GIF提取
![](<2025 NSSCTF/file-20260331130228606.png>)

这个gif文件没有正确显示。文件头修复：

![](<2025 NSSCTF/file-20260331130228580.png>)

NSSCTF{zhi-yin-you-are-beautiful}

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

### [BJDCTF 2020]base??
#### #Base家族 #古典密码 #其他
> dict:{0: 'J', 1: 'K', 2: 'L', 3: 'M', 4: 'N', 5: 'O', 6: 'x', 7: 'y', 8: 'U', 9: 'V', 10: 'z', 11: 'A', 12: 'B', 13: 'C', 14: 'D', 15: 'E', 16: 'F', 17: 'G', 18: 'H', 19: '7', 20: '8', 21: '9', 22: 'P', 23: 'Q', 24: 'I', 25: 'a', 26: 'b', 27: 'c', 28: 'd', 29: 'e', 30: 'f', 31: 'g', 32: 'h', 33: 'i', 34: 'j', 35: 'k', 36: 'l', 37: 'm', 38: 'W', 39: 'X', 40: 'Y', 41: 'Z', 42: '0', 43: '1', 44: '2', 45: '3', 46: '4', 47: '5', 48: '6', 49: 'R', 50: 'S', 51: 'T', 52: 'n', 53: 'o', 54: 'p', 55: 'q', 56: 'r', 57: 's', 58: 't', 59: 'u', 60: 'v', 61: 'w', 62: '+', 63: '/', 64: '='}
>
> chipertext:
>
> FlZNfnF6Qol6e9w17WwQQoGYBQCgIkGTa9w3IQKw
>

```python
#!/usr/bin/env python3
# coding=utf-8
# Custom Base64 mapping
dictionary = {
    0: 'J', 1: 'K', 2: 'L', 3: 'M', 4: 'N', 5: 'O', 6: 'x', 7: 'y', 8: 'U', 9: 'V',
    10: 'z', 11: 'A', 12: 'B', 13: 'C', 14: 'D', 15: 'E', 16: 'F', 17: 'G', 18: 'H',
    19: '7', 20: '8', 21: '9', 22: 'P', 23: 'Q', 24: 'I', 25: 'a', 26: 'b', 27: 'c',
    28: 'd', 29: 'e', 30: 'f', 31: 'g', 32: 'h', 33: 'i', 34: 'j', 35: 'k', 36: 'l',
    37: 'm', 38: 'W', 39: 'X', 40: 'Y', 41: 'Z', 42: '0', 43: '1', 44: '2', 45: '3',
    46: '4', 47: '5', 48: '6', 49: 'R', 50: 'S', 51: 'T', 52: 'n', 53: 'o', 54: 'p',
    55: 'q', 56: 'r', 57: 's', 58: 't', 59: 'u', 60: 'v', 61: 'w', 62: '+', 63: '/',
    64: '='
}

# Ciphertext to decrypt
ciphertext = "FlZNfnF6Qol6e9w17WwQQoGYBQCgIkGTa9w3IQKw"

def decrypt_custom_base64(ciphertext, mapping):
    # Create reverse mapping: character to index
    reverse_mapping = {v: k for k, v in mapping.items()}
    
    # Convert ciphertext to list of indices
    indices = []
    for char in ciphertext:
        if char in reverse_mapping:
            indices.append(reverse_mapping[char])
        else:
            print(f"Warning: Character '{char}' not found in mapping")
    
    # Convert indices to binary data (6 bits per index)
    binary_str = ''
    for idx in indices:
        # Convert to 6-bit binary string
        binary_str += f"{idx:06b}"
    
    # Convert binary string to bytes
    # Pad to make length multiple of 8
    padding = len(binary_str) % 8
    if padding > 0:
        binary_str = binary_str[:-padding]  # Remove padding bits
    
    # Convert to bytes
    bytes_data = bytearray()
    for i in range(0, len(binary_str), 8):
        byte = binary_str[i:i+8]
        if byte:
            bytes_data.append(int(byte, 2))
    
    return bytes_data

# Decrypt the ciphertext
decrypted_bytes = decrypt_custom_base64(ciphertext, dictionary)

# Try different encodings to get readable text
print("Decrypted results:")
print("UTF-8:", decrypted_bytes.decode('utf-8', errors='replace'))
print("ASCII:", decrypted_bytes.decode('ascii', errors='replace'))
print("HEX:", decrypted_bytes.hex())
print("Raw bytes:", decrypted_bytes)

# Also try checking if it's a standard encoding with custom mapping
# Let's see the standard Base64 characters for comparison
standard_base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
print("\nStandard Base64 mapping for comparison:")
for i in range(64):
    if i in dictionary and dictionary[i] != standard_base64[i]:
        print(f"Index {i}: Custom='{dictionary[i]}', Standard='{standard_base64[i]}'")

if __name__ == "__main__":
    pass
```

BJD{D0_Y0u_kNoW_Th1s_b4se_map}

## 2.Web

### [SWPUCTF 2021 新生赛]easy_md5 lamaper
#### #弱比较 #PHP #数组绕过
既要两变量个值不相同，又要两个变量md5值一样。  
可以发现此时判断md5值是否一样用的是`==`，这是php的弱类型比较，  
**方法一：** 可以使用带0e开头的数字穿进行传递参数，因为php会将0e开头的数字转化为0，故此时md5值相等，而两个变量值不相等；  
**方法二：** 可以传递数组，如name[]=123,password[]=456，md5不能加密数组，故两个md5返回的都是null

另：若遇到`===`这样的强类型比较，方法一就失效了，方法二仍然有效，或者还可以使用软件fastcoll进行md5碰撞，生成两个字符串使得他们的md5值相同

## 3.Misc

### [SWPUCTF 2021 新生赛]gif好像有点大 
#### #GIF #提取二维码 #图片隐写
纯找。

![](<2025 NSSCTF/file-20260331130228571.png>)

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

