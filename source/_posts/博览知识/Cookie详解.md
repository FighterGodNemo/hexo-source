---
created: 2026-10-13T12:39
updated: 2026-10-13T12:39
title: Cookie 详解
permalink: /2026/10/13/博览知识/Cookie详解/
categories:
  - 博览知识
---
> 整理日期：2026-10-13
> 关联笔记：[JWT（JSON Web Token）详解](/2026/10/13/博览知识/JWT_JSON_Web_Token_详解/)（同为 Web 认证与状态机制主题）

---

## 1. 什么是 Cookie

**Cookie（曲奇）** 是**服务器下发并存储在浏览器端的一小段文本数据**，用于在**无状态的 HTTP 协议**上维持会话状态。

HTTP 协议本身是无状态的——服务器默认不记得"你是谁、上次做了什么"。Cookie 就是让浏览器"替服务器记住你"的机制：一段键值对文本，随请求自动往返。

---

## 2. 工作原理

```
1. 浏览器首次请求网站
        ↓
2. 服务器在响应头 Set-Cookie 下发身份标识
        ↓
3. 浏览器收到后存储该 Cookie（按域名/路径归位）
        ↓
4. 后续每次请求同一域名 → 浏览器自动在请求头 Cookie 中带上它
        ↓
5. 服务器凭 Cookie 识别用户（如"已登录"状态）
```

```http
# 服务器下发（响应头）
HTTP/1.1 200 OK
Set-Cookie: session_id=abc123; Path=/; HttpOnly; SameSite=Lax

# 浏览器回传（请求头）
GET /profile HTTP/1.1
Cookie: session_id=abc123
```

---

## 3. Cookie 主要属性

| 属性 | 作用 |
|------|------|
| Name / Value | 键值对本体（如 `session_id=abc123`） |
| Domain | 限定哪些域名会携带该 Cookie |
| Path | 限定哪些路径下携带（默认 `/` 全站） |
| Expires / Max-Age | 有效期：会话级（关闭浏览器失效）或固定时长 |
| Secure | 仅通过 HTTPS 传输 |
| HttpOnly | JS 无法通过 document.cookie 读取，防 XSS 窃取 |
| SameSite | 限制跨站携带：Strict / Lax / None，防 CSRF |

**SameSite 三档**
- `Strict`：完全禁止跨站携带（最严格，但影响第三方链接进入时的登录态）
- `Lax`：仅允许顶级导航（点击链接跳转）携带，默认推荐
- `None`：允许跨站携带（必须配合 Secure）

---

## 4. Cookie 的三大用途

1. **会话管理**：登录状态、购物车、用户偏好（最常见）
2. **个性化**：语言、主题、浏览推荐
3. **跟踪分析**：第三方 Cookie 记录浏览行为，用于广告定向

---

## 5. Cookie 与相关概念对比

| 机制 | 存储位置 | 特点 |
|------|----------|------|
| Cookie | 浏览器 | 随每个请求自动携带，单个约 4KB 上限 |
| Session | 服务器 | 靠 Cookie 存 session_id 关联，安全但占服务器内存 |
| localStorage | 浏览器 | 不随请求发送，容量大（5MB+），纯前端本地用 |
| JWT | 客户端 | 无状态令牌，可放 Cookie 或 Authorization 头 |

**Cookie vs Session**
- Cookie 数据在客户端，Session 数据在服务器端
- Session 通常只把 id 存进 Cookie，真正的用户数据放服务器
- 服务器重启/多实例时 Session 需共享存储（Redis 等）

**Cookie vs localStorage**
- Cookie 自动随请求发送（省事但增加流量），localStorage 不发送
- localStorage 容量远大于 Cookie，适合纯前端缓存
- localStorage 存敏感信息被 XSS 读取的风险高（JWT 笔记中提到的 Token Sidejacking 场景）

---

## 6. 安全要点

| 攻击 | 手段 | 防护 |
|------|------|------|
| XSS 窃取 | 注入脚本读取 document.cookie | **HttpOnly**（JS 读不到）+ 输入输出转义 |
| CSRF | 恶意网站伪造请求携带 Cookie | **SameSite** + CSRF Token 校验 |
| 会话重放 | 窃取/复用过期 Cookie | 合理 **Max-Age** + 服务端会话失效机制 |
| 中间人窃听 | 明文 HTTP 抓包 | **Secure**（仅 HTTPS）+ HSTS |

**最佳实践清单**
- 登录态 Cookie 必须加 `HttpOnly` + `Secure` + `SameSite=Lax`
- 会话有效期尽量短，配合滑动续期
- 服务端做变更（改密/登出）时主动使旧会话失效
- 敏感数据本身不放 Cookie，Cookie 只存标识

---

## 7. 一句话总结

> Cookie 是浏览器替服务器保存的"小纸条"：服务器用 Set-Cookie 下发，浏览器每次访问自动递上，从而让无状态的 HTTP 认出"你是谁"。配合 HttpOnly / Secure / SameSite 使用，才能安全地承载登录态与会话。

---

## 参考来源

- MDN Web Docs：Using HTTP cookies / Set-Cookie
- RFC 6265（HTTP State Management Mechanism）
- 关联自本文件夹：JWT_JSON_Web_Token_详解.md
*（内容由AI生成，仅供参考）*
