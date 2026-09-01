---
title: Base64编码隐藏
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/CTFshow/Web应用安全与防护/
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - CTFshow
tags:
  - CTF
  - WriteUp
  - CTFshow
  - Base64
  - 编码
created: 2026-03-15T16:49
updated: 2026-09-01T12:34
---
## Base64编码隐藏
![](Web应用安全与防护/file-20260331130229538.png)![](Web应用安全与防护/file-20260331130229549.png)![](Web应用安全与防护/file-20260331130229558.png)
平时只知道解码，不知道base怎么来的。这里找了一个base64的具体过程：
![](Web应用安全与防护/file-20260503085909217.png)
CTF{easy_base64}
## HTTP头注入

![](Web应用安全与防护/file-20260503085457877.png)
![](Web应用安全与防护/file-20260503095205581.png)![](Web应用安全与防护/file-20260503095232605.png)密码：CTF{easy_base64}
![](Web应用安全与防护/file-20260503095326907.png)
修改UA为ctf-show-brower
![](Web应用安全与防护/file-20260503100326252.png)
![](Web应用安全与防护/file-20260503100344736.png)
CTF{user_agent_inject_success}
## Base64多层嵌套解码
![](Web应用安全与防护/file-20260901122155791.png)

![](Web应用安全与防护/file-20260901122739072.png)
```
    document. getElementById('loginForm').addEventListener('submit', function(e) {
    const correctPassword = "SXpVR1F4TTFVe1JtdFNSazB3VTJ4U1UwNXFSWGRVV1ZrOWNWYzU=";
    function validatePassword(input){
	    let encoded = btoa(input);
	    encoded = btoa(encoded + 'xH7jK').slice(3);
	    encoded = btoa(encoded.split('').reverse(). join(''));
	    encoded = btoa('aB3' + encoded + 'qW9'). substr(2);
	    return btoa(encoded) === correctPassword;
    }
    const enteredPassword = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    if (!validatePassword (enteredPassword)){
	    e. preventDefault();
	    messageElement. textContent = "Login failed! Incorrect password.";
	    messageElement. className = "message error";
    }
    });

```
