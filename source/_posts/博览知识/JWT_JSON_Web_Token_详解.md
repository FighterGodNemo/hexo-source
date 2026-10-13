---
created: 2026-10-13T12:39
updated: 2026-10-13T12:39
title: JWT（JSON Web Token）详解
permalink: /2026/10/13/博览知识/JWT_JSON_Web_Token_详解/
categories:
  - 博览知识
---
> 调研日期：2026-10-13
> 核心依据：RFC 7519、jwt.io、OWASP 指南及多篇权威资料（见文末参考）

---

## 1. 什么是 JWT

**JSON Web Token（JWT）** 是一个开放标准（**RFC 7519**），定义了一种**紧凑、自包含**的方式，在各方之间以 JSON 对象形式安全地传输信息。

- **紧凑**：体积小，可通过 URL、POST 参数、HTTP Header 传输
- **自包含**：令牌本身携带了所有必要信息（用户 ID、角色等），服务端无需查库即可验证
- **可信**：信息经过**数字签名**，可验证其完整性与来源

JWT 的签名可以用：
- **HMAC 算法**（对称，如 HS256，使用同一个密钥）
- **RSA / ECDSA**（非对称，如 RS256 / ES256，使用公钥/私钥对）

---

## 2. JWT 的结构

一个标准 JWT 由三部分组成，用点号 `.` 分隔：

```
xxxxx.yyyyy.zzzzz
 ├─ Header（头部）
 ├─ Payload（负载）
 └─ Signature（签名）
```

### 2.1 Header（头部）
包含令牌类型与签名算法：

```json
{
  "alg": "HS256",   // 签名算法：HS256 / RS256 / ES256 ...
  "typ": "JWT"      // 令牌类型，固定为 JWT
}
```
该 JSON 经 **Base64Url 编码**后成为第一段。

### 2.2 Payload（负载）
存放一组**声明（Claims）**，分三类：

| 类型 | 说明 | 常见字段 |
|------|------|----------|
| 标准注册声明 | 规范推荐的预定义字段 | `iss` 签发者、`exp` 过期时间、`sub` 主题、`iat` 签发时间、`aud` 受众、`jti` 唯一 ID |
| 公共声明 | 自定义，需避免与标准冲突 | 可注册到 IANA |
| 私有声明 | 业务方自定义字段 | `user_id`、`role`、`name` 等 |

⚠️ **重要**：Header 和 Payload 只是 **Base64Url 编码，并未加密**——任何人都可以解码查看内容。**严禁**在 Payload 中存放密码、身份证号、银行卡号等敏感信息。

### 2.3 Signature（签名）
签名是 JWT 安全性的关键，计算方式：

```
Signature = HMAC/SHA256(
    Base64Url(Header) + "." + Base64Url(Payload),
    Secret（密钥）
)
```

**作用**：防篡改。一旦 Header 或 Payload 被修改，签名验证就会失败。

### 2.4 完整示例
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## 3. 工作原理（典型认证流程）

```
① 用户登录（提交用户名/密码）
        ↓
② 服务器验证身份，构造 JWT 并用密钥签名
        ↓
③ 返回 JWT 给客户端
        ↓
④ 客户端存储 JWT（localStorage / sessionStorage / Cookie）
        ↓
⑤ 后续请求携带：Authorization: Bearer <JWT>
        ↓
⑥ 服务器拦截请求，验证签名 + 检查有效期（exp）
        ↓
⑦ 验证通过 → 解析用户信息，处理请求；失败 → 401/403
```

---

## 4. 签名算法：对称 vs 非对称

| 算法 | 类型 | 密钥 | 适用场景 |
|------|------|------|----------|
| HS256 | 对称（HMAC） | 同一个 Secret 签名/验证 | 单一服务端，无跨域需求 |
| RS256 | 非对称（RSA） | 私钥签名，公钥验证 | 多服务/网关：持有公钥即可验证 |
| ES256 | 非对称（ECDSA） | 私钥签名，公钥验证 | 同 RS256，密钥更短更高效 |

---

## 5. JWT vs Session（对比）

| 维度 | Session 认证 | JWT 认证 |
|------|-------------|----------|
| 客户端持有 | 随机 session ID（Cookie） | 带用户信息的签名令牌 |
| 真相存储位置 | 服务端存储（DB / Redis） | 令牌内部 |
| 请求校验 | 查服务端存储 | 验证签名，无需查库 |
| 登出 | 删除记录，立即生效 | 过期前难撤销，需短生命周期或黑名单 |
| 多服务器 | 需共享同一存储 | 任何持有密钥的服务器均可验证 |
| 单次请求体积 | 短 ID | 数百字节+，随 claims 增长 |
| 移动端/API | 可用但 Cookie 不便 | 天然适配（Bearer Token） |
| 主要风险 | CSRF（需 SameSite + CSRF Token） | localStorage 被 XSS 窃取 |

**选择建议**：
- 自研网站 + 自己的后端 → 选 **Session**（即时登出、撤销简单）
- 多服务/微服务、移动端、第三方 API 需独立验证 → 选 **JWT**（保持短生命周期）
- 常见组合：**短命 Access Token（JWT）+ 长命 Refresh Token/Session** 负责续发新令牌

---

## 6. 典型使用场景

- **无状态认证**：单点登录（SSO）、移动端/Web API 认证
- **微服务间通信**：各服务持公钥独立验证令牌，无需共享 session 存储
- **跨域认证**：前后端分离、第三方授权（OAuth2.0 中常用 JWT 作为 access token）
- **信息交换**：签名保证双方数据可信、防篡改

---

## 7. 优缺点

**优点**
- 无状态、可水平扩展，多服务验证友好
- 跨域/跨平台天然支持
- 自包含，减少服务端查询
- 体积小、传输方式灵活（Header / URL / Body）

**缺点**
- **登出/撤销困难**：令牌过期前无法立即失效，需黑名单或缩短有效期
- **不可变**：签发后修改用户权限/角色不即时生效
- **无法控制体积**：claims 越多 token 越大，请求开销增加
- **安全责任全在实现方**：算法、密钥、过期检查任何一环出错都会导致可利用漏洞

---

## 8. 安全注意事项与常见攻击

### 8.1 四大常见漏洞

| 漏洞 | 原理 | 防御 |
|------|------|------|
| **Algorithm None 攻击** | 攻击者将 header 改为 `"alg": "none"` 并删除签名；若服务端未强制算法则接受伪造令牌 | 验证时**显式指定允许的算法列表** |
| **密钥混淆（Key Confusion）** | RS256 服务端未强制算法，攻击者改为 HS256 并用**公开的 RSA 公钥**作为 HMAC 密钥签名 | 校验算法 + 禁止密钥混用 |
| **令牌侧劫持（Token Sidejacking）** | 令牌存 localStorage，XSS 漏洞可执行 `localStorage.getItem('token')` 窃取 | 使用 **HttpOnly Cookie** 存储 |
| **过期令牌重放** | 服务端不校验 `exp`，过期令牌永远有效 | 强制校验 `exp`，用 `jti` + 服务端撤销列表 |

### 8.2 其他高危实践
- **硬编码/弱密钥**：HS256 使用短、可猜测或提交进源码的密钥，可被离线暴力破解
- **跨环境复用密钥**：开发/测试/生产共用同一签名密钥，开发环境泄露即生产沦陷
- **不设过期时间**：等于签发永久凭证
- **Payload 放敏感数据**：Base64Url 可解码，任何持有令牌者都能看到

### 8.3 安全最佳实践清单
1. 验证时**强制白名单算法**（如仅允许 RS256）
2. 使用**强随机密钥**（≥256 bit），并用环境变量/密钥管理服务管理
3. 不同环境（dev/staging/prod）**使用不同密钥**
4. 始终设置并校验 `exp`，有效期尽量短（如 15 分钟 ~ 2 小时）
5. Payload **只放非敏感声明**（user_id、role）
6. 客户端存储优先 **HttpOnly + Secure + SameSite Cookie**（防 XSS 窃取；同时配 CSRF 防护）
7. 需要即时撤销时使用 `jti` + **黑名单/deny list**
8. 配合 **Refresh Token 轮换**：访问令牌过期后由刷新令牌换取新令牌，刷新令牌被重用则全部作废

---

## 9. 一句话总结

> JWT 是一个**签名自包含的令牌**，把用户身份信息编码进令牌本身，让服务端"验签即可信、无需查库"；代价是**难以即时撤销**，因此必须**短生命周期 + 严格校验算法/过期/密钥**，并结合 Refresh Token 机制使用。

---

## 参考来源

- RFC 7519（JSON Web Token 标准定义）
- jwt.io / freeCodeCamp：What Are JSON Web Tokens (JWT)?
- OWASP：JWT 相关攻击模式与防护指南
- AppSecMaster：JSON Web Token (JWT) Security Best Practices 2026
- DevLune：Sessions vs JWT: differences and which to choose
- BytePane：JWT Tokens Guide: Authentication Made Simple
*（内容由AI生成，仅供参考）*
