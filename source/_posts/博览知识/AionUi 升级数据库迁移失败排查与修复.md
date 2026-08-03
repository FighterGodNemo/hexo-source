---
title: AionUi 升级数据库迁移失败排查与修复
date: 2026-07-30 12:00:00
permalink: /2026/07/30/博览知识/AionUi-升级数据库迁移失败排查与修复/
categories:
  - 博览知识
tags:
  - AionUi
  - SQLite
  - 数据库迁移
  - 排查
created: 2026-07-30T12:00
updated: 2026-08-03T14:11
---

## 问题现象

AionUi 从 2.1.41 更新到 2.1.43 后，启动时报错：

> 本地数据迁移失败 — AionCore 在初始化本地数据时发生了错误

界面能加载，但后端一直卡在 `Initializing database`，6 分钟后超时失败。

## 初步尝试（均无效）

1. **删除 WAL/SHM 残留文件**：`aionui-backend.db-shm`、`aionui-backend.db-wal`、`instance.lock`、`migrate.lock` — 无效，仍然卡住。
2. **从最近的自动备份恢复数据库**：7 月 20 日的 `bak-filesystem-safe-roots` 备份 — 同样无效，说明备份文件内也有同样的问题数据。
3. **用全新空数据库启动**：能正常启动，但所有历史数据丢失 — 证实 2.1.43 程序本身没问题，问题出在数据库迁移。

## 关键诊断步骤

用 AionCore 自带的 debug 模式直接运行，抓取详细日志：

```bash
aioncore.exe --local --log-level debug --data-dir <data-dir> --log-dir <temp-dir> --port 25809
```

日志中捕获到关键错误：

```text
Error: Failed to initialize the database: SqliteError: CHECK constraint failed:
rule_resource_type IN ('none', 'builtin_asset', 'user_file', 'extension')
```

迁移第 30 步（migration 30）在 `assistant_definitions` 表上添加了一个 CHECK 约束，要求 `rule_resource_type` 只能是上述四种值。

然后用 Node.js + better-sqlite3 查询数据库：

```js
const db = new Database('aionui-backend.db', { readonly: true });
const rows = db.prepare(
  "SELECT id, name, rule_resource_type FROM assistant_definitions WHERE rule_resource_type NOT IN ('none','builtin_asset','user_file','extension')"
).all();
console.log(rows);
```

输出：

```json
[{ "id": "...", "name": "Hayo酱", "rule_resource_type": "inline" }]
```

## 根因

`assistant_definitions` 表中 `Hayo酱` 助手的 `rule_resource_type` 值为 `inline`，这是老版本（AionCore v0.1.53）允许的值，但新版本 v0.1.54 的迁移 30 将其排除在外（只接受 `none`、`builtin_asset`、`user_file`、`extension`），导致 CHECK 约束添加失败，整个数据库初始化阻塞。

## 修复

使用 better-sqlite3 直接修改不合规数据：

```js
const db = new Database('aionui-backend.db');
db.prepare(
  "UPDATE assistant_definitions SET rule_resource_type = 'builtin_asset' WHERE rule_resource_type = 'inline'"
).run();
db.close();
```

修改后重启 AionUi，数据库迁移顺利通过，所有历史数据完好。

## 总结

| 步骤 | 结果 |
|------|------|
| 删除 WAL/SHM | 无效 |
| 恢复备份数据库 | 无效（备份含同样脏数据） |
| 空数据库启动 | 能启动但丢数据 |
| Debug 模式抓日志 | 定位到 migration 30 CHECK 约束 |
| 查询不合规数据 | 确认 `Hayo酱` 的 `inline` 值 |
| 修改 `inline` → `builtin_asset` | **修复成功** |

> 💡 **教训**：数据库迁移失败时，不要盲目清除文件。用 debug 日志定位具体迁移步骤和违例数据行，精准修复远比重装高效。
