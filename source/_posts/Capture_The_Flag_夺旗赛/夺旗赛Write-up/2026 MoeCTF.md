---
created: 2026-11-24T18:59
updated: 2026-11-24T19:58
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



