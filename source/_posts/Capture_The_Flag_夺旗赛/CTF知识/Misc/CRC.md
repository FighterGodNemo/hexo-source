---
title: "CRC"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- CTF知识
- Misc
---

<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">CRC（Cyclic Redundancy Check，循环冗余校验）</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">用于检测数据在传输或存储过程中是否出现差错。</font>**

### <font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">核心原理</font>
1. **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">生成校验码</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">发送方：将需要传输的数据（看作一个二进制多项式）与一个预先确定的</font>**<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">生成多项式</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">（如常见的 CRC - 16、CRC - 32 等，不同标准生成多项式不同）进行运算，得到一个固定长度的</font>**<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">CRC 校验码</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">。</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">例如，数据是</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1011001</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">，生成多项式是</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1010</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">，通过模 2 除法（异或运算）得到余数，这个余数就是校验码。</font>
2. **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">验证数据完整性</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">接收方：接收到数据（包括附带的 CRC 校验码）后，用同样的生成多项式对数据部分进行运算，得到新的校验码。</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">将新校验码与接收到的校验码对比：若一致，认为数据无错误；若不一致，说明数据在传输过程中发生了错误。</font>

### <font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">特点</font>
+ **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">检错能力强</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：能检测出大部分的随机错误（如位翻转）、突发错误（连续多位错误），但</font>**<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">不能纠错</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">（只能发现错误，无法定位或修正错误）。</font>
+ **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">计算高效</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：通过移位寄存器等硬件或简单的算法就能快速计算，适合对实时性要求高的场景。</font>
+ **<font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">应用广泛</font>**<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">：在以太网、zip 压缩、磁盘存储、蓝牙等众多领域都有应用，比如 CRC - 32 常用于验证文件传输的完整性。</font>

### <font style="color:rgb(0, 0, 0) !important;background-color:rgba(0, 0, 0, 0);">简单示例（帮助理解）</font>
<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">假设数据是 </font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">1010</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">，生成多项式是 </font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">1101</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">（4 位，校验码长度为 4−1=3 位）：</font>

1. <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">发送方计算：</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">数据后面补 3 个 0，变成</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1010000</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">。</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">用</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1010000</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">对</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1101</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">做模 2 除法，得到余数（校验码）</font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">011</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">。</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">发送的数据为</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1010</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">+</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">011</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">=</font><font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1010011</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">。</font>
2. <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">接收方验证：</font>
    - <font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">对接收到的 </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1010011</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> 用 </font>`<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">1101</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);"> 做模 2 除法，若余数为 0，说明数据正确；若余数非 0，说明数据错误。</font>

<font style="color:rgba(0, 0, 0, 0.85) !important;background-color:rgba(0, 0, 0, 0);">总之，CRC 是一种高效的差错检测手段，通过多项式运算生成和验证校验码，保障数据传输或存储的可靠性。</font><font style="color:rgb(31, 35, 41);">  
</font>

