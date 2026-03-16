---
title: "焚靖（Fenjing）"
date: 2026-03-15 13:28:18
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- 上海awdp赛前培训
- 沙盒攻防赛
- 工具
---

焚靖（Fenjing）是面向 CTF 的 Jinja2 SSTI 自动化绕 WAF 工具，会自动分析 WAF 并生成/尝试 payload，支持表单、HTTP 路径、GET 参数等场景

Fuzz（模糊测试）：用大量“变形输入”去试探一个功能，看看它会不会出错或暴露异常行为。可以理解为“用各种奇怪的输入去撞”。

WAF（Web Application Firewall）：网站前面的“防火墙”，专门拦截看起来像攻击的请求（比如包含敏感关键词、异常参数等）。

怎么判断题目有 WAF（高层判断）

1. 访问行为异常
    - 正常请求 OK，但某些输入一旦出现就变成 403/406/429 或直接被重定向
    - 页面提示“Access Denied / Request blocked / Forbidden / 被拦截”等字样
2. 出现验证或挑战页面
    - 要你过验证码
    - 自动跳转到“安全检查”
    - 带“请开启 JavaScript / 浏览器验证”的页面
3. 响应头暗示
    - 头里出现 WAF/CDN 相关标识（如特定厂商字段或 cf- 之类的标识）
4. 源码里有黑名单或过滤逻辑
    - 题目直接写了“关键字拦截”或用正则过滤



SSTI（Server-Side Template Injection）：服务端模板注入漏洞。模板引擎（如 Jinja2）本来只渲染变量，如果把用户输入当成  
模板执行，就可能导致代码执行或信息泄露。

Payload（载荷）：攻击中“真正发挥作用的那段输入”。例如触发漏洞的关键字符串或请求内容。





