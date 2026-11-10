-- ============================================================
-- 数据库课程 第4章 数据库安全性 实战脚本（MySQL 8.0，需 root 身份）
-- 运行：登录 mysql -u root -p 后执行
--       source D:/WorkBuddy_workspace/2026-11-10-09-39-22/assets/practice-ch4.sql
-- ============================================================

DROP DATABASE IF EXISTS sec_practice;
CREATE DATABASE sec_practice CHARACTER SET utf8mb4;
USE sec_practice;

CREATE TABLE secret_info (
  id   INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  salary INT            -- 敏感列：练习视图隐藏它
);
INSERT INTO secret_info VALUES (1,'张三',12000), (2,'李四',15000);

-- ---------- 1. 创建两个实验用户 ----------
CREATE USER 'alice'@'localhost' IDENTIFIED BY 'Alice_Pass123';
CREATE USER 'bob'@'localhost'   IDENTIFIED BY 'Bob_Pass45678';

-- ---------- 2. 授权（GRANT） ----------
-- alice：只能查整个库
GRANT SELECT ON sec_practice.* TO 'alice'@'localhost';

-- bob：可查可插 secret_info 表，并且可以把权限转授给别人（WITH GRANT OPTION）
GRANT SELECT, INSERT ON sec_practice.secret_info TO 'bob'@'localhost' WITH GRANT OPTION;

-- ---------- 3. 验证自主存取控制（DAC） ----------
-- 新开一个终端，分别登录测试：
--   mysql -u alice -p
--     SELECT * FROM sec_practice.secret_info;   -- 成功
--     INSERT INTO sec_practice.secret_info VALUES(3,'王五',9000);  -- 报错：权限不足！
--   mysql -u bob -p
--     INSERT INTO sec_practice.secret_info VALUES(3,'王五',9000);  -- 成功

-- ---------- 4. 视图机制：隐藏敏感列 ----------
-- root 创建视图，只暴露姓名、隐藏工资：
CREATE OR REPLACE VIEW v_public AS SELECT id, name FROM secret_info;
GRANT SELECT ON sec_practice.v_public TO 'alice'@'localhost';
-- alice 再查： SELECT * FROM sec_practice.v_public;   -- 看不到 salary 列！

-- ---------- 5. 收回权限（REVOKE） ----------
REVOKE INSERT ON sec_practice.secret_info FROM 'bob'@'localhost';
-- bob 再执行 INSERT 会报错；注意：他转授出去的权限也会被级联回收

-- ---------- 6. 清理 ----------
-- DROP USER 'alice'@'localhost';
-- DROP USER 'bob'@'localhost';
-- DROP DATABASE sec_practice;
