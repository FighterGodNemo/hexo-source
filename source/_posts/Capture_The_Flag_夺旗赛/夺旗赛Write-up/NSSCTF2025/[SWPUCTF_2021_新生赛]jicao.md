---
title: "[SWPUCTF_2021_新生赛]jicao"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- NSSCTF2025
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

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">要让程序输出 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">$flag</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">，必须同时满足：</font>

1. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">POST 参数</font>****<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">id</font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>****<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">的值为</font>****<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">"wllmNB"</font>**`
2. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">GET 参数 </font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">json</font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 是一个合法的 JSON 字符串，且解析后是一个数组，其中键 </font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">'x'</font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 的值为 </font>**`**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">"wllm"</font>**`
3. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">使用 URL 编码，避免任何歧义</font>**

```php
curl -X POST "http://node7.anna.nssctf.cn:27541/index.php?json=%7B%22x%22%3A%22wllm%22%7D" -d "id=wllmNB"
```

![](1764333513217-cc6c2ca7-1019-43f2-a84c-85f381ef214e.png)NSSCTF{5e3b5793-b1f6-488a-bac4-53e9c4889ed7}


