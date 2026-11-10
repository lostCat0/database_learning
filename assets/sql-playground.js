/* ============ 可复用 SQL 练习场组件（基于 sql.js / SQLite WASM） ============
 * 用法：页面引入
 *   <script src="../assets/sqljs/sql-wasm.js"></script>
 *   <script src="../assets/sqljs/sql-wasm-b64.js"></script>
 *   <script src="../assets/sql-playground.js"></script>
 * 然后放入容器：
 *   <div class="sql-pg" data-setup="CREATE TABLE ...;INSERT ...;" data-title="练习1"></div>
 * 支持属性：
 *   data-setup  初始化 SQL（建表+插入示例数据，每次运行前重置）
 *   data-title  练习标题
 *   data-task   任务要求文本
 *   data-hint   提示（点击展开）
 *   data-check  校验 SQL（查询期望结果的验证语句，可选；运行用户 SQL 后执行比对行数与内容）
 */
(function () {
  const STYLE = `
    .sql-pg { border: 1px solid var(--line); border-radius: var(--radius); margin: 1.6em 0; overflow: hidden; }
    .sql-pg-head { background: var(--code-bg); padding: 10px 16px; font-family: "PingFang SC","Microsoft YaHei",sans-serif; font-size: .95rem; font-weight: 600; display:flex; justify-content:space-between; align-items:center; }
    .sql-pg-task { padding: 12px 16px 0; font-size: .95rem; }
    .sql-pg textarea {
      display:block; width: calc(100% - 32px); margin: 10px 16px; min-height: 110px;
      font-family: "JetBrains Mono", Consolas, monospace; font-size: .9rem;
      border: 1px solid var(--line); border-radius: 8px; padding: 12px;
      background: #fff; resize: vertical; line-height: 1.6;
    }
    .sql-pg textarea:focus { outline: 2px solid var(--accent-soft); border-color: var(--accent); }
    .sql-pg-bar { padding: 0 16px 12px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .sql-pg-btn {
      background: var(--accent); color: #fff; border: none; border-radius: 8px;
      padding: 8px 22px; font-size: .95rem; cursor: pointer; font-family: inherit;
    }
    .sql-pg-btn:hover { filter: brightness(1.1); }
    .sql-pg-btn.ghost { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
    .sql-pg-reset { font-size: .85rem; }
    .sql-pg-hint-btn { font-size: .85rem; background: none; border: none; color: var(--accent); cursor: pointer; text-decoration: underline; padding:0; font-family: inherit; }
    .sql-pg-status { font-size: .88rem; color: var(--ink-soft); }
    .sql-pg-status.ok { color: var(--accent); font-weight: 600; }
    .sql-pg-status.err { color: #c0392b; }
    .sql-pg-out { padding: 0 16px 16px; }
    .sql-pg-out table { font-size: .86rem; font-family: "JetBrains Mono", Consolas, monospace; margin: 0; }
    .sql-pg-note { font-size: .82rem; color: var(--ink-soft); margin-top: 6px; }`;

  if (!document.getElementById("sql-pg-style")) {
    const s = document.createElement("style");
    s.id = "sql-pg-style";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  let SQL_READY = null;
  function getSQL() {
    if (!SQL_READY) {
      SQL_READY = initSqlJs({ wasmBinary: b64ToBytes(window.SQL_WASM_B64) });
    }
    return SQL_READY;
  }

  function rowsToTable(res) {
    if (!res || res.length === 0) return "<p class='sql-pg-note'>查询成功，但没有返回行。</p>";
    const cols = res[0].columns;
    let html = "<table><tr>" + cols.map(c => "<th>" + c + "</th>").join("") + "</tr>";
    for (const v of res[0].values) {
      html += "<tr>" + v.map(x => "<td>" + (x === null ? "<i>NULL</i>" : x) + "</td>").join("") + "</tr>";
    }
    return html + "</table><p class='sql-pg-note'>共 " + res[0].values.length + " 行</p>";
  }

  function execAll(db, sql) {
    return db.exec(sql);
  }

  function normRows(res) {
    if (!res || !res.length) return "";
    return JSON.stringify(res.values.map(r => r.map(x => x === null ? "N" : String(x))));
  }

  document.querySelectorAll(".sql-pg").forEach(function (el) {
    // data-setup 写 "@demo" 时，使用页面全局 window.DEMO_SETUP 中的示例数据集
    const setup = el.dataset.setup === "@demo" ? (window.DEMO_SETUP || "") : (el.dataset.setup || "");
    const check = el.dataset.check || "";
    const startCode = el.dataset.start || "";
    el.innerHTML =
      '<div class="sql-pg-head"><span>' + (el.dataset.title || "SQL 练习场") + "</span>" +
      '<button type="button" class="sql-pg-hint-btn">显示提示</button></div>' +
      (el.dataset.task ? '<div class="sql-pg-task">🎯 ' + el.dataset.task + "</div>" : "") +
      "<textarea spellcheck='false'></textarea>" +
      '<div class="sql-pg-bar"><button type="button" class="sql-pg-btn run">▶ 运行</button>' +
      '<button type="button" class="sql-pg-btn ghost reset sql-pg-reset">↺ 重置</button>' +
      '<span class="sql-pg-status"></span></div>' +
      '<div class="sql-pg-out" style="display:none"></div>' +
      '<div class="sql-pg-hint" style="display:none;padding:0 16px 16px;font-size:.9rem"></div>';

    const ta = el.querySelector("textarea");
    const hint = el.querySelector(".sql-pg-hint");
    if (el.dataset.hint) hint.innerHTML = "💡 " + el.dataset.hint;
    const hintBtn = el.querySelector(".sql-pg-hint-btn");
    if (!el.dataset.hint) hintBtn.style.display = "none";
    hintBtn.addEventListener("click", function () {
      const showing = hint.style.display !== "none";
      hint.style.display = showing ? "none" : "block";
      hintBtn.textContent = showing ? "显示提示" : "隐藏提示";
    });

    const status = el.querySelector(".sql-pg-status");
    const out = el.querySelector(".sql-pg-out");

    async function reset() {
      const SQL = await getSQL();
      const db = new SQL.Database();
      if (setup) execAll(db, setup);
      return db;
    }

    let db = null;
    getSQL().then(function (SQL) {
      db = new SQL.Database();
      if (setup) execAll(db, setup);
      ta.value = startCode;
      status.textContent = "✅ 练习场就绪（内置 SQLite 引擎，示例数据已加载）";
    });

    el.querySelector(".run").addEventListener("click", async function () {
      if (!db) { status.textContent = "引擎加载中，稍候…"; return; }
      const sql = ta.value.trim();
      if (!sql) return;
      status.className = "sql-pg-status";
      try {
        const res = execAll(db, sql);
        out.style.display = "block";
        let html = "";
        if (el.dataset.expect) {
          // 与期望结果（JSON 数组的行）比对：查询任务、增删改任务（以验证 SELECT 结尾）均适用
          const want = JSON.stringify(el.dataset.expect.replace(/'/g, '"').split(";").map(r => r.split(",").map(x => x.trim())));
          const got = res.length ? normRows({ values: res[res.length - 1].values }) : "";
          const same = got !== "" && got === want;
          if (res.length) html += rowsToTable(res);
          status.className = "sql-pg-status " + (same ? "ok" : "err");
          status.textContent = same ? "🎉 结果正确！" : "结果和期望不一致，再试试（可点「显示提示」）";
          if (!same) html += "<p class='sql-pg-note'>提示：确认列的顺序与个数和任务要求一致，并确认最后一条语句是验证用的 SELECT。</p>";
        } else {
          if (res.length) html += rowsToTable(res); else html = "<p class='sql-pg-note'>执行成功。</p>";
          status.className = "sql-pg-status ok";
          status.textContent = "✅ 执行成功";
        }
        out.innerHTML = html;
      } catch (e) {
        out.style.display = "block";
        out.innerHTML = "";
        status.className = "sql-pg-status err";
        status.textContent = "❌ " + e.message;
      }
    });

    el.querySelector(".reset").addEventListener("click", async function () {
      db = await reset();
      ta.value = startCode;
      out.style.display = "none";
      status.className = "sql-pg-status";
      status.textContent = "↺ 已重置（示例数据已恢复）";
    });
  });
})();
