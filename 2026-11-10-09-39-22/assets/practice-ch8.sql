-- ============================================================
-- 数据库课程 第8章 数据库编程 实战脚本（MySQL 8.0，root 或普通用户均可）
-- 运行：source D:/WorkBuddy_workspace/2026-11-10-09-39-22/assets/practice-ch8.sql
-- ============================================================

DROP DATABASE IF EXISTS prog_practice;
CREATE DATABASE prog_practice CHARACTER SET utf8mb4;
USE prog_practice;

CREATE TABLE student (
  sno CHAR(4) PRIMARY KEY, sname VARCHAR(50), sage INT
);
INSERT INTO student VALUES ('S1','张三',19),('S2','李四',20),('S3','王五',19),('S4','赵六',21);

-- ---------- 1. 存储过程（PROCEDURE） ----------
DELIMITER //                          -- 把语句结束符临时换成 //，防止分号截断过程体

-- 过程1：按学号查询学生，并用 OUT 参数返回其年龄
CREATE PROCEDURE get_age(IN p_sno CHAR(4), OUT p_age INT)
BEGIN
  SELECT sage INTO p_age FROM student WHERE sno = p_sno;
END //

-- 调用：CALL 需要 SET 变量接住 OUT 结果
CALL get_age('S2', @age);
SELECT @age AS 李四的年龄;             -- 应为 20

-- 过程2：带逻辑的批量操作——给所有年龄>19 的学生标记（演示 IF 判断）
CREATE PROCEDURE bump_adults()
BEGIN
  IF EXISTS (SELECT 1 FROM student WHERE sage > 19) THEN
    SELECT COUNT(*) AS 成年学生数 FROM student WHERE sage > 19;
  ELSE
    SELECT '没有成年学生' AS 提示;
  END IF;
END //
CALL bump_adults();

-- ---------- 2. 游标（CURSOR）：逐行处理 ----------
CREATE PROCEDURE list_by_row()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_name VARCHAR(50);
  -- 声明游标：绑定一个结果集
  DECLARE cur CURSOR FOR SELECT sname FROM student ORDER BY sno;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;   -- 取完行的信号

  OPEN cur;                          -- 打开游标
  read_loop: LOOP
    FETCH cur INTO v_name;           -- 逐行取
    IF done = 1 THEN LEAVE read_loop; END IF;
    SELECT v_name AS 当前处理的学生;   -- 主语言里这里通常是业务逻辑
  END LOOP;
  CLOSE cur;                         -- 关闭游标
END //
CALL list_by_row();

DELIMITER ;                           -- 恢复分号

-- ---------- 3. 触发器（TRIGGER，回顾第5章 + 实战） ----------
CREATE TABLE audit_log (msg VARCHAR(100), ts DATETIME DEFAULT CURRENT_TIMESTAMP);

DELIMITER //
CREATE TRIGGER trg_after_insert
AFTER INSERT ON student FOR EACH ROW
BEGIN
  INSERT INTO audit_log VALUES (CONCAT('新学生：', NEW.sno, ' ', NEW.sname), DEFAULT);
END //
DELIMITER ;

INSERT INTO student VALUES ('S5','孙七',18);
SELECT * FROM audit_log;              -- 自动出现一条审计记录

-- ---------- 4. 清理 ----------
-- DROP DATABASE prog_practice;
