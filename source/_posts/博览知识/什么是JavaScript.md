---
created: 2026-10-13T12:39
updated: 2026-10-13T12:39
title: 什么是 JavaScript
permalink: /2026/10/13/博览知识/什么是JavaScript/
categories:
  - 博览知识
---
## 一句话定义
JavaScript（简称 JS）是一种轻量级的、解释执行（或即时编译 JIT）的编程语言，拥有一等函数（first-class functions）。它是 Web 开发的三大核心技术之一，与 HTML（内容结构）、CSS（样式布局）协作，JavaScript 负责控制网页的行为与交互。除浏览器外，也广泛运行于 Node.js 等非浏览器环境。（来源：MDN Web Docs）

## 核心语言特性
- 动态类型（dynamic typing）：变量类型运行时确定，无需显式声明类型
- 基于原型（prototype-based）：通过原型链实现继承，而非传统类继承
- 垃圾回收（garbage-collected）：自动管理内存
- 多范式：支持命令式、函数式、面向对象等编程范式
- 运行时能力：运行期构造对象、可变参数列表、函数作为变量、eval 动态执行脚本、对象自省等
- 单线程 + 事件循环：通过异步回调（Promise、async/await）处理并发，而非多线程

## 发展历史（时间线）
- 1995年：Netscape 工程师 Brendan Eich 约 10 天设计出原型语言，最初叫 Mocha，后改名 LiveScript，最终定名 JavaScript
- 1997年：提交给 Ecma International 标准化，发布 ECMAScript 1（ECMA-262 标准，JavaScript 是最著名的实现）
- 1999年：ECMAScript 3，引入正则表达式、异常处理 try/catch，奠定现代基础
- 2005年：Ajax 技术兴起，带动 Web 2.0，实现不刷新页面即可与服务器交换数据
- 2008年：Google 发布 Chrome，内置 V8 JavaScript 引擎，执行速度大幅提升
- 2009年：Ryan Dahl 推出 Node.js，JavaScript 进入服务器端编程
- 2015年：ES2015（ES6）里程碑式更新：let/const、class、模块、箭头函数、Promise
- 此后每年 6 月 TC39 发布以年份命名的小版本；ECMAScript 2026 已发布（新增 Map.prototype.getOrInsert()、Iterator.concat()、Math.sumPrecise()、Error.isError()、Array.fromAsync() 等）
- 注意：JavaScript 与 Java 是完全不同的两种语言，两者仅是名字相近，语法、语义和用途差异巨大，JavaScript 不是"解释版 Java"

## 运行机制
- 浏览器中：由内嵌 JS 引擎执行（Chrome/Node.js 用 V8、Firefox 用 SpiderMonkey 等）
- V8 引擎工作流程：解析（Parsing，拆分为 token）→ Ignition 解释器转为字节码快速执行 → TurboFan 编译器分析热点代码并优化为机器码（JIT）
- Node.js：基于 Chrome V8 引擎构建的运行时，提供服务器端 API，使 JS 可编写后端代码
- 事件循环（Event Loop）：处理异步任务（定时器、网络请求、IO），避免阻塞主线程

## 主要应用领域（2026 生态现状）
- 浏览器端：几乎所有现代网页的交互逻辑，浏览器是 JS 的垄断性部署目标
- 服务器端：Node.js、Deno 等运行时，后端开发
- 前端框架：React（市场份额最大的 UI 库，支撑 Meta、Airbnb、Netflix 等）、Vue、Angular；配套 Next.js、React Query、Zustand 等生态
- TypeScript：JavaScript 的超集，添加类型层，行业过去五年大规模迁移，但本质仍是 JS 生态
- 边缘计算：Cloudflare Workers（300+ 城市）、Vercel Edge Functions、Deno Deploy、AWS Lambda@Edge 均使用 V8 引擎
- 移动端：React Native、小程序等跨平台方案
- 桌面端：Electron（VS Code、Slack 等）、Tauri
- 游戏开发、物联网等更多场景

## 常见误解与真实局限
1. 误解：浏览器 JS 可直接访问本地文件系统 → 事实：浏览器 JS 运行在沙箱环境中，不能随意读写本地文件，只能通过用户选择的 file input、File API 等受限方式
2. 误解：JS 能直接创建桌面应用 → 事实：原生 JS 不能，需借助 Electron、Tauri 等框架打包
3. 误解：JS 可自由读取其他网站数据 → 事实：受 CORS（同源策略）限制，跨域访问需服务端配合
4. 局限：单线程模型，CPU 密集型任务会阻塞；类型灵活性带来运行时错误风险（TypeScript 可缓解）

## 参考资料
- MDN Web Docs - JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- 科普中国 - JavaScript
- A Brief History: from Mocha to ECMAScript 2026（webcodingcenter.com）
- State of JavaScript 2026（langpop.com）
- GeeksforGeeks - V8 Engine in Node.js
*（内容由AI生成，仅供参考）*
