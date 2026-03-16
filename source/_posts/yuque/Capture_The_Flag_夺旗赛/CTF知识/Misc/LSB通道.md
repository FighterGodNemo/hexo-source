---
title: "LSB通道"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- CTF知识
- Misc
---

**<font style="color:rgb(15, 17, 21);">LSB（</font>****<font style="color:#df2a3f;">最低有效位</font>****<font style="color:rgb(15, 17, 21);">）通道，一种将秘密信息隐藏到数字图像（最常见的是位图BMP或PNG）中的方法，其原理是修改像素颜色值中“最不重要”的比特位，从而嵌入信息，同时使人眼几乎察觉不到图像的改变。</font>**

### <font style="color:rgb(15, 17, 21);">解题：</font><font style="color:#117cee;">Stegsolve</font>
#### <font style="color:rgb(15, 17, 21);">1. 像素是如何表示颜色的？</font>
<font style="color:rgb(15, 17, 21);">一张数字图像由成千上万个</font>**<font style="color:rgb(15, 17, 21);">像素（Pixel）</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">组成。每个像素的颜色通常由几种</font>**<font style="color:rgb(15, 17, 21);">通道（Channels）</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">混合而成，最常见的是</font>**<font style="color:rgb(15, 17, 21);">红（R）、绿（G）、蓝（B）</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">三个通道。</font>

<font style="color:rgb(15, 17, 21);">每个通道的强度通常用一个</font><font style="color:rgb(15, 17, 21);"> </font>**<font style="color:rgb(15, 17, 21);">8比特（bit）</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的数字来表示，范围是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">到</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">255</font>`<font style="color:rgb(15, 17, 21);">（因为 2⁸ = 256）。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">例如：</font>

+ <font style="color:rgb(15, 17, 21);">纯红色：</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">(255, 0, 0)</font>`
+ <font style="color:rgb(15, 17, 21);">纯白色：</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">(255, 255, 255)</font>`
+ <font style="color:rgb(15, 17, 21);">深灰色：</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">(34, 34, 34)</font>`

#### <font style="color:rgb(15, 17, 21);">2. 什么是“有效位”？</font>
<font style="color:rgb(15, 17, 21);">一个 8 位的二进制数，例如</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">11001011</font>`<font style="color:rgb(15, 17, 21);">，其每一位的“重要性”是不同的。</font>

+ **<font style="color:rgb(15, 17, 21);">最高有效位（MSB - Most Significant Bit）</font>**<font style="color:rgb(15, 17, 21);">：最左边的位（在这个例子中是第一个</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);">）。改变它会极大地改变数值。比如，将</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">11001011</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(203) 改为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">01001011</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(75)，变化非常大。</font>
+ **<font style="color:rgb(15, 17, 21);">最低有效位（LSB - Least Significant Bit）</font>**<font style="color:rgb(15, 17, 21);">：最右边的位（在这个例子中是最后一个</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);">）。改变它只会让数值变化</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);">。比如，将</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">11001011</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(203) 改为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">11001010</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(202)，变化微乎其微。</font>

**<font style="color:rgb(15, 17, 21);">结论：修改最低有效位对数值的整体影响最小。</font>**

#### <font style="color:rgb(15, 17, 21);">3. 应用到图像上</font>
<font style="color:rgb(15, 17, 21);">现在，我们将这个概念应用到图像的像素上：</font>

+ <font style="color:rgb(15, 17, 21);">一个像素的红色通道值</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">203</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的二进制是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">11001011</font>`<font style="color:rgb(15, 17, 21);">。</font>
+ <font style="color:rgb(15, 17, 21);">如果我们把它的</font>**<font style="color:rgb(15, 17, 21);">最低有效位（LSB）</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">从</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">改为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0</font>`<font style="color:rgb(15, 17, 21);">，它就变成了</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">11001010</font>`<font style="color:rgb(15, 17, 21);">，即</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">202</font>`<font style="color:rgb(15, 17, 21);">。</font>
+ **<font style="color:rgb(15, 17, 21);">从</font>****<font style="color:rgb(15, 17, 21);"> </font>**`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">203</font>**`**<font style="color:rgb(15, 17, 21);"> </font>****<font style="color:rgb(15, 17, 21);">的红色变成</font>****<font style="color:rgb(15, 17, 21);"> </font>**`**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">202</font>**`**<font style="color:rgb(15, 17, 21);"> </font>****<font style="color:rgb(15, 17, 21);">的红色，人眼根本无法分辨这两种颜色的差异！</font>**

**<font style="color:rgb(15, 17, 21);">LSB隐写就是利用了这个原理</font>**<font style="color:rgb(15, 17, 21);">：我们牺牲掉图像中每个通道最后一位的精度（这点精度损失人眼看不到），用它们来存储我们的秘密信息。</font>

---

### <font style="color:rgb(15, 17, 21);">三、工作原理：如何隐藏信息？</font>
<font style="color:rgb(15, 17, 21);">假设我们想隐藏字母</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A</font>`<font style="color:rgb(15, 17, 21);">。</font>

1. **<font style="color:rgb(15, 17, 21);">将秘密信息转换为二进制</font>**
    - <font style="color:rgb(15, 17, 21);">字母</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的 ASCII 码是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">65</font>`<font style="color:rgb(15, 17, 21);">。</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">65</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的二进制是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">01000001</font>`<font style="color:rgb(15, 17, 21);">。</font>
2. **<font style="color:rgb(15, 17, 21);">获取载体图像的像素</font>**
    - <font style="color:rgb(15, 17, 21);">我们取一串连续的像素，例如前 8 个通道（可能来自3个像素：Pixel1(R,G,B), Pixel2(R,G,B), Pixel3(R,G,B) -> 这已经9个通道了，我们只需要前8个）。</font>
    - <font style="color:rgb(15, 17, 21);">假设前8个通道的LSB分别是：</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1, 0, 1, 1, 0, 0, 1, 1</font>`
3. **<font style="color:rgb(15, 17, 21);">替换LSB</font>**
    - <font style="color:rgb(15, 17, 21);">我们将载体图像这8个通道的</font>**<font style="color:rgb(15, 17, 21);">最低有效位</font>**<font style="color:rgb(15, 17, 21);">，替换为我们秘密信息</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的二进制位</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">01000001</font>`<font style="color:rgb(15, 17, 21);">。</font>

| <font style="color:rgb(15, 17, 21);">通道原值 (二进制)</font> | <font style="color:rgb(15, 17, 21);">原LSB</font> | <font style="color:rgb(15, 17, 21);">秘密信息位</font> | **<font style="color:rgb(15, 17, 21);">新通道值 (二进制)</font>** | <font style="color:rgb(15, 17, 21);">新十进制值</font> |
| --- | --- | --- | --- | --- |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1100101**1**</font>` | <font style="color:rgb(15, 17, 21);">1</font> | **<font style="color:rgb(15, 17, 21);">0</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1100101**0**</font>` | <font style="color:rgb(15, 17, 21);">202</font> |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0011010**0**</font>` | <font style="color:rgb(15, 17, 21);">0</font> | **<font style="color:rgb(15, 17, 21);">1</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0011010**1**</font>` | <font style="color:rgb(15, 17, 21);">53</font> |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1111111**1**</font>` | <font style="color:rgb(15, 17, 21);">1</font> | **<font style="color:rgb(15, 17, 21);">0</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1111111**0**</font>` | <font style="color:rgb(15, 17, 21);">254</font> |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0000000**1**</font>` | <font style="color:rgb(15, 17, 21);">1</font> | **<font style="color:rgb(15, 17, 21);">0</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0000000**0**</font>` | <font style="color:rgb(15, 17, 21);">0</font> |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1010101**0**</font>` | <font style="color:rgb(15, 17, 21);">0</font> | **<font style="color:rgb(15, 17, 21);">0</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1010101**0**</font>` | <font style="color:rgb(15, 17, 21);">170</font> |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0101010**0**</font>` | <font style="color:rgb(15, 17, 21);">0</font> | **<font style="color:rgb(15, 17, 21);">0</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0101010**0**</font>` | <font style="color:rgb(15, 17, 21);">84</font> |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1110001**1**</font>` | <font style="color:rgb(15, 17, 21);">1</font> | **<font style="color:rgb(15, 17, 21);">0</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">1110001**0**</font>` | <font style="color:rgb(15, 17, 21);">226</font> |
| `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0001110**1**</font>` | <font style="color:rgb(15, 17, 21);">1</font> | **<font style="color:rgb(15, 17, 21);">1</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0001110**1**</font>` | <font style="color:rgb(15, 17, 21);">29</font> |


4. **<font style="color:rgb(15, 17, 21);">完成隐藏</font>**
    - <font style="color:rgb(15, 17, 21);">经过上述修改后，字母</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的信息就被成功地隐藏在了图像的前8个通道中。</font>
    - <font style="color:rgb(15, 17, 21);">由于每个通道只改变了最低的1位，整张图片看起来和原来</font>**<font style="color:rgb(15, 17, 21);">几乎没有任何区别</font>**<font style="color:rgb(15, 17, 21);">。</font>
5. **<font style="color:rgb(15, 17, 21);">提取信息</font>**
    - <font style="color:rgb(15, 17, 21);">接收方只需要知道信息是从哪个像素开始隐藏的（这通常由算法或密钥约定），然后按顺序读取这些通道的</font>**<font style="color:rgb(15, 17, 21);">最低有效位</font>**<font style="color:rgb(15, 17, 21);">，每8位组合成一个字节，再转换成字符，就能还原出隐藏的信息</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A</font>`<font style="color:rgb(15, 17, 21);">。</font>

---

### <font style="color:rgb(15, 17, 21);">四、优缺点</font>
#### <font style="color:rgb(15, 17, 21);">优点：</font>
+ **<font style="color:rgb(15, 17, 21);">实现简单</font>**<font style="color:rgb(15, 17, 21);">：算法原理和编程实现都相对简单。</font>
+ **<font style="color:rgb(15, 17, 21);">隐蔽性高</font>**<font style="color:rgb(15, 17, 21);">：对图像视觉质量影响极小，难以被肉眼察觉。</font>
+ **<font style="color:rgb(15, 17, 21);">容量大</font>**<font style="color:rgb(15, 17, 21);">：一张图片有数百万像素，理论上有巨大的隐藏空间（像素数 × 3通道 ≈ 可隐藏的比特数）。</font>

