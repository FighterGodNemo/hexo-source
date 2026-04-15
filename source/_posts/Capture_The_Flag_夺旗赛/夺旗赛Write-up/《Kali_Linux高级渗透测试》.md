---
title: 《Kali Linux高级渗透测试》
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/《Kali_Linux高级渗透测试》/
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
tags:
  - CTF
  - WriteUp
  - 读书笔记
  - Kali
  - Linux
  - 渗透测试
created: 2026-03-15T16:49
updated: 2026-04-15T13:54
---

# 第一章 基于目标的渗透测试
+ 动态主机配置协议（Dynamic Host Configuration Protocol，DHCP）

Kali默认不启用DHCP服务。启用会在全网广播新的IP地址。从而可能让管理员意识到测试者的存在。

安全外壳协议（Secure Shell，SSH）使用前必须启用。

Kali预先配置了默认的SSH密钥。启用前最好弃用默认密钥，并产生一个唯一的密钥集。

`service ssh status`查看SSH服务是否正在运行。

通过`dpkg-reconfigure openssh-server`可以将默认的SSH密钥移动到备份文件，然后生成新的密钥集。

注意：启用SSH默认配置就无法使用超级用户登录。如果需要，必须编辑/etc/ssh/sshd_config文件，并将PermitRootLogin设置为yes，保存然后退出。

OSINT指的是从公共的资源，特别是互联网上，进行信息收集。可用的信息是相当多的——大多数的情报机构和军事组织正积极地在OSINT中收集信息，并防止自身数据泄露。

进攻型OSINT

域名（Domain name）：在外部场景中识别攻击者或渗透测试人员的目标是通过域名开始的。

DNS侦察和路由映射（DNS reconnaissance and route mapping）

2.1.3 利用Sublist3r收集资料

这是一个基于Python的工具。用于域捕获，即利用OSINT枚举主域名的所有子域名。

Maltego

1.在Paterva创建一个账户。

2.点击Maltego CE（Free）

3.账户登录

4.点击Finish

OSRFramework

+ usufy：
+ searchfy：
+ mailfy：识别关键字并自动在关键字后添加电子邮件域名，然后自动以API调用的形式在haveibeenpawned.com中搜索

Web archives

网页虽然删除，但可能在Google中可能保留。

2.1.8 收集用户和电子邮件地址

theHarvester 工具是一个Python脚本，可以借助流行的搜索引擎和其他一些站点来搜索电子邮件地址、主机以及子域站点等。

Shodan.io搜索引擎。

2.2.4 防守型OSINT

1.暗网

暗网（Dark Web）是Tor服务器及其客户端之间存在的加密网络，而深网
