---
title: "Pwn攻防实战课程讲义"
date: 2026-03-15 13:28:18
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- 上海awdp赛前培训
- 沙盒攻防赛
---

Break & Fix  
Break  等同于  CTF解题赛  
Fix       修复程序使得主办方的exp不成功 ，同时要能够通过平台的check  
需要提交`patch.tar.gz`

赛前注意关注一下比赛手册  
了解得分机制，一般策略是尽早轮次得分 ，一般修复要比利用更简单更快

##### 打包
`tar czvf patch.tar.gz patch.sh patch_ok`

```bash
#!/bin/bash
cp patch_ok /home/ctf/challenge/login
```

#### check主要逻辑
不同出题人、不同平台方check的逻辑思路不同，所以有些时候是要看运气的  
常见的check思路  
1、检测程序正常功能的交互  
2、检测文件大小是否被修改 （确保文件没变）  
3、限制修改的范围  
4、限制修改的字节数  
5、针对恶意修复检测  
... ...

#### fix
##### ida-keypatch
###### stack_overflow
1、修改size  
2、调整栈位置  
3、scanf("%s",buf) ---> scanf("%ns",buf)  或者 改成read(0,buf,size)

###### fmt
1、printf--->puts         `_printf  --> _puts`   会多一个`\n`  
        2024-anime  
2、加参数%s     0x25 0x73 0x00  
A- 在`.eh_frame`写入想要执行的代码，将原函数位置改成 `jmp  eh_frame`  
        需要注意将LOAD中EH_FRAME的Flags改为7  
        2024-anime  
    B- 在原函数调用前用更短的代码实现原功能，从而节省出足够长度写入新内容  
        2024-anime  
        mov rax,0 ==> xor rax,rax  甚至 xor eax,eax  
        mov rax,rbx ==> mov eax,ebx  |  push rbx；pop rax  |  xchg rax,rbx  
        jmp offset  ==>  jmp short offset  
3、snprintf  参数顺序问题  
2025-typo  (利用角度在堆溢出)

```c
int snprintf ( char * str, size_t size, const char * format, ... );

正确参数案例：snprintf(buffer, 6, "%s", s);
错误参数案例：snprintf(buffer, "%s", s, 6);
    "%s"是传入字符串地址，这个地址会被解析为size，

printf("%s",buf)
sprintf(adr,"%s",buf)
snprintf(adr,n,"%s",buf)
```

###### 整数溢出
调整jmp指令  
nsctf_online_2019_pwn1

| 无符号跳转指令 | 描述 | 有符号跳转指令 | 描述 |
| --- | --- | --- | --- |
| JA | 无符号大于则跳转 | JG | 有符号大于则跳转 |
| JNA | 无符号不大于则跳转 | JNG | 有符号不大于则跳转 |
| JAE | 无符号大于等于则跳转（同JNB） | JGE | 有符号大于等于则跳转（同JNL） |
| JNAE | 无符号不大于等于则跳转（同JB） | JNGE | 有符号不大于等于则跳转（同JL） |
| JB | 无符号小于则跳转 | JL | 有符号小于则跳转 |
| JNB | 无符号不小于则跳转 | JNL | 有符号不小于则跳转 |
| JBE | 无符号小于等于则跳转（同JNA） | JLE | 有符号小于等于则跳转（同JNG） |
| JNBE | 无符号不小于等于则跳转（同JA） | JNLE | 有符号不小于等于则跳转（同JG） |


###### 堆
1、check不严谨可直接 nop free

2、UAF --> free后添加置空  
    A- 在`.eh_frame`写入想要执行的代码，将原函数位置改成 `jmp  eh_frame`  
    B- 在原函数调用前用更短的代码实现原功能，从而节省出足够长度写入新内容  
        2023_notepad

3、堆溢出 --> 调整写入时的size 或者 调整malloc申请时的大小   
        prompt

###### 奇奇怪怪
1、alarm  
通常程序的alarm时间较长，可以测试进行一次操作的时间大概多久，比如5次操作需要2秒，正常程序运行需要几次操作，多留1次的时间大致就行，例如设置为alarm(3)，这样限制多次操作也能修复程序。

2、patch指令限制

3、`exit()`退出的堆题，可以尝试把`exit()`改成`_exit()`

##### AwdPwnPatcher
用脚本替代手动patch，可以不用但不能没有



#### 通防 - evilPatcher
大概率没用，小概率有效

