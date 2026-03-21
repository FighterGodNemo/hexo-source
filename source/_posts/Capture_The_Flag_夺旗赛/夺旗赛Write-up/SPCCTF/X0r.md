---
title: X0r
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - SPCCTF
created: 2026-03-15T16:49
updated: 2026-03-21T08:20
---

题目内容：

![](1759155991311-4578c694-b4a6-4a34-a09d-18872c4db4d4.png)

解答：

● 用IDA打开：![](1759660720436-89fd346e-1c12-44e7-ab60-a4092030887d.png)

+ 按F5反编译成c语言代码：

![](1759660699927-c827163e-39f1-4ce2-b5ef-4b4a4d538ae4.png)

```plain
for ( i = 0; i <= 27; ++i )
{
    if ( ((unsigned __int8)v4[i] ^ 0x7A) != enc_0[i] )
    {
        printf("FLAG is wrong!\n");
        system("pause");
        exit(0);
    }
}
```

意思是：

+ 用户输入的 `v4[i]` 与 `0x7A` 异或。
+ 结果必须等于 `enc_0[i]`（`enc_0` 是程序里已有的数组，存放加密后的数据）。
+ 循环长度是 28（`i` 从 0 到 27）。

## 2. 解密方法
+ 由于XOR操作是可逆的，我们只需要按相反的顺序和相同的密钥进行XOR就能解密。

所以只要在 IDA 里找到 `enc_0` 数组的内容（应该是 28 个字节），然后每个字节与 `0x7A` 异或，就能得到 flag。

![](1759661451706-03378e70-f93b-4018-94af-0dffcd104ab0.png)

```python
def decrypt_flag(enc_data, xor_key=0x7A):
    flag = ''.join([chr(byte ^ xor_key) for byte in enc_data])
    return flag
enc_0 = [
    0x34, 0x29, 0x29, 0x39, 0x2E, 0x3C, 0x01, 0x22, 0x15, 0x08, 0x25,
    0x13, 0x09, 0x25, 0x18, 0x18, 0x09, 0x13, 0x19, 0x25, 0x08, 0x1F, 0x0C,
    0x1F, 0x08, 0x09, 0x1F, 0x07, 0x00, 0x00, 0x00, 0x00
]
flag = decrypt_flag(enc_0)
print(f"解密后的 flag: {flag}")
```

NSSCTF{Xor_is_basic_reverse}


