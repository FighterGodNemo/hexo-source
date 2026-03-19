---
title: Ubuntu镜像配置_版本24.04.03_
date: 2026-03-15 13:28:20
categories:
  - 博览知识
created: 2026-03-15T16:49
updated: 2026-03-18T09:35
---

### 认识 Ubuntu 24.04 的源配置
Ubuntu 24.04 引入了一个新的**DEB822格式**的源配置文件，默认路径是 `/etc/apt/sources.list.d/ubuntu.sources`。当然，你依然可以继续使用传统的 `sources.list` 文件格式

**sudo nano /etc/apt/sources.list**

```plain
Types: deb
URIs: https://mirrors.tuna.tsinghua.edu.cn/ubuntu/
Suites: noble noble-updates noble-backports
Components: main restricted universe multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://security.ubuntu.com/ubuntu/
Suites: noble-security
Components: main restricted universe multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```

这一版是noble！

