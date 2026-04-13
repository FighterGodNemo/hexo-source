---
title: NewstarCTF_2025
date: "2026-03-15 13:28:20"
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - NewstarCTF_2025
tags:
  - CTF
  - WriteUp
  - NewstarCTF
  - 2025
created: "2026-03-15T16:49"
updated: "2026-04-04T07:34"
---

## F12_

直接
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352329.png)
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352358.png)

**Ctrl+Shift+C** 打开元素选择器

**Ctrl+Shift+J** 打开控制台
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352339.png)

## GNU_Debugger

题目内容：

进入pwn的世界之后的第一关，了解你的好伙伴gdb

题目的流程为：

1. 启动靶机获得端口和ip

2. 启动程序： ./gdb_challenge (假设你已经在这个程序所在的目录)

3. 进行一系列的gdb挑战

4. 完成所有挑战，得到flag

ps: 这题暂时用不到ida哦，推荐直接执行程序，跟着流程来就好啦。不过也可以通过逆向工程来得到flag ^^

解答：

## multi-headach3

题目内容：

什么叫机器人控制了我的头？

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352499.png)

解答：

这提示我们查看 `/robots.txt` 文件，这是网站用来与搜索引擎爬虫（机器人）通信的标准文件。

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352463.png)

这明确告诉我们有一个隐藏页面：`/hidden.php`。

网页说：**But... Why my head is so painful???!!!**

“头” = HTTP 头（Headers），

+ 可能要求修改 `User-Agent`、`Referer`、`X-Forwarded-For` 等请求头
+ 先尝试直接访问/hidden.php  
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352454.png)
+ 没那么简单。。。意味着单一条件可能不够，需要组合多个头部，正如题目的multi所提示

### 组合头部
常见需要组合的头部：

+ `User-Agent: Robot`（伪装成机器人）
+ `Referer: <目标网站>`（表明来源）
+ `X-Forwarded-For: 127.0.0.1`（伪装成本地访问）
+ 可能还需要 `X-CTF: true` 等自定义头

### 使用 HEAD 方法
+ “头很痛”可能暗示使用 `HEAD` 请求
+ 响应头里可能包含 flag

```python
import requests

target = "https://eci-2zeiz5c9arq9crpj8d1x.cloudeci1.ichunqiu.com:80"
hidden_url = target + "/hidden.php"

# 测试各种头部组合
tests = [
    {"name": "1. 普通访问", "headers": {&#125;&#125;,
    {"name": "2. Robot UA", "headers": {"User-Agent": "Robot"&#125;&#125;,
    {"name": "3. Robot + Referer", "headers": {"User-Agent": "Robot", "Referer": target&#125;&#125;,
    {"name": "4. Robot + X-Forwarded-For", "headers": {"User-Agent": "Robot", "X-Forwarded-For": "127.0.0.1"&#125;&#125;,
    {"name": "5. Robot + X-CTF", "headers": {"User-Agent": "Robot", "X-CTF": "true"&#125;&#125;,
    {"name": "6. 全部组合", "headers": {
        "User-Agent": "Robot",
        "Referer": target,
        "X-Forwarded-For": "127.0.0.1",
        "X-CTF": "true"
    &#125;&#125;,
]

for test in tests:
    print(f"\n=== {test['name']} ===")
    try:
        r = requests.get(hidden_url, headers=test['headers'], verify=False, timeout=5)
        if "flag" in r.text.lower() or "ctf" in r.text.lower():
            print(">>> 🚩 Possible flag here!")
        print(r.text)
        # 检查响应头
        for h, v in r.headers.items():
            if 'flag' in h.lower() or 'ctf' in h.lower():
                print(f">>> 🚩 Header {h}: {v}")
    except Exception as e:
        print("Error:", e)

# 测试 HEAD 方法
print("\n=== 7. HEAD + Robot ===")
try:
    r = requests.head(hidden_url, headers={"User-Agent": "Robot"}, verify=False, timeout=5)
    print("HEAD response headers:")
    for h, v in r.headers.items():
        print(f"{h}: {v}")
        if 'flag' in h.lower() or 'ctf' in h.lower():
            print(f">>> 🚩 Header {h}: {v}")
except Exception as e:
    print("Error:", e) 
```

flag{e6c421da-4941-447c-a22a-6f09984bdd21}

## 解题成功的关键
1. **使用 HEAD 方法**而不是 GET
2. **正确的 HTTP 头部组合**：User-Agent + Referer + X-Forwarded-For
    - `User-Agent: Robot`
    - `Referer: https://eci-2zeiz5c9arq9crpj8d1x.cloudeci1.ichunqiu.com`
    - `X-Forwarded-For: 127.0.0.1`

## NewstarCTF 2025



## Puzzle

题目内容：

咦？存在于这个程序中的flag貌似被人打碎了。你能找到flag的碎片并拼凑出完整的flag吗？

解答：

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352390.png)
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352348.png)

## pwn's_door

题目内容：

Key 已经为进入 pwn 的世界做好了充分准备。他找到了可靠的伙伴，猫猫 NetCat 和蟒蛇 Python，还为 Python 配备了强大的工具 pwntools。有了这些，他相信自己一定能顺利通过考验。

容器地址： nc 47.94.87.199 29217

附件：
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352571.png)

解答：这是一个典型的 **pwn 签到题**，通常需要你通过 `netcat` 连接给定的服务器，然后与程序交互来获取 flag。

1.连接

+ python

```python
from pwn import *
r = remote('47.94.87.199', 29217)
#IP地址: 47.94.87.199
#端口号: 29217
r.interactive()
```

或
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352563.png)

二者均可

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352519.png)

+ 随意输入，enter：

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352554.png)

+ 用IDA打开door文件，按F5

+ 发现密码7038329。输入：
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352545.png)
+ 执行cat flag命令得flag：
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352509.png)

## Sagemath使用指哪_

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

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352378.png)

## strange_login

题目内容：

我当然知道1=1了！？

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352638.png)

解题：这很可能是在暗示可以利用 SQL 注入的方式进行登录。

SQL 注入是一种常见的网络攻击手段，**<u>通过在输入框（如用户名或密码框）中输入特定的 SQL 语句，来绕过正常的登录验证逻辑</u>**。**<u>“1=1” 是一个恒成立的条件，在 SQL 语句中可以用于构造永真的查询条件。</u>**

假设后台的登录验证 SQL 语句类似 `SELECT * FROM users WHERE username = '$username' AND password = '$password'`，当我们在用户名或密码输入框中输入包含 SQL 注入的内容时，就可能改变这个查询的逻辑。

比如，在用户名输入框输入 `admin' OR '1'='1`，密码输入框随意输入（或者也构造类似的注入语句），这样拼接后的 SQL 语句可能变成 `SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = '$password'`。由于 `'1'='1'` 恒成立，可能就会绕过密码验证，以 `admin`（管理员）身份登录，从而查看特殊内容。



### 核心思路：利用 SQL 逻辑漏洞绕过登录验证
假设登录表单的后端 SQL 查询逻辑大致为：

**sql**

```sql
SELECT * FROM users WHERE username = '[输入的用户名]' AND password = '[输入的密码]'
```

当查询结果不为空时，登录成功。我们需要构造特殊输入，让这个查询恒为真，从而绕过验证。

### 具体注入方法（分场景尝试）
#### 1. 最简单的万能密码（针对用户名 / 密码任意一方）
+ **用户名输入**：`admin' OR 1=1#`密码任意输入（如 123）拼接后 SQL 变为：**sql**

```sql
SELECT * FROM users WHERE username = 'admin' OR 1=1#' AND password = '123'
```

    - `OR 1=1` 使条件恒成立
    - `#` 注释掉后面的密码判断部分（MySQL 中`#`是注释符，也可用`-- `代替，注意后面有空格）
+ **如果用户名固定为 admin，也可只注入密码**：用户名输入`admin`，密码输入`' OR 1=1#`

#### 2. 处理引号被转义的情况（单引号被过滤）
如果输入的`'`被转义为`\'`，可尝试：

+ 用双引号`"`代替单引号（若后端用双引号包裹参数）：用户名：`admin" OR 1=1#`
+ 利用 SQL 语句的其他逻辑（如数字型注入，若参数未用引号包裹）：用户名：`admin OR 1=1#`

#### 3. 进阶：获取管理员真实信息（若需要正确用户名 / 密码）
如果题目需要实际的管理员账号密码（而非单纯绕过），可尝试：

+ **猜解用户名长度**：用户名输入`' AND LENGTH(username)=5#`（通过返回结果判断长度是否为 5）
+ **逐字符猜解用户名**：用户名输入`' AND SUBSTR(username,1,1)='a'#`（判断用户名第 1 个字符是否为 a）（类似方法可猜解密码）

### 关键原理
+ **逻辑恒真**：`OR 1=1` 让 WHERE 条件永远成立，无论用户名密码是否正确
+ **注释截断**：`#`或`-- `忽略后续 SQL 语句，消除原始查询的密码验证部分
+ **闭合引号**：注入的`'`用于闭合 SQL 语句中原本的引号，使注入的逻辑生效

### 注意事项
1. 不同数据库的注释符可能不同（如 MySQL 用`#`，Oracle 用`-- `）
2. 若遇到过滤（如过滤`OR`、`=`），可尝试大小写变形（`Or`、`1=1`→`1 Like 1`）或编码绕过

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352599.png)

## X0r

题目内容：

no xor，no encrypt.

【难度：签到】

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352650.png)

解答：

● 用IDA打开


+ 按F5反编译成c语言代码

+ **anu`ym7wKLl$P]v3q%D]lHpi** 试着解密
+ 由于XOR操作是可逆的，我们只需要按相反的顺序和相同的密钥进行XOR就能解密。

```python
# 已知的加密后字符串
encrypted_str = "anu`ym7wKLl$P]v3q%D]lHpi"

# v5数组
v5 = [19, 19, 81]

# 第一步：逆向第二轮XOR（与v5的XOR）
step1 = []
for j in range(len(encrypted_str)):
    # 与v5[j%3]再次XOR，抵消原来的操作
    step1.append(ord(encrypted_str[j]) ^ v5[j % 3])

# 第二步：逆向第一轮XOR（根据索引的不同进行不同的XOR）
original_flag = []
for i in range(len(step1)):
    if i % 3:
        if i % 3 == 1:
            # 逆向i%3==1的情况，原来的操作为XOR 0x11
            original_char = step1[i] ^ 0x11
        else:
            # 逆向i%3==2的情况，原来的操作为XOR 0x45
            original_char = step1[i] ^ 0x45
    else:
        # 逆向i%3==0的情况，原来的操作为XOR 0x14
        original_char = step1[i] ^ 0x14
    original_flag.append(chr(original_char))

# 组合结果并输出
flag = ''.join(original_flag)
print("解密得到的flag:", flag)
```

解密过程说明：

1. 代码首先对输入的 flag 进行了第一轮 XOR 加密：
    - 当索引 i%3==0 时，与 0x14 进行 XOR
    - 当索引 i%3==1 时，与 0x11 进行 XOR
    - 当索引 i%3==2 时，与 0x45 进行 XOR
2. 然后进行了第二轮 XOR 加密，使用 v5 数组 [19, 19, 81]，根据索引 j%3 循环使用数组元素
3. 解密时需要逆向这个过程：
    - 先对加密字符串与 v5 数组进行 XOR，还原到第一轮加密后的状态
    - 再根据索引位置，使用对应的密钥进行 XOR，完全还原原始 flag



### 1. 先明确代码里的 `v5` 原始定义（回顾上下文）
在你之前提供的 `main` 函数代码中，`v5` 的定义和使用是这样的：

```c
char v5[16]; // [rsp+40h] [rbp-40h]  // 定义一个16字节的字符数组v5
// ... 中间代码省略 ...
v5[0] = 19;   // 给v5第1个元素赋值19
v5[1] = 19;   // 给v5第2个元素赋值19
v5[2] = 81;   // 给v5第3个元素赋值81
// ... 后续使用 ...
for (j = 0; j < v7; ++j)
  Str[j] ^= v5[j % 3];  // 用v5[j%3]作为密钥，对Str进行XOR加密
```

你说的 `v5 = [19, 19, 81]`，本质是对这段代码的简化描述 —— 即 `v5` 数组的前 3 个有效元素是 `19、19、81`，后续元素未赋值（不影响加密逻辑）。

### 2. `v5` 的核心作用：第二轮 XOR 加密的 “循环密钥”
在整个 flag 验证流程中，`v5` 是**第二轮加密的关键**，具体逻辑如下：

#### （1）先明确加密流程（回顾）
用户输入的原始 flag（存在 `Str` 中），会经过 **两轮 XOR 加密**，最终与预设的目标字符串 `Str2`（`"anu`ym7wKLl$P]v3q%D]lHpi"`）比较——若相等则验证通过。 而 `v5` 负责 **第二轮加密**：

#### （2）`v5` 的 “循环使用” 逻辑
第二轮加密的核心代码是：

```c
for (j = 0; j < v7; ++j)  // v7是flag长度（固定24）
  Str[j] ^= v5[j % 3];    // 关键：v5[j%3]
```

这里的 `j % 3`（取余运算）决定了 `v5` 的**循环使用规则**：

+ 当 `j=0` 时：`0%3=0` → 用 `v5[0] = 19` 作为密钥；
+ 当 `j=1` 时：`1%3=1` → 用 `v5[1] = 19` 作为密钥；
+ 当 `j=2` 时：`2%3=2` → 用 `v5[2] = 81` 作为密钥；
+ 当 `j=3` 时：`3%3=0` → 再次用 `v5[0] = 19`；
+ 以此类推，直到遍历完整个 24 位的 flag。

简单说：`v5` 的 3 个元素 `[19,19,81]` 会按 “19→19→81→19→19→81...” 的顺序，循环对每一位 flag 进行 XOR 加密。

### 3. 为什么用 XOR 加密？为什么用 “循环密钥”？
#### （1）XOR 加密的特性（决定 `v5` 可逆向）
XOR（异或）运算有个关键特性：**对同一个数据用同一个密钥做两次 XOR，会还原原始数据**（即 `a ^ key ^ key = a`）。这也是我们之前能 “解密” 的核心 —— 只要知道 `v5` 的值，就能反向对 `Str2` 做 XOR，还原出第一轮加密后的 flag，再进一步还原原始 flag。

#### （2）循环密钥的作用（简单加密，增加破解难度）
如果直接用一个固定密钥（比如只用 19）对所有位加密，破解难度很低；而用 `[19,19,81]` 循环，相当于每 3 位用不同的密钥组合，既实现了简单的加密逻辑，又比 “单密钥” 更难直接猜测（必须知道循环规律和 3 个密钥值才能破解）。

### 总结
`v5 = [19, 19, 81]` 不是随机的数字，而是 flag 验证代码中 **第二轮 XOR 加密的 “循环密钥数组”**：

+ 功能：按 “19→19→81” 的循环顺序，对第一轮加密后的 flag 做二次加密；
+ 关键：由于 XOR 特性，它既是加密的 “钥匙”，也是解密的 “钥匙”—— 知道这 3 个值，才能反向还原出用户输入的原始正确 flag。

## 别笑，你也过不了第二关

题目内容：

不是哥们，说白了你有啥实力啊，

过关不是简简单单。

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352472.png)

+ 应该要改数字
+ 尝试F12控制台改数字，但是没用。


```plain
score = 1000000;
currentLevel = 1;
gameEnded = false;
finishSpawned = true;
endLevel();
```


+ 回顾：为什么直接在元素里修改分数不行，一定要输这个代码才能判定过关呢？

## 1. 前端显示 vs 程序变量
+ **你在元素里修改的**：只是 HTML 页面上显示的文字
+ **游戏实际使用的**：JavaScript 内存中的变量 `score`

比如：

比如：

html

<p id="score">分数: 0</p>  <!-- 这只是显示 -->

和

javascript

let score = 0;  // 这是程序实际使用的值

当时改的只是“分数牌”，不是“实际分数”！

## 初识RSA

题目内容：

好像很标准，又好像不太标准（md5码怎么解呢？好像有在线工具）

```python
from Crypto.Util.number import *
import hashlib

key=b'??????'   
assert len(key)==6
KEY = hashlib.md5(key).hexdigest().encode()
print('KEY=',KEY)

flag=b'flag{?????????????}'

m=bytes_to_long(flag)

e=65537
p=getPrime(512)
q=getPrime(512)
n=pow(p,3)* pow(q,2)
c=pow(m,e,n)

P=p^(bytes_to_long(key))

print("P=",P)
print("n=",n)
print("c=",c)

'''
KEY = b'5ae9b7f211e23aac3df5f2b8f3b8eada'
P= 8950704257708450266553505566662195919814660677796969745141332884563215887576312397012443714881729945084204600427983533462340628158820681332200645787691506
n= 44446616188218819786207128669544260200786245231084315865332960254466674511396013452706960167237712984131574242297631824608996400521594802041774252109118569706894250996931000927100268277762882754652796291883967540656284636140320080424646971672065901724016868601110447608443973020392152580956168514740954659431174557221037876268055284535861917524270777789465109449562493757855709667594266126482042307573551713967456278514060120085808631486752297737122542989222157016105822237703651230721732928806660755347805734140734412060262304703945060273095463889784812104712104670060859740991896998661852639384506489736605859678660859641869193937584995837021541846286340552602342167842171089327681673432201518271389316638905030292484631032669474635442148203414558029464840768382970333
c= 42481263623445394280231262620086584153533063717448365833463226221868120488285951050193025217363839722803025158955005926008972866584222969940058732766011030882489151801438753030989861560817833544742490630377584951708209970467576914455924941590147893518967800282895563353672016111485919944929116082425633214088603366618022110688943219824625736102047862782981661923567377952054731667935736545461204871636455479900964960932386422126739648242748169170002728992333044486415920542098358305720024908051943748019208098026882781236570466259348897847759538822450491169806820787193008018522291685488876743242619977085369161240842263956004215038707275256809199564441801377497312252051117441861760886176100719291068180295195677144938101948329274751595514805340601788344134469750781845
'''
```

要解出这个 RSA 问题的 flag，我们可以按照以下步骤进行：

1. 已知 KEY 的 MD5 哈希值，可反推出 key（6 字节）
2. 利用 P 和 key 求出素数 p
3. 从 n 分解出 q
4. 计算私钥解密得到 flag

这是一个更简单高效的代码，使用 `itertools` 快速爆破：

python

```python
from Crypto.Util.number import *
import hashlib
import itertools

KEY = b'5ae9b7f211e23aac3df5f2b8f3b8eada'
P = 8950704257708450266553505566662195919814660677796969745141332884563215887576312397012443714881729945084204600427983533462340628158820681332200645787691506
n = 44446616188218819786207128669544260200786245231084315865332960254466674511396013452706960167237712984131574242297631824608996400521594802041774252109118569706894250996931000927100268277762882754652796291883967540656284636140320080424646971672065901724016868601110447608443973020392152580956168514740954659431174557221037876268055284535861917524270777789465109449562493757855709667594266126482042307573551713967456278514060120085808631486752297737122542989222157016105822237703651230721732928806660755347805734140734412060262304703945060273095463889784812104712104670060859740991896998661852639384506489736605859678660859641869193937584995837021541846286340552602342167842171089327681673432201518271389316638905030292484631032669474635442148203414558029464840768382970333
c = 42481263623445394280231262620086584153533063717448365833463226221868120488285951050193025217363839722803025158955005926008972866584222969940058732766011030882489151801438753030989861560817833544742490630377584951708209970467576914455924941590147893518967800282895563353672016111485919944929116082425633214088603366618022110688943219824625736102047862782981661923567377952054731667935736545461204871636455479900964960932386422126739648242748169170002728992333044486415920542098358305720024908051943748019208098026882781236570466259348897847759538822450491169806820787193008018522291685488876743242619977085369161240842263956004215038707275256809199564441801377497312252051117441861760886176100719291068180295195677144938101948329274751595514805340601788344134469750781845
e = 65537

# 爆破所有6字节key
for key_bytes in itertools.product(range(256), repeat=6):
    key = bytes(key_bytes)
    if hashlib.md5(key).hexdigest().encode() == KEY:
        print("Found key:", key)
        key_int = bytes_to_long(key)
        p = P ^ key_int  # 普通 XOR

        # 检查 p 是否整除 n
        if n % (p**3) == 0:
            q2 = n // (p**3)
            q = isqrt(q2)
            if q * q == q2:
                print("p =", p)
                print("q =", q)

                # 计算 phi(n) = p^2*(p-1) * q*(q-1)
                phi = p**2 * (p-1) * q * (q-1)
                d = pow(e, -1, phi)  # Python 3.8+ 逆元
                m = pow(c, d, n)
                flag = long_to_bytes(m)
                print("Flag:", flag.decode())
                exit(0)
```





解题思路说明：

1. **获取 key**：通过已知的 MD5 哈希值`5ae9b7f211e23aac3df5f2b8f3b8eada`，可以爆破出 6 字节的 key 
2. **计算 p**：根据代码中的`P = p ^ bytes_to_long(key)`，利用异或的可逆性，得到`p = P ^ bytes_to_long(key)`
3. **分解 n**：已知`n = p^3 * q^2`，有了 p 之后可以很容易计算出 q
4. **解密过程**：计算欧拉函数 φ(n) = (p³-p²)(q²-q)，然后求 e 的逆元 d，最后用私钥 d 解密得到 flag

## 随机数之旅1

题目内容：

真正的大中衔接belike:

```python
import uuid
from Crypto.Util.number import getPrime, bytes_to_long
import random

# 生成随机 flag 并转换为整数
flag = "flag{" + str(uuid.uuid4()) + "}"
message_int = bytes_to_long(flag.encode())

# 生成两个素数：
# p 的比特长度比 message_int 略大
# a 的比特长度和 p 相同
p = getPrime(message_int.bit_length() + 3)
a = getPrime(p.bit_length())

print(f"a = {a}")
print(f"p = {p}")

# hint 序列：以随机数为起点，按递推关系生成 5 次
# hint[i+1] = (a * hint[i] + message_int) mod p
hint_values = [random.randint(1, p - 1)]

for _ in range(5):
    next_value = (a * hint_values[-1] + message_int) % p
    hint_values.append(next_value)

print("hint =", hint_values)

"""
a = 295789025762601408173828135835543120874436321839537374211067344874253837225114998888279895650663245853
p = 516429062949786265253932153679325182722096129240841519231893318711291039781759818315309383807387756431
hint = [184903644789477348923205958932800932778350668414212847594553173870661019334816268921010695722276438808, 289189387531555679675902459817169546843094450548753333994152067745494929208355954578346190342131249104, 511308006207171169525638257022520734897714346965062712839542056097960669854911764257355038593653419751, 166071289874864336172698289575695453201748407996626084705840173384834203981438122602851131719180238215, 147110858646297801442262599376129381380715215676113653296571296956264538908861108990498641428275853815, 414834276462759739846090124494902935141631458647045274550722758670850152829207904420646985446140292244]

"""
```

解答：这是一个 **线性同余生成器 (LCG)** 的题目，已知：

text

hint[i+1] = (a * hint[i] + m) mod p

其中 `m` 就是 flag 的整数形式。

我们有 6 个连续的 hint 值，可以解出 `m`。

---

## 1. 推导公式
从两个相邻的方程：

text

```plain
hint[1] = (a * hint[0] + m) mod p
hint[2] = (a * hint[1] + m) mod p
```

相减：

text

hint[2] - hint[1] = a * (hint[1] - hint[0]) mod p

所以：

text

a = (hint[2] - hint[1]) * (hint[1] - hint[0])^(-1) mod p

然后求 `m`：

text

m = hint[1] - a * hint[0] mod p



```python
from Crypto.Util.number import long_to_bytes

a = 295789025762601408173828135835543120874436321839537374211067344874253837225114998888279895650663245853
p = 516429062949786265253932153679325182722096129240841519231893318711291039781759818315309383807387756431
hint = [184903644789477348923205958932800932778350668414212847594553173870661019334816268921010695722276438808, 289189387531555679675902459817169546843094450548753333994152067745494929208355954578346190342131249104, 511308006207171169525638257022520734897714346965062712839542056097960669854911764257355038593653419751, 166071289874864336172698289575695453201748407996626084705840173384834203981438122602851131719180238215, 147110858646297801442262599376129381380715215676113653296571296956264538908861108990498641428275853815, 414834276462759739846090124494902935141631458647045274550722758670850152829207904420646985446140292244]

# 验证 a 是否正确（题目给了 a，但我们可以验证）
diff1 = (hint[1] - hint[0]) % p
diff2 = (hint[2] - hint[1]) % p
a_calc = (diff2 * pow(diff1, -1, p)) % p
print("验证 a:", a == a_calc)  # 应该为 True

# 计算 m
m = (hint[1] - a * hint[0]) % p

# 转为字节
flag_bytes = long_to_bytes(m)
flag = flag_bytes.decode()

print("Flag:", flag)
```

flag{c3bc3ead-01e3-491b-aa2d-d2f042449fd6}

## 唯一表示

题目：不要把鸡蛋放在同一个篮子里

```python
from sympy.ntheory.modular import crt
from Crypto.Util.number import bytes_to_long
from sympy import primerange
import uuid

# 生成素数列表
primes = list(primerange(2, 114514))

# 生成随机 flag，并转换为整数
flag = "flag{" + str(uuid.uuid4()) + "}"
message_int = bytes_to_long(flag.encode())

def fun(n: int):
    """
    给定整数 n，返回它对若干个素数模的余数列表，
    直到用这些余数和模数 CRT 重建出的值恰好等于 n。
    """
    used_primes = [2]          # 当前使用的素数列表，先用 2 开始
    prime_index = 1            # primes[0] 已用，从 primes[1] 开始
    while True:
        # 计算 n 对当前所有模数的余数
        remainders = [n % p for p in used_primes]

        # 用 CRT 尝试重建 n
        reconstructed, _ = crt(used_primes, remainders)

        # 如果重建成功，返回余数列表
        if reconstructed == n:
            return remainders

        # 否则继续添加新的素数，扩大模数集合
        used_primes.append(primes[prime_index])
        prime_index += 1

# 计算 message_int 的余数表示
c = fun(message_int)

print(c)


"""
[1, 2, 2, 4, 0, 2, 11, 11, 8, 23, 1, 30, 35, 0, 18, 30, 55, 60, 29, 42, 8, 13, 49, 11, 69, 26, 8, 73, 84, 67, 100, 9, 77, 72, 127, 49, 57, 74, 70, 129, 146, 45, 35, 180, 196, 101, 100, 146, 100, 194, 2, 161, 35, 155]
"""
```

解答：这是一个 **中国剩余定理（CRT）** 的逆向问题。给你余数列表，需要恢复原始的消息。

## 问题分析
已知：

+ 余数列表 `c`
+ 使用的素数是从小到大依次选取的（从2开始）
+ 需要找到对应的素数列表，然后用CRT恢复 `message_int`
+ 最后将整数转换回字符串得到flag

```python
from sympy.ntheory.modular import crt
from sympy import primerange
from Crypto.Util.number import long_to_bytes
# 生成与加密时相同的素数列表
primes = list(primerange(2, 114514))
# 给定的余数列表
c = [1, 2, 2, 4, 0, 2, 11, 11, 8, 23, 1, 30, 35, 0, 18, 30, 55, 60, 29, 42, 8, 13, 49, 11, 69, 26, 8, 73, 84, 67, 100, 9, 77, 72, 127, 49, 57, 74, 70, 129, 146, 45, 35, 180, 196, 101, 100, 146, 100, 194, 2, 161, 35, 155]
# 确定使用的素数数量与余数数量相同
used_primes = primes[:len(c)]
# 应用中国剩余定理重建原始整数
reconstructed, _ = crt(used_primes, c)
# 将整数转换回字节，再解码为字符串
flag = long_to_bytes(int(reconstructed)).decode()
print(flag)
```

## 我不要革命失败

题目内容：

小吉的机械革命笔记本又双叒叕蓝屏了！这次他不想再坐以待毙！他发来了他在C:\Windows\Minidump\的蓝屏文件，请你帮忙分析一下，让机革摆脱舍友的歧视。听说大伙看蓝屏日志都用的是WinDbg，操作也很简单，好像要敲什么!analyze -v?

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352607.png)

flag{崩溃类型(即蓝屏显示的终止代码)_故障进程}

解答：

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352588.png)

+ 输入analyze -v得到

这里的关键信息：
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352580.png)

+ `**0xEF**` - **蓝屏终止代码**（STOP CODE）

`CRITICAL_PROCESS_DIED` (对应十六进制 0xEF)

+ `**svchost.exe**` - 故障进程
+ `**CRITICAL_PROCESS**` - 崩溃类型描述

## 正确的flag格式：
**flag{CRITICAL_PROCESS_DIED_svchost.exe}**

## 我真得控制你了

题目内容：

小小web还不是简简单单？什么？你拿不下来？那我得好好控制控制你了哈

解题：这是一个前端 JavaScript 题目，关键障碍是：
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352367.png)

1. **开发者工具被禁用**（无法直接 F12）
2. **启动按钮点不了**（可能被 CSS 或 JS 禁用）



+ 查看页面源代码（尝试绕开禁用）

虽然开发者工具被禁用，但可以尝试在浏览器地址栏输入 `view-source:https://[你的网址]`（将`[你的网址]`替换为目标页面的实际网址），查看页面的 HTML 源代码。在源代码中寻找与 “启动” 按钮相关的代码，比如按钮的`onclick`事件绑定的函数、表单提交的目标等，分析其逻辑，看是否能找到触发功能的关键代码，进而通过其他方式（如手动构造表单提交、调用相关 JS 函数等，如果 JS 函数可访问的话）来触发 “启动” 操作。

+ 抓包分析

使用抓包工具（如 Fiddler、Wireshark 或者浏览器自带的网络抓包功能，虽然开发者工具被禁用，但部分浏览器的网络抓包入口可能仍可访问），捕获页面的请求和响应。查看页面加载时的请求，特别是与 “启动” 按钮相关的接口请求。如果能找到触发 “启动” 功能的 API 接口，就可以直接构造请求，模拟点击 “启动” 按钮的操作，与服务器进行交互，从而推进解题。

**view-source:**https://eci-2ze7zpyuszwuqs81atoc.cloudeci1.ichunqiu.com:80

+ ctrl＋U 

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352400.png)

## 小跳蛙

题目内容：

青蛙会跳到哪里去呢？

```python
banner = """
Welcome to Cathylin's cryptography learning platform, where we learn an algorithm through an interesting problem.

There is a frog on the grid point (a, b). When a > b, it will jump to (a-b, b); when a < b, it will jump to (a, b-a); and when a = b, it will stay where it is.

Next, I will provide five sets of (a, b), and please submit the final position (x, y) of the frog in sequence

If you succeed, I will give you a mysterious flag.
"""
print(banner)

import re
import random
from secret import flag


cnt = 0
while cnt < 5:
    a = random.randint(1, 10**(cnt+1))
    b = random.randint(1, 10**(cnt+1))
    print(  str(cnt+1) + ".(a,b) is: (" + str(a) + "," + str(b) + ")")
    user_input = input("Please input the final position of the frog (x,y) :")
    pattern = r'[()]?(\d+)[,\s]+(\d+)[)]?'
    match = re.match(pattern, user_input.strip())
    if match:
        x, y = map(int, match.groups())
    else:
        print("Unable to parse the input. Please check the format and re-enter")
        continue

    original_a, original_b = a, b
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a

    if x == a and y == b:
        print("Congratulations, you answered correctly! Keep going for " + str(4-cnt) + " more times and you will get the mysterious flag!")
        cnt += 1
    else:
        print("Unfortunately, you answered incorrectly. The correct answer is({}, {}). Please start learning again".format(a, b))
        break

if cnt == 5:
    print("Congratulations, you answered all the questions correctly!")
    print("Mysterious Flag:" + flag)
```

Welcome to Cathylin's cryptography learning platform, where we learn an algorithm through an interesting problem.

There is a frog on the grid point (a, b). When a > b, it will jump to (a-b, b); when a < b, it will jump to (a, b-a); and when a = b, it will stay where it is.

Next, I will provide five sets of (a, b), and please submit the final position (x, y) of the frog in sequence

If you succeed, I will give you a mysterious flag.



解答：

题目 `jump_frog.py` 是一个交互程序，它模拟一只青蛙在坐标 `(a, b)` 上，按照规则跳跃：

+ 如果 `a > b`，则跳到 `(a-b, b)`
+ 如果 `a < b`，则跳到 `(a, b-a)`
+ 如果 `a == b`，则停止

这其实就是 **辗转相减法**（Euclidean algorithm 的减法版本），最终青蛙会停在 `(g, g)`，其中 `g = gcd(a, b)`。

程序会生成 5 组 `(a, b)`，数字范围逐渐变大（`10^(cnt+1)`），每次你要输入最终位置 `(x, y)`，其实就是 `(gcd(a,b), gcd(a,b))`。

其核心是计算两个数经过多次相减（直到两数相等）后的结果，这其实就是求两个数的最大公约数（GCD）的过程（欧几里得算法的简化形式）。

+ 由于程序中 a 和 b 是随机生成的，且 flag 存储在 secret.py 中，无法直接通过代码静态分析获取。

## 宇宙的中心是php

题目内容：

所有光线都逃不出去......但我知道这不会难倒你的

（本题下发后，请通过http访问相应的ip和port，例如 nc ip port ，改为http://ip:port/）

容器地址： nc 47.94.87.199 33001

解答：

+ 访问方式：`http://47.94.87.199:33001/`

html
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352445.png)
![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352481.png)

```plain
<!-- 你还是找到了......这片黑暗的秘密 -->
<!-- s3kret.php -->
```

这说明存在一个隐藏文件：`s3kret.php`。

访问：http://47.94.87.199:33001/s3kret.php

![](../../Capture%20The%20Flag_夺旗赛/file-20260404073352491.png)

### 分析代码逻辑
代码首先包含了 `flag.php` 文件（里面应该存放着我们需要的 `flag`），然后判断是否通过 `POST` 方法提交了名为 `newstar2025` 的参数。如果提交了，就将该参数的值赋给 `$answer`，接着进行关键判断：

+ `intval($answer) != 47`：要求 `$answer` 转换为整数后不等于 47。
+ `intval($answer, 0) == 47`：`intval` 函数第二个参数为 `0` 时，会根据字符串的格式自动判断进制。这里要求 `$answer` 转换为整数后等于 47。

执行：

+ curl -X POST [http://47.94.87.199:33001/s3kret.php](http://47.94.87.199:33001/s3kret.php) -d "newstar2025=057"

得到flag{a64a70f1-1435-4e2d-832b-c1d7e678d4e7}



接下来解释绕过原理：

## 1. PHP `intval()` 函数的行为
`intval($var, $base)` 的第二个参数是**进制基数**：

+ `intval($answer)` 默认 `$base = 10`（十进制）
+ `intval($answer, 0)` 中 `$base = 0` 表示**自动检测进制**

---

## 2. 自动检测进制规则（base=0）
+ 如果字符串以 `0x` 或 `0X` 开头 → 当作**十六进制**
+ 如果字符串以 `0` 开头 → 当作**八进制**
+ 否则 → 当作**十进制**

---

## 3. 我们的绕过 payload：`057`
###  `intval("057", 0)`（自动检测进制）
+ 字符串以 `0` 开头 → 按**八进制**解析
+ 八进制 `057` = `5*8 + 7 = 40 + 7 = 47`
+ **所以**** **`**intval("057", 0) = 47**`

`47 == 47` ✅ 成立

---

## 4. 条件满足
php

if(intval($answer) != 47 && intval($answer, 0) == 47)

代入 `$answer = "057"`：

+ `intval("057") = 57` → `57 != 47` ✅ true
+ `intval("057", 0) = 47` → `47 == 47` ✅ true
+ `true && true` → 条件成立，输出 flag

---

## 5. 另一个 payload：`0x2f` 的原理
+ `intval("0x2f")` 十进制解析，遇到 `0` 后遇到 `x` 不是数字，停止 → 返回 `0`
+ `0 != 47` ✅ true
+ `intval("0x2f", 0)` 十六进制解析 → `0x2f = 47`
+ `47 == 47` ✅ true

---

## 总结
这个漏洞利用的是**<u> PHP 在不同进制下对同一字符串解析结果不同</u>** 的特性，通过八进制/十六进制与十进制的转换差异来满足矛盾条件。

这就是 CTF 中常见的 **<u>PHP 类型混淆/进制混淆 漏洞</u>**。

