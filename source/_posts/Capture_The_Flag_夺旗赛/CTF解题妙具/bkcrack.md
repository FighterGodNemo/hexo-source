---
title: bkcrack
permalink: '/2026/03/15/Capture_The_Flag_夺旗赛/CTF解题妙具/bkcrack/'
date: "2026-03-15 13:28:16"
categories:
  - Capture_The_Flag_夺旗赛
  - CTF解题妙具
tags:
  - CTF
  - CTF工具
  - bkcrack
created: "2026-03-15T16:49"
updated: "2026-03-19T15:57"
---

D:

cd D:\CaptureTheFlag\CTFTool\bkcrack-1.7.1-win64

`bkcrack` 是一个用于**破解使用传统 ZIP 加密（PKZIP Cipher）的 ZIP 文件**的工具，基于 **Biham 和 Kocher 提出的已知明文攻击（Known Plaintext Attack）**。它不要求暴力破解密码本身，而是通过**已知部分原始文件内容（明文）+ 对应加密后的 ZIP 内容（密文）** 来恢复 ZIP 的内部密钥（3 个 32 位整数），进而解密整个 ZIP 或更改密码。

---

## ✅ 使用前提
你需要满足以下条件之一：

+ **知道 ZIP 中某个文件的部分或全部原始内容（明文）**
    - 比如：你知道被加密的 `flag.txt` 原本以 `"CTF{"` 开头
    - 或者你有该文件未加密的版本（哪怕只有前几十字节）
+ 明文长度建议 ≥ **12 字节**（越多越好，至少 8 字节连续）

💡 ZIP 传统加密（不是 AES！）非常脆弱，只要有少量明文就能破解。

---

## 🧰 基本使用流程（三步走）
### 第一步：用已知明文 + 密文恢复密钥（X Y Z）
```plain
Bash

编辑


1bkcrack -C encrypted.zip -c target_file.txt -P plain.zip -p target_file.txt
```

或者，如果你有明文文件在磁盘上（不是 ZIP）：

```plain
Bash

编辑


1bkcrack -C encrypted.zip -c target_file.txt -p known_plaintext.txt
```

#### 常见参数说明：
+ `-C encrypted.zip`：被加密的 ZIP 文件
+ `-c target_file.txt`：ZIP 中你要破解的那个加密文件名
+ `-P plain.zip`：包含**相同文件名且未加密**的 ZIP（可选）
+ `-p known_plaintext.txt`：本地明文文件（内容必须与 ZIP 中加密文件对应位置一致）
+ `-o offset`：如果明文不是从文件开头开始的，需指定偏移（默认为 0）

⚠️ 注意：`-p` 和 `-P` 二选一；`-c` 必须指定 ZIP 中的文件名。

#### 示例（最常见场景）：
假设：

+ `secret.zip` 中有一个加密文件 `data.bin`
+ 你知道 `data.bin` 的前 16 字节是 `504B0304140000000800...`（比如它是另一个 ZIP 文件头）
+ 你把这 16 字节保存为 `header.bin`

运行：

```plain
Bash

编辑


1bkcrack -C secret.zip -c data.bin -p header.bin -o 0
```

如果成功，会输出类似：

```plain
Text

编辑


1[INFO] Successfully recovered keys:
2X = a1b2c3d4
3Y = e5f67890
4Z = 12345678
```

---

### 第二步：用密钥解密文件或整个 ZIP
#### 解密单个文件：
```plain
Bash

编辑


1bkcrack -C secret.zip -c data.bin -k a1b2c3d4 e5f67890 12345678 -d decrypted_data.bin
```

#### 解密整个 ZIP（生成无密码的新 ZIP）：
```plain
Bash

编辑


1bkcrack -C secret.zip -k a1b2c3d4 e5f67890 12345678 -D decrypted.zip
```

---

### 第三步（可选）：尝试恢复原始密码（暴力）
即使没有密码也能解密，但有时题目要求“交密码”。可用：

```plain
Bash

编辑


1bkcrack -k a1b2c3d4 e5f67890 12345678 -b "?a" -l 1..8
```

+ `-b "?a"`：尝试所有字母+数字（也可用 `?l?u?d?s` 等）
+ `-l 1..8`：密码长度 1 到 8 位

或用快捷方式：

```plain
Bash

编辑


1bkcrack -k ... -r 1..8 "?a"
```

🔍 注意：传统 ZIP 加密的“密码”只是用来生成内部密钥，不同密码可能生成相同密钥（等效密码）。所以恢复的可能是“等效密码”，不一定是原密码，但能用就行。

---

## 📌 实用技巧
### 1. 查看 ZIP 内容
```plain
Bash

编辑


1bkcrack -L encrypted.zip
```

### 2. 手动指定额外明文（十六进制）
如果你只知道中间某段内容，比如偏移 10 处是 `DEADBEEF`：

```plain
Bash

编辑


1bkcrack -C enc.zip -c file.txt -x 10 DEADBEEF
```

### 3. 多线程加速
加 `-j 4` 使用 4 个线程。

### 4. 已知明文不在开头？
用 `-o -5` 表示明文比密文早 5 字节（负偏移），常用于 ZIP 文件头对齐问题。

---

## ❗ 常见错误
+ **明文与密文不对齐** → 检查 `-o` 偏移
+ **明文太少（<12字节）** → 攻击失败率高
+ **ZIP 用了 AES 加密** → `bkcrack` 无效！只支持传统 PKZIP 加密（ZipCrypto）

💡 如何判断是否是传统加密？  
用 7-Zip 打开 ZIP，看加密方法是不是 “ZipCrypto” 而不是 “AES-256”。

---

## ✅ 总结命令模板
```plain
Bash

编辑


1# 1. 恢复密钥
2bkcrack -C encrypted.zip -c file.txt -p known.txt -o 0
3
4# 2. 解密整个 ZIP
5bkcrack -C encrypted.zip -k X Y Z -D output.zip
6
7# 3. （可选）爆破密码
8bkcrack -k X Y Z -r 1..10 "?a"
```

只要你有**一点点明文**，`bkcrack` 就能秒破传统 ZIP 加密！非常适合 CTF 中的 zip 破解题。

