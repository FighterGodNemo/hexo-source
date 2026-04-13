---
title: Hashcat
date: "2026-03-15 13:28:28"
categories:
tags:
  - 电子取证
  - 取证工具
  - Hashcat
---

好的，`hashcat` 是世界上最强大、最流行的密码恢复工具，被誉为 **“密码破解界的王者”**。它支持GPU加速，能极大地提升破解速度。

它的核心工作流程是：**你给它一个密码的哈希值，它帮你猜出原始的明文密码。**

下面是一个从入门到实战的完整使用指南。

---

### **一、 核心概念与准备**
#### **1. 什么是哈希？**
哈希是一种单向加密算法，能把任意长度的数据（如密码）变成固定长度的字符串（哈希值）。

+ 例如，`password` 的 MD5 哈希值是 `5f4dcc3b5aa765d61d8327deb882cf99`
+ **hashcat的任务**：通过计算，反向找出 `5f4dcc3b5aa765d61d8327deb882cf99` 原来就是 `password`。

#### **2. 安装与基本命令**
Hashcat 是一个命令行工具。在Windows下，你打开其所在文件夹，在地址栏输入 `cmd` 然后回车，即可在当前目录打开命令提示符。

基本命令格式如下：

bash

hashcat -m <哈希类型> -a <攻击模式> <哈希值或哈希文件> <字典或掩码>

---

### **二、 实战破解流程**
#### **步骤1：识别哈希类型**
这是最关键的第一步。你必须告诉 hashcat 你正在破解的是什么哈希。

+ **方法**：使用 `hashcat --help` 查看所有支持的哈希类型及其对应的 `-m` 代码。
+ **常见类型**：
    - `-m 0`: MD5
    - `-m 1000`: NTLM (Windows 系统密码)
    - `-m 1800`: sha512crypt (`$6$`, Linux 影子文件)

**示例**：如果你从Windows系统中提取出了哈希 `aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0`，你需要使用 `-m 1000` (NTLM)。

#### **步骤2：选择攻击模式 (**`**-a**`**)**
hashcat 有多种“猜密码”的策略：

| 攻击模式 | 命令参数 | 说明 | 适用场景 |
| --- | --- | --- | --- |
| **字典攻击** | `-a 0` | 使用一个密码字典文件，逐个尝试。 | **最常用**，用现成的密码库去撞。 |
| **组合攻击** | `-a 1` | 将两个字典中的词组合起来（如 `admin123`<br/>）。 | 知道密码可能由两部分组成时。 |
| **掩码攻击** | `-a 3` | 按照你设定的规则（如 `Abc!123`<br/>）来猜。 | 知道密码的大致格式（如8位，以大写字母开头）。 |
| **混合攻击** | `-a 6`<br/> / `-a 7` | **字典 + 掩码**（如 `password2024`<br/>）。 | 非常强大，结合了字典和规则。 |


对于初学者，**从字典攻击 (**`**-a 0**`**) 开始**。

#### **步骤3：准备你的“武器”**
**哈希值文件**** **`**hashes.txt**`：  
创建一个文本文件（如 `hashes.txt`），将你要破解的哈希值放进去，每行一个。

1. text

```plain
5f4dcc3b5aa765d61d8327deb882cf99
e10adc3949ba59abbe56e057f20f883e
```

**密码字典**** **`**wordlist.txt**`：  
这是一个包含成千上万常用密码的文本文件。你可以在网上下载著名的字典，如 `**rockyou.txt**`、`**weakpass_2a**` 等。自己创建一个简单的字典文件内容如下：

2. text

```plain
123456
password
admin
qwerty
letmein
```

#### **步骤4：开始破解！**
假设你已准备好：

+ 哈希文件：`hashes.txt`
+ 字典文件：`rockyou.txt`
+ 哈希类型：MD5 (`-m 0`)
+ 攻击模式：字典攻击 (`-a 0`)

**在cmd中执行命令：**

bash

hashcat -m 0 -a 0 hashes.txt rockyou.txt

+ `-m 0`： 指定哈希类型为 MD5。
+ `-a 0`： 指定攻击模式为字典攻击。
+ `hashes.txt`： 包含目标哈希值的文件。
+ `rockyou.txt`： 你的密码字典文件。

按下回车后，hashcat 会开始疯狂工作，屏幕上会显示当前的破解状态、速度和解密的密码。

---

### **三、 高级技巧与常用参数**
为了让破解更高效，你可以添加一些参数：

| 参数 | 作用 | 示例 |
| --- | --- | --- |
| `--force` | 忽略一些警告（如驱动问题）。 | `hashcat -m 0 ... --force` |
| `-O` | 优化，启用优化内核，提升速度。 | `hashcat -m 0 -O ...` |
| `-w 3` | 设置工作负载，`3`<br/> 是“重度”，让GPU满负荷运行。 | `hashcat -m 0 -w 3 ...` |
| `--show` | **破解完成后**，用此命令查看结果。 | `hashcat --show hashes.txt` |
| `-o` | 将破解出的密码保存到指定文件。 | `hashcat ... -o cracked_passwords.txt` |


**一个完整的、高效的命令示例：**

bash

hashcat -m 1000 -a 0 -O -w 3 hashes.txt rockyou.txt -o cracked_passwords.txt

---

### **四、 总结：hashcat 核心工作流**
1. **识别哈希**：确定哈希类型，找到对应的 `-m` 值。
2. **准备文件**：创建包含目标哈希的 `hashes.txt` 文件，准备强大的密码字典。
3. **选择模式**：根据情况选择攻击模式（首选 `-a 0` 字典攻击）。
4. **执行命令**：在命令行中输入完整的 hashcat 命令。
5. **查看结果**：使用 `--show` 参数或查看输出文件获取破解出的密码。在 Ubuntu 中使用 Hashcat 破解加盐哈希是标准操作，但比破解普通哈希要多一些注意事项。下面我为你提供完整的流程和指导。

---

## 加盐哈希破解的核心概念
**加盐** 就是在密码哈希之前，在密码前面或后面添加一个随机字符串（盐值）。

+ 目的：防止彩虹表攻击，确保即使两个用户密码相同，其哈希值也不同。
+ 格式：通常存储为 `$hash$salt` 或 `salt$hash` 等形式。

---

## 步骤 1：识别哈希类型
这是最关键的一步！你需要知道：

1. **哈希算法**（如 MD5, SHA1, SHA256, SHA512 等）
2. **盐值的位置和格式**
3. **对应的 Hashcat 模式代码**

### 常见加盐哈希格式示例：
| 哈希格式 | 示例 | Hashcat 模式代码 |
| --- | --- | --- |
| **MD5($pass.$salt)** | `5f4dcc3b5aa765d61d8327deb882cf99:1234` | `10` |
| **MD5($salt.$pass)** | `12345f4dcc3b5aa765d61d8327deb882cf99` | `20` |
| **SHA1($pass.$salt)** | `5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8:admin` | `110` |
| **SHA1($salt.$pass)** | `admin5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8` | `120` |
| **SHA256($pass.$salt)** | `5e884898da28047151d0e56f8dc629...:salt123` | `1410` |
| **SHA256($salt.$pass)** | `salt1235e884898da28047151d0e56f8dc629...` | `1420` |
| **Linux shadow** (`$id$salt$hash`<br/>) | `$6$salt$hash` | `1800`<br/> (SHA512) |


---

## 步骤 2：准备 Hashcat 和文件
### 安装 Hashcat
bash

```plain
sudo apt update
sudo apt install hashcat hashcat-utils
```

### 准备你的文件
**创建哈希文件** (`hashes_with_salt.txt`)：  
每行一个哈希，格式为 `hash:salt` 或根据具体格式要求

1. text

```plain
5f4dcc3b5aa765d61d8327deb882cf99:1234
5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8:admin
```

**准备密码字典** (`wordlist.txt`)：

2. bash

```plain
# 可以使用系统字典或自己创建
cat /usr/share/wordlists/rockyou.txt > wordlist.txt
# 或者创建自定义字典
echo -e "password\n123456\nadmin\nletmein" > wordlist.txt
```

---

## 步骤 3：运行 Hashcat 破解
### 基本命令语法：
bash

hashcat -m <模式代码> -a <攻击模式> <哈希文件> <字典或掩码>

### 实战示例：
#### 示例 1：破解 MD5($pass.$salt) - 模式 10
bash

```plain
# 使用字典攻击
hashcat -m 10 -a 0 hashes_with_salt.txt wordlist.txt

# 使用掩码攻击（假设知道密码是6位数字）
hashcat -m 10 -a 3 hashes_with_salt.txt ?d?d?d?d?d?d
```

#### 示例 2：破解 SHA1($salt.$pass) - 模式 120
bash

hashcat -m 120 -a 0 hashes_with_salt.txt wordlist.txt

#### 示例 3：破解 Linux Shadow 密码（/etc/shadow） - 模式 1800
bash

```plain
# 提取shadow文件中的哈希行，如：$6$salt$hash
hashcat -m 1800 -a 0 shadow_hashes.txt wordlist.txt
```

---

## 步骤 4：高级技巧和优化
### 1. 使用规则增强字典攻击
bash

hashcat -m 10 -a 0 hashes_with_salt.txt wordlist.txt -r /usr/share/hashcat/rules/best64.rule

### 2. 组合攻击（字典+掩码）
bash

```plain
# 在字典中每个密码后面添加2位数字
hashcat -m 10 -a 1 hashes_with_salt.txt wordlist.txt ?d?d
```

### 3. 使用 GPU 优化
bash

```plain
# 强制使用GPU（通常默认启用）
hashcat -m 10 -a 0 -D 2 hashes_with_salt.txt wordlist.txt

# 查看GPU状态
hashcat -I
```

### 4. 恢复会话和显示结果
bash

```plain
# 如果中断，可以恢复会话
hashcat --session mysession --restore

# 显示破解结果
hashcat -m 10 --show hashes_with_salt.txt
```

---

## 完整实战演示
假设我们有文件 `my_hashes.txt`：

text

```plain
5f4dcc3b5aa765d61d8327deb882cf99:1234
5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8:admin
```

### 步骤：
1. **识别哈希**：第一个是 MD5($pass.$salt)，第二个是 SHA1($pass.$salt)

**准备字典**：

2. bashecho -e "password\nadmin\n123456\nletmein" > my_wordlist.txt

**运行破解**：

3. bash

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


