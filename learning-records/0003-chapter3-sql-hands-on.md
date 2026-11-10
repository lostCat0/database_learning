# 0003 - 第3章 SQL 语言 + 引入动手实践环节

日期：2026-11-10

## 用户需求变化（重要）

用户明确要求：学习过程中加入动手实践环节，利用 SQL 数据库工具做小任务辅助理解概念。
此后每章课程都应包含可操作的实践任务，不只是理论讲解。

## 完成内容

- 课程文件 lessons/0003-chapter3-sql.html，含 6 个内嵌动手任务（1b 约束体验 + 5 个正式任务）
- **发现用户本机已装 MySQL Server 8.0.46**（`C:\Program Files\MySQL\MySQL Server 8.0`）
- 双通道实践设计：
  1. 课程内嵌 SQL 练习场（sql.js/SQLite WASM，assets/sqljs/ + assets/sql-playground.js 组件），
     自动批改（data-expect 期望结果比对），零安装即时反馈
  2. 本机真实 MySQL：assets/practice-ch3.sql 一键建库脚本（任务 A~E + 故意报错体验完整性约束）
- 术语表新增第3章术语（DDL/DML/DCL、视图、WHERE vs HAVING、DROP/DELETE/TRUNCATE 等）

## 技术要点（复用经验）

- sql.js wasm 必须 base64 内嵌为**单行** JS 字符串（printf 不带换行；echo 的换行会导致 JS 字符串语法错误），
  这样课程 HTML 双击 file:// 打开也能运行，不依赖 CDN
- 练习场组件 assets/sql-playground.js：textarea + 运行/重置 + 自动批改 + 提示展开，页面用 window.DEMO_SETUP 共享示例数据集（data-setup="@demo"）
- 已用 Node 验证引擎加载与各任务期望结果全部正确

## 待办

- 用户 MySQL root 密码未知，若登录失败需协助（免密重置或指导）
- 第4章起延续「讲解 + 动手任务」模式
