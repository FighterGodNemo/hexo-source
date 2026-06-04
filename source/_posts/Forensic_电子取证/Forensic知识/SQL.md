---
title: SQL
permalink: /2026/03/15/Forensic_电子取证/Forensic知识/SQL/
date: 2026-03-15 13:28:28
categories:
  - Forensic_电子取证
  - Forensic知识
tags:
  - 电子取证
  - 取证知识
  - SQL
created: 2026-03-15T16:49
updated: 2026-06-04T14:56
---
![](SQL/1762580652161-beb65500-89ec-40e7-b5a9-61b6dfced07a.png)


## SQL 语言基础

SQL（Structured Query Language）是结构化查询语言，用于对关系型数据库中的数据进行查询、插入、更新、删除和管理。

学习 SQL 时要先分清两件事：一是语句的固定书写顺序，二是数据库内部的实际执行逻辑。它们不是完全一样的。

### 查询语句的固定书写顺序

常见查询语句按下面的顺序写：

```sql
SELECT ...
FROM ...
WHERE ...
GROUP BY ...
HAVING ...
ORDER BY ...
LIMIT ...
```

对应含义如下：

| 关键字        | 作用        |
| ---------- | --------- |
| `SELECT`   | 选择要输出哪些列  |
| `FROM`     | 从哪张表取数据   |
| `WHERE`    | 分组前筛选原始行  |
| `GROUP BY` | 按哪些字段分组   |
| `HAVING`   | 分组后筛选聚合结果 |
| `ORDER BY` | 排序        |
| `LIMIT`    | 限制返回行数    |

### 查询语句的执行逻辑

虽然语法上 `SELECT` 写在最前面，但数据库理解查询时，大致更接近下面这个顺序：

```text
FROM
WHERE
GROUP BY
HAVING
SELECT
ORDER BY
LIMIT
```

所以 `GROUP BY` 虽然写在 `SELECT` 后面，但逻辑上会先完成分组，再让 `SELECT` 输出分组后的字段和聚合结果。

### 例子：按欺诈状态和性别统计占比

```sql
SELECT
    FraudFound_P AS `是否发现欺诈`,
    Sex AS `性别`,
    ROUND(
        COUNT(*) / SUM(COUNT(*)) OVER(PARTITION BY FraudFound_P),
        4
    ) AS `占比`
FROM fraud
GROUP BY FraudFound_P, Sex;
```

这条语句先按 `FraudFound_P` 和 `Sex` 分组，算出每个“是否欺诈 + 性别”组合的数量。

然后：

```sql
SUM(COUNT(*)) OVER(PARTITION BY FraudFound_P)
```

会在同一个 `FraudFound_P` 里面，把各个性别分组的数量加起来，得到该欺诈状态下的总数。

最后计算：

```text
某个欺诈状态下某个性别的数量 / 该欺诈状态下的总数量
```

也就是这个性别在该欺诈状态中的占比。

### WHERE 和 HAVING 的区别

`WHERE` 和 `HAVING` 都能筛选数据，但筛选阶段不同：

```text
WHERE  过滤原始行，发生在 GROUP BY 之前
HAVING 过滤分组结果，发生在 GROUP BY 之后
```

例如：

```sql
SELECT
    Sex,
    COUNT(*) AS cnt
FROM fraud
WHERE Age > 30
GROUP BY Sex
HAVING COUNT(*) > 10
ORDER BY cnt DESC;
```

这里 `WHERE Age > 30` 是先筛出年龄大于 30 的原始记录，再按性别分组；`HAVING COUNT(*) > 10` 是分组之后，只保留数量大于 10 的性别分组。
