---
title: "Sagemath使用指哪_"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- NewstarCTF_2025
---



题目内容：

使用Sagemath运行程序以获得flag

```python
# Sage 9.3

key=1
G = PSL(2, 11)
key*=G.order()
G = CyclicPermutationGroup(11)
key*=G.order()
G = AlternatingGroup(114)
key*=G.order()
G = PSL(4, 7)
key*=G.order()
G = PSU(3, 4)
key*=G.order()
G = MathieuGroup(12)
key*=G.order()

c=91550542840025722520458836108112308924742424464072171170891749838108012046397534151231852770095499011

key=(int(str(bin(key))[2:][0:42*8],2))
m=c^^key
f=[]
while m>0:
    x=m%256
    f.append(chr(x))
    m//=256
f.reverse()
flag="".join(i for i in f )
print(flag)
```

解答：这是一个群论计算题，需要计算几个群的阶（order）然后解密。

用sagemath运行：

key = 1

key *= PSL(2, 11).order()

key *= CyclicPermutationGroup(11).order() 

key *= AlternatingGroup(114).order()

key *= PSL(4, 7).order()

key *= PSU(3, 4).order()

key *= MathieuGroup(12).order()

key_bin = bin(key)[2:][:336]

key_int = int(key_bin, 2)

c = 91550542840025722520458836108112308924742424464072171170891749838108012046397534151231852770095499011

m = c ^^ key_int

import binascii

flag = binascii.unhexlify(hex(m)[2:]).decode()

print(flag)

![](1759231704437-90bd9ea4-0ba7-4b55-b354-4df47501d26c.png)


