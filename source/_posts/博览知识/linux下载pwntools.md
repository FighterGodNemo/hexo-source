---
title: linux下载pwntools
date: 2026-03-15 13:28:22
categories:
  - 博览知识
created: 2026-03-15T16:49
updated: 2026-03-18T09:35
---

### <font style="color:rgb(15, 17, 21);">先完成系统依赖安装</font>
### <font style="color:rgb(15, 17, 21);">sudo apt update && sudo apt install -y python3 python3-pip python3-dev git libssl-dev libffi-dev build-essential</font>


```plain
# 1. 安装虚拟环境支持
sudo apt install -y python3-venv

# 2. 创建虚拟环境
cd ~/Env
python3 -m venv pwn-env

# 3. 激活虚拟环境
source pwn-env/bin/activate

# 4. 安装pwntools
python -m pip install --upgrade pip
python -m pip install pwntools
```

