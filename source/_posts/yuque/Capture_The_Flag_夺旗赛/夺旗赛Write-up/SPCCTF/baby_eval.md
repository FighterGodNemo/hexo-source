---
title: "baby_eval"
date: 2026-03-15 13:28:18
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- SPCCTF
---

题目：

<font style="color:rgb(0, 0, 187);"><?php  
</font><font style="color:rgb(0, 0, 187);">highlight_file</font><font style="color:rgb(0, 119, 0);">(</font><font style="color:rgb(0, 0, 187);">__FILE__</font><font style="color:rgb(0, 119, 0);">);  
</font><font style="color:rgb(255, 128, 0);">// flag还是在/flag  
</font><font style="color:rgb(0, 119, 0);">if(isset(</font><font style="color:rgb(0, 0, 187);">$_POST</font><font style="color:rgb(0, 119, 0);">[</font><font style="color:rgb(221, 0, 0);">'code'</font><font style="color:rgb(0, 119, 0);">])){  
</font><font style="color:rgb(0, 0, 187);">$code </font><font style="color:rgb(0, 119, 0);">= </font><font style="color:rgb(0, 0, 187);">$_POST</font><font style="color:rgb(0, 119, 0);">[</font><font style="color:rgb(221, 0, 0);">'code'</font><font style="color:rgb(0, 119, 0);">];  
</font><font style="color:rgb(0, 119, 0);">if (</font><font style="color:rgb(0, 0, 187);">preg_match</font><font style="color:rgb(0, 119, 0);">(</font><font style="color:rgb(221, 0, 0);">'/[b-zA-Z]/'</font><font style="color:rgb(0, 119, 0);">, </font><font style="color:rgb(0, 0, 187);">$code</font><font style="color:rgb(0, 119, 0);">)) {  
</font><font style="color:rgb(0, 119, 0);">die(</font><font style="color:rgb(221, 0, 0);">'Detected forbidden characters!'</font><font style="color:rgb(0, 119, 0);">);  
</font><font style="color:rgb(0, 119, 0);">}  
</font><font style="color:rgb(0, 0, 187);">system</font><font style="color:rgb(0, 119, 0);">(</font><font style="color:rgb(0, 0, 187);">$code</font><font style="color:rgb(0, 119, 0);">);  
</font><font style="color:rgb(0, 119, 0);">}  
</font><font style="color:rgb(0, 0, 187);">?></font>

<font style="color:rgb(0, 0, 187);"></font>

<font style="color:rgba(0, 0, 0, 0.85);">要解决这道 Web 题目，核心是突破</font>**<u><font style="color:#DF2A3F;">字母过滤限制</font></u>**<font style="color:rgba(0, 0, 0, 0.85);"> 并执行系统命令读取 </font>`<font style="color:rgba(0, 0, 0, 0.85);">/flag</font>`<font style="color:rgba(0, 0, 0, 0.85);"> 文件</font>

<font style="color:rgba(0, 0, 0, 0.85);">核心矛盾：</font>`<font style="color:rgba(0, 0, 0, 0.85);">system()</font>`<font style="color:rgba(0, 0, 0, 0.85);"> 支持执行 Linux 系统命令，但</font>`<font style="color:rgba(0, 0, 0, 0.85);">code</font>`<font style="color:rgba(0, 0, 0, 0.85);">参数</font>**<font style="color:rgb(0, 0, 0) !important;">不能包含任何字母</font>**<font style="color:rgba(0, 0, 0, 0.85);">，需用「无字母命令」读取 </font>`<font style="color:rgba(0, 0, 0, 0.85);">/flag</font>`<font style="color:rgba(0, 0, 0, 0.85);">。</font>

### <font style="color:rgb(0, 0, 0);">二、关键技术：Linux 无字母命令构造</font>
<font style="color:rgb(0, 0, 0);">Linux 系统中，命令和文件路径可通过</font><font style="color:rgb(0, 0, 0);"> </font>**<font style="color:rgb(0, 0, 0) !important;">ASCII 码（十进制 / 八进制）转义</font>**<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">表示，无需直接写字母。例如：</font>

+ <font style="color:rgb(0, 0, 0);">命令</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">cat</font>`<font style="color:rgb(0, 0, 0);">（用于读取文件）的 ASCII 码：</font>`<font style="color:rgb(0, 0, 0);">c(99)、a(97)、t(116)</font>`
+ <font style="color:rgb(0, 0, 0);">文件路径</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">/flag</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">的 ASCII 码：</font>`<font style="color:rgb(0, 0, 0);">/(47)、f(102)、l(108)、a(97)、g(103)</font>`

<font style="color:rgb(0, 0, 0);">在 Bash 终端中，</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;">$'\xXX'</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">或</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgba(0, 0, 0, 0.85) !important;">$'XXX'</font>`<font style="color:rgb(0, 0, 0);">（XXX 为八进制）可将 ASCII 码转义为对应字符，例如：</font>

+ `<font style="color:rgb(0, 0, 0);">$'\x63\x61\x74'</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">等价于</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">cat</font>`<font style="color:rgb(0, 0, 0);">（63 是 c 的十六进制 ASCII 码，61 是 a，74 是 t）</font>
+ `<font style="color:rgb(0, 0, 0);">$'\x2f\x66\x6c\x61\x67'</font>`<font style="color:rgb(0, 0, 0);"> 等价于 </font>`<font style="color:rgb(0, 0, 0);">/flag</font>`<font style="color:rgb(0, 0, 0);">（2f 是 / 的十六进制 ASCII 码）</font>
+ <font style="color:rgb(0, 0, 0);">目标命令是</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgba(0, 0, 0, 0.85) !important;">cat /flag</font>`<font style="color:rgb(0, 0, 0);">（读取 /flag 文件），将其转为</font><font style="color:rgb(0, 0, 0);"> </font>**<font style="color:rgb(0, 0, 0) !important;">纯 ASCII 码转义格式</font>**<font style="color:rgb(0, 0, 0);">（无任何字母）：</font><font style="color:rgb(0, 0, 0);">最终可执行的</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;">code</font>`<font style="color:rgb(0, 0, 0);">参数为：</font>

**<font style="color:rgba(0, 0, 0, 0.85);">bash</font>**

```bash
code=$'\143\141\164' /??a?
```

#### <font style="color:rgb(0, 0, 0);">2. 发送 POST 请求</font>
<font style="color:rgb(0, 0, 0);">通过工具（如 Burp Suite、Postman）或脚本向目标 URL</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgba(0, 0, 0, 0.85) !important;">http://152.32.191.198:33387/</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">发送 POST 请求，携带上述</font>`<font style="color:rgba(0, 0, 0, 0.85) !important;">code</font>`<font style="color:rgb(0, 0, 0);">参数。</font>

<font style="color:rgb(0, 0, 0);">以</font><font style="color:rgb(0, 0, 0);"> </font>**<font style="color:rgb(0, 0, 0) !important;">Burp Suite</font>**<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">为例：</font>

1. <font style="color:rgb(0, 0, 0);">打开 Burp，配置浏览器代理，访问目标 URL；</font>
2. <font style="color:rgb(0, 0, 0);">拦截请求，将请求方法从</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">GET</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">改为</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">POST</font>`<font style="color:rgb(0, 0, 0);">；</font>
3. <font style="color:rgb(0, 0, 0);">在请求体中添加参数：code=$'\143\141\164' /??a?</font>
4. <font style="color:rgb(0, 0, 0);">发送请求，查看响应，即可看到 </font>`<font style="color:rgb(0, 0, 0);">/flag</font>`<font style="color:rgb(0, 0, 0);"> 文件的内容（即 flag 值）。</font>

<font style="color:rgb(0, 0, 0);"></font>

## <font style="color:rgb(15, 17, 21);">1. 原理解读</font>
<font style="color:rgb(15, 17, 21);">sh</font>

<font style="color:rgb(15, 17, 21);">code=$'\143\141\164' /??a?</font>

<font style="color:rgb(15, 17, 21);">这里分为两部分：</font>

1. `**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$'\143\141\164'</font>**`<font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">这是 Bash 的 ANSI-C 引号语法，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$'...'</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">里面的反斜杠后跟八进制数字会被转换成对应的 ASCII 字符。</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">\143</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">八进制 → 十进制 99 → ASCII 字符</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">'c'</font>`
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">\141</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">八进制 → 十进制 97 → ASCII 字符</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">'a'</font>`
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">\164</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">八进制 → 十进制 116 → ASCII 字符</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">'t'</font>`<font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">所以</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$'\143\141\164'</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">在展开后就是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">cat</font>`<font style="color:rgb(15, 17, 21);">。</font>
2. `**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>**`<font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">这是通配符匹配文件名：</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">根目录开始</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">??a?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">表示：第1个字符任意，第2个字符任意，第3个字符是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">a</font>`<font style="color:rgb(15, 17, 21);">，第4个字符任意。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">在根目录下，符合这个模式的文件名可能是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">flag</font>`<font style="color:rgb(15, 17, 21);">（</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">fl</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">任意吗？不是，这里</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">在根目录下匹配，比如</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/bin</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是 4 个字符，但第三个字符不是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">a</font>`<font style="color:rgb(15, 17, 21);">）。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">实际上，更可能是用来匹配</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/flag</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">吗？不，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/flag</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是 5 个字符</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/ f l a g</font>`<font style="color:rgb(15, 17, 21);">，不符合 4 个字符的模式。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">所以</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">可能匹配到</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/bin/bash</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">吗？不，那是 8 个字符。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">其实这里</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">可能是笔误或者需要具体环境测试，更常见的是用</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">匹配</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/bin/cat</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">吗？也不对，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/bin/cat</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是 8 个字符。</font>

---

## <font style="color:rgb(15, 17, 21);">2. 为什么这样能绕过过滤</font>
<font style="color:rgb(15, 17, 21);">原题的过滤是：</font>

<font style="color:rgb(15, 17, 21);">php</font>

<font style="color:rgb(15, 17, 21);">preg_match('/[b-zA-Z]/', $code)</font>

<font style="color:rgb(15, 17, 21);">它禁止</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">b-z</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">和</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">A-Z</font>`<font style="color:rgb(15, 17, 21);">，但允许：</font>

+ <font style="color:rgb(15, 17, 21);">小写字母</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">a</font>`
+ <font style="color:rgb(15, 17, 21);">数字、符号、通配符、空格、</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$</font>`<font style="color:rgb(15, 17, 21);">、反斜杠、单引号等</font>

`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$'\143\141\164'</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">这个字符串里，字面上只有</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$ \ 1 4 3 1 4 1 1 6 4 '</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">这些字符，没有任何</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">b-zA-Z</font>`<font style="color:rgb(15, 17, 21);">，所以能通过过滤。</font>

<font style="color:rgb(15, 17, 21);">但是在</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">system($code)</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">执行时，Shell 会先进行 ANSI-C 转义，把</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$'\143\141\164'</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">变成</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">cat</font>`<font style="color:rgb(15, 17, 21);">，然后执行。</font>

---

## <font style="color:rgb(15, 17, 21);">3. 后半部分</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的作用</font>
<font style="color:rgb(15, 17, 21);">如果直接</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">$'\143\141\164' /????</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">就是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">cat /flag</font>`<font style="color:rgb(15, 17, 21);">（假设 flag 文件在根目录且名为 4 字符）。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">但这里你写的是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>`<font style="color:rgb(15, 17, 21);">，这是 4 个字符，第三个字符必须是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">a</font>`<font style="color:rgb(15, 17, 21);">。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">在根目录下，常见 4 字符文件名且第三个字符是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">a</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的有：</font>

+ <font style="color:rgb(15, 17, 21);">可能没有</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">flag</font>`<font style="color:rgb(15, 17, 21);">（因为第三个字符是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">l</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">不是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">a</font>`<font style="color:rgb(15, 17, 21);">）</font>
+ <font style="color:rgb(15, 17, 21);">可能是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/data</font>`<font style="color:rgb(15, 17, 21);">、</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/var?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">等，但一般根目录下没有这样的文件。</font>

<font style="color:rgb(15, 17, 21);">所以</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/??a?</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">可能匹配不到</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/flag</font>`<font style="color:rgb(15, 17, 21);">，除非文件名第三个字母是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">a</font>`<font style="color:rgb(15, 17, 21);">。</font><font style="color:rgb(15, 17, 21);">  
</font><font style="color:rgb(15, 17, 21);">如果题目环境根目录下有一个文件名为</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">f?ag</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">之类的，或者</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/etc/passwd</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是 11 个字符，不匹配。</font>

---

## <font style="color:rgb(15, 17, 21);">4. 更合理的 payload</font>
<font style="color:rgb(15, 17, 21);">为了读</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/flag</font>`<font style="color:rgb(15, 17, 21);">，应该用：</font>

<font style="color:rgb(15, 17, 21);">sh</font>

<font style="color:rgb(15, 17, 21);">code=$'\143\141\164' /????    # 匹配 /flag</font>

<font style="color:rgb(15, 17, 21);">或者</font>

<font style="color:rgb(15, 17, 21);">sh</font>

<font style="color:rgb(15, 17, 21);">code=$'\143\141\164' /???a?   # 如果 flag 是 5 个字符且第三个是 a</font>

<font style="color:rgb(15, 17, 21);">但</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/flag</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">是 5 个字符</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/ f l a g</font>`<font style="color:rgb(15, 17, 21);">，所以用</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/?????</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">匹配。</font>

---

## <font style="color:rgb(15, 17, 21);">5. 总结</font>
<font style="color:rgb(15, 17, 21);">你给出的 </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">code=$'\143\141\164' /??a?</font>`<font style="color:rgb(15, 17, 21);"> 是一个</font>**<font style="color:rgb(15, 17, 21);">用八进制转义绕过字母过滤</font>**<font style="color:rgb(15, 17, 21);">的方法</font>

