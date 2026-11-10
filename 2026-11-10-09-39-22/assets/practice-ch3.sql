-- ============================================================
-- 数据库课程 第3章 SQL 实战练习脚本（MySQL 8.0）
-- 运行方法：
--   1. 打开终端，登录 MySQL：  mysql -u root -p
--   2. 输入密码后执行：        source D:/WorkBuddy_workspace/2026-11-10-09-39-22/assets/practice-ch3.sql
--   3. 或在 Navicat/MySQL Workbench/DBeaver 中直接打开本文件运行
-- ============================================================

DROP DATABASE IF EXISTS school_practice;
CREATE DATABASE school_practice CHARACTER SET utf8mb4;
USE school_practice;

-- ---------- 1. 建表（对照课程中 DDL 一节） ----------
CREATE TABLE student (
  sno   CHAR(4) PRIMARY KEY,            -- 实体完整性：主码
  sname VARCHAR(50) NOT NULL,
  ssex  CHAR(2),
  sage  INT
);

CREATE TABLE course (
  cno    CHAR(3) PRIMARY KEY,
  cname  VARCHAR(50) NOT NULL,
  credit INT
);

CREATE TABLE sc (
  sno   CHAR(4),
  cno   CHAR(3),
  grade INT,
  PRIMARY KEY (sno, cno),               -- 实体完整性：全码
  FOREIGN KEY (sno) REFERENCES student(sno),   -- 参照完整性：外码
  FOREIGN KEY (cno) REFERENCES course(cno)
);

-- ---------- 2. 插入示例数据（INSERT） ----------
INSERT INTO student VALUES
  ('S1','张三','男',19),
  ('S2','李四','女',20),
  ('S3','王五','男',19),
  ('S4','赵六','女',21);

INSERT INTO course VALUES
  ('C1','数据库',4),
  ('C2','数据结构',3),
  ('C3','操作系统',3);

INSERT INTO sc VALUES
  ('S1','C1',92),
  ('S1','C2',85),
  ('S1','C3',76),
  ('S2','C1',78),
  ('S2','C2',65),
  ('S3','C3',88);

-- ---------- 3. 动手任务（一次取消一行注释来练习） ----------

-- 任务A 单表查询：查询年龄大于19的学生姓名和年龄
-- SELECT sname, sage FROM student WHERE sage > 19 ORDER BY sage;

-- 任务B 聚合分组：每个学生的选课门数和平均分
-- SELECT sno, COUNT(*) AS cnt, ROUND(AVG(grade),2) AS avg_g
-- FROM sc GROUP BY sno ORDER BY sno;

-- 任务C 连接查询：选修了「数据库」的学生姓名和成绩
-- SELECT s.sname, sc.grade
-- FROM student s JOIN sc ON s.sno = sc.sno
-- JOIN course c ON sc.cno = c.cno
-- WHERE c.cname = '数据库'
-- ORDER BY sc.grade DESC;

-- 任务D 数据更新：把李四的数据库成绩加 5 分，然后验证
-- UPDATE sc SET grade = grade + 5 WHERE sno='S2' AND cno='C1';
-- SELECT grade FROM sc WHERE sno='S2' AND cno='C1';   -- 应为 83

-- 任务E 视图：建立女生视图并查询
-- CREATE VIEW v_female AS SELECT sno, sname, sage FROM student WHERE ssex='女';
-- SELECT * FROM v_female ORDER BY sage;

-- ---------- 4. 体会完整性约束（故意触发报错） ----------
-- 下面三条各执行一次，观察报错信息，理解三类完整性：
-- INSERT INTO sc VALUES ('S9','C1',90);            -- 违反参照完整性：S9 学生不存在
-- INSERT INTO student VALUES ('S1','重名','男',18); -- 违反实体完整性：主码重复
-- INSERT INTO sc VALUES ('S3','C1',150);           -- 若加 CHECK (grade<=100) 可被用户定义完整性拦截
