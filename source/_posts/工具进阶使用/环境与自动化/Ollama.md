---
title: Ollama
permalink: /2026/03/15/Forensic_电子取证/Forensic解题妙具/Ollama/
date: 2026-03-15 13:28:28
categories:
  - 工具进阶使用
  - 环境与自动化
tags:
  - 电子取证
  - 取证工具
  - Ollama
  - 工具进阶
created: 2026-03-15T16:49
updated: 2026-09-09T18:57
---
cd C:\Users\glj07\AppData\Local\Programs\Ollama

ollama serve

#### **给你的具体操作指令**

```plain
# 快速任务 - 使用 qwen
ollama run qwen2.5:3b "快速总结这份文档的要点：[文档内容]"

# 深度分析 - 使用 deepseek  
ollama run deepseek-r1:14b "详细分析这个攻击代码的工作原理：[代码片段]"

# 平衡任务 - 使用 gemma
ollama run gemma2:9b "为这些证据创建一个调查时间线：[证据列表]"
```






