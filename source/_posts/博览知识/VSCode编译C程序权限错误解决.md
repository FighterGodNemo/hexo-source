---
title: VSCode编译C程序权限错误解决
date: 2026-04-29
permalink: /knowledge/vscode-c-compile-permission-error
categories:
  - 博览知识
tags:
  - VSCode
  - C语言
  - 编译错误
created: 2026-04-29
updated: 2026-04-29
---

## 问题现象

在 VS Code 中编译 C 程序时出现以下错误：

`
Assembler messages:
Error: can't open c:\Users\glj07\Desktop\C语言程序学习/build for reading: Permission denied
`

## 问题根源

编译命令中包含 -I c:\Users\glj07\Desktop\C语言程序学习/** 参数，**Windows 命令行不支持 ** 通配符**，导致 GCC 编译器试图将其当作文件读取，从而产生权限错误。

## 解决方案

修改项目根目录下的 .vscode/settings.json 文件：

1. **清空 C_Cpp_Runner 扩展的 includeSearch**：
`json
C_Cpp_Runner.includeSearch: []
`

2. **添加 c-cpp-compile-run 扩展的 include-paths**：
`json
c-cpp-compile-run.include-paths: []
`

## 验证方法

手动编译测试（命令行方式）：
`powershell
gcc -Wall -Wextra -g3 -finput-charset=UTF-8 -fexec-charset=GBK 源文件.c -o 输出文件.exe
`

若退出码为 0，则编译成功。

## 注意事项

- 问题出在扩展配置而非代码本身
- 手动编译通常能成功，但 VS Code 中的扩展会自动添加搜索路径参数
- 修改配置后可能需要重启 VS Code 才能生效
>