---
created: 2026-11-24T18:59
updated: 2026-11-24T19:11
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
