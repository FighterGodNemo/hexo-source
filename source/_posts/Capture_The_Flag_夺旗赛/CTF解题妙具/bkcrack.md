---
title: bkcrack
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - CTF解题妙具
created: 2026-03-15T16:49
updated: 2026-03-18T09:41
---

D:

cd D:\CaptureTheFlag\CTFTool\bkcrack-1.7.1-win64

`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">bkcrack</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 是一个用于</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">破解使用传统 ZIP 加密（PKZIP Cipher）的 ZIP 文件</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">的工具，基于 </font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">Biham 和 Kocher 提出的已知明文攻击（Known Plaintext Attack）</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">。它不要求暴力破解密码本身，而是通过</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">已知部分原始文件内容（明文）+ 对应加密后的 ZIP 内容（密文）</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 来恢复 ZIP 的内部密钥（3 个 32 位整数），进而解密整个 ZIP 或更改密码。</font>

---

## <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">✅</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 使用前提</font>
<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">你需要满足以下条件之一：</font>

+ **<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">知道 ZIP 中某个文件的部分或全部原始内容（明文）</font>**
    - <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">比如：你知道被加密的</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">flag.txt</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">原本以</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">"CTF{"</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">开头</font>
    - <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">或者你有该文件未加密的版本（哪怕只有前几十字节）</font>
+ <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">明文长度建议 ≥</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">12 字节</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">（越多越好，至少 8 字节连续）</font>

<font style="background-color:rgb(21, 21, 21);">💡</font><font style="background-color:rgb(21, 21, 21);"> ZIP 传统加密（不是 AES！）非常脆弱，只要有少量明文就能破解。</font>

---

## <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">🧰</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 基本使用流程（三步走）</font>
### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">第一步：用已知明文 + 密文恢复密钥（X Y Z）</font>
```plain
Bash

编辑


1bkcrack -C encrypted.zip -c target_file.txt -P plain.zip -p target_file.txt
```

<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">或者，如果你有明文文件在磁盘上（不是 ZIP）：</font>

```plain
Bash

编辑


1bkcrack -C encrypted.zip -c target_file.txt -p known_plaintext.txt
```

#### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">常见参数说明：</font>
+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-C encrypted.zip</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：被加密的 ZIP 文件</font>
+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-c target_file.txt</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：ZIP 中你要破解的那个加密文件名</font>
+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-P plain.zip</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：包含</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">相同文件名且未加密</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">的 ZIP（可选）</font>
+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-p known_plaintext.txt</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：本地明文文件（内容必须与 ZIP 中加密文件对应位置一致）</font>
+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-o offset</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：如果明文不是从文件开头开始的，需指定偏移（默认为 0）</font>

<font style="background-color:rgb(21, 21, 21);">⚠️</font><font style="background-color:rgb(21, 21, 21);"> 注意：</font>`<font style="background-color:rgba(175, 184, 193, 0.2);">-p</font>`<font style="background-color:rgb(21, 21, 21);"> 和 </font>`<font style="background-color:rgba(175, 184, 193, 0.2);">-P</font>`<font style="background-color:rgb(21, 21, 21);"> 二选一；</font>`<font style="background-color:rgba(175, 184, 193, 0.2);">-c</font>`<font style="background-color:rgb(21, 21, 21);"> 必须指定 ZIP 中的文件名。</font>

#### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">示例（最常见场景）：</font>
<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">假设：</font>

+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">secret.zip</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">中有一个加密文件</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">data.bin</font>`
+ <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">你知道</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">data.bin</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">的前 16 字节是</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">504B0304140000000800...</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">（比如它是另一个 ZIP 文件头）</font>
+ <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">你把这 16 字节保存为</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">header.bin</font>`

<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">运行：</font>

```plain
Bash

编辑


1bkcrack -C secret.zip -c data.bin -p header.bin -o 0
```

<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">如果成功，会输出类似：</font>

```plain
Text

编辑


1[INFO] Successfully recovered keys:
2X = a1b2c3d4
3Y = e5f67890
4Z = 12345678
```

---

### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">第二步：用密钥解密文件或整个 ZIP</font>
#### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">解密单个文件：</font>
```plain
Bash

编辑


1bkcrack -C secret.zip -c data.bin -k a1b2c3d4 e5f67890 12345678 -d decrypted_data.bin
```

#### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">解密整个 ZIP（生成无密码的新 ZIP）：</font>
```plain
Bash

编辑


1bkcrack -C secret.zip -k a1b2c3d4 e5f67890 12345678 -D decrypted.zip
```

---

### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">第三步（可选）：尝试恢复原始密码（暴力）</font>
<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">即使没有密码也能解密，但有时题目要求“交密码”。可用：</font>

```plain
Bash

编辑


1bkcrack -k a1b2c3d4 e5f67890 12345678 -b "?a" -l 1..8
```

+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-b "?a"</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：尝试所有字母+数字（也可用</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">?l?u?d?s</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">等）</font>
+ `<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-l 1..8</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：密码长度 1 到 8 位</font>

<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">或用快捷方式：</font>

```plain
Bash

编辑


1bkcrack -k ... -r 1..8 "?a"
```

<font style="background-color:rgb(21, 21, 21);">🔍</font><font style="background-color:rgb(21, 21, 21);"> 注意：传统 ZIP 加密的“密码”只是用来生成内部密钥，不同密码可能生成相同密钥（等效密码）。所以恢复的可能是“等效密码”，不一定是原密码，但能用就行。</font>

---

## <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">📌</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 实用技巧</font>
### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">1. 查看 ZIP 内容</font>
```plain
Bash

编辑


1bkcrack -L encrypted.zip
```

### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">2. 手动指定额外明文（十六进制）</font>
<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">如果你只知道中间某段内容，比如偏移 10 处是 </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">DEADBEEF</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">：</font>

```plain
Bash

编辑


1bkcrack -C enc.zip -c file.txt -x 10 DEADBEEF
```

### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">3. 多线程加速</font>
<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">加 </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-j 4</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 使用 4 个线程。</font>

### <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">4. 已知明文不在开头？</font>
<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">用 </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-o -5</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 表示明文比密文早 5 字节（负偏移），常用于 ZIP 文件头对齐问题。</font>

---

## <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">❗</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 常见错误</font>
+ **<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">明文与密文不对齐</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">→ 检查</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">-o</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">偏移</font>
+ **<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">明文太少（<12字节）</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">→ 攻击失败率高</font>
+ **<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">ZIP 用了 AES 加密</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">→</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">bkcrack</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> </font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">无效！只支持传统 PKZIP 加密（ZipCrypto）</font>

<font style="background-color:rgb(21, 21, 21);">💡</font><font style="background-color:rgb(21, 21, 21);"> 如何判断是否是传统加密？  
</font><font style="background-color:rgb(21, 21, 21);">用 7-Zip 打开 ZIP，看加密方法是不是 “ZipCrypto” 而不是 “AES-256”。</font>

---

## <font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">✅</font><font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 总结命令模板</font>
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

<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">只要你有</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">一点点明文</font>**<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);">，</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgba(175, 184, 193, 0.2);">bkcrack</font>`<font style="color:rgba(255, 255, 255, 0.85);background-color:rgb(21, 21, 21);"> 就能秒破传统 ZIP 加密！非常适合 CTF 中的 zip 破解题。</font>

