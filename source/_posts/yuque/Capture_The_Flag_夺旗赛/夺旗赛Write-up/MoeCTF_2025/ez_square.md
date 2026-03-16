---
title: "ez_square"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- MoeCTF_2025
---

题目：

```python
from Crypto.Util.number import *
from secret import flag

assert len(flag) == 35
assert flag[:7] == b'moectf{'
assert flag[-1:] == b'}'

def main():
    # 生成两个512位的大素数p和q
    p = getPrime(512)
    q = getPrime(512)

    # 计算n，即p和q的乘积，这是RSA模数
    n = p * q
    # 设置公钥指数e为65537，这是一个常用的固定值
    e = 65537

    # 将flag转换为长整型
    m = bytes_to_long(flag)

    # 使用RSA加密：计算c = m^e mod n
    c = pow(m, e, n)
    # 计算hint = (p + q)^2 mod n，这是一个提示信息
    hint = pow(p + q, 2, n)

    # 输出n、加密后的密文c和提示hint
    print(f'{n = }')
    print(f'{c = }')
    print(f'{hint = }')

if __name__ == '__main__':
    main()

"""
n = 83917281059209836833837824007690691544699901753577294450739161840987816051781770716778159151802639720854808886223999296102766845876403271538287419091422744267873129896312388567406645946985868002735024896571899580581985438021613509956651683237014111116217116870686535030557076307205101926450610365611263289149
c = 69694813399964784535448926320621517155870332267827466101049186858004350675634768405333171732816667487889978017750378262941788713673371418944090831542155613846263236805141090585331932145339718055875857157018510852176248031272419248573911998354239587587157830782446559008393076144761176799690034691298870022190
hint = 5491796378615699391870545352353909903258578093592392113819670099563278086635523482350754035015775218028095468852040957207028066409846581454987397954900268152836625448524886929236711403732984563866312512753483333102094024510204387673875968726154625598491190530093961973354413317757182213887911644502704780304
"""
```

解密：

```python
from Crypto.Util.number import long_to_bytes
import gmpy2

n = 83917281059209836833837824007690691544699901753577294450739161840987816051781770716778159151802639720854808886223999296102766845876403271538287419091422744267873129896312388567406645946985868002735024896571899580581985438021613509956651683237014111116217116870686535030557076307205101926450610365611263289149
c = 69694813399964784535448926320621517155870332267827466101049186858004350675634768405333171732816667487889978017750378262941788713673371418944090831542155613846263236805141090585331932145339718055875857157018510852176248031272419248573911998354239587587157830782446559008393076144761176799690034691298870022190
hint = 5491796378615699391870545352353909903258578093592392113819670099563278086635523482350754035015775218028095468852040957207028066409846581454987397954900268152836625448524886929236711403732984563866312512753483333102094024510204387673875968726154625598491190530093961973354413317757182213887911644502704780304
e = 65537

# 找 k
for k in range(1, 10):
    val = hint + k * n
    root, exact = gmpy2.iroot(val, 2)
    if exact:
        S = int(root)
        print(f"k = {k}, S = {S}")
        break

# 求 p, q
D2 = S*S - 4*n
D, exact = gmpy2.iroot(D2, 2)
if exact:
    D = int(D)
    p = (S + D) // 2
    q = (S - D) // 2
    assert p * q == n
    print("p =", p)
    print("q =", q)

# 解密
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, n)
print(long_to_bytes(m))
```

解得：k = 4, S = 18470541968644424341853360787392124964912376035057025304283994397475806910690870232956788598297125214076864380379470271723684322545326168920856938288029630

p = 10407000088959425169419203940606545581520363832679548727898058943637902824586736063534210492690389402499379844542729949917492266301734929472912145381387041

q = 8063541879684999172434156846785579383392012202377476576385935453837904086104134169422578105606735811577484535836740321806192056243591239447944792906642589

b'moectf{Ma7hm4t1c5_is_@_k1nd_0f_a2t}'

## <font style="color:rgb(15, 17, 21);">1. 已知条件</font>
<font style="color:rgb(15, 17, 21);">我们有：</font>

<font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">⋅</font><font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">=</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">⋅</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">m</font><font style="color:rgb(15, 17, 21);">o</font><font style="color:rgb(15, 17, 21);">d</font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">mod</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">c</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">m</font><font style="color:rgb(15, 17, 21);">e</font><font style="color:rgb(15, 17, 21);">m</font><font style="color:rgb(15, 17, 21);">o</font><font style="color:rgb(15, 17, 21);">d</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">,</font><font style="color:rgb(15, 17, 21);">e</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">65537</font>_<font style="color:rgb(15, 17, 21);">c</font>_<font style="color:rgb(15, 17, 21);">=</font>_<font style="color:rgb(15, 17, 21);">m</font>__<font style="color:rgb(15, 17, 21);">e</font>_<font style="color:rgb(15, 17, 21);">mod</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">,</font>_<font style="color:rgb(15, 17, 21);">e</font>_<font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">65537</font>

<font style="color:rgb(15, 17, 21);">因为</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">m</font><font style="color:rgb(15, 17, 21);">o</font><font style="color:rgb(15, 17, 21);">d</font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">mod</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">，且</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);"><</font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);"><</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">（因为</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">,</font><font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">,</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">都是 512 位，</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">最多 513 位，而</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是 1024 位，所以</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);"><</font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);"><</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">），所以实际上：</font>

<font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font>

<font style="color:rgb(15, 17, 21);">因为</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);"><</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);"><</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">，但这里模</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">之后还是等于</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">，只要</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);"><</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);"><</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">就成立。我们来验证一下：</font>

<font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">,</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">512</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">,</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">512</font><font style="color:rgb(15, 17, 21);">，所以</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">513</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">513</font><font style="color:rgb(15, 17, 21);">，平方后约为</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1026</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1026</font><font style="color:rgb(15, 17, 21);">，而</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1024</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1024</font><font style="color:rgb(15, 17, 21);">，所以</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">></font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">></font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">，因此不能直接说</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">，需要小心。</font>

---

## <font style="color:rgb(15, 17, 21);">2. 利用 hint 求</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_
<font style="color:rgb(15, 17, 21);">我们有：</font>

<font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">≡</font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">m</font><font style="color:rgb(15, 17, 21);">o</font><font style="color:rgb(15, 17, 21);">d</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">)</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">≡</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">mod</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">)</font>

<font style="color:rgb(15, 17, 21);">即：</font>

<font style="color:rgb(15, 17, 21);">(</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">k</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">(</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">)</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">=</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">kn</font>_

<font style="color:rgb(15, 17, 21);">其中</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是某个正整数。</font>

<font style="color:rgb(15, 17, 21);">因为</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font><font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">，数量级是</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">513</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">513</font><font style="color:rgb(15, 17, 21);">，平方是</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1026</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1026</font><font style="color:rgb(15, 17, 21);">，而</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1024</font>_<font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1024</font><font style="color:rgb(15, 17, 21);">，所以</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">k</font><font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1026</font><font style="color:rgb(15, 17, 21);">/</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1024</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">4</font>_<font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);">≈</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1026</font><font style="color:rgb(15, 17, 21);">/</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">1024</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">4</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">左右。因此</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">很小，我们可以枚举</font><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);">。</font>

---

<font style="color:rgb(15, 17, 21);">设：</font>

<font style="color:rgb(15, 17, 21);">S</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">p</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">q</font>_<font style="color:rgb(15, 17, 21);">S</font>_<font style="color:rgb(15, 17, 21);">=</font>_<font style="color:rgb(15, 17, 21);">p</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">q</font>_

<font style="color:rgb(15, 17, 21);">那么：</font>

<font style="color:rgb(15, 17, 21);">S</font><font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">k</font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">S</font>_<font style="color:rgb(15, 17, 21);">2</font><font style="color:rgb(15, 17, 21);">=</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">kn</font>_<font style="color:rgb(15, 17, 21);">S</font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);">h</font><font style="color:rgb(15, 17, 21);">i</font><font style="color:rgb(15, 17, 21);">n</font><font style="color:rgb(15, 17, 21);">t</font><font style="color:rgb(15, 17, 21);">+</font><font style="color:rgb(15, 17, 21);">k</font><font style="color:rgb(15, 17, 21);">n</font>_<font style="color:rgb(15, 17, 21);">S</font>_<font style="color:rgb(15, 17, 21);">=</font>_<font style="color:rgb(15, 17, 21);">hin</font>__<font style="color:rgb(15, 17, 21);">t</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">kn</font>_

<font style="color:rgb(15, 17, 21);">我们检查 k</font>_<font style="color:rgb(15, 17, 21);">k</font>_<font style="color:rgb(15, 17, 21);"> 使得 hint+kn</font>_<font style="color:rgb(15, 17, 21);">hint</font>_<font style="color:rgb(15, 17, 21);">+</font>_<font style="color:rgb(15, 17, 21);">kn</font>_<font style="color:rgb(15, 17, 21);"> 为完全平方数，并且 S</font>_<font style="color:rgb(15, 17, 21);">S</font>_<font style="color:rgb(15, 17, 21);"> 为整数。</font>

