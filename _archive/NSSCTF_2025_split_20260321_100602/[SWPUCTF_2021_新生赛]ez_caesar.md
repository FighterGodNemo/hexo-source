---
title: "[SWPUCTF_2021_新生赛]ez_caesar"
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - NSSCTF2025
created: 2026-03-15T16:49
updated: 2026-03-21T09:29
---

#凯撒密码 #Base家族 #古典密码

```python
import base64
def caesar(plaintext):
    str_list = list(plaintext)
    i = 0
    while i < len(plaintext):
        if not str_list[i].isalpha():
            str_list[i] = str_list[i]
        else:
            a = "A" if str_list[i].isupper() else "a"
            str_list[i] = chr((ord(str_list[i]) - ord(a) + 5) % 26 + ord(a) or 5)
        i = i + 1

    return ''.join(str_list)

flag = "*************************"
str = caesar(flag)
print(str)

#str="U1hYSFlLe2R0em1mYWpwc3RiaGZqeGZ3fQ=="
```

![]([SWPUCTF_2021_新生赛]ez_caesar/1765803938928-56ddeac8-e009-4099-ba34-f8f2c9a89191.png)NSSCTF{youhaveknowcaesar}


