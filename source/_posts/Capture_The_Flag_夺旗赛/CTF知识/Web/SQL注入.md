---
title: SQL注入
date: "2026-03-15 13:28:16"
categories:
  - Capture_The_Flag_夺旗赛
  - CTF知识
  - Web
tags:
  - CTF
  - CTF知识
  - Web
  - SQL注入
created: "2026-03-15T16:49"
updated: "2026-03-18T09:42"
---

SQL（Structured Query Language）结构化查询语言，是一种关系型数据库查询的标准编程语言，用于存取数据以及查询、更新、删除和管理关系型数据库（即SQL是一种数据库查询语言）

SQL 注入（SQL Injection）是一种常见的 Web 攻击方式，攻击者通过构造恶意 SQL 语句，将其注入到应用程序中，从而操纵数据库执行非授权操作。

原理：web应用程序在接收相关数据参数时未做好过滤，将其直接带入到数据库中查询，导致攻击者可以拼接执行构造的SQL语句。

SQLmap

