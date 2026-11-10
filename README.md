# 数据库系统课程 · 11 章完全学习路径

一个纯静态的数据库教学网站：理论考点 × 动手实践 × 交互自测，
以王珊《数据库系统概论》章节体系为主线，SQL 练习环境为 MySQL（浏览器内嵌 SQLite 练习场，零安装即可上手）。

## ✨ 特性

- **11 章系统课程**：绪论 → 关系模型 → SQL → 安全性 → 完整性 → 范式 → 设计 → 编程 → 优化 → 恢复 → 并发控制
- **内嵌 SQL 练习场**：基于 sql.js（SQLite WASM）浏览器内运行，自动批改任务结果，无需任何后端
- **交互自测**：每章 4~6 道选择题，即时反馈与解析
- **考点标注**：每章「★ 考点」框串联即复习提纲；全程术语表（`reference/glossary.html`）
- **本机实战脚本**：`assets/practice-ch3.sql`、`practice-ch4.sql`、`practice-ch8.sql`（MySQL 8.0）

## 🚀 部署到 GitHub Pages（完整步骤）

> 站点为纯静态 HTML/CSS/JS，无构建步骤，以下一次配好，之后每次 `git push` 自动重新部署。

### 1. 初始化本地仓库并提交（已在本地完成）

```bash
git init -b main
git add .
git commit -m "数据库课程站点：11 章课程 + 术语表 + SQL 练习场"
```

### 2. 创建 GitHub 仓库并推送

```bash
# 在 GitHub 网页上新建一个空仓库（不要勾选 README/gitignore 初始化），然后：
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

### 3. 开启 Pages 托管

推荐方式（**GitHub Actions 部署**，已内置工作流 `.github/workflows/deploy.yml`）：

1. 打开仓库页面 → **Settings** → **Pages**
2. **Build and deployment → Source** 选择 **GitHub Actions**
3. 推送后工作流自动运行（或到 **Actions** 页手动 Run workflow）
4. 部署成功后访问：`https://<你的用户名>.github.io/<仓库名>/`

备用方式（**分支部署**）：Settings → Pages → Source 选 **Deploy from a branch** → 分支 `main`、目录 `/ (root)` → Save。

### 4. 本地预览（可选）

```bash
# 任选其一：
python -m http.server 8080
npx serve .
# 打开 http://localhost:8080
```

> 直接双击 `index.html` 也能用（课程页面均为相对路径引用，WASM 已 base64 内嵌，file:// 下可完整运行）。

## 📁 目录结构

```
├── index.html                  # 课程首页（11 章导航）
├── lessons/                    # 11 章课程（每章含自测与动手任务）
├── reference/glossary.html     # 全程术语表
├── assets/
│   ├── course.css              # 共享样式
│   ├── quiz.js                 # 交互自测组件
│   ├── sql-playground.js       # SQL 练习场组件
│   ├── sqljs/                  # sql.js 引擎（WASM 已 base64 内嵌）
│   └── practice-ch*.sql        # MySQL 实战脚本
├── .github/workflows/deploy.yml # GitHub Pages 部署工作流
└── .nojekyll                   # 禁用 Jekyll 处理
```

## 📚 主资源

- 中国大学MOOC《数据库系统概论(基础篇/高级篇)》—— 中国人民大学 王珊等主讲
- 教材：王珊等《数据库系统概论（第6版）》高等教育出版社
