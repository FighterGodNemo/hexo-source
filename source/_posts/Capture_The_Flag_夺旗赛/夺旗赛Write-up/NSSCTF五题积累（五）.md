---
title: NSSCTF五题积累（五）
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/NSSCTF五题积累（五）/
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - NSSCTF
tags:
  - CTF
  - WriteUp
  - NSSCTF
  - 五题积累
created: 2026-03-15T16:49
updated: 2026-04-29T14:21
---

# 第一轮
## 1.Crypto

### [LitCTF 2023]Hex？Hex！(初级)
#### #古典密码 #Base家族 #其他
题目描述: 如果你也和我一样知道hex的话，那我觉得，这件事，太酷啦！

> 4c69744354467b746169313131636f6f6c6c616161217d
>

十六进制转字符即可

![](<2025 NSSCTF/file-20260331130228343.png>)

LitCTF{tai111coollaaa!}

## 2.Web

### [BJDCTF 2020]Ezphp
#### #数组绕过 #正则绕过 #弱比较 #PHP的类型转换 #伪协议 #extract函数的使用 #sha1碰撞
环境：http://node4.anna.nssctf.cn:28905/

![](<2025 NSSCTF/file-20260331130228589.png>)

Ctrl+U查看源代码

![](<2025 NSSCTF/file-20260331130228562.png>)

**GFXEIM3YFZYGQ4A=**显然是线索。

全大写+等号，推测是base32编码。放入CyberChef解码。

![](<2025 NSSCTF/file-20260331130228536.png>)

```php
<?php
  highlight_file(__FILE__);
error_reporting(0); 

$file = "1nD3x.php";
$shana = $_GET['shana'];
$passwd = $_GET['passwd'];
$arg = '';
$code = '';

echo "<br /><font color=red><B>This is a very simple challenge and if you solve it I will give you a flag. Good Luck!</B><br></font>";

if($_SERVER) { 
  if (
    preg_match('/shana|debu|aqua|cute|arg|code|flag|system|exec|passwd|ass|eval|sort|shell|ob|start|mail|\$|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|read|inc|info|bin|hex|oct|echo|print|pi|\.|\"|\'|log/i', $_SERVER['QUERY_STRING'])
  )  
    die('You seem to want to do something bad?'); 
}

if (!preg_match('/http|https/i', $_GET['file'])) {
  if (preg_match('/^aqua_is_cute$/', $_GET['debu']) && $_GET['debu'] !== 'aqua_is_cute') { 
    $file = $_GET["file"]; 
    echo "Neeeeee! Good Job!<br>";
  } 
} else die('fxck you! What do you want to do ?!');

if($_REQUEST) { 
  foreach($_REQUEST as $value) { 
    if(preg_match('/[a-zA-Z]/i', $value))  
      die('fxck you! I hate English!'); 
  } 
} 

if (file_get_contents($file) !== 'debu_debu_aqua')
  die("Aqua is the cutest five-year-old child in the world! Isn't it ?<br>");


if ( sha1($shana) === sha1($passwd) && $shana != $passwd ){
  extract($_GET["flag"]);
  echo "Very good! you know my password. But what is flag?<br>";
} else{
  die("fxck you! you don't know my password! And you don't know sha1! why you come here!");
}

if(preg_match('/^[a-z0-9]*$/isD', $code) || 
   preg_match('/fil|cat|more|tail|tac|less|head|nl|tailf|ass|eval|sort|shell|ob|start|mail|\`|\{|\%|x|\&|\$|\*|\||\<|\"|\'|\=|\?|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|print|echo|read|inc|flag|1f|info|bin|hex|oct|pi|con|rot|input|\.|log|\^/i', $arg) ) { 
  die("<br />Neeeeee~! I have disabled all dangerous functions! You can't get my flag =w="); 
} else { 
  include "flag.php";
  $code('', $arg); 
} ?>
这是一个非常简单的挑战,如果你解决,我会给你一面旗帜。祝你好运!
你!我讨厌英语!
```

```php
<code><span style="color: #000000">
<span style="color: #0000BB">&lt;?php
<br />highlight_file</span><span style="color: #007700">(</span><span style="color: #0000BB">__FILE__</span><span style="color: #007700">);
<br /></span><span style="color: #0000BB">error_reporting</span><span style="color: #007700">(</span><span style="color: #0000BB">0</span><span style="color: #007700">);&nbsp;
<br />
<br /></span><span style="color: #0000BB">$file&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #DD0000">"1nD3x.php"</span><span style="color: #007700">;
<br /></span><span style="color: #0000BB">$shana&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'shana'</span><span style="color: #007700">];
<br /></span><span style="color: #0000BB">$passwd&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'passwd'</span><span style="color: #007700">];
<br /></span><span style="color: #0000BB">$arg&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #DD0000">''</span><span style="color: #007700">;
<br /></span><span style="color: #0000BB">$code&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #DD0000">''</span><span style="color: #007700">;
<br />
<br />echo&nbsp;</span><span style="color: #DD0000">"&lt;br&nbsp;/&gt;&lt;font&nbsp;color=red&gt;&lt;B&gt;This&nbsp;is&nbsp;a&nbsp;very&nbsp;simple&nbsp;challenge&nbsp;and&nbsp;if&nbsp;you&nbsp;solve&nbsp;it&nbsp;I&nbsp;will&nbsp;give&nbsp;you&nbsp;a&nbsp;flag.&nbsp;Good&nbsp;Luck!&lt;/B&gt;&lt;br&gt;&lt;/font&gt;"</span><span style="color: #007700">;
<br />
<br />if(</span><span style="color: #0000BB">$_SERVER</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/shana|debu|aqua|cute|arg|code|flag|system|exec|passwd|ass|eval|sort|shell|ob|start|mail|\$|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|read|inc|info|bin|hex|oct|echo|print|pi|\.|\"|\'|log/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$_SERVER</span><span style="color: #007700">[</span><span style="color: #DD0000">'QUERY_STRING'</span><span style="color: #007700">])
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">'You&nbsp;seem&nbsp;to&nbsp;want&nbsp;to&nbsp;do&nbsp;something&nbsp;bad?'</span><span style="color: #007700">);&nbsp;
<br />}
<br />
<br />if&nbsp;(!</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/http|https/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'file'</span><span style="color: #007700">]))&nbsp;{
<br />&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/^aqua_is_cute$/'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'debu'</span><span style="color: #007700">])&nbsp;&amp;&amp;&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">'debu'</span><span style="color: #007700">]&nbsp;!==&nbsp;</span><span style="color: #DD0000">'aqua_is_cute'</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">$file&nbsp;</span><span style="color: #007700">=&nbsp;</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">"file"</span><span style="color: #007700">];&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;</span><span style="color: #DD0000">"Neeeeee!&nbsp;Good&nbsp;Job!&lt;br&gt;"</span><span style="color: #007700">;
<br />&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;
<br />}&nbsp;else&nbsp;die(</span><span style="color: #DD0000">'fxck&nbsp;you!&nbsp;What&nbsp;do&nbsp;you&nbsp;want&nbsp;to&nbsp;do&nbsp;?!'</span><span style="color: #007700">);
<br />
<br />if(</span><span style="color: #0000BB">$_REQUEST</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;foreach(</span><span style="color: #0000BB">$_REQUEST&nbsp;</span><span style="color: #007700">as&nbsp;</span><span style="color: #0000BB">$value</span><span style="color: #007700">)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/[a-zA-Z]/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$value</span><span style="color: #007700">))&nbsp;&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">'fxck&nbsp;you!&nbsp;I&nbsp;hate&nbsp;English!'</span><span style="color: #007700">);&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;
<br />}&nbsp;
<br />
<br />if&nbsp;(</span><span style="color: #0000BB">file_get_contents</span><span style="color: #007700">(</span><span style="color: #0000BB">$file</span><span style="color: #007700">)&nbsp;!==&nbsp;</span><span style="color: #DD0000">'debu_debu_aqua'</span><span style="color: #007700">)
<br />&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">"Aqua&nbsp;is&nbsp;the&nbsp;cutest&nbsp;five-year-old&nbsp;child&nbsp;in&nbsp;the&nbsp;world!&nbsp;Isn't&nbsp;it&nbsp;?&lt;br&gt;"</span><span style="color: #007700">);
<br />
<br />
<br />if&nbsp;(&nbsp;</span><span style="color: #0000BB">sha1</span><span style="color: #007700">(</span><span style="color: #0000BB">$shana</span><span style="color: #007700">)&nbsp;===&nbsp;</span><span style="color: #0000BB">sha1</span><span style="color: #007700">(</span><span style="color: #0000BB">$passwd</span><span style="color: #007700">)&nbsp;&amp;&amp;&nbsp;</span><span style="color: #0000BB">$shana&nbsp;</span><span style="color: #007700">!=&nbsp;</span><span style="color: #0000BB">$passwd&nbsp;</span><span style="color: #007700">){
<br />&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">extract</span><span style="color: #007700">(</span><span style="color: #0000BB">$_GET</span><span style="color: #007700">[</span><span style="color: #DD0000">"flag"</span><span style="color: #007700">]);
<br />&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;</span><span style="color: #DD0000">"Very&nbsp;good!&nbsp;you&nbsp;know&nbsp;my&nbsp;password.&nbsp;But&nbsp;what&nbsp;is&nbsp;flag?&lt;br&gt;"</span><span style="color: #007700">;
<br />}&nbsp;else{
<br />&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">"fxck&nbsp;you!&nbsp;you&nbsp;don't&nbsp;know&nbsp;my&nbsp;password!&nbsp;And&nbsp;you&nbsp;don't&nbsp;know&nbsp;sha1!&nbsp;why&nbsp;you&nbsp;come&nbsp;here!"</span><span style="color: #007700">);
<br />}
<br />
<br />if(</span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/^[a-z0-9]*$/isD'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$code</span><span style="color: #007700">)&nbsp;||&nbsp;
<br /></span><span style="color: #0000BB">preg_match</span><span style="color: #007700">(</span><span style="color: #DD0000">'/fil|cat|more|tail|tac|less|head|nl|tailf|ass|eval|sort|shell|ob|start|mail|\`|\{|\%|x|\&amp;|\$|\*|\||\&lt;|\"|\'|\=|\?|sou|show|cont|high|reverse|flip|rand|scan|chr|local|sess|id|source|arra|head|light|print|echo|read|inc|flag|1f|info|bin|hex|oct|pi|con|rot|input|\.|log|\^/i'</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$arg</span><span style="color: #007700">)&nbsp;)&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;die(</span><span style="color: #DD0000">"&lt;br&nbsp;/&gt;Neeeeee~!&nbsp;I&nbsp;have&nbsp;disabled&nbsp;all&nbsp;dangerous&nbsp;functions!&nbsp;You&nbsp;can't&nbsp;get&nbsp;my&nbsp;flag&nbsp;=w="</span><span style="color: #007700">);&nbsp;
<br />}&nbsp;else&nbsp;{&nbsp;
<br />&nbsp;&nbsp;&nbsp;&nbsp;include&nbsp;</span><span style="color: #DD0000">"flag.php"</span><span style="color: #007700">;
<br />&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0000BB">$code</span><span style="color: #007700">(</span><span style="color: #DD0000">''</span><span style="color: #007700">,&nbsp;</span><span style="color: #0000BB">$arg</span><span style="color: #007700">);&nbsp;
<br />}&nbsp;</span><span style="color: #0000BB">?&gt;</span>
</span>
</code><br /><font color=red><B>This is a very simple challenge and if you solve it I will give you a flag. Good Luck!</B><br></font>fxck you! I hate English!
```

### 1. 代码分析
首先，我们来梳理一下代码的执行流程和关键条件：

1. QUERY_STRING检查 ：URL中不能包含敏感字符（如shana、debu、aqua等），否则直接退出。
2. file参数检查 ：不能包含http或https，否则直接退出。
3. debu参数条件 ：
    - 正则匹配/^aqua_is_cute$/
    - $_GET['debu'] !== 'aqua_is_cute'  
满足则将file参数设置为用户输入的值。
4. $_REQUEST参数检查 ：所有参数值不能包含字母，否则退出。
5. file_get_contents检查 ：file_get_contents($file)必须等于'debu_debu_aqua'，否则退出。
6. sha1比较 ：sha1($ shana) === sha1( $passwd)且$ shana !=  $passwd，否则退出。
7. code和arg参数检查 ：不能包含敏感字符，否则退出。
8. 执行代码 ：包含flag.php，执行$ code('',  $arg)。

### 2. 绕过方法 2.1 QUERY_STRING检查
使用URL编码绕过，将敏感字符编码为十六进制格式，例如：

+ shana → %73%68%61%6e%61
+ debu → %64%65%62%75
+ flag → %66%6c%61%67 2.2 debu参数条件绕过  
这个条件看起来矛盾，但我们可以 不满足此条件 ，而是通过后续的extract函数覆盖$ file变量。
 2.3  $_REQUEST参数检查  
所有参数值不能包含字母，我们可以使用 数组 作为参数值，例如：
+ shana[]=1
+ passwd[]=2 2.4 file_get_contents检查  
使用 php://input 伪协议，通过POST方式提交数据'debu_debu_aqua'，这样file_get_contents($file)就会返回POST的数据。  
 2.5 sha1比较绕过  
利用PHP中sha1(array())返回NULL的特性，使用不同的数组作为参数值，例如：
+ shana[]=1
+ passwd[]=2  
这样sha1($ shana) === sha1( $passwd)（都返回NULL）且$ shana !=  $passwd（数组不同）。 2.6 执行代码获取flag  
通过extract函数设置$ code和 $arg变量，使用 assert函数 执行任意代码，例如：
+ flag[code]=assert
+ flag[arg]=var_dump($ flag)
这样 $code('', $ arg)就会执行var_dump( $flag)，输出flag的值。

### 3. 最终payload
1. URL ：

```plain
http://node4.anna.nssctf.cn:28905/1nD3x.php?%73%68%61%6e%61%5b%5d=1&
%70%61%73%73%77%64%5b%5d=2&%66%6c%61%67%5b%63%6f%64%65%5d=assert&
%66%6c%61%67%5b%61%72%67%5d=var_dump%28%24%66%6c%61%67%29&
%66%69%6c%65=php%3a%2f%2finput
```

2. POST数据 ：

```plain
debu_debu_aqua
```

### 4. 执行流程
1. URL使用URL编码，绕过QUERY_STRING检查。
2. file参数设置为php://input，不包含http或https，通过检查。
3. debu参数不存在，不满足条件，但后续extract函数会覆盖$file变量。
4. shana和passwd参数值为数组，不包含字母，通过$_REQUEST检查。
5. file_get_contents(php://input)返回POST数据'debu_debu_aqua'，通过检查。
6. sha1比较使用数组，返回NULL，且数组不同，通过检查。
7. extract函数设置$ code=assert， $arg=var_dump($flag)。
8. 包含flag.php，执行assert('', var_dump($flag))，输出flag的值。

### 5. 预期结果
执行上述payload后，页面会输出$flag变量的值，即最终的flag。

这个挑战主要考察了。通过分析代码的执行流程，找出各个条件的绕过方法，最终成功获取flag。

## 3.Misc

### [SDCTF 2022]Susan Album Party
#### #图片隐写 #图片分离 #结构隐写
 My friend Susan is having a photo album party, but she accidentally corrupted the SD card with all her photos on it! Can you save Susan's party by recovering her photos?

附件：stub

![](<2025 NSSCTF/file-20260331130228545.png>)

查看发现是jpeg格式。修改后缀：

![](<2025 NSSCTF/file-20260331130228528.png>)

题目photos提示有多个图片。可能是叠在一起了。

 binwalk和foremost并未提取出结果               

搜索FF D8 FF EE 出现三个结果。

![](<2025 NSSCTF/file-20260331130228553.png>)

把另外两个图片复制出来保存。

![](<2025 NSSCTF/file-20260331130228509.png>)

![](<2025 NSSCTF/file-20260331130228491.png>) 

这里很坑，明明写得像SOME结果说是S0ME。看来该leet还得leet。        

sdctf{FFD8_th3n_S0ME_s7uff_FFD9}

## 4.Pwn

### [WUSTCTF 2020]getshell2 
#### #栈溢出 #ret2syscall #栈
附件：service

题目环境：

直接file+checksec

![](<2025 NSSCTF/file-20260331130228790.png>)

只开启了栈不可执行，应该是栈溢出题目。

使用ROPgadget

![](<2025 NSSCTF/file-20260331130228771.png>)

找到了sh地址：0x08048670 

直接写死：sh_addr = 0x08048670

![](<2025 NSSCTF/file-20260331130228763.png>)





栈溢出（Stack Overflow） 漏洞：

+ 程序执行完一个函数后，会跳回它被调用的地方，即返回地址（存于栈上）
+ 当攻击者输入超长数据后,会覆盖返回地址（Return Address）

![](<2025 NSSCTF/file-20260331130228754.png>)

+ `gets()`、`strcpy()` 等属于没有边界检查的函数。

🛠️ 六、完整攻击流程

1. **连接远程服务**
2. **p = remote('ip', port)**

**构造 payload**

    - 填充 28 字节到返回地址位置
    - 覆盖返回地址为 `system`
    - 提供 fake return 和 `"sh"` 地址
3. **发送 payload**

```plain
Python

编辑


1p.sendline(payload)
```

4. **进入交互模式，输入命令**

```plain
Python

编辑


1p.interactive()  # 之后你就可以输入 ls, cat flag.txt 等
```

Q1: 为什么不用 `"/bin/sh"`，而用 `"sh"`？

很多题目为了简化，只放了 `"sh"`。

在 Linux 中，`system("sh")` 和 `system("/bin/sh")` 效果几乎一样，都能弹 shell。

Q2: `0xdeadbeef` 是什么？会 crash 吗？

它只是一个“占位符”，表示“随便填个地址”。

只要你在 `system` 返回前已经拿到 shell，程序是否 crash 都不影响你读 flag。

Q3: 为什么偏移是 28（0x18+4）？

`0x18 = 24` 字节是 buffer 大小

`+4` 是 saved ebp（旧的栈基址指针）

总共 28 字节后，才是返回地址

## 5.Reverse

### [BJDCTF_2020]Easy

附件：easy.exe

无壳程序，直接分析即可

![](<2025 NSSCTF/file-20260331130230842.png>)


# 第二轮
## 1.Crypto

### [SWPUCTF 2021 新生赛]traditional
#### #古典密码 #其他
> 题目：
>
> 西方的二进制数学的发明者莱布尼茨，从中国的八卦图当中受到启发，演绎并推论出了数学矩
>
> 阵，
>
> 最后创造的二进制数学。二进制数学的诞生为计算机的发明奠定了理论基础。而计算机现在改
>
> 变
>
> 了我们整个世界，改变了我们生活，而他的源头却是来自于八卦图。现在，给你一组由八卦图
>
> 方位
>
> 组成的密文，你能破解出其中的含义吗？
>
>  震坤艮 震艮震 坤巽坤 坤巽震 震巽兑 震艮震 震离艮 震离艮
>
>  格式：NSSCTF{}
>

![](<2025 NSSCTF/file-20260331130228334.jpeg>)![](<2025 NSSCTF/file-20260331130228324.jpeg>)

```python
#!/usr/bin/env python3
# coding=utf-8

# 精简版八卦密码解密脚本
# 核心思想：每个3卦组对应9位二进制，取最后8位作为ASCII字符

# 八卦符号到二进制的映射
bagua_map = {
    '坤': '000', '震': '001', '坎': '010', '兑': '011',
    '艮': '100', '离': '101', '巽': '110', '乾': '111'
}

# 密文
cipher = "震坤艮 震艮震 坤巽坤 坤巽震 震巽兑 震艮震 震离艮 震离艮"

def solve_bagua(ciphertext, mapping):
    # 初始化结果字符串
    result = ""
    
    # 按空格分割为3卦一组
    for group in ciphertext.split():
        # 将每个卦转换为二进制并拼接
        binary = ''.join([mapping[trigram] for trigram in group])
        # 取9位二进制的最后8位，转换为ASCII
        result += chr(int(binary[1:9], 2))
    
    return result

if __name__ == "__main__":
    flag = solve_bagua(cipher, bagua_map)
    print(f"NSSCTF&#123;&#123;{flag&#125;&#125;}")
```

NSSCTF{Da01sall}









```java
package com.example.crackme1;

import android.content.Context;
import android.os.Bundle;
import android.text.Editable;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class MainActivity extends AppCompatActivity {
    public boolean check(CharSequence paramCharSequence) {
        if (paramCharSequence.length() != 38)
            return false; 
        if (!paramCharSequence.subSequence(0, 5).toString().equals("flag{"))
            return false; 
        if (paramCharSequence.charAt(paramCharSequence.length() - 1) != '}')
            return false; 
        paramCharSequence = paramCharSequence.subSequence(5, paramCharSequence.length() - 1);
        StringBuilder stringBuilder = new StringBuilder();
        for (byte b = 0; b < paramCharSequence.length(); b += 4)
        stringBuilder.append(md5(paramCharSequence.subSequence(b, b + 4).toString())); 
        return !!stringBuilder.toString().equals("8393931a16db5a00f464a24abe24b17a9040b57d9cb2cbfa6bdc61d12e9b51f2789e8a8ae9406c969118e75e9bc65c4327fbc7c3accdf2c54675b0ddf3e0a6099b1b81046d525495e3a14ff6eae76eddfa1740cd6bd483da0f7684b2e4ec84b371f07bf95f0113eefab12552181dd832af8d1eb220186400c494db7091e402b0");
    }

    public String md5(String paramString) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.update(paramString.getBytes(StandardCharsets.UTF_8));
            byte[] arrayOfByte = messageDigest.digest();
            StringBuilder stringBuilder = new StringBuilder();
            this();
            int i = arrayOfByte.length;
            for (byte b = 0; b < i; b++) {
                byte b1 = arrayOfByte[b];
                if (Integer.toHexString(b1 & 0xFF).length() == 1) {
                    stringBuilder.append("0");
                    stringBuilder.append(Integer.toHexString(b1 & 0xFF));
                } else {
                    stringBuilder.append(Integer.toHexString(b1 & 0xFF));
                } 
            } 
            return stringBuilder.toString();
        } catch (Exception exception) {
            return "";
        } 
    }

    protected void onCreate(Bundle paramBundle) {
        super.onCreate(paramBundle);
        setContentView(2131427356);
        ((Button)findViewById(2131230808)).setOnClickListener(new View.OnClickListener() {
            public void onClick(View param1View) {
                Editable editable = flagInput.getText();
                if (MainActivity.this.check((CharSequence)editable)) {
                    Toast.makeText((Context)MainActivity.this, "Right!", 0).show();
                } else {
                    Toast.makeText((Context)MainActivity.this, "Wrong!", 0).show();
                } 
            }
        });
    }
}
```

1. ``check`` 方法是核心验证方法，它接受一个CharSequence参数并返回布尔值。
2. 方法首先检查输入长度是否为38个字符，如果不是则直接返回false。
3. 然后检查输入的前5个字符是否为"flag{"，如果不是则返回false。
4. 接着检查输入的最后一个字符是否为"}"，如果不是则返回false。
5. 然后从第5个字符开始到倒数第1个字符结束，每4个字符一组，对每组进行MD5哈希处理。
6. 最后将所有哈希结果拼接起来，与一个固定的字符串进行比较，如果相等则返回true，否则返回false。  
这个固定的字符串是：`8393931a16db5a00f464a24abe24b17a9040b57d9cb2cbfa6bdc61d12e9b51f2789e8a8ae9406c969118e75e9bc65c4327fbc7c3accdf2c54675b0ddf3e0a6099b1b81046d525495e3a14ff6eae76eddfa1740cd6bd483da0f7684b2e4ec84b371f07bf95f0113eefab12552181dd832af8d1eb220186400c494db7091e402b0`

法一：hashcat掩码?a?a?a?a分组爆破。    

    "8393931a16db5a00f464a24abe24b17a",

    "9040b57d9cb2cbfa6bdc61d12e9b51f2",

    "789e8a8ae9406c969118e75e9bc65c43",

    "27fbc7c3accdf2c54675b0ddf3e0a609",

    "9b1b81046d525495e3a14ff6eae76edd",

    "fa1740cd6bd483da0f7684b2e4ec84b3",

    "71f07bf95f0113eefab12552181dd832",

    "af8d1eb220186400c494db7091e402b0"

```python
import hashlib
import itertools

# 目标MD5哈希值，分成8组，每组32个字符
target_hashes = [
    "8393931a16db5a00f464a24abe24b17a",
    "9040b57d9cb2cbfa6bdc61d12e9b51f2",
    "789e8a8ae9406c969118e75e9bc65c43",
    "27fbc7c3accdf2c54675b0ddf3e0a609",
    "9b1b81046d525495e3a14ff6eae76edd",
    "fa1740cd6bd483da0f7684b2e4ec84b3",
    "71f07bf95f0113eefab12552181dd832",
    "af8d1eb220186400c494db7091e402b0"
]

# 可能的字符集（假设是ASCII可打印字符）
charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

# 暴力破解4个字符的MD5哈希值
def crack_md5(target_md5, charset):
    # 生成所有4个字符的组合
    for chars in itertools.product(charset, repeat=4):
        text = ''.join(chars)
        md5_hash = hashlib.md5(text.encode()).hexdigest()
        if md5_hash == target_md5:
            return text
    return None

# 破解所有MD5哈希值
flag_parts = []
for i, target_md5 in enumerate(target_hashes):
    print(f"破解第{i+1}组MD5: {target_md5}")
    part = crack_md5(target_md5, charset)
    if part:
        print(f"  找到: {part}")
        flag_parts.append(part)
    else:
        print(f"  未找到")

# 拼接flag
if len(flag_parts) == 8:
    flag = "flag{" + ''.join(flag_parts) + "}"
    print(f"\n找到flag: {flag}")
else:
    print(f"\n只找到{len(flag_parts)}组，无法拼接完整flag")
```

分析过程：

1. 解压crackme1.apk，得到dex文件和其他资源文件
2. 使用dex2jar工具将classes.dex、classes2.dex和classes3.dex转换为JAR文件
3. 发现MainActivity类位于classes3-dex2jar.jar文件中
4. 使用javap工具查看MainActivity类的反编译代码，分析了check方法的逻辑
5. 编写Python脚本crack_flag.py，暴力破解了每组4个字符的MD5哈希值
6. 成功破解了所有8组MD5哈希值，得到了flag

NSSCTF{4aea146e9dc7365e4ec931f547284822}

## 2.Web

### [SWPUCTF 2021 新生赛]easy_md5
#### #弱比较 #PHP #数组绕过
![](<2025 NSSCTF/file-20260331130228456.png>)

```php
<?php #PHP代码的起始标记，表示后续是PHP代码。
  highlight_file(__FILE__);
#highlight_file() 函数会将文件内容以语法高亮的形式输出到页面，方便用户查看源码。
#__FILE__ 是PHP预定义常量，表示当前文件路径
include 'flag2.php';
#包含外部文件 ， flag2.php 中定义了 $flag 变量（存储着我们要获取的flag）
#通过 include 可以在当前文件中访问这个变量。
if (isset($_GET['name']) && isset($_POST['password'])){ 
#检查请求参数 ：判断URL中是否存在 name （GET参数）和表单中是否存在 password （POST参数）。 
#isset() 函数用于检查变量是否已设置且不为NULL。
  $name = $_GET['name'];
  #获取GET参数 ：将URL中传递的 name 参数值赋给 $name 变量。
  #例如： ?name=abc 会将 $name 设为 abc
  $password = $_POST['password'];
  #获取POST参数 ：将表单中传递的 password 参数值赋给 $password 变量。
  if ($name != $password && md5($name) == md5($password)){
#核心条件判断 ： 1. $name != $password ：要求 name 和 password 的值 不相等 ；
#2. md5($name) == md5($password) ：要求 name 和 password 的 MD5哈希值相等 ； 
#“&&”表示合取。两个条件需同时满足
    echo $flag;#输出 flag2.php 中定义的 $flag 变量
  else {
    echo "wrong!";
  }

}
else {
  echo 'wrong!';
}
?>
```

![](<2025 NSSCTF/file-20260331130228500.png>)

EXECUTE

![](<2025 NSSCTF/file-20260331130228518.png>)

### 漏洞原理
+ 当PHP的 md5() 函数接收 数组 时，会返回 NULL
+ md5(array('1')) == md5(array('2')) 结果为 true （都返回 NULL ）
+ 但 array('1') != array('2') 结果也为 true （不同的数组实例）
+ 因此满足条件 $ name !=  $password && md5($ name) == md5( $password)

### 核心漏洞原理
+ 当PHP的 md5() 函数接收 数组 作为参数时，会返回 NULL （而不是报错）。
+ 例如： md5(array('1')) 和 md5(array('2')) 都会返回 NULL 。
+ 因此： md5(array('1')) == md5(array('2')) 结果为 true （因为两个都返回 NULL ）。
+ 但 array('1') != array('2') 结果也为 true （因为它们是 不同的数组实例 ）。
+ 这就满足了核心条件： $ name !=  $password && md5($ name) == md5( $password) 。

### 为什么用数组可以绕过？
+ GET参数传 name[]=1 ：表示 $name 是一个 数组 ，值为 array('1') 。
+ POST参数传 password[]=2 ：表示 $password 是一个 数组 ，值为 array('2') 。
+ array('1') != array('2') → true （不同数组实例）。
+ md5(array('1')) == md5(array('2')) → true （都返回 NULL ）。
+ 因此条件成立，输出 flag 。

### 总结
这个题目利用了PHP md5() 函数处理数组时的 特殊行为 （返回NULL），通过构造不同的数组参数，绕过了“值不同但MD5相同”的条件，从而获取到flag。这是Web安全中经典的 类型混淆漏洞 。





## 3.Misc

### [西湖论剑 2022]mp3
#### #Misc文件 #隐写音频 #隐写
1. 把需要分析的mp3文件拖到MP3stego所在目录

![](<2025 NSSCTF/file-20260331130228481.png>)

2. Decode.exe -X cipher.mp3

![](<2025 NSSCTF/file-20260331130228472.png>)

## 4.Pwn

### [WUSTCTF 2020]getshell2 
#### #栈溢出 #ret2syscall #栈
附件：service

题目环境：

直接file+checksec

![](<2025 NSSCTF/file-20260331130228790.png>)

只开启了栈不可执行，应该是栈溢出题目。

使用ROPgadget

![](<2025 NSSCTF/file-20260331130228771.png>)

找到了sh地址：0x08048670 

直接写死：sh_addr = 0x08048670

![](<2025 NSSCTF/file-20260331130228763.png>)





栈溢出（Stack Overflow） 漏洞：

+ 程序执行完一个函数后，会跳回它被调用的地方，即返回地址（存于栈上）
+ 当攻击者输入超长数据后,会覆盖返回地址（Return Address）

![](<2025 NSSCTF/file-20260331130228754.png>)

+ `gets()`、`strcpy()` 等属于没有边界检查的函数。

🛠️ 六、完整攻击流程

1. **连接远程服务**
2. **p = remote('ip', port)**

**构造 payload**

    - 填充 28 字节到返回地址位置
    - 覆盖返回地址为 `system`
    - 提供 fake return 和 `"sh"` 地址
3. **发送 payload**

```plain
Python

编辑


1p.sendline(payload)
```

4. **进入交互模式，输入命令**

```plain
Python

编辑


1p.interactive()  # 之后你就可以输入 ls, cat flag.txt 等
```

Q1: 为什么不用 `"/bin/sh"`，而用 `"sh"`？

很多题目为了简化，只放了 `"sh"`。

在 Linux 中，`system("sh")` 和 `system("/bin/sh")` 效果几乎一样，都能弹 shell。

Q2: `0xdeadbeef` 是什么？会 crash 吗？

它只是一个“占位符”，表示“随便填个地址”。

只要你在 `system` 返回前已经拿到 shell，程序是否 crash 都不影响你读 flag。

Q3: 为什么偏移是 28（0x18+4）？

`0x18 = 24` 字节是 buffer 大小

`+4` 是 saved ebp（旧的栈基址指针）

总共 28 字节后，才是返回地址

## 5.Reverse

### [SEETF 2022]Magic 
#### #反调试 #REVERSE
题目描述：There might be a hidden gate to the magical land of flags...

![](<2025 NSSCTF/file-20260331130228709.png>)

默认值：

![](<2025 NSSCTF/file-20260331130228691.png>)

```plain
int __cdecl __noreturn main(int argc, const char **argv, const char **envp)
{
  _OWORD v3[2]; // [esp-C0h] [ebp-CCh] BYREF
  __int64 v4; // [esp-A0h] [ebp-ACh]
  int v5; // [esp-98h] [ebp-A4h]
  char v6[3]; // [esp-94h] [ebp-A0h] BYREF
  int v7; // [esp+4h] [ebp-8h]
  int retaddr; // [esp+Ch] [ebp+0h]

  v7 = retaddr;
  v5 = 1725917800;
  v3[0] = xmmword_403148;
  strcpy(v6, "h6");
  v3[1] = xmmword_403158;
  v4 = 0x7CE4457476DB4268i64;
  ((void (__thiscall __noreturn *)(_OWORD *))sub_401290)(v3);
```

重新用ida32打开magic.exe，进入`内核选项 kernel options`，**取消勾选** `进行"无返回"分析 perform no-return analysis`，这样分析`main` 函数内容会更完整。  ![](<2025 NSSCTF/file-20260331130228673.png>)

操作后：

```plain
int __cdecl main(int argc, const char **argv, const char **envp)
{
  int v3; // ebp
  char v4; // di
  int v5; // ecx
  FILE *v6; // eax
  int i; // edi
  DWORD TickCount; // eax
  HKEY v10; // [esp-13Ch] [ebp-148h] BYREF
  DWORD v11; // [esp-138h] [ebp-144h] BYREF
  __int16 v12; // [esp-134h] [ebp-140h]
  _OWORD v13[4]; // [esp-130h] [ebp-13Ch] BYREF
  char v14[24]; // [esp-F0h] [ebp-FCh] BYREF
  BYTE v15[24]; // [esp-D8h] [ebp-E4h] BYREF
  _OWORD v16[2]; // [esp-C0h] [ebp-CCh] BYREF
  __int64 v17; // [esp-A0h] [ebp-ACh]
  int v18; // [esp-98h] [ebp-A4h]
  char v19[3]; // [esp-94h] [ebp-A0h] BYREF
  _OWORD v20[2]; // [esp-90h] [ebp-9Ch] BYREF
  __int16 v21; // [esp-70h] [ebp-7Ch]
  char v22; // [esp-6Eh] [ebp-7Ah]
  _OWORD v23[2]; // [esp-54h] [ebp-60h] BYREF
  __int16 v24; // [esp-34h] [ebp-40h]
  __int128 v25; // [esp-30h] [ebp-3Ch] BYREF
  int v26; // [esp-20h] [ebp-2Ch]
  char v27; // [esp-1Ch] [ebp-28h]
  char v28[12]; // [esp-18h] [ebp-24h] BYREF
  int v29; // [esp-Ch] [ebp-18h] BYREF
  __int16 v30; // [esp-8h] [ebp-14h]
  int v31; // [esp+0h] [ebp-Ch]
  int v32; // [esp+4h] [ebp-8h]
  int retaddr; // [esp+Ch] [ebp+0h]

  v31 = v3;
  v32 = retaddr;
  v18 = 1725917800;
  v16[0] = xmmword_403148;
  strcpy(v19, "h6");
  v16[1] = xmmword_403158;
  v17 = 0x7CE4457476DB4268i64;
  sub_401290(v16);
  RegOpenKeyExA(HKEY_LOCAL_MACHINE, (LPCSTR)v16, 0, 0x101u, &v10);
  v29 = 1741189973;
  v30 = 96;
  sub_401290(&v29);
  v11 = 21;
  if ( RegQueryValueExA(v10, (LPCSTR)&v29, 0, 0, v15, &v11) )
    return -1;
  v12 = 20;
  sub_401170(v14);
  v26 = -405287383;
  v25 = xmmword_4031F0;
  v27 = 0;
  if ( strncmp(v14, (const char *)&v25, 0x14u) )
    return -1;
  v13[0] = xmmword_4031B0;
  v13[1] = xmmword_4031D0;
  v13[2] = xmmword_4031C0;
  v13[3] = xmmword_4031E0;
  sub_4012F0(v13, v15, v5);
  sub_4011D0("%s", (char)v13);
  v6 = _acrt_iob_func(0);
  fgets(v28, 9, v6);
  if ( !atoi(v28) )
  {
    sub_4011D0("nope", v4);
    return -1;
  }
  if ( sub_401360(v28) == -1339812568 )
  {
    if ( IsDebuggerPresent() )
      goto LABEL_13;
    v21 = 5692;
    v20[0] = xmmword_40318C;
    v22 = 0;
    v20[1] = xmmword_40319C;
    sub_401290(v20);
    sub_4011D0("%s", (char)v20);
    for ( i = 0; i < 8; ++i )
    {
      TickCount = GetTickCount();
      v28[i] -= 10;
      if ( GetTickCount() - TickCount > 0x5DC )
        goto LABEL_13;
    }
    v23[0] = xmmword_403200;
    v23[1] = xmmword_403210;
    v24 = -10010;
    sub_401170(v23);
    if ( IsDebuggerPresent() )
LABEL_13:
      ExitProcess(0xFFFFFFFF);
    sub_4011D0("%s", (char)v23);
    return 0;
  }
  else
  {
    sub_4011D0("nope", v4);
    return 0;
  }
}
```

原因：

部分函数直接调用 `ExitProcess` 退出而不返回，以阻碍动调。ida识别后认为是结束点，就不分析 `main` 函数剩下的代码了。

