# 0004 - 批量生成第4~11章（课程全部完成）

日期：2026-11-10

## 完成内容

一次性生成第4~11章全部课程（用户要求「一直生成到最后」），延续动手实践模式：

- 第4章 安全性：practice-ch4.sql（root 建 alice/bob 用户体验 DAC 授权/回收/级联）+ 练习场视图任务
- 第5章 完整性：练习场 3 任务（CHECK 拦截、外码报错 PRAGMA foreign_keys=ON、触发器计数）
- 第6章 范式：闭包法求候选码流程口诀 + 练习场模拟 2NF 分解（CREATE TABLE AS SELECT + JOIN 验证无损）
- 第7章 设计：E-R 图 SVG、转换规则、六阶段；quiz
- 第8章 编程：练习场行级触发器任务 + practice-ch8.sql（IN/OUT 存储过程、游标四步曲、审计触发器）
- 第9章 优化：启发式规则 + 练习场 2000 行大表 EXPLAIN QUERY PLAN 实验（递归 CTE 造数据）
- 第10章 恢复：ACID 保证机制对应表 + 练习场 BEGIN/ROLLBACK 原子性体验
- 第11章 并发：四类问题辨析、相容矩阵、2PL、等待图 + 练习场丢失修改复现 + MySQL 双终端并发实验

## 技术要点

- 第5章练习场开启 PRAGMA foreign_keys=ON 才能演示外码拦截（已在 DEMO_SETUP5 中内置）
- 各章 DEMO_SETUP 通过 window.DEMO_SETUPn 传递给 window.DEMO_SETUP，页面间相互独立
- 术语表已扩充第4~11章全部术语；第3章导航补齐「第4章 →」链接，1~11 章可线性串联

## 后续可做

- 模拟卷生成（按章节组卷）
- 用户 MySQL root 登录未验证，若失败协助重置
- 收官建议已写入第11章：打印术语表做检索自测
