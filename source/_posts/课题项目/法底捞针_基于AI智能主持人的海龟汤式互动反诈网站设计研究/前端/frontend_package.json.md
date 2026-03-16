---
title: "frontend_package.json"
date: 2026-03-15 13:28:22
categories:
- 课题项目
- 法底捞针_基于AI智能主持人的海龟汤式互动反诈网站设计研究
- 前端
---

frontend/package.json 是前端项目的“配置清单”，主要告诉 Node/npm 这几件事：

1. 项目叫什么、版本号是什么。
2. 依赖哪些库（比如 React、axios、tailwind）。
3. 怎么启动/打包/测试（scripts 里的 start、build、test）。

  文件来源：

1. 先用脚手架（项目模板生成器）生成初始化前端项目（如create-react-app --template typescript）。动生成一份基础 package.json。
2.  后续每次执行 npm install xxx，依赖会自动写进 dependencies。
+ `npm init -y`先生成基础 package.json
+ `npx create-react-app my-app --template typescript`

这条命令就会自动生成一个可运行的 React + TS 项目。

## package-lock.json
 npm 自动生成的“依赖锁定文件”。

 作用是把你当前安装的精确版本和依赖树记录下来，保证：

1. 今天装和明天装结果一致。
2. 本电脑和别人电脑安装结果一致。
3. 部署服务器安装结果一致。

