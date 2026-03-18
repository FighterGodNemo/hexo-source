---
title: XOR异或
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - CTF知识
  - Crypto
created: 2026-03-15T16:49
updated: 2026-03-18T09:42
---

<font style="color:rgb(15, 17, 21);">XOR的特性（A XOR B XOR B = A），我们可以用加密的密钥解密。由于XOR操作是可逆的，我们只需要按相反的顺序和相同的密钥进行XOR就能解密。</font>

<font style="color:rgb(15, 17, 21);"></font>

<font style="color:rgb(15, 17, 21);">100</font>

<font style="color:rgb(15, 17, 21);">010</font>

<font style="color:rgb(15, 17, 21);">110</font>

<font style="color:rgb(15, 17, 21);"></font>

<font style="color:rgb(15, 17, 21);">110</font>

<font style="color:rgb(15, 17, 21);">010</font>

<font style="color:rgb(15, 17, 21);">100</font>

### <font style="color:rgb(15, 17, 21);">核心定义：什么是异或？</font>
**<font style="color:rgb(15, 17, 21);">异或</font>**<font style="color:rgb(15, 17, 21);">，英文为</font><font style="color:rgb(15, 17, 21);"> </font>**<font style="color:rgb(15, 17, 21);">XOR</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">或</font><font style="color:rgb(15, 17, 21);"> </font>**<font style="color:rgb(15, 17, 21);">Exclusive OR</font>**<font style="color:rgb(15, 17, 21);">，中文全称是“</font>**<font style="color:rgb(15, 17, 21);">异或逻辑运算</font>**<font style="color:rgb(15, 17, 21);">”。它是一种基本的二进制位运算。</font>

<font style="color:rgb(15, 17, 21);">它的核心逻辑是：</font>**<font style="color:rgb(15, 17, 21);">“相异为真，相同为假”</font>**<font style="color:rgb(15, 17, 21);">。</font>

<font style="color:rgb(15, 17, 21);">也就是说，当比较的两个位（bit）</font>**<font style="color:rgb(15, 17, 21);">不相同</font>**<font style="color:rgb(15, 17, 21);">时，结果为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);">（真）；当两个位</font>**<font style="color:rgb(15, 17, 21);">相同</font>**<font style="color:rgb(15, 17, 21);">时，结果为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0</font>`<font style="color:rgb(15, 17, 21);">（假）。</font>

### <font style="color:rgb(15, 17, 21);">真值表</font>
<font style="color:rgb(15, 17, 21);">我们可以用一个真值表来清晰地展示它的规则。假设有两个输入 A 和 B，一个输出 Y。</font>

| <font style="color:rgb(15, 17, 21);">A</font> | <font style="color:rgb(15, 17, 21);">B</font> | <font style="color:rgb(15, 17, 21);">Y (A XOR B)</font> |
| --- | --- | --- |
| <font style="color:rgb(15, 17, 21);">0</font> | <font style="color:rgb(15, 17, 21);">0</font> | **<font style="color:rgb(15, 17, 21);">0</font>** |
| <font style="color:rgb(15, 17, 21);">0</font> | <font style="color:rgb(15, 17, 21);">1</font> | **<font style="color:rgb(15, 17, 21);">1</font>** |
| <font style="color:rgb(15, 17, 21);">1</font> | <font style="color:rgb(15, 17, 21);">0</font> | **<font style="color:rgb(15, 17, 21);">1</font>** |
| <font style="color:rgb(15, 17, 21);">1</font> | <font style="color:rgb(15, 17, 21);">1</font> | **<font style="color:rgb(15, 17, 21);">0</font>** |


<font style="color:rgb(15, 17, 21);">从表中可以一目了然地看到：</font>

+ <font style="color:rgb(15, 17, 21);">当 A 和 B 都是 0（相同）时，结果是 0。</font>
+ <font style="color:rgb(15, 17, 21);">当 A 和 B 一个是 0，一个是 1（相异）时，结果是 1。</font>
+ <font style="color:rgb(15, 17, 21);">当 A 和 B 都是 1（相同）时，结果是 0。</font>

### <font style="color:rgb(15, 17, 21);">常见的符号表示</font>
<font style="color:rgb(15, 17, 21);">在不同的领域，异或有不同的表示符号：</font>

+ **<font style="color:rgb(15, 17, 21);">编程语言</font>**<font style="color:rgb(15, 17, 21);">中常用：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">^</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">（脱字符号）</font>
+ **<font style="color:rgb(15, 17, 21);">数学/逻辑学</font>**<font style="color:rgb(15, 17, 21);">中常用：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">⊕</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">（圆圈加号）</font>
+ **<font style="color:rgb(15, 17, 21);">电子工程</font>**<font style="color:rgb(15, 17, 21);">中常用：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">XOR</font>`

### <font style="color:rgb(15, 17, 21);">一个简单的例子</font>
<font style="color:rgb(15, 17, 21);">让我们用十进制数来演示一下异或运算（实际是在二进制位上操作的）：</font>

<font style="color:rgb(15, 17, 21);">计算</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">5 ^ 3</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">（</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">^</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是编程中的异或符号）</font>

1. **<font style="color:rgb(15, 17, 21);">转换为二进制</font>**<font style="color:rgb(15, 17, 21);">：</font>
    - <font style="color:rgb(15, 17, 21);">5 的二进制是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">101</font>`
    - <font style="color:rgb(15, 17, 21);">3 的二进制是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">011</font>`

**<font style="color:rgb(15, 17, 21);">按位进行异或运算</font>**<font style="color:rgb(15, 17, 21);">（对齐，一位一位地比较）：</font>

2. <font style="color:rgb(15, 17, 21);">text</font>

```plain
1 0 1   (5)
XOR 0 1 1   (3)
    -----
    1 1 0   (6)
```

    - <font style="color:rgb(15, 17, 21);">最右边：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">XOR</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0</font>`
    - <font style="color:rgb(15, 17, 21);">中间：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">XOR</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`
    - <font style="color:rgb(15, 17, 21);">最左边：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">XOR</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">=</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`
3. **<font style="color:rgb(15, 17, 21);">将结果转换回十进制</font>**<font style="color:rgb(15, 17, 21);">：二进制</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">110</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">等于十进制</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">6</font>`<font style="color:rgb(15, 17, 21);">。</font>

<font style="color:rgb(15, 17, 21);">所以，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">5 ^ 3</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的结果是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">6</font>`<font style="color:rgb(15, 17, 21);">。</font>

---

### <font style="color:rgb(15, 17, 21);">异或运算的重要特性</font>
<font style="color:rgb(15, 17, 21);">异或有一些非常独特且有用的数学特性，这些特性是它在各种算法中得以应用的基础。</font>

1. **<font style="color:rgb(15, 17, 21);">交换律</font>**<font style="color:rgb(15, 17, 21);">:</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ B = B ^ A</font>`
2. **<font style="color:rgb(15, 17, 21);">结合律</font>**<font style="color:rgb(15, 17, 21);">:</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">(A ^ B) ^ C = A ^ (B ^ C)</font>`
3. **<font style="color:rgb(15, 17, 21);">与自身的运算</font>**<font style="color:rgb(15, 17, 21);">:</font><font style="color:rgb(15, 17, 21);"> </font>`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ A = 0</font>**`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">（任何数与自己异或，结果为0）</font>
4. **<font style="color:rgb(15, 17, 21);">与 0 的运算</font>**<font style="color:rgb(15, 17, 21);">:</font><font style="color:rgb(15, 17, 21);"> </font>`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ 0 = A</font>**`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">（任何数与 0 异或，结果还是自己）</font>
5. **<font style="color:rgb(15, 17, 21);">自反性</font>**<font style="color:rgb(15, 17, 21);">: 如果</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ B = C</font>`<font style="color:rgb(15, 17, 21);">，那么</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">C ^ B = A</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">且</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">C ^ A = B</font>`<font style="color:rgb(15, 17, 21);">。</font>
    - <font style="color:rgb(15, 17, 21);">这个特性是</font>**<font style="color:rgb(15, 17, 21);">加密和解密</font>**<font style="color:rgb(15, 17, 21);">、</font>**<font style="color:rgb(15, 17, 21);">交换两个变量</font>**<font style="color:rgb(15, 17, 21);">等功能的核心。</font>

---

### <font style="color:rgb(15, 17, 21);">异或的常见应用</font>
<font style="color:rgb(15, 17, 21);">凭借上述特性，异或在计算机科学中有着广泛的应用。</font>

#### <font style="color:rgb(15, 17, 21);">1. 交换两个变量的值（不使用临时变量）</font>
<font style="color:rgb(15, 17, 21);">这是一个经典的面试题。利用异或的自反性，可以不需要第三个临时变量就交换两个数。</font>

<font style="color:rgb(15, 17, 21);">python</font>

```plain
a = 5
b = 10

print(f"交换前: a = {a}, b = {b}")

a = a ^ b  # a 现在变成了 5 ^ 10
b = a ^ b  # b = (5 ^ 10) ^ 10 = 5 ^ (10 ^ 10) = 5 ^ 0 = 5
a = a ^ b  # a = (5 ^ 10) ^ 5 = (5 ^ 5) ^ 10 = 0 ^ 10 = 10

print(f"交换后: a = {a}, b = {b}")
```

<font style="color:rgb(15, 17, 21);">输出：</font>

<font style="color:rgb(15, 17, 21);">text</font>

```plain
交换前: a = 5, b = 10
交换后: a = 10, b = 5
```

#### <font style="color:rgb(15, 17, 21);">2. 简单的加密和解密</font>
<font style="color:rgb(15, 17, 21);">利用自反性，可以使用同一个密钥对数据进行加密和解密。</font>

+ **<font style="color:rgb(15, 17, 21);">加密</font>**<font style="color:rgb(15, 17, 21);">：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">密文 = 明文 ^ 密钥</font>`
+ **<font style="color:rgb(15, 17, 21);">解密</font>**<font style="color:rgb(15, 17, 21);">：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">明文 = 密文 ^ 密钥</font>`

<font style="color:rgb(15, 17, 21);">python</font>

```plain
plain_text = 42        # 原始数据
key = 123              # 密钥

# 加密
cipher_text = plain_text ^ key
print(f"密文: {cipher_text}") # 输出一个看起来是乱码的数字

# 解密
decrypted_text = cipher_text ^ key
print(f"解密后的明文: {decrypted_text}") # 输出 42
```

#### <font style="color:rgb(15, 17, 21);">3. 在算法题中的应用：找出“落单”的数字</font>
<font style="color:rgb(15, 17, 21);">这是一个非常著名的算法题：</font>

<font style="color:rgb(15, 17, 21);">一个非空整数数组中，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。</font>

**<font style="color:rgb(15, 17, 21);">解决方案</font>**<font style="color:rgb(15, 17, 21);">：利用</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ A = 0</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">和</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ 0 = A</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的特性，将所有数字一起进行异或运算，成对出现的数字会变成 0，最后剩下的就是那个“落单”的数字。</font>

<font style="color:rgb(15, 17, 21);">python</font>

```plain
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num  # 等同于 result = result ^ num
    return result

# 示例
arr = [4, 1, 2, 1, 2]
print(single_number(arr))  # 输出：4
```

**<font style="color:rgb(15, 17, 21);">计算过程</font>**<font style="color:rgb(15, 17, 21);">：</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0 ^ 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1^1) ^ (2^2) ^ 4 = 0 ^ 0 ^ 4 = 4</font>`

#### <font style="color:rgb(15, 17, 21);">4. 图形学中的“异或”模式</font>
<font style="color:rgb(15, 17, 21);">在一些古老的绘图软件或硬件中，有一种“异或”绘图模式。当你在同一个位置用同一种颜色画两次时，第二次绘制会擦除第一次的痕迹，因为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">颜色 ^ 颜色 = 0</font>`<font style="color:rgb(15, 17, 21);">（背景色），从而实现了一种“橡皮擦”效果。</font>

### <font style="color:rgb(15, 17, 21);">总结</font>
+ **<font style="color:rgb(15, 17, 21);">异或（XOR）</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是一种“</font>**<font style="color:rgb(15, 17, 21);">相异为1，相同为0</font>**<font style="color:rgb(15, 17, 21);">”的二进制逻辑运算。</font>
+ <font style="color:rgb(15, 17, 21);">它的关键特性是</font><font style="color:rgb(15, 17, 21);"> </font>`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ A = 0</font>**`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">和</font><font style="color:rgb(15, 17, 21);"> </font>`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A ^ 0 = A</font>**`<font style="color:rgb(15, 17, 21);">，以及强大的</font>**<font style="color:rgb(15, 17, 21);">自反性</font>**<font style="color:rgb(15, 17, 21);">。</font>
+ <font style="color:rgb(15, 17, 21);">这些特性使其在</font>**<font style="color:rgb(15, 17, 21);">变量交换</font>**<font style="color:rgb(15, 17, 21);">、</font>**<font style="color:rgb(15, 17, 21);">简单加密</font>**<font style="color:rgb(15, 17, 21);">、</font>**<font style="color:rgb(15, 17, 21);">算法优化</font>**<font style="color:rgb(15, 17, 21);">（如找落单数）和</font>**<font style="color:rgb(15, 17, 21);">底层计算</font>**<font style="color:rgb(15, 17, 21);">等领域非常有用。</font>

<font style="color:rgb(15, 17, 21);"></font>

