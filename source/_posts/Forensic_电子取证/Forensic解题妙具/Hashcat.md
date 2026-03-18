---
title: "Hashcat"
date: 2026-03-15 13:28:28
categories:
- Forensic_电子取证
- Forensic解题妙具
---

<font style="color:rgb(15, 17, 21);">好的，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashcat</font>`<font style="color:rgb(15, 17, 21);"> 是世界上最强大、最流行的密码恢复工具，被誉为 </font>**<font style="color:rgb(15, 17, 21);">“密码破解界的王者”</font>**<font style="color:rgb(15, 17, 21);">。它支持GPU加速，能极大地提升破解速度。</font>

<font style="color:rgb(15, 17, 21);">它的核心工作流程是：</font>**<font style="color:rgb(15, 17, 21);">你给它一个密码的哈希值，它帮你猜出原始的明文密码。</font>**

<font style="color:rgb(15, 17, 21);">下面是一个从入门到实战的完整使用指南。</font>

---

### **<font style="color:rgb(15, 17, 21);">一、 核心概念与准备</font>**
#### **<font style="color:rgb(15, 17, 21);">1. 什么是哈希？</font>**
<font style="color:rgb(15, 17, 21);">哈希是一种单向加密算法，能把任意长度的数据（如密码）变成固定长度的字符串（哈希值）。</font>

+ <font style="color:rgb(15, 17, 21);">例如，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">password</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的 MD5 哈希值是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">5f4dcc3b5aa765d61d8327deb882cf99</font>`
+ **<font style="color:rgb(15, 17, 21);">hashcat的任务</font>**<font style="color:rgb(15, 17, 21);">：通过计算，反向找出</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">5f4dcc3b5aa765d61d8327deb882cf99</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">原来就是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">password</font>`<font style="color:rgb(15, 17, 21);">。</font>

#### **<font style="color:rgb(15, 17, 21);">2. 安装与基本命令</font>**
<font style="color:rgb(15, 17, 21);">Hashcat 是一个命令行工具。在Windows下，你打开其所在文件夹，在地址栏输入</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">cmd</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">然后回车，即可在当前目录打开命令提示符。</font>

<font style="color:rgb(15, 17, 21);">基本命令格式如下：</font>

<font style="color:rgb(15, 17, 21);">bash</font>

<font style="color:rgb(15, 17, 21);">hashcat -m <哈希类型> -a <攻击模式> <哈希值或哈希文件> <字典或掩码></font>

---

### **<font style="color:rgb(15, 17, 21);">二、 实战破解流程</font>**
#### **<font style="color:rgb(15, 17, 21);">步骤1：识别哈希类型</font>**
<font style="color:rgb(15, 17, 21);">这是最关键的第一步。你必须告诉 hashcat 你正在破解的是什么哈希。</font>

+ **<font style="color:rgb(15, 17, 21);">方法</font>**<font style="color:rgb(15, 17, 21);">：使用</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashcat --help</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">查看所有支持的哈希类型及其对应的</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">代码。</font>
+ **<font style="color:rgb(15, 17, 21);">常见类型</font>**<font style="color:rgb(15, 17, 21);">：</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m 0</font>`<font style="color:rgb(15, 17, 21);">: MD5</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m 1000</font>`<font style="color:rgb(15, 17, 21);">: NTLM (Windows 系统密码)</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m 1800</font>`<font style="color:rgb(15, 17, 21);">: sha512crypt (</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$6$</font>`<font style="color:rgb(15, 17, 21);">, Linux 影子文件)</font>

**<font style="color:rgb(15, 17, 21);">示例</font>**<font style="color:rgb(15, 17, 21);">：如果你从Windows系统中提取出了哈希</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0</font>`<font style="color:rgb(15, 17, 21);">，你需要使用</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m 1000</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(NTLM)。</font>

#### **<font style="color:rgb(15, 17, 21);">步骤2：选择攻击模式 (</font>**`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a</font>**`**<font style="color:rgb(15, 17, 21);">)</font>**
<font style="color:rgb(15, 17, 21);">hashcat 有多种“猜密码”的策略：</font>

| <font style="color:rgb(15, 17, 21);">攻击模式</font> | <font style="color:rgb(15, 17, 21);">命令参数</font> | <font style="color:rgb(15, 17, 21);">说明</font> | <font style="color:rgb(15, 17, 21);">适用场景</font> |
| --- | --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">字典攻击</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 0</font>` | <font style="color:rgb(15, 17, 21);">使用一个密码字典文件，逐个尝试。</font> | **<font style="color:rgb(15, 17, 21);">最常用</font>**<font style="color:rgb(15, 17, 21);">，用现成的密码库去撞。</font> |
| **<font style="color:rgb(15, 17, 21);">组合攻击</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 1</font>` | <font style="color:rgb(15, 17, 21);">将两个字典中的词组合起来（如</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">admin123</font>`<br/><font style="color:rgb(15, 17, 21);">）。</font> | <font style="color:rgb(15, 17, 21);">知道密码可能由两部分组成时。</font> |
| **<font style="color:rgb(15, 17, 21);">掩码攻击</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 3</font>` | <font style="color:rgb(15, 17, 21);">按照你设定的规则（如</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">Abc!123</font>`<br/><font style="color:rgb(15, 17, 21);">）来猜。</font> | <font style="color:rgb(15, 17, 21);">知道密码的大致格式（如8位，以大写字母开头）。</font> |
| **<font style="color:rgb(15, 17, 21);">混合攻击</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 6</font>`<br/><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">/</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 7</font>` | **<font style="color:rgb(15, 17, 21);">字典 + 掩码</font>**<font style="color:rgb(15, 17, 21);">（如</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">password2024</font>`<br/><font style="color:rgb(15, 17, 21);">）。</font> | <font style="color:rgb(15, 17, 21);">非常强大，结合了字典和规则。</font> |


<font style="color:rgb(15, 17, 21);">对于初学者，</font>**<font style="color:rgb(15, 17, 21);">从字典攻击 (</font>**`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 0</font>**`**<font style="color:rgb(15, 17, 21);">) 开始</font>**<font style="color:rgb(15, 17, 21);">。</font>

#### **<font style="color:rgb(15, 17, 21);">步骤3：准备你的“武器”</font>**
**<font style="color:rgb(15, 17, 21);">哈希值文件</font>****<font style="color:rgb(15, 17, 21);"> </font>**`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashes.txt</font>**`<font style="color:rgb(15, 17, 21);">：</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">创建一个文本文件（如</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashes.txt</font>`<font style="color:rgb(15, 17, 21);">），将你要破解的哈希值放进去，每行一个。</font>

1. <font style="color:rgb(15, 17, 21);">text</font>

```plain
5f4dcc3b5aa765d61d8327deb882cf99
e10adc3949ba59abbe56e057f20f883e
```

**<font style="color:rgb(15, 17, 21);">密码字典</font>****<font style="color:rgb(15, 17, 21);"> </font>**`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">wordlist.txt</font>**`<font style="color:rgb(15, 17, 21);">：</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">这是一个包含成千上万常用密码的文本文件。你可以在网上下载著名的字典，如</font><font style="color:rgb(15, 17, 21);"> </font>`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">rockyou.txt</font>**`<font style="color:rgb(15, 17, 21);">、</font>`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">weakpass_2a</font>**`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">等。自己创建一个简单的字典文件内容如下：</font>

2. <font style="color:rgb(15, 17, 21);">text</font>

```plain
123456
password
admin
qwerty
letmein
```

#### **<font style="color:rgb(15, 17, 21);">步骤4：开始破解！</font>**
<font style="color:rgb(15, 17, 21);">假设你已准备好：</font>

+ <font style="color:rgb(15, 17, 21);">哈希文件：</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashes.txt</font>`
+ <font style="color:rgb(15, 17, 21);">字典文件：</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">rockyou.txt</font>`
+ <font style="color:rgb(15, 17, 21);">哈希类型：MD5 (</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m 0</font>`<font style="color:rgb(15, 17, 21);">)</font>
+ <font style="color:rgb(15, 17, 21);">攻击模式：字典攻击 (</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 0</font>`<font style="color:rgb(15, 17, 21);">)</font>

**<font style="color:rgb(15, 17, 21);">在cmd中执行命令：</font>**

<font style="color:rgb(15, 17, 21);">bash</font>

<font style="color:rgb(15, 17, 21);">hashcat -m 0 -a 0 hashes.txt rockyou.txt</font>

+ `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m 0</font>`<font style="color:rgb(15, 17, 21);">： 指定哈希类型为 MD5。</font>
+ `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 0</font>`<font style="color:rgb(15, 17, 21);">： 指定攻击模式为字典攻击。</font>
+ `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashes.txt</font>`<font style="color:rgb(15, 17, 21);">： 包含目标哈希值的文件。</font>
+ `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">rockyou.txt</font>`<font style="color:rgb(15, 17, 21);">： 你的密码字典文件。</font>

<font style="color:rgb(15, 17, 21);">按下回车后，hashcat 会开始疯狂工作，屏幕上会显示当前的破解状态、速度和解密的密码。</font>

---

### **<font style="color:rgb(15, 17, 21);">三、 高级技巧与常用参数</font>**
<font style="color:rgb(15, 17, 21);">为了让破解更高效，你可以添加一些参数：</font>

| <font style="color:rgb(15, 17, 21);">参数</font> | <font style="color:rgb(15, 17, 21);">作用</font> | <font style="color:rgb(15, 17, 21);">示例</font> |
| --- | --- | --- |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">--force</font>` | <font style="color:rgb(15, 17, 21);">忽略一些警告（如驱动问题）。</font> | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashcat -m 0 ... --force</font>` |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-O</font>` | <font style="color:rgb(15, 17, 21);">优化，启用优化内核，提升速度。</font> | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashcat -m 0 -O ...</font>` |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-w 3</font>` | <font style="color:rgb(15, 17, 21);">设置工作负载，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">3</font>`<br/><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是“重度”，让GPU满负荷运行。</font> | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashcat -m 0 -w 3 ...</font>` |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">--show</font>` | **<font style="color:rgb(15, 17, 21);">破解完成后</font>**<font style="color:rgb(15, 17, 21);">，用此命令查看结果。</font> | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashcat --show hashes.txt</font>` |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-o</font>` | <font style="color:rgb(15, 17, 21);">将破解出的密码保存到指定文件。</font> | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashcat ... -o cracked_passwords.txt</font>` |


**<font style="color:rgb(15, 17, 21);">一个完整的、高效的命令示例：</font>**

<font style="color:rgb(15, 17, 21);">bash</font>

<font style="color:rgb(15, 17, 21);">hashcat -m 1000 -a 0 -O -w 3 hashes.txt rockyou.txt -o cracked_passwords.txt</font>

---

### **<font style="color:rgb(15, 17, 21);">四、 总结：hashcat 核心工作流</font>**
1. **<font style="color:rgb(15, 17, 21);">识别哈希</font>**<font style="color:rgb(15, 17, 21);">：确定哈希类型，找到对应的</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-m</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">值。</font>
2. **<font style="color:rgb(15, 17, 21);">准备文件</font>**<font style="color:rgb(15, 17, 21);">：创建包含目标哈希的</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashes.txt</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">文件，准备强大的密码字典。</font>
3. **<font style="color:rgb(15, 17, 21);">选择模式</font>**<font style="color:rgb(15, 17, 21);">：根据情况选择攻击模式（首选</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-a 0</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">字典攻击）。</font>
4. **<font style="color:rgb(15, 17, 21);">执行命令</font>**<font style="color:rgb(15, 17, 21);">：在命令行中输入完整的 hashcat 命令。</font>
5. **<font style="color:rgb(15, 17, 21);">查看结果</font>**<font style="color:rgb(15, 17, 21);">：使用 </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">--show</font>`<font style="color:rgb(15, 17, 21);"> 参数或查看输出文件获取破解出的密码。</font><font style="color:rgb(15, 17, 21);">在 Ubuntu 中使用 Hashcat 破解加盐哈希是标准操作，但比破解普通哈希要多一些注意事项。下面我为你提供完整的流程和指导。</font>

---

## <font style="color:rgb(15, 17, 21);">加盐哈希破解的核心概念</font>
**<font style="color:rgb(15, 17, 21);">加盐</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">就是在密码哈希之前，在密码前面或后面添加一个随机字符串（盐值）。</font>

+ <font style="color:rgb(15, 17, 21);">目的：防止彩虹表攻击，确保即使两个用户密码相同，其哈希值也不同。</font>
+ <font style="color:rgb(15, 17, 21);">格式：通常存储为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$hash$salt</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">或</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">salt$hash</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">等形式。</font>

---

## <font style="color:rgb(15, 17, 21);">步骤 1：识别哈希类型</font>
<font style="color:rgb(15, 17, 21);">这是最关键的一步！你需要知道：</font>

1. **<font style="color:rgb(15, 17, 21);">哈希算法</font>**<font style="color:rgb(15, 17, 21);">（如 MD5, SHA1, SHA256, SHA512 等）</font>
2. **<font style="color:rgb(15, 17, 21);">盐值的位置和格式</font>**
3. **<font style="color:rgb(15, 17, 21);">对应的 Hashcat 模式代码</font>**

### <font style="color:rgb(15, 17, 21);">常见加盐哈希格式示例：</font>
| <font style="color:rgb(15, 17, 21);">哈希格式</font> | <font style="color:rgb(15, 17, 21);">示例</font> | <font style="color:rgb(15, 17, 21);">Hashcat 模式代码</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">MD5($pass.$salt)</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">5f4dcc3b5aa765d61d8327deb882cf99:1234</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">10</font>` |
| **<font style="color:rgb(15, 17, 21);">MD5($salt.$pass)</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">12345f4dcc3b5aa765d61d8327deb882cf99</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">20</font>` |
| **<font style="color:rgb(15, 17, 21);">SHA1($pass.$salt)</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8:admin</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">110</font>` |
| **<font style="color:rgb(15, 17, 21);">SHA1($salt.$pass)</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">admin5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">120</font>` |
| **<font style="color:rgb(15, 17, 21);">SHA256($pass.$salt)</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">5e884898da28047151d0e56f8dc629...:salt123</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1410</font>` |
| **<font style="color:rgb(15, 17, 21);">SHA256($salt.$pass)</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">salt1235e884898da28047151d0e56f8dc629...</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1420</font>` |
| **<font style="color:rgb(15, 17, 21);">Linux shadow</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$id$salt$hash</font>`<br/><font style="color:rgb(15, 17, 21);">)</font> | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$6$salt$hash</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1800</font>`<br/><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(SHA512)</font> |


---

## <font style="color:rgb(15, 17, 21);">步骤 2：准备 Hashcat 和文件</font>
### <font style="color:rgb(15, 17, 21);">安装 Hashcat</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
sudo apt update
sudo apt install hashcat hashcat-utils
```

### <font style="color:rgb(15, 17, 21);">准备你的文件</font>
**<font style="color:rgb(15, 17, 21);">创建哈希文件</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hashes_with_salt.txt</font>`<font style="color:rgb(15, 17, 21);">)：</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">每行一个哈希，格式为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">hash:salt</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">或根据具体格式要求</font>

1. <font style="color:rgb(15, 17, 21);">text</font>

```plain
5f4dcc3b5aa765d61d8327deb882cf99:1234
5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8:admin
```

**<font style="color:rgb(15, 17, 21);">准备密码字典</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">wordlist.txt</font>`<font style="color:rgb(15, 17, 21);">)：</font>

2. <font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 可以使用系统字典或自己创建
cat /usr/share/wordlists/rockyou.txt > wordlist.txt
# 或者创建自定义字典
echo -e "password\n123456\nadmin\nletmein" > wordlist.txt
```

---

## <font style="color:rgb(15, 17, 21);">步骤 3：运行 Hashcat 破解</font>
### <font style="color:rgb(15, 17, 21);">基本命令语法：</font>
<font style="color:rgb(15, 17, 21);">bash</font>

<font style="color:rgb(15, 17, 21);">hashcat -m <模式代码> -a <攻击模式> <哈希文件> <字典或掩码></font>

### <font style="color:rgb(15, 17, 21);">实战示例：</font>
#### <font style="color:rgb(15, 17, 21);">示例 1：破解 MD5($pass.$salt) - 模式 10</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 使用字典攻击
hashcat -m 10 -a 0 hashes_with_salt.txt wordlist.txt

# 使用掩码攻击（假设知道密码是6位数字）
hashcat -m 10 -a 3 hashes_with_salt.txt ?d?d?d?d?d?d
```

#### <font style="color:rgb(15, 17, 21);">示例 2：破解 SHA1($salt.$pass) - 模式 120</font>
<font style="color:rgb(15, 17, 21);">bash</font>

<font style="color:rgb(15, 17, 21);">hashcat -m 120 -a 0 hashes_with_salt.txt wordlist.txt</font>

#### <font style="color:rgb(15, 17, 21);">示例 3：破解 Linux Shadow 密码（/etc/shadow） - 模式 1800</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 提取shadow文件中的哈希行，如：$6$salt$hash
hashcat -m 1800 -a 0 shadow_hashes.txt wordlist.txt
```

---

## <font style="color:rgb(15, 17, 21);">步骤 4：高级技巧和优化</font>
### <font style="color:rgb(15, 17, 21);">1. 使用规则增强字典攻击</font>
<font style="color:rgb(15, 17, 21);">bash</font>

<font style="color:rgb(15, 17, 21);">hashcat -m 10 -a 0 hashes_with_salt.txt wordlist.txt -r /usr/share/hashcat/rules/best64.rule</font>

### <font style="color:rgb(15, 17, 21);">2. 组合攻击（字典+掩码）</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 在字典中每个密码后面添加2位数字
hashcat -m 10 -a 1 hashes_with_salt.txt wordlist.txt ?d?d
```

### <font style="color:rgb(15, 17, 21);">3. 使用 GPU 优化</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 强制使用GPU（通常默认启用）
hashcat -m 10 -a 0 -D 2 hashes_with_salt.txt wordlist.txt

# 查看GPU状态
hashcat -I
```

### <font style="color:rgb(15, 17, 21);">4. 恢复会话和显示结果</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 如果中断，可以恢复会话
hashcat --session mysession --restore

# 显示破解结果
hashcat -m 10 --show hashes_with_salt.txt
```

---

## <font style="color:rgb(15, 17, 21);">完整实战演示</font>
<font style="color:rgb(15, 17, 21);">假设我们有文件</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">my_hashes.txt</font>`<font style="color:rgb(15, 17, 21);">：</font>

<font style="color:rgb(15, 17, 21);">text</font>

```plain
5f4dcc3b5aa765d61d8327deb882cf99:1234
5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8:admin
```

### <font style="color:rgb(15, 17, 21);">步骤：</font>
1. **<font style="color:rgb(15, 17, 21);">识别哈希</font>**<font style="color:rgb(15, 17, 21);">：第一个是 MD5($pass.$salt)，第二个是 SHA1($pass.$salt)</font>

**<font style="color:rgb(15, 17, 21);">准备字典</font>**<font style="color:rgb(15, 17, 21);">：</font>

2. <font style="color:rgb(15, 17, 21);">bash</font><font style="color:rgb(15, 17, 21);">echo -e "password\nadmin\n123456\nletmein" > my_wordlist.txt</font>

**<font style="color:rgb(15, 17, 21);">运行破解</font>**<font style="color:rgb(15, 17, 21);">：</font>

3. <font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 先破解MD5
hashcat -m 10 -a 0 my_hashes.txt my_wordlist.txt

# 显示结果
hashcat -m 10 --show my_hashes.txt

# 然后破解SHA1  
hashcat -m 110 -a 0 my_hashes.txt my_wordlist.txt
hashcat -m 110 --show my_hashes.txt
```

D:

cd D:\CaptureTheFlag\CTFTool\hashcat-7.1.2

hashcat -m 0 -a 0 C:\Users\glj07\Desktop\hash.txt D:\Forensic\ForensicTool\Decrypt\rockyou\rockyou.txt -d 1 -O

![](1763818241816-45a15e17-eab4-4a68-8b79-3e53b1a94a1f.png)![](1763818313205-5c2fb803-8fff-4911-a83d-8c9621556604.png)

```plain
hashcat -m 0 --show C:\Users\glj07\Desktop\hash.txt
```

![](1763820315969-4dd993cb-5205-4f60-a8f4-69ff313d292d.png)


