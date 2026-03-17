---
title: Python虚拟环境路径问题_Could_not_find_platform_independent_libraries__prefix__
date: 2026-03-15 13:28:20
categories:
  - 博览知识
created: 2026-03-15T16:49
updated: 2026-03-17T19:26
---

**<font style="color:rgb(0, 0, 0) !important;">重新创建虚拟环境</font>**

    - <font style="color:rgb(0, 0, 0);">进入 “python 学习” 文件夹：</font>**<font style="color:rgba(0, 0, 0, 0.85);"></font>**

```plain
cd C:\Users\glj07\Desktop\python学习
```

    - <font style="color:rgb(0, 0, 0);">删除旧的虚拟环境（如果存在）：</font>**<font style="color:rgba(0, 0, 0, 0.85);"></font>**

```plain
rmdir /s /q venv
```

    - <font style="color:rgb(0, 0, 0);">重新创建虚拟环境：</font>**<font style="color:rgba(0, 0, 0, 0.85);"></font>**

```plain
python -m venv venv
```

    - <font style="color:rgb(0, 0, 0);">激活虚拟环境：</font>**<font style="color:rgba(0, 0, 0, 0.85);"></font>**

```plain
venv\Scripts\activate
```

<font style="color:rgb(0, 0, 0);">完成。</font>

