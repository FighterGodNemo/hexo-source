---
created: 2026-11-18T10:55
updated: 2026-11-18T11:02
---
# Web

## 小佰的后台

Burpsuite爆破管理员id
1. 浏览器开代理，访问一次该请求，右键这条请求发送到攻击器Intruder

![](CTFPlus/file-20261118105657291.png)
![](CTFPlus/file-20261118105624655.png)
id后面数字就是攻击的参数，选择1添加载荷位置
![](CTFPlus/file-20261118110028022.png)
爆破后发现：
![](CTFPlus/file-20261118110113307.png)
id=250和其他账号长度不一样
![](CTFPlus/file-20261118110219978.png)