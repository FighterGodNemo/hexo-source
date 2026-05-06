---
created: 2026-05-06T12:59
updated: 2026-05-06T13:36
title: BugKu CTF
tags:
  - CTF
---
## Web
### 你必须让他停下
描述:你必须让他停下
![](<BugKu CTF/file-20260506130234077.png>)
题目的网页不断刷新，停不下来。偶尔闪出一个包含CTF的页面。
我们需要用插件禁用JavaScript。成功阻止自动刷新。
然后手动刷新到目标页面：
![](<BugKu CTF/file-20260506130039690.png>)
Ctrl+U 查看源代码即可
![](<BugKu CTF/file-20260506130118107.png>)
### GET
![](<BugKu CTF/file-20260506131040736.png>)
参数是what，值为flag则输出答案。
![](<BugKu CTF/file-20260506131252292.png>)
### POST
![](<BugKu CTF/file-20260506131353984.png>)
这次变成了post方法。使用HackBar
![](<BugKu CTF/file-20260506131447800.png>)
### source
描述:我哥说渗透我只用linux环境
![](<BugKu CTF/file-20260506131651885.png>)
http://171.80.2.169:16167/.git/
发现.git泄露了。
![](<BugKu CTF/file-20260506132810147.png>)这里直接使用githack：
![](<BugKu CTF/file-20260506132901938.png>)
![](<BugKu CTF/file-20260506132958899.png>)仅仅下载了两个文件，其中一个是假flag。wget