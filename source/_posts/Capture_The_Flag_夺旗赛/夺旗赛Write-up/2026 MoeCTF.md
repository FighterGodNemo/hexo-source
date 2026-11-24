---
created: 2026-11-24T18:59
updated: 2026-11-24T20:24
title: 2026 MoeCTF
---
# 从此开始

## 1 签到

moectf{welcome-to-moectf-2026}

## 2-1 如何连接在线环境？

```
很高兴能看到你来参加 MoeCTF 2026。我是本次比赛的运维同学，接下来我们通过几道题来熟悉比赛平台的一些操作和常用工具的使用。你可能之前见过这个平台，也很有可能没见过。这些题目不是正式题目，仅供你熟悉在线环境的连接方法。

请你仔细阅读[题目连接指南](https://ctf.xidian.edu.cn/wiki/18)，用合适的方法连接本题的环境，使用浏览器打开就可以看到本题的flag。

后续很多方向的题目都要用到这种连接方法。若你通过此题，从此比赛尽是坦途。

演示视频：[https://www.bilibili.com/video/BV1CCNM6CEBc/](https://www.bilibili.com/video/BV1CCNM6CEBc/)

关于连接过程中更多细节问题的视频：[https://www.bilibili.com/video/BV1SxbC6LEBB/](https://www.bilibili.com/video/BV1SxbC6LEBB/)
```

![](2026%20MoeCTF/file-20261124190822976.png)

[GitHub加速下载代理 - 快速访问 GitHub 文件](https://gh-proxy.com/)

![](2026%20MoeCTF/file-20261124190936108.png)

![](2026%20MoeCTF/file-20261124190954788.png)
访问127.0.0.1:29278
![](2026%20MoeCTF/file-20261124190751125.png)
## 2-2 如何使用 nc 连接环境？

```
刚才我们学习使用了 wsrx，接下来我们尝试使用 netcat（又称 ncat、nc）软件来连接一些特殊的题目环境。nc 是一个很常用的工具，我们同样会在很多方向的题目中碰到它。当遇到一些题目的环境用浏览器打不开的时候，我们就需要尝试用 nc 来打开它。

请你仔细阅读[如何使用 netcat](https://ctf.xidian.edu.cn/wiki/13)这篇维基，并使用 nc 来连接本题环境。本题环境给的是 wsrx 链接怎么办？首先用 wsrx 将链接映射到本地，再用 nc 连接 wsrx 给出的地址。

演示视频：[https://www.bilibili.com/video/BV1CCNM6CEBc/](https://www.bilibili.com/video/BV1CCNM6CEBc/)
```

![](2026%20MoeCTF/file-20261124192849615.png)

![](2026%20MoeCTF/file-20261124192904323.png)

![](2026%20MoeCTF/file-20261124192941346.png)

## 2-3 如何使用 ssh 连接环境？

```
你已经学会了 wsrx 和 nc 的使用。最后，我们来了解一下 ssh 的连接方法，这个在「开发与运维基础」以及其他方向的部分题目会使用到。

我们的电脑应该都预装了 ssh。使用 Windows 和 Mac 系统的同学可以呼唤出命令提示符或终端工具，在其中可以敲命令。命令格式是`ssh 用户名@IP地址 -p 端口号`。若一个题目给了 ssh 环境，你使用 wsrx 将环境映射到 127.0.0.1:1145 端口，用户名是 moeops，那么可以敲`ssh moeops@127.0.0.1 -p 1145`登录。

这里给了一个 ssh 环境，试着登录一下吧。Flag 放置在`/tmp/flag`内，你在登录后的界面敲`cat /tmp/flag`就可以找到。（用户名`moeops`，密码`foo`）

那使用 Linux 的同学呢？别问了，我相信你肯定知道了。

好啦，我们关于环境连接方面的介绍就到这里结束了。你可以看看其他方向的题目，挑一个名字你看着感兴趣的做一做。新生赛的水不会深，不用担心呛到，敢游就是了。

演示视频：[https://www.bilibili.com/video/BV1CCNM6CEBc/](https://www.bilibili.com/video/BV1CCNM6CEBc/)

### 附录：ssh如何设置保活？

本次比赛提供的ssh服务端大部分没有配置保活机制，ssh连上放着一分钟自己就断连了，打断了思绪，非常恼人。如何设置保活机制呢？

使用 Windows 系统的同学可以使用文件管理器进入`%USERPROFILE%\.ssh`文件夹，修改或创建`config`文本文件（如果用记事本创建的话需要删掉`.txt`文件拓展名）。在里面加入

Host *    ServerAliveInterval 30    ServerAliveCountMax 3

这下连接不会因为长时间没操作而断开了。

要是我使用 Linux 呢？同样，我相信你搜集信息解决问题的能力。
```

![](2026%20MoeCTF/file-20261124195658022.png)
![](2026%20MoeCTF/file-20261124195840255.png)

## 3-1 C语言环境配置与基础语法

```
我们熟悉完题目环境的连接方法，“连接不上题目导致做不了题”将不再是解题的阻碍。接下来是从零开始的计算机之旅，负责不同方向出题的学长将带你了解编程语言、命令行以及计算机一些基础功能的使用。

直接获取本题flag？看看这段C语言代码，执行它？好像代码有点问题，改一改吧，然后执行就可以得到flag。

#include <studio.h>

int main() {
    unsigned char encrypted[] = "8:06!3.6x<&x4x34&!x4;1x=<2=x90#09x94;2 420(";
    unsigned char key = 0x55;
    for(int i = 0; encrypted[i]; i++) {
        encrypted[i] ^= key;
    }
    printf("%s\n", encrypted);
    return 0;
}


操作视频：[https://www.bilibili.com/video/BV1kY3E6XESG/](https://www.bilibili.com/video/BV1kY3E6XESG/)

## 环境配置

[https://sourceforge.net/projects/mingw-w64/files/](https://sourceforge.net/projects/mingw-w64/files/)

注册表打开方法：Win + R regedit

Path环境变量在注册表的位置：`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment`

任务管理器打开方法：Win + R taskmgr
```
![](2026%20MoeCTF/file-20261124202022788.png)
stdio全称standard input and output
![](2026%20MoeCTF/file-20261124202113873.png)

moectf{c-is-a-fast-and-high-level-language}

##   3-2 Python环境配置与基础语法

我们希望在此讲解 Python 的一些最基础的内容，方便你在后面做 CTF 题目的时候能得心应手。

想直接得到 flag？运行一下这个代码就行了，希望你读懂了这段代码。

```
import base64
i = 0
while i < 103: i += 1
print(f"moectf{{{base64.b64decode('cHl0aG9u').decode()}-{chr(i+2)}5-c0Ol}}")
```

操作视频：[https://www.bilibili.com/video/BV14kgC6fEYv/](https://www.bilibili.com/video/BV14kgC6fEYv/)

## 如何安装 Python？

请在官网的下载页面 [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/) 找到 Stable Releases 下载安装包，注意要把 Python 添加到 Path。

## 基础语法

### Hello World

```
print("Hello World")
```

### 基本数据类型及其运算

赋值，右值赋到左值

```
a = 1 # intb = 1.0 # floatc = "abc" # stringd = False # boolean
```

```
print(1 + 1)print(1 + 1.0)print(1 + "1") # this will raise TypeErrorprint("1" + 1) # this tooprint("1" + "1")
```

```
print(2 + 1)print(2 - 1)print(2 * 1)print(2 / 1)print(2 % 1)print(2 ** 1)print(3 // 2)
```

```
print(1 > 2)print(1 < 2)print(1 == 2)print(1 >= 2)
```

```
a = 1a += 1a -= 1a *= 2a /= 2
```

位运算符不讲

逻辑运算符 AND OR NOT

成员运算符 in, not in

字符串格式化

```
name = "Starwalking"age = 19 print(f"My name is {name}, I'm {age} years old") # f-stringprint("My name is {}, I'm {} years old".format(name, age)) # format
```

### 流程控制

```
if (1 == 1):    pass # do thiselif (2 == 1):    pass # wont go into itelse:    pass # too
```

```
for i in range(10):    print(i) # print nums from 0 to 9
```

```
while(1):    pass # always running this code blockpass # wont go outside
```

### 复合数据类型及其方法

List

```
a = [1, 2, 3, 4, 5] # this is a list of nums from 1 to 5a.append(6) # add 6 to the backa.pop() # delete the last num 6print(a[2]) # print the third element, caution, the third element
```

Tuple

```
a = (1, 2, 3)a.append(4) # this is a misktake, tuple cannot be editedb = (4,)c = a + b # but we can link two tuplesprint(a[1]) # print the second element, the same as List
```

Set 用的不是很多

```
a = {1, 2, 3, 4} # the same way we descibe a set in mathb = set([1, 2, 3, 4]) # or create from a Listc = set() # create a empty set, we cannot use {}print(1 in a)print(6 in a)d = a - b # differenced = a | b # uniond = a & b # intersectiond = a ^ b # symmetric difference
```

Dict 这个在网络请求处理json的时候用的比较多

```
a = {"key": "info"}print(a["key"])
```

### 函数

```
def add(a: int, b: int) -> int:    return a + b
```

类、对象、Pickle这些会在Web题当中出现，此处不讲。

### 依赖

Python有很多依赖，生态非常成熟。

```
import requests # import a libraryimport numpy as pd # rename a lib, just a kidding
```

有些依赖需要从网络中下载。

```
pip install requestspip install -r requirements.txt
```

### requests & flask

requests是一个用来发包的库。

```
import requestsa = requests.get("http://moectf.example") # sending a get requestprint(a.ok) # is request okdata = {"something": "somedata"}b = requests.post("http://moectf.example", json=data) # sending a post req with dataprint(b.text) # print response
```

关于 http 的请求类型请查阅 Web 方向入门指北，此处不赘述。

flask是一个轻量的后端库，可以用来创建一些简单的接口，在 Web 和 Devops 题目中可能用到。

```
from flask import Flaskapp = Flask(__name__)@app.get("/")def index():    return "Hello"if __name__ == "__main__":    app.run()
```

![](2026%20MoeCTF/file-20261124202321259.png)

moectf{python-i5-c0Ol}