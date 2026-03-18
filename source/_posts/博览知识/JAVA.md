---
title: JAVA
date: 2026-03-15 13:28:22
categories:
  - 博览知识
created: 2026-03-15T16:49
updated: 2026-03-18T09:34
---

Java 技术体系（JDK, JRE, JVM）：

· JVM (Java Virtual Machine)：Java 虚拟机是 Java 跨平台的核心。它负责加载、验证、执行字节码。不同平台有各自不同的 JVM，但它们对字节码的解释规范是一致的。

· JRE (Java Runtime Environment)：Java 运行时环境。如果你只想运行一个已有的 Java 程序，只需要安装 JRE。它包含了 JVM 和运行 Java 程序所必需的核心类库（如 java.lang, java.util 等）。

· JDK (Java Development Kit)：Java 开发工具包。如果你要开发 Java 程序，就必须安装 JDK。它包含了 JRE，以及编译器（javac）、调试器（jdb）、打包工具（jar）等一系列开发工具和更多的类库。

关系总结：JDK = JRE + Development Tools，JRE = JVM + Core Libraries

