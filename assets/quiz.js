/* ============ 可复用交互测验组件 ============
 * 用法：HTML 中放入
 * <div class="quiz" data-quiz='[{"q":"...","opts":["A","B","C","D"],"a":1,"exp":"解析"}]'></div>
 * opts: 选项数组；a: 正确答案下标（0起）；exp: 答对/答错后展示的解析
 */
(function () {
  document.querySelectorAll(".quiz").forEach(function (box) {
    let items;
    try { items = JSON.parse(box.dataset.quiz); } catch (e) { return; }
    box.innerHTML = "";
    let score = 0, answered = 0;

    items.forEach(function (item, qi) {
      const card = document.createElement("div");
      card.className = "quiz-card";
      const q = document.createElement("p");
      q.className = "quiz-q";
      q.textContent = (qi + 1) + ". " + item.q;
      card.appendChild(q);
      const opts = document.createElement("div");
      opts.className = "quiz-opts";
      item.opts.forEach(function (opt, oi) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-opt";
        btn.textContent = opt;
        btn.addEventListener("click", function () {
          if (card.dataset.done) return;
          card.dataset.done = "1";
          answered++;
          const fb = document.createElement("p");
          fb.className = "quiz-fb";
          if (oi === item.a) { score++; btn.classList.add("right"); fb.classList.add("ok"); }
          else {
            btn.classList.add("wrong");
            opts.children[item.a].classList.add("right");
            fb.classList.add("bad");
          }
          fb.textContent = item.exp || (oi === item.a ? "正确！" : "再想想～");
          card.appendChild(fb);
          if (answered === items.length) showResult();
        });
        opts.appendChild(btn);
      });
      card.appendChild(opts);
      box.appendChild(card);
    });

    function showResult() {
      const r = document.createElement("div");
      r.className = "quiz-result";
      const pct = Math.round((score / items.length) * 100);
      r.innerHTML = "<b>得分：" + score + " / " + items.length + "（" + pct + "分）</b>" +
        (pct === 100 ? " 🎉 全对，可以进入下一章了！"
         : pct >= 60 ? " 👍 不错，建议回看错题对应的考点再继续。"
         : " 📖 建议重新阅读本课考点部分后再测一次。");
      box.appendChild(r);
    }
  });

  /* 测验样式（首次引入时注入） */
  if (!document.getElementById("quiz-style")) {
    const s = document.createElement("style");
    s.id = "quiz-style";
    s.textContent = `
      .quiz-card { border: 1px solid var(--line); border-radius: var(--radius); padding: 18px 22px; margin: 1.2em 0; }
      .quiz-q { font-weight: 600; font-family: "PingFang SC","Microsoft YaHei",sans-serif; margin: 0 0 12px; }
      .quiz-opts { display: grid; gap: 8px; }
      .quiz-opt {
        text-align: left; padding: 10px 14px; border: 1px solid var(--line);
        border-radius: 8px; background: #fff; cursor: pointer; font-size: 0.95rem;
        font-family: inherit; transition: all .15s;
      }
      .quiz-opt:hover { border-color: var(--accent); background: var(--accent-soft); }
      .quiz-opt.right { border-color: var(--accent); background: var(--accent-soft); font-weight: 600; }
      .quiz-opt.wrong { border-color: #c0392b; background: #fbeae8; }
      .quiz-fb { margin: 10px 0 0; font-size: 0.9rem; }
      .quiz-fb.ok { color: var(--accent); }
      .quiz-fb.bad { color: #c0392b; }
      .quiz-result { margin-top: 1.5em; padding: 16px 20px; border-radius: var(--radius);
        background: var(--accent-soft); font-family: "PingFang SC","Microsoft YaHei",sans-serif; }
    `;
    document.head.appendChild(s);
  }
})();
