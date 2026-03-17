---
created: 2026-03-17T19:33
updated: 2026-03-17T19:33
---
管理员模式打开PowerShell输入以下命令：
```
Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\veracrypt' -Name 'VeraCryptEnableScreenProtection' -Value 0 -Type DWord
```
——贡献者mzj和他的好朋友claude
