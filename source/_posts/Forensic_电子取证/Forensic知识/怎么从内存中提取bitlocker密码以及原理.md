---
title: 怎么从内存中提取bitlocker密码以及原理
date: 2026-03-15 13:28:28
categories:
  - Forensic_电子取证
  - Forensic知识
created: 2026-03-15T16:49
updated: 2026-03-18T09:45
---

<font style="color:rgb(15, 17, 21);">从内存中提取 BitLocker 密码是基于 </font>**<font style="color:rgb(15, 17, 21);">内存取证</font>**<font style="color:rgb(15, 17, 21);"> 的原理。以下是详细说明：</font>

## <font style="color:rgb(15, 17, 21);">提取原理</font>
### <font style="color:rgb(15, 17, 21);">1. 核心原理</font>
+ **<font style="color:rgb(15, 17, 21);">密钥常驻内存</font>**<font style="color:rgb(15, 17, 21);">：当 BitLocker 加密的驱动器被解锁并挂载时，加密密钥会一直保留在内存中</font>
+ **<font style="color:rgb(15, 17, 21);">冷启动攻击</font>**<font style="color:rgb(15, 17, 21);">：RAM 中的数据在断电后不会立即消失，可以维持数秒到数分钟</font>
+ **<font style="color:rgb(15, 17, 21);">内存转储</font>**<font style="color:rgb(15, 17, 21);">：通过物理访问或软件工具获取系统内存的完整副本</font>

### <font style="color:rgb(15, 17, 21);">2. 密钥在内存中的位置</font>
+ **<font style="color:rgb(15, 17, 21);">FVEK</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(Full Volume Encryption Key)：全卷加密密钥，用于实际的数据加解密</font>
+ **<font style="color:rgb(15, 17, 21);">VMK</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">(Volume Master Key)：卷主密钥，用于加密 FVEK</font>
+ **<font style="color:rgb(15, 17, 21);">TPM 状态</font>**<font style="color:rgb(15, 17, 21);">：如果使用 TPM，相关的验证数据也会在内存中</font>

## <font style="color:rgb(15, 17, 21);">提取方法</font>
### <font style="color:rgb(15, 17, 21);">方法1：使用 Volatility 框架</font>
#### <font style="color:rgb(15, 17, 21);">步骤1：获取内存转储</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 使用DumpIt工具获取内存转储
DumpIt.exe  # Windows环境下

# 或使用WinPmem
winpmem_minimal_x64_rc2.exe memory.dmp
```

#### <font style="color:rgb(15, 17, 21);">步骤2：使用 Volatility 分析</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 识别镜像信息
volatility -f memory.dmp imageinfo

# 搜索BitLocker相关密钥
volatility -f memory.dmp --profile=Win10x64_19041 bitlocker

# 提取BitLocker密钥
volatility -f memory.dmp --profile=Win10x64_19041 bitlocker -O bitlocker_keys.txt

# 搜索内存中的密码和密钥
volatility -f memory.dmp --profile=Win10x64_19041 yarascan -Y "bitlocker"
```

### <font style="color:rgb(15, 17, 21);">方法2：使用 Elcomsoft Forensic Disk Decryptor</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 使用EFDD直接处理内存转储
efdd --memory-dump=memory.dmp --output=keys.txt
```

### <font style="color:rgb(15, 17, 21);">方法3：手动搜索内存模式</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 使用hex编辑器搜索特定模式
hexdump -C memory.dmp | grep -i "FVEK"
strings memory.dmp | grep -i "bitlocker"
```

## <font style="color:rgb(15, 17, 21);">具体操作步骤</font>
### <font style="color:rgb(15, 17, 21);">完整工作流程</font>
<font style="color:rgb(15, 17, 21);">bash</font>

```plain
# 1. 获取内存转储（需要在目标系统上运行）
# 使用工具：DumpIt、WinPmem、Belkasoft RAM Capturer

# 2. 使用Volatility分析
volatility -f memory.dmp imageinfo
# 确定正确的profile，如：Win10x64_19041

# 3. 提取BitLocker密钥
volatility -f memory.dmp --profile=Win10x64_19041 bitlocker -O recovery_key.txt

# 4. 如果上述方法失败，尝试搜索内存模式
volatility -f memory.dmp --profile=Win10x64_19041 yarascan -Y "FVEK|VMK|BitLocker"

# 5. 使用提取的密钥解密驱动器
manage-bde -unlock C: -RecoveryKey recovery_key.txt
```

## <font style="color:rgb(15, 17, 21);">技术细节</font>
### <font style="color:rgb(15, 17, 21);">BitLocker 密钥链结构</font>
<font style="color:rgb(15, 17, 21);">text</font>

```plain
用户输入/TPM/恢复密钥
    ↓
VMK (Volume Master Key)
    ↓
FVEK (Full Volume Encryption Key)
    ↓
数据加解密
```

### <font style="color:rgb(15, 17, 21);">内存中的密钥特征</font>
+ **<font style="color:rgb(15, 17, 21);">FVEK</font>**<font style="color:rgb(15, 17, 21);">：通常以特定模式出现，长度通常为 256/512 位</font>
+ **<font style="color:rgb(15, 17, 21);">VMK</font>**<font style="color:rgb(15, 17, 21);">：用于加密 FVEK 的密钥</font>
+ **<font style="color:rgb(15, 17, 21);">元数据</font>**<font style="color:rgb(15, 17, 21);">：包含加密算法、密钥强度等信息</font>

