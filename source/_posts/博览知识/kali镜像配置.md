---
title: kali镜像配置
date: 2026-03-15 13:28:22
categories:
  - 博览知识
created: 2026-03-15T16:49
updated: 2026-03-18T09:35
---
## 镜像源：
sudo nano /etc/apt/sources.list

输入：

```plain
deb https://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling main contrib non-free non-free-firmware
```

```plain
Ctrl + O    # 保存
Enter       # 确认
Ctrl + X    # 退出
```

下载pwn

```plain
# 创建虚拟环境目录
mkdir -p ~/kali-tools
cd ~/kali-tools

# 创建虚拟环境
python3 -m venv pwn-env

# 激活虚拟环境
source pwn-env/bin/activate

# 安装 ROPgadget
pip install ROPgadget
```

```plain
mkdir -p ~/.pip
cat > ~/.pip/pip.conf << 'EOF'
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple/
[install]
trusted-host = pypi.tuna.tsinghua.edu.cn
EOF
```

