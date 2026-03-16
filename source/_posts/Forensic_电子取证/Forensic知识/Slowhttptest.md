---
title: "Slowhttptest"
date: 2026-03-15 13:28:28
categories:
- Forensic_电子取证
- Forensic知识
---

[<font style="color:rgb(64, 81, 181);">Slowhttptest</font>](https://github.com/shekyan/slowhttptest)<font style="color:rgba(0, 0, 0, 0.87);">是依赖HTTP协议的慢速攻击DoS攻击工具，设计的基本原理是服务器在请求完全接收后才会进行处理，如果客户端的发送速度缓慢或者发送不完整，服务端为其保留连接资源池占用，大量此类请求并发将导致DoS。</font>

