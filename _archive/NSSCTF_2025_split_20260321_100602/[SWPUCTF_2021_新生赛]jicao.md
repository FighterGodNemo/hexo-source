---
title: "[SWPUCTF_2021_新生赛]jicao"
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - NSSCTF2025
created: 2026-03-15T16:49
updated: 2026-03-21T09:29
---

```php
<?php
  highlight_file('index.php');
include("flag.php");
$id=$_POST['id'];// 从 POST 请求中获取 id 参数
$json=json_decode($_GET['json'],true);// 从 GET 请求的 json 参数中解析 JSON 数据为数组
// 判断条件：
if ($id=="wllmNB"&&$json['x']=="wllm")
{echo $flag;}
  ?>
```

要让程序输出 `$flag`，必须同时满足：

1. **POST 参数**** **`**id**`** ****的值为**** **`**"wllmNB"**`
2. **GET 参数 **`**json**`** 是一个合法的 JSON 字符串，且解析后是一个数组，其中键 **`**'x'**`** 的值为 **`**"wllm"**`
3. **使用 URL 编码，避免任何歧义**

```php
curl -X POST "http://node7.anna.nssctf.cn:27541/index.php?json=%7B%22x%22%3A%22wllm%22%7D" -d "id=wllmNB"
```

![]([SWPUCTF_2021_新生赛]jicao/1764333513217-cc6c2ca7-1019-43f2-a84c-85f381ef214e.png)NSSCTF{5e3b5793-b1f6-488a-bac4-53e9c4889ed7}


