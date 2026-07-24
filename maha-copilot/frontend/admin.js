const $ = s => document.querySelector(s);
const api = (p, o) => fetch(p, o).then(r => r.json());
let DEPTS = [];

init();
async function init() {
  const d = await api("/api/departments");
  DEPTS = d.departments;
  $("#a-dept").innerHTML = DEPTS.map(x => `<option value="${x.slug}">${x.name}</option>`).join("");
  await refreshStats();
  $("#a-ingest").addEventListener("click", ingest);
  $("#a-reset").addEventListener("click", reset);
  const t = localStorage.getItem("admtok"); if (t) $("#a-token").value = t;
}

async function refreshStats() {
  const s = await api("/api/stats");
  $("#s-grs").textContent = s.total_grs;
  $("#s-chunks").textContent = s.total_chunks;
  $("#s-depts").textContent = s.departments_with_data;
  $("#s-mode").textContent = s.mock_mode ? "Mock" : "Live";
  const rows = DEPTS.map(x => {
    const n = (s.by_department || {})[x.slug] || 0;
    return `<tr><td>${x.name}</td><td>${n}</td></tr>`;
  }).join("");
  $("#deptRows").innerHTML = rows;
}

async function ingest() {
  const token = $("#a-token").value.trim();
  const files = $("#a-files").files;
  if (!token) return toast("Enter the admin token.");
  if (!files.length) return toast("Choose .mr.txt / .en.txt files.");
  localStorage.setItem("admtok", token);
  const btn = $("#a-ingest"); btn.disabled = true;
  $("#a-out").innerHTML = `<div class="hint"><span class="spinner dark" style="vertical-align:middle"></span> Chunking & embedding ${files.length} file(s)…</div>`;
  const fd = new FormData();
  fd.append("department", $("#a-dept").value);
  fd.append("doc_type", $("#a-type").value);
  for (const f of files) fd.append("files", f);
  try {
    const res = await fetch("/api/admin/ingest", { method: "POST", headers: { "X-Admin-Token": token }, body: fd });
    const data = await res.json();
    if (!res.ok) { $("#a-out").innerHTML = `<div class="answer">${data.detail || "Ingestion failed."}</div>`; return; }
    const ing = data.ingested || {};
    $("#a-out").innerHTML = `<div class="later-note" style="background:var(--current-bg); color:var(--current)">
      Ingested ${ing.documents} document(s) → ${ing.chunks} chunks into <b>${data.department}</b>.
      ${data.skipped?.length ? "Skipped: " + data.skipped.join(", ") : ""}</div>`;
    await refreshStats();
  } catch (e) { $("#a-out").innerHTML = `<div class="answer">Error: ${e}</div>`; }
  finally { btn.disabled = false; }
}

async function reset() {
  const token = $("#a-token").value.trim();
  if (!token) return toast("Enter the admin token.");
  if (!confirm("Delete ALL ingested GRs and chunks? This cannot be undone.")) return;
  const res = await fetch("/api/admin/reset", { method: "POST", headers: { "X-Admin-Token": token } });
  const data = await res.json();
  if (res.ok) { toast("Corpus reset."); await refreshStats(); }
  else toast(data.detail || "Reset failed.");
}

function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1800); }
