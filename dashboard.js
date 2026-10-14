const $ = (id) => document.getElementById(id);
const cfg = window.QUIZ_CONFIG || {};
const AUTO_REFRESH_MS = 60000;

let rows = [];
let timer = null;

function apiUrl() {
  const base = (cfg.supabaseUrl || "").replace(/\/$/, "");
  const table = cfg.tableName || "quiz_responses";
  const params = new URLSearchParams({
    select: "id,submitted_at,score,total_questions,answers",
    order: "submitted_at.desc",
    limit: "5000"
  });
  return `${base}/rest/v1/${table}?${params}`;
}

async function loadData() {
  const status = $("lastUpdated");
  const banner = $("errorBanner");
  banner.classList.add("hidden");

  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    banner.textContent = "Falta configurar Supabase en config.js (supabaseUrl y supabaseAnonKey).";
    banner.classList.remove("hidden");
    status.textContent = "Sin conexión a la base de datos.";
    return;
  }

  status.textContent = "Cargando datos…";
  $("refreshBtn").disabled = true;
  try {
    const res = await fetch(apiUrl(), {
      headers: {
        apikey: cfg.supabaseAnonKey,
        Authorization: `Bearer ${cfg.supabaseAnonKey}`
      }
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Error de Supabase:", res.status, body);
      if (res.status === 401 || res.status === 403) {
        banner.innerHTML = "Supabase no permite leer la tabla todavía. Ejecutá el contenido de <code>supabase-schema.sql</code> en el SQL Editor de Supabase (incluye la política de lectura para el dashboard).";
      } else {
        banner.textContent = `No se pudieron obtener los datos (HTTP ${res.status}).`;
      }
      banner.classList.remove("hidden");
      status.textContent = "Error al actualizar.";
      return;
    }
    rows = await res.json();
    render();
    status.textContent = `Actualizado: ${new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}`;
  } catch (err) {
    console.error(err);
    banner.textContent = "No se pudo conectar con Supabase. Revisá la conexión a internet o la URL en config.js.";
    banner.classList.remove("hidden");
    status.textContent = "Error al actualizar.";
  } finally {
    $("refreshBtn").disabled = false;
  }
}

function render() {
  renderKpis();
  renderScoreChart();
  renderQuestionChart();
  renderTable();
  $("csvBtn").disabled = rows.length === 0;
}

function renderKpis() {
  const total = rows.length;
  const sum = rows.reduce((acc, r) => acc + (Number(r.score) || 0), 0);
  const avg = total ? sum / total : 0;
  const per = total * 6;
  const correct = rows.reduce((acc, r) => acc + correctCount(r), 0);
  const perfect = rows.filter((r) => Number(r.score) >= Number(r.total_questions || 6)).length;

  $("kpiTotal").textContent = total.toLocaleString("es-AR");
  $("kpiAvg").textContent = total ? avg.toFixed(1) : "—";
  $("kpiAvgSub").textContent = total ? `de 6 puntos · ${((avg / 6) * 100).toFixed(0)}%` : "sin datos";
  $("kpiAccuracy").textContent = per ? `${((correct / per) * 100).toFixed(0)}%` : "—";
  $("kpiAccuracySub").textContent = `${correct} de ${per} respuestas correctas`;
  $("kpiPerfect").textContent = perfect.toLocaleString("es-AR");
}

function correctCount(row) {
  if (!Array.isArray(row.answers)) return Number(row.score) || 0;
  return row.answers.filter((a) => a && a.correct === true).length;
}

function renderScoreChart() {
  const total = rows.length;
  const counts = Array.from({ length: 7 }, (_, s) => rows.filter((r) => Number(r.score) === s).length);
  const max = Math.max(...counts, 1);
  $("scoreChart").innerHTML = counts.map((count, score) => {
    const pct = total ? (count / total) * 100 : 0;
    const cls = score === 6 ? "perfect" : score <= 2 ? "low" : "";
    return `
      <div class="bar-row">
        <span class="bar-label">${score} de 6</span>
        <div class="bar-track"><div class="bar-fill ${cls}" style="width:${(count / max) * 100}%"></div></div>
        <span class="bar-value">${count} · ${pct.toFixed(0)}%</span>
      </div>`;
  }).join("");
}

function questionStats() {
  const stats = new Map();
  rows.forEach((row) => {
    if (!Array.isArray(row.answers)) return;
    row.answers.forEach((a, i) => {
      if (!a || typeof a.question !== "string") return;
      const key = a.question;
      if (!stats.has(key)) stats.set(key, { question: key, index: i, total: 0, correct: 0, options: {} });
      const entry = stats.get(key);
      entry.total += 1;
      if (a.correct === true) entry.correct += 1;
      const opt = a.selected_option;
      if (typeof opt === "string") entry.options[opt] = (entry.options[opt] || 0) + 1;
    });
  });
  return [...stats.values()].sort((a, b) => a.index - b.index);
}

function renderQuestionChart() {
  const stats = questionStats();
  if (!stats.length) {
    $("questionChart").innerHTML = `<p class="muted">Sin datos de respuestas todavía.</p>`;
    return;
  }
  $("questionChart").innerHTML = stats.map((q, i) => {
    const pct = q.total ? (q.correct / q.total) * 100 : 0;
    const cls = pct >= 70 ? "perfect" : pct < 40 ? "low" : "";
    const short = q.question.length > 58 ? q.question.slice(0, 58).trimEnd() + "…" : q.question;
    return `
      <div class="bar-row" title="${escapeAttr(q.question)}">
        <span class="bar-label">${i + 1}. ${escapeHtml(short)}</span>
        <div class="bar-track"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div>
        <span class="bar-value">${pct.toFixed(0)}% · ${q.correct}/${q.total}</span>
      </div>`;
  }).join("");
}

function renderTable() {
  const body = $("rowsBody");
  const empty = $("emptyState");
  if (!rows.length) {
    body.innerHTML = "";
    empty.classList.remove("hidden");
    $("tableCount").textContent = "";
    return;
  }
  empty.classList.add("hidden");
  $("tableCount").textContent = `${rows.length} participacion(es)`;
  body.innerHTML = rows.map((r) => {
    const score = Number(r.score) || 0;
    const total = Number(r.total_questions) || 6;
    const pct = (score / total) * 100;
    const cls = score === total ? "perfect" : score >= 4 ? "good" : score >= 2 ? "mid" : "low";
    const label = score === total ? "Perfecto" : score >= 4 ? "Muy bien" : score >= 2 ? "En proceso" : "A reforzar";
    const date = r.submitted_at ? new Date(r.submitted_at) : null;
    const fecha = date && !isNaN(date)
      ? date.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
      : "—";
    return `
      <tr>
        <td>${escapeHtml(String(r.id ?? "—"))}</td>
        <td>${fecha}</td>
        <td><strong>${score}/${total}</strong></td>
        <td>${pct.toFixed(0)}%</td>
        <td><span class="badge ${cls}">${label}</span></td>
      </tr>`;
  }).join("");
}

function exportCsv() {
  if (!rows.length) return;
  const head = ["id", "fecha", "puntaje", "total_preguntas", "respuestas"];
  const lines = [head.join(";")];
  rows.forEach((r) => {
    const fecha = r.submitted_at ? new Date(r.submitted_at).toLocaleString("es-AR") : "";
    const answers = Array.isArray(r.answers) ? JSON.stringify(r.answers) : "";
    lines.push([r.id, fecha, r.score, r.total_questions, answers]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";"));
  });
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quiz-resultados-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/\n/g, " ");
}

function setAutoRefresh(enabled) {
  if (timer) clearInterval(timer);
  timer = enabled ? setInterval(loadData, AUTO_REFRESH_MS) : null;
}

$("refreshBtn").addEventListener("click", loadData);
$("csvBtn").addEventListener("click", exportCsv);
$("autoRefresh").addEventListener("change", (e) => setAutoRefresh(e.target.checked));
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) loadData();
});

loadData();
setAutoRefresh($("autoRefresh").checked);
