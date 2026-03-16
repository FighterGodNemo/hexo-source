---
title: "Basic_Number_theory"
date: 2026-03-15 13:28:18
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- SPCCTF
---

数论并非那么简单...答案用SPCCTF{}包裹

tips：试着了解一下费马小定理、同余运算的规则

```python
from Cryptodome.Util.number import *

flag=b'SPCCTF{********}'

def gift(m, prime):
    """
    计算模素数下的平方根
    参数:
        m: 被开方数
        prime: 模数，必须是一个素数
    返回:
        m 在模 prime 下的平方根，即满足 x^2 ≡ m (mod prime) 的 x 值
    """
    return pow(m, (prime + 1) // 2, prime)

m = bytes_to_long(flag)
p = getPrime(256)
q = getPrime(256)

print(f'p = {p}')
print(f'q = {q}')
print(f'gift1 = {gift(m, p)}')
print(f'gift2 = {gift(m, q)}')

'''
p = 105567001902149483225233801278030547652749833525571608392930512645364400245999
q = 81511997683966846473333390828680375856568631631277717336250575831122994340471
gift1 = 105419799642658114984760815640014033297217363704585842609128111376906603236722
gift2 = 81364795424475478232860405190663861501036161810291951552448174562665197331194
'''
```

解密：

<font style="color:rgb(0, 0, 0);">通过中国剩余定理（CRT），从给定的素数 p、q 以及模平方根值还原出原始 flag：</font>

```python
from Crypto.Util.number import long_to_bytes
p = 105567001902149483225233801278030547652749833525571608392930512645364400245999
q = 81511997683966846473333390828680375856568631631277717336250575831122994340471
gift1 = 105419799642658114984760815640014033297217363704585842609128111376906603236722
gift2 = 81364795424475478232860405190663861501036161810291951552448174562665197331194
# 计算所有可能的平方根组合（每个模数有两个可能的平方根）
x_p_candidates = [gift1, p - gift1]
x_q_candidates = [gift2, q - gift2]
# 使用中国剩余定理寻找满足条件的m
n = p * q
for x_p in x_p_candidates:
    for x_q in x_q_candidates:
        # 计算满足以下条件的m:
        # m ≡ x_p (mod p)
        # m ≡ x_q (mod q)
        # 利用扩展欧几里得算法计算模逆
        inv_p = pow(p, -1, q)  # p在模q下的逆元
        k = (x_q - x_p) * inv_p % q
        m = x_p + k * p 
        # 将结果转换为字节并尝试解析flag
        try:
            flag = long_to_bytes(m)
            if flag.startswith(b'SPCCTF{') and flag.endswith(b'}'):
                print("Found flag:", flag.decode())
        except:
            continue
```

### ![](Basic_Number_theory/1759666881358-222c08b1-5a06-4e94-af32-cf3bbd548426.png)
![](Basic_Number_theory/1759666917113-0768ddba-9591-4229-9d88-91c122a70a89.png)![](Basic_Number_theory/1759666947089-78228a3f-3763-48c2-98e2-b7564bb32bc5.png)

