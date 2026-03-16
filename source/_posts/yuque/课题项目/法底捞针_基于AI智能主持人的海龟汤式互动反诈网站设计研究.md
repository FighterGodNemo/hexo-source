---
title: "法底捞针_基于AI智能主持人的海龟汤式互动反诈网站设计研究"
date: 2026-03-15 13:28:22
categories:
- 课题项目
---

> <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">主域名：lawturtlesoup.top </font>
>
> <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">子域名：</font>[<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">http://www.lawturtlesoup.top</font>](http://www.lawturtlesoup.top)
>
> <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">公网IP：47.93.149.132</font>
>
> <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">主私网IP：172.25.45.252</font>
>

二、从0开始搭建（实操顺序）

1. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">建项目骨架</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  mkdir project && cd project  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  mkdir frontend backend docs</font>

2. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">搭后端（先跑通接口）</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  cd backend  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  npm init -y  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  npm i express cors helmet express-rate-limit mongoose dotenv axios bcryptjs jsonwebtoken joi  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  npm i -D nodemon</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  先实现 3 个核心接口：</font>

+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">GET /api/game/list（题目列表）</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">POST /api/ai/ask（AI判题）</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">POST /api/ai/chat（AI提示）</font>
3. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">搭前端（先能玩一题）</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  cd ../frontend  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  npx create-react-app . --template typescript  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  npm i axios react-router-dom framer-motion lucide-react tailwindcss</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  先做一个页面：显示题面、输入问题、显示 AI 回答。</font>

4. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">接入 AI（可控化）  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端服务层做这4件事：</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Prompt 强约束输出</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">输出校验（只接受“是/不是/不重要”）</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">高频问题预制答案</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">同题缓存，保证一致性</font>
5. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">加叙事系统（第二阶段）</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">数据结构：surface/truth/victory_condition/additional</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">双线数据：modern_timeline/ancient_timeline/meta_story</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">解锁逻辑：完成两条线后解锁核心启示题</font>
6. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">加持久化</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端：localStorage 存进度、提示历史、解锁状态</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端：MongoDB 存用户/题库/统计</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">做降级：DB 挂了也能以内存模式演示</font>
7. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">部署</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前后端分离部署到云服务器</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Nginx 反向代理</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">.env 管理密钥</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">健康检查接口 /api/health</font>

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Node.js + React/Vue</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Tailwind CSS</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端使用Node.js</font>

`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">npm</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（Node.js包管理器</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">先安装Node.js和npm，然后才能继续安装项目依赖。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo apt update -y && sudo apt install nodejs npm -y</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">cd /root/backend && npm install</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">进入</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">目录并安装所有依赖项。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Node.js（版本12.22.9）和npm（版本8.5.1）</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">统一接口：所有AI都用judgeAnswer方法</font>

| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">类别</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">技术</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">版本</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">用途</font> |
| --- | --- | --- | --- |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端框架</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">React</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">19.2.4</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">UI框架</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">类型系统</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">TypeScript</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">4.9.5</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">类型安全</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">状态管理</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Zustand</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">5.0.11</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">状态管理</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端框架</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Express</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">4.18.2</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">API服务</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">实时通信</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Socket.IO</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">4.7.2</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">WebSocket</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">数据库</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">MongoDB</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">7.5.0</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">主数据库</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">缓存</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Redis</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">4.6.7</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">缓存层</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">样式框架</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Tailwind CSS</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">3.4.0</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">UI样式</font> |


<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">node /root/backend/minimal_server.js</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo npm audit fix --prefix /root/project/frontend</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo npm audit fix --force --prefix /root/project/frontend</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo apt list nginx</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端开发端口：3007 </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">✅</font>

+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">生产环境不使用3007端口 </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">✅</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">生产环境前端通过80/443端口访问 </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">✅</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo apt install certbot python3-certbot-nginx -y</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">此命令将安装 Certbot 以及 Certbot 的 Nginx 插件，用于自动配置 SSL 证书并将其与 Nginx 集成。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">   
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Certbot 和 Nginx 插件已准备好。接下来，我们将使用 Certbot 为您的域名 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">lawturtlesoup.top</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 和 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">www.lawturtlesoup.top</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 获取并配置 SSL 证书。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo certbot --nginx -d lawturtlesoup.top -d www.lawturtlesoup.top</font>

![](1772286936676-ebee618b-2561-41b1-babe-46e074970f78.png)<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">不同环境下的端口使用</font>

| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">环境</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端访问方式</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">端口</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">说明</font> |
| --- | --- | --- | --- |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">开发环境</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">直接访问前端开发服务器</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">3007</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">npm start 启动，热更新</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">生产环境</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">通过Nginx访问静态文件</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">80/443</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">用户浏览器访问域名</font> |
| <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端API</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端调用后端接口</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">3008</font> | <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">内部通信，用户不直接访问</font> |


<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">权限不足</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo chmod -R 755 /root/project/frontend/build/ && sudo chown -R www-data:www-data /root/project/frontend/build/  
</font>

1. `<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">/root/project/frontend/build/</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">目录的权限已更改为</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">755</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">，允许其他用户（包括</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">www-data</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">）读取和执行。</font>
2. `<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">/root/project/frontend/build/</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 目录的所有者已更改为 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">www-data:www-data</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">，确保 Nginx 可以访问该目录。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">您提到的另一个 AI 的解释是正确的。在 React 或其他现代前端框架中，开发模式和生产模式的行为确实不同：</font>

1. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">开发模式</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">使用</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">npm start</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">启动开发服务器（通常是 3007 或其他端口）。</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">支持热更新（Hot Module Replacement, HMR），代码修改后会实时反映到页面上。</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">不生成静态文件，因此不能直接用于生产环境。</font>
2. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">生产模式</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">使用</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">npm run build</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">构建项目，生成优化后的静态文件（如 HTML、CSS、JavaScript 等）。</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">这些静态文件需要部署到 Web 服务器（如 Nginx）中，供用户访问。</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">如果未重新构建，Nginx 将继续提供旧版本的静态文件。</font>

---

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">解决方案：重新构建并部署前端项目</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">根据您的描述，服务器显示旧版本的原因很可能是未重新执行</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">npm run build</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">来生成最新的生产文件。以下是具体步骤：</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（1）进入前端项目目录</font>
```bash
cd /root/project/frontend
```

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（2）重新构建前端项目</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">执行以下命令以生成最新的生产文件：</font>

```bash
npm run build
```

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（3）将构建后的文件复制到 Nginx 根目录</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">执行以下命令以覆盖旧版本的静态文件：</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">是否同意执行以下命令并查看输出？</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">执行</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Ctrl↵</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">修改</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">CtrlE</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">拒绝</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Ctrl⌫</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">这条命令将最新的构建文件复制到 Nginx 的根目录</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">/var/www/project/frontend/build</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（4）重新加载 Nginx</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">执行以下命令以确保 Nginx 加载最新的静态文件：</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">是否同意执行以下命令并查看输出？</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">执行</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Ctrl↵</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">修改</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">CtrlE</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">拒绝</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Ctrl⌫</font>

---

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">验证结果</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">完成上述步骤后，请再次访问您的域名（如</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">https://lawturtlesoup.top</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">），并确认页面是否已更新为最新版本。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">如果页面仍然显示旧版内容，请尝试清除浏览器缓存（按下</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Ctrl + F5</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">或</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Cmd + Shift + R</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">），或者检查是否有其他缓存机制（如 CDN 或代理服务器）影响了内容更新。</font>

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">. 重新构建前端项目</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">执行以下命令以生成最新的生产文件  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> npm run build</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">sudo npm install pm2@latest -g</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">这条命令将全局安装最新版本的</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">pm2</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">。</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">pm2</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">是一个流行的进程管理器，可以帮助您在后台运行Node.js应用程序，并确保它们在系统重启后自动启动。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">cd /var/www/project/backend && pm2 start npm --name "turtle-soup-backend" -- start</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/.env 文件的内容来看，以下是关键信息总结：</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">API 配置：</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">QIANWEN_API_KEY：已正确配置为 sk-3740b2e391c344ccad63159416adbc50。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">QIANWEN_BASE_URL：已正确配置为 </font>[<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">https://dashscope.aliyuncs.com/compatible-mode/v1。</font>](https://dashscope.aliyuncs.com/compatible-mode/v1。)<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">使用的模型：qwen-turbo。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">其他配置：</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">服务运行端口：3008。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">数据库连接：mongodb://localhost:27017/turtle-soup-dev。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Redis 连接：redis://localhost:6379。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">跨域允许的前端地址：</font>[<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">http://localhost:3007。</font>](http://localhost:3007。)<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">开发环境：</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">当前环境为开发环境（NODE_ENV=development）。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">日志级别为 debug，便于排查问题。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 我的项目“法底捞针：基于AI智能主持人的海龟汤式互动反诈网站设计研究”在服务器中地址：/var/www/project 域名和服务器基本信息参照：/var/www/project/docs/域名和服务器基本信息.md ai主持人的api信息：/var/www/project/docs/API-CONFIG-NOTES.md 另一个ai给的提示：！在第542-575行，前端通过调用 /api/ai/ask 接口来使用AI服务。 ✶ Insight ───────────────────────────────────── 通过分析代码，我发现了AI服务不可用的根本原因： 1. 环境变量加载问题：虽然有.env文件包含通义千问API密钥，但启动时没有正确加载 2. 前端调用正确：前端通过/api/ai/ask接口正确调用AI服务，使用provider: 'qianwen' 3. AI服务本身正常：测试显示当环境变量正确设置时，通义千问能正常工作 4. MongoDB连接失败：这可能导致故事数据加载失败，影响AI回答的准确性 解决方案已经包含在创建的Start Game Fixed.bat文件中，它会： - 自动创建包含AI API密钥的.env文件 - 确保环境变量正确设置 - 提供AI服务测试功能</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

# <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端核心</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  frontend/src/                  # 源代码  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  frontend/package.json          # 依赖配置  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  frontend/.env.production       # 生产环境配置  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  frontend/public/               # 静态资源（除test.html）</font>

# <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端核心</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  backend/src/                   # 源代码  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  backend/package.json           # 依赖配置  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  backend/.env.production        # 生产环境配置  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  backend/uploads/               # 用户上传文件  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  backend/data/                  # 数据文件（如果未使用数据库）</font>

# <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">项目配置</font>
<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  .gitignore                     # Git忽略文件  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  package.json                   # 如果根目录有</font>



我已经确认主要卡点了：当前前端把 AI 请求固定到 [https://lawturtlesoup.top:3008，而生产推荐是](https://lawturtlesoup.top:3008，而生产推荐是) Nginx 反代同域名，这会直接导致 AI 接口跨域/端口/TLS 问题。  
  接下来我按这个顺序修改并验证：

1. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端统一 API 地址解析</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">新增一个统一的 apiConfig，默认走“当前网页同源域名”（window.location.origin），仅在你显式设置 REACT_APP_API_URL 时才覆盖。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">改掉 GamePage、api.ts、api_simple.ts、auth.ts、StopServiceButton 里所有 localhost:3008 回退写法。</font>
2. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端生产 CORS 和健康检查</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">app.js 改成支持 CORS_ORIGIN 多域名白名单（支持 lawturtlesoup.top + </font>[www.lawturtlesoup.top），并允许无](http://www.lawturtlesoup.top），并允许无)<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> Origin 的健康检查。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">增加 /api/health 别名，和你的部署文档/Nginx检查路径保持一致。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">打开 trust proxy，避免 Nginx 反代后限流器误判。</font>
3. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">AI 主持人可用性增强</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">AI 服务支持阿里云常见变量名兼容（DASHSCOPE_API_KEY 也可用）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">/api/ai/ask 在指定 provider 不可用时自动切换到已配置 provider，并给出明确错误，不再“无提示失败”。</font>
4. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">生产环境配置文件修正</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">调整 frontend/.env.production、frontend/.env，移除 :3008 端口依赖。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">更新后端示例环境变量和部署文档，确保你上传后按文档即可跑通。</font>已按“上传到阿里云 + 域名访问”场景改完，重点是修复 AI 主持人在生产环境的请求链路。

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  主要改动：</font>

+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端 CORS 改为支持多域名白名单（含 lawturtlesoup.top 和 </font>[www.lawturtlesoup.top），并允许无](http://www.lawturtlesoup.top），并允许无)<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> Origin 的健康检查；新增 /api/health。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">app.js:26  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">app.js:92</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">AI 主持人可用性增强：/api/ai/ask 会在请求 provider 不可用时自动切换到已配置 provider；无可用 provider 时返回明确 503。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">ai.js:89</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">AI 密钥兼容阿里云常见变量名：支持 DASHSCOPE_API_KEY（除 QIANWEN_API_KEY 外）。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">aiService.js:417  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">ai.js:140</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端新增统一 API 地址解析：生产默认同源（window.location.origin），避免再打到 https://域名:3008。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">apiConfig.ts:1</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">AI 调用、认证调用全部切到统一 API 配置。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">GamePage.tsx:304  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">api.ts:3  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">auth.ts:2</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">生产环境变量已修正为同源模式（前端），后端 CORS/公共地址已补齐。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/.env.production:2  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/.env.production:17</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">部署文档已同步更新（含 .env.local 清理、前后端生产变量建议）。  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">DEPLOYMENT.md:82</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  校验结果：</font>

+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端 npm run build 成功（仅有原有 ESLint warning，不阻塞构建）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端关键文件 node --check 通过。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  你上服务器后建议按这个最小流程：</font>

1. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端用 backend/.env.production 作为 backend/.env（并确认 QIANWEN_API_KEY 或 DASHSCOPE_API_KEY 已设置）。</font>
2. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端构建前执行：rm -f frontend/.env.local，再 npm run build。</font>
3. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Nginx 反代 /api 到 </font>[http://127.0.0.1:3008，前端静态目录指向](http://127.0.0.1:3008，前端静态目录指向)<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> frontend/build。</font>
4. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">上线后先测：</font>[https://lawturtlesoup.top/api/health、https://lawturtlesoup.top/api/ai/providers。](https://lawturtlesoup.top/api/health、https://lawturtlesoup.top/api/ai/providers。)
5. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">你现在文档和环境文件里有明文 DashScope key，建议立刻去阿里云控制台轮换密钥。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端的.env前两行</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"># 生产环境留空，默认走同域名（Nginx反代 /api）</font>核心功能是怎么实现的

1. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">首页进入游戏后，前端从 realCases.json 加载题库，并从 localStorage.gameProgress 读取解锁/完成状态。</font>
2. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">选题并开始后，前端把玩家问题发到 /api/ai/ask；后端读取题目真相后，调用 AI（通义千问优先）返回“是/不是/不重要”。</font>
3. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">玩家点“获取提示”会调用 /api/ai/chat，后端按当前题目和已提问历史生成提示。</font>
4. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">玩家“猜答案”在前端本地做关键词匹配判定（不是后端判定），正确则更新 gameProgress 并解锁下一题。</font>
5. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">双线叙事主线主要由前端 dualStoryService.ts 的本地剧情数据驱动，进度存 localStorage.dualStoryProgress。</font>
6. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">导师剧情页通过后端 /api/mentor-story/* 接口读取场景并推进分支。</font>

## <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">逐文件说明</font>
### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">根目录</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">.gitignore：忽略前后端 .env、node_modules、前端构建产物和后端日志。</font>

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">docs</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">docs/API-CONFIG-NOTES.md：通义千问（OpenAI兼容）配置说明和排障。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">docs/双线叙事设计说明.md：双线叙事玩法、教育目标、流程设计文档。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">docs/域名和服务器基本信息.md：线上服务器/域名资产信息。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">docs/deploy/nginx.lawturtlesoup.top.conf：Nginx 站点配置，/api 反代 127.0.0.1:3008。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">docs/deploy/lawturtlesoup-backend.service：systemd 后端常驻服务配置。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  ———</font>

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend（服务端）</font>
#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend 根</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/README.md：后端启动、接口、AI与数据库环境变量说明。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/package.json：后端依赖与脚本。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/package-lock.json：依赖锁定。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/logs/error.log：错误日志文件。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/logs/combined.log：综合运行日志。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src 核心</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/app.js：服务入口；配置 CORS、限流、路由挂载、健康检查、错误处理中间件、启动流程。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/config/database.js：连接 MongoDB；失败时按环境决定是否降级内存模式。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/config/initData.js：初始化默认用户、默认题目、双线剧情。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/config/memoryStore.js：无Mongo时的“内存版模型层”，模拟 find/save/populate 等行为。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/config/dualStoryData.js：初始化一版双线叙事种子数据。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/config/mentorStoryData.js：初始化导师剧情数据。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/middleware/auth.js：JWT 鉴权与可选鉴权。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/utils/logger.js：Winston 日志器。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models/index.js：根据 DB 状态动态导出 Mongo 模型或内存模型。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models/User.js：用户Schema、密码哈希、密码比对、公开信息输出。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models/Story.js：普通海龟汤题目Schema。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models/DualStory.js：双线剧情Schema（现代线/古代线/元剧情）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models/MentorStory.js：导师剧情场景树Schema。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models/Room.js：房间数据结构（当前基本未走完整多人链路）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/models/Game.js：游戏会话Schema（房间、消息、玩家、状态）。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/controllers</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/controllers/auth.js：注册、登录、用户信息、更新资料。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/controllers/ai.js：/ask 判题、/chat 提示、/providers 提供商查询。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/controllers/game-simple.js：简化题目列表/详情接口（内置样例数据）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/controllers/dualStory.js：双线剧情列表、详情、开始、提问、猜测。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/controllers/mentorStory.js：导师剧情初始化、取故事、取场景、选项推进、完成奖励。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/services</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/src/services/aiService.js：AI适配层（OpenAI/Claude/Qianwen）、重试、限流、答案标准化、预设问答缓存。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/data</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/data/realCases.json：反诈/普法题库 + 情景模拟 + 叙事素材。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/data/predefinedQuestions.json：某些题目的固定问答映射，提升 AI 判题稳定性。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/data/main-story.json：主线剧情数据（modern/ancient/final）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/data/finalChapter.json：最终章内容定义。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/data/insightStory.json：核心启示题目定义。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/data/sample-questions.json：样例题库。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/scripts</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/scripts/setup-mongodb.js：本地Mongo使用说明与快速启动脚本生成。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/scripts/load-questions.js：尝试导入样例题（偏旧脚本）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/scripts/load-main-story.js：导入主线剧情到 Story 集合。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/scripts/load-mentor-story.js：导入导师剧情数据。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">backend/scripts/managePredefinedQuestions.js：管理 predefinedQuestions.json 的工具脚本。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  ———</font>

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend（前端）</font>
#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend 根</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/README.md：前端启动/构建与 API 地址策略。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/package.json：前端依赖与脚本。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/package-lock.json：依赖锁定。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/tsconfig.json：TS 编译选项。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/tailwind.config.js：Tailwind 主题色、动画扩展。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/postcss.config.js：PostCSS 插件配置。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/public</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/public/index.html：SPA 容器模板。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/public/manifest.json：PWA 元信息。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/public/robots.txt：爬虫规则。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/public/data/realCases.json：前端直接加载的题库源。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/public/data/finalChapter.json：顿悟时刻最终章数据。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/public/data/insightStory.json：核心启示题目数据。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src 入口与配置</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/index.tsx：React 挂载入口。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/App.tsx：路由总表 + 全局 ErrorBoundary + StoryProvider。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/index.css：全局 Tailwind 组件类与主题样式。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/react-app-env.d.ts：CRA TypeScript 环境声明。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/config/apiConfig.ts：统一生成 API 地址，兼容同域部署和环境变量。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/types</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/types/index.ts：通用数据类型定义（Story/User/APIResponse 等）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/types/story.ts：主线剧情引擎类型。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/types/dualStory.ts：双线叙事类型。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/auth.ts：登录/注册服务与 token 本地持久化。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/api.ts：axios 实例、拦截器、分组 API。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/socket.ts：单人模式下的 socket 空实现（占位兼容）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/realCasesService.ts：加载 public/data/realCases.json 并提供查询方法。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/PlayerStatsService.ts：本地玩家统计和成就通知。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/StoryEngine.ts：主线剧情状态机（节点推进、证据、进度存档）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/StoryUnlockService.ts：主线章节完成后的解锁规则处理。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/services/dualStoryService.ts：双线剧情大段数据 + 章节读取 + 本地进度持久化。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/contexts</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/contexts/StoryContext.tsx：主线剧情页面的全局状态与动作分发。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/ErrorBoundary.tsx：页面崩溃兜底。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/LoginModal.tsx：登录注册弹窗。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/Story/DialogueBox.tsx：剧情对话框。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/Story/ChoiceButton.tsx：剧情选项按钮。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/Story/InvestigationScene.tsx：证据发现交互。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/Story/Notebook.tsx：剧情笔记本 UI。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/Story/ProgressBar.tsx：章节进度条。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/components/Story/UnlockNotification.tsx：解锁弹窗。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/HomePage.tsx：首页与入口导航。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/GamePage.tsx：核心单人玩法页（选题、提问、猜测、提示、解锁、顿悟时刻）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/GamePlayPage.tsx：多人房间玩法页面骨架。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/StoryPage.tsx：主线剧情（chapter1）交互页。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/StoryBrowserPage.tsx：题库浏览与筛选页。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/ScenarioPage.tsx：情景模拟互动页（当前重点实现“对比识别”）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/DualStoryList.tsx：双线故事列表、解锁与进度展示。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/DualStoryPage.tsx：双线章节推进、完成后过渡对话、解锁核心启示。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/MentorStoryPage.tsx：导师剧情场景播放页。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/DualStoryPage.css：双线页样式（当前页面已多用 Tailwind，部分是遗留CSS）。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/DualStoryList.css：双线列表页补充样式。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/pages/StoryBrowserPage.css：题库浏览页基础样式。</font>

#### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/data</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/data/storyUnlocks.json：主线章节完成后的额外故事解锁规则。</font>
+ <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">frontend/src/data/story/chapter1.json：主线第一章节点数据。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">1. frontend/src/pages/GamePage.tsx + backend/src/controllers/ai.js + backend/src/services/aiService.js：先吃透“提问/提示/AI判题”主链路。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  2. frontend/src/pages/DualStoryList.tsx + frontend/src/pages/DualStoryPage.tsx + frontend/src/services/dualStoryService.ts：再理解双线叙事推进与解锁。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  3. backend/src/app.js + backend/src/config/database.js + backend/src/config/initData.js：最后看服务启动和数据初始化。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"></font>

| 用户动作 | 前端入口 | 请求 | 后端处理 | 数据读写 |  
  | 点“猜答案” | GamePage.tsx handleGuess() + checkAnswerCorrectness() | 无 | 无 | 本地判定正确后写  
  localStorage.gameProgress（完成/解锁） |  
  | 点“跳过” | GamePage.tsx handleSkipStory() | 无 | 无 | 本地把下一题加入 gameProgress.unlockedStories |  
  | 点“重置进度” | GamePage.tsx handleResetProgress() | 无 | 无 | 清空/重建 gameProgress、storyHintsUsed、storyHintHistory |  
  | 双线列表加载 | DualStoryList.tsx loadStories() | 无（本地服务） | 无 | 调 dualStoryService.ts + 读 localStorage.dualStoryProgress |  
  | 双线章节推进 | DualStoryPage.tsx handleChoice() | 无 | 无 | saveProgress() 写 dualStoryProgress |  
  | 双线完成解锁顿悟 | DualStoryPage.tsx handleStoryComplete() | 无 | 无 | markStoryCompleted() + 写 dualStoryProgress.dualStoryCompleted + 写  
  gameProgress.unlockedStories |  
  | 导师剧情加载 | MentorStoryPage.tsx loadStory() | GET /api/mentor-story/:id | mentorStory.js | 读 Mongo 或内存模型 MentorStory.js |  
  | 导师剧情选项 | MentorStoryPage.tsx handleChoice() | POST /api/mentor-story/choice | mentorStory.js | 当前主要返回下一场景，进度记录偏简化 |  
  | 登录/注册 | LoginModal.tsx -> auth.ts | POST /api/auth/login / register | auth.js | 后端读写 User，前端写 localStorage.token/userId/username |

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  ———</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  全局路由与转发</font>

1. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">前端路由定义在 App.tsx。</font>
2. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">API 基地址生成在 apiConfig.ts。</font>
3. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后端路由挂载在 app.js。</font>
4. <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Nginx 反代在 nginx.lawturtlesoup.top.conf。</font>

