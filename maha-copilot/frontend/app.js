/* Maha Copilot — dashboard logic */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const api = (p, o) => fetch(p, o).then(r => r.json());

const VIEW_META = {
  copilot:   ["Maha Copilot", "Ask across the GR corpus — grounded, cited, bilingual."],
  letter:    ["Letter Drafting", "Generate formal correspondence, optionally grounded in precedent GRs."],
  gr:        ["GR Analysis", "Extract metadata, summarize, and query a Government Resolution."],
  circular:  ["Circular Analysis", "Extract metadata, summarize, and query a departmental circular."],
  summarize: ["File Summarization", "Summarize a PDF or Word document into an officer's brief."],
  translate: ["Translation", "Translate GRs and documents between Marathi and English."],
  ocr:       ["OCR Intelligence", "Extract text from scanned GRs — images or PDFs, Marathi & English."],
  pdf:       ["PDF Intelligence", "Ask questions directly of a PDF or Word document."],
  image:     ["Image Understanding", "Read tables, stamps, seals and signatures from a document image."],
};

let DEPTS = [];      // [{name, slug, cluster, gr_count}]
let CLUSTERS = {};   // {cluster: [name,...]}
const history = [];

/* ---------- boot ---------- */
init();
async function init() {
  bindNav();
  await Promise.all([loadHealth(), loadDepartments()]);
  buildAnalysisViews();
  bindCopilot();
  bindLetter();
  bindSummarize();
  bindTranslate();
  bindOcr();
  bindPdf();
  bindImage();
}

async function loadHealth() {
  try {
    const h = await api("/api/health");
    const dot = $("#statusDot"), txt = $("#statusText");
    if (h.mock_mode) { dot.className = "dot mock"; txt.textContent = "Mock mode · no API key"; }
    else { dot.className = "dot live"; txt.textContent = "Live · " + (h.chat_model || "Together"); }
  } catch { $("#statusText").textContent = "Backend offline"; }
}

async function loadDepartments() {
  const d = await api("/api/departments");
  DEPTS = d.departments; CLUSTERS = d.clusters;
  renderDeptPanel();
  // populate letter dept select
  const sel = $("#lt-dept");
  sel.innerHTML = '<option value="">— none —</option>' +
    DEPTS.map(x => `<option value="${x.slug}">${x.name}</option>`).join("");
}

/* ---------- navigation ---------- */
function bindNav() {
  $$(".nav-item[data-view]").forEach(b =>
    b.addEventListener("click", () => switchView(b.dataset.view)));
}
function switchView(v) {
  $$(".nav-item[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  ["copilot","letter","gr","circular","summarize","translate","ocr","pdf","image"].forEach(id =>
    $("#view-" + id).classList.toggle("hidden", id !== v));
  const [t, s] = VIEW_META[v];
  $("#viewTitle").textContent = t; $("#viewSub").textContent = s;
}

/* ---------- F1 department filter ---------- */
function renderDeptPanel() {
  const panel = $("#deptPanel");
  panel.innerHTML = "";
  Object.entries(CLUSTERS).forEach(([cluster, names], i) => {
    const rows = names.map(name => {
      const dept = DEPTS.find(d => d.name === name) || { slug: "", gr_count: 0 };
      return `<label class="dept-row">
        <input type="checkbox" class="dept-cb" value="${dept.slug}" checked />
        <span>${name}</span><span class="dept-count">${dept.gr_count}</span></label>`;
    }).join("");
    const el = document.createElement("div");
    el.className = "cluster" + (i === 0 ? " open" : "");
    el.innerHTML = `<div class="cluster-head"><span>${cluster}</span><span class="caret">▸</span></div>
      <div class="dept-list">${rows}</div>`;
    el.querySelector(".cluster-head").addEventListener("click", () => el.classList.toggle("open"));
    panel.appendChild(el);
  });
}
function selectedDepts() {
  const all = $$(".dept-cb");
  const checked = all.filter(c => c.checked).map(c => c.value);
  return checked.length === all.length ? null : checked; // null = search everywhere
}

/* ---------- Maha Copilot ---------- */
function bindCopilot() {
  const input = $("#copilotQuery"), btn = $("#copilotBtn");
  const run = () => askCopilot(input.value.trim());
  btn.addEventListener("click", run);
  input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
  document.addEventListener("click", e => {
    if (e.target.matches("#view-copilot .chip")) { input.value = e.target.textContent; run(); }
    if (e.target.matches(".hist-item")) { input.value = e.target.dataset.q; run(); }
  });
}

async function askCopilot(query) {
  if (!query) return;
  const box = $("#copilotResult");
  box.innerHTML = `<div class="empty"><span class="spinner dark" style="margin:0 auto 10px"></span>Retrieving & grounding…</div>`;
  const btn = $("#copilotBtn"); btn.disabled = true;
  try {
    const data = await api("/api/copilot", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, departments: selectedDepts(), quick_mode: $("#quickMode").checked }),
    });
    renderCopilot(box, query, data);
    pushHistory(query);
  } catch (e) {
    box.innerHTML = `<div class="answer">Could not reach the backend. ${e}</div>`;
  } finally { btn.disabled = false; }
}

function renderCopilot(box, query, d) {
  let html = "";
  if (d.mock) html += `<div class="later-note" style="background:var(--check-bg)">Mock mode — add a Together API key for real generation. Retrieval & citations below are real.</div>`;
  if (d.subquestions && d.subquestions.length)
    html += `<div class="section-label">Answer <span class="tag">${d.subquestions.length} questions answered</span></div>`;
  else html += `<div class="section-label">Answer</div>`;
  html += `<div class="answer ${d.lang === "mr" ? "mr" : ""}">${esc(d.answer)}</div>`;

  if (d.citations && d.citations.length) {
    html += `<div class="section-label">Citations · ${d.citations.length} GR${d.citations.length>1?"s":""}</div>`;
    html += d.citations.map(citeCard).join("");
  }
  box.innerHTML = html;
}

function citeCard(c) {
  const badgeText = { current: "Current", check: "Check", superseded: "Superseded" }[c.status] || "Current";
  const later = c.later_gr ? `<div class="later-note">A later GR may affect this: <b>${esc(c.later_gr.gr_id)}</b> (${c.later_gr.date||"n/d"}) — ${esc(c.later_gr.subject_en||c.later_gr.subject_mr||"")}</div>` : "";
  const copyPayload = `${c.gr_id} · ${c.date} · ${c.subject_mr}`.replace(/"/g,"&quot;");
  return `<div class="cite">
    <div class="cite-top">
      <span class="cite-id mono">${esc(c.gr_id)}</span>
      <span class="cite-date">${c.date || "date n/a"}</span>
      <span class="cite-dept">${esc(c.department)}</span>
      <span class="badge ${c.status}" style="margin-left:auto">${badgeText}</span>
    </div>
    <div class="cite-subj deva">${esc(c.subject_mr) || "—"}</div>
    <div class="cite-subj-en">${esc(c.subject_en)}</div>
    <div class="cite-passage deva">${esc(trim(c.passage_mr, 320))}</div>
    ${later}
    <div class="cite-actions">
      <a class="link-btn" href="${c.source_url}" target="_blank" rel="noopener">View full GR →</a>
      <button class="link-btn" onclick='copyText("${copyPayload}")'>Copy citation</button>
    </div>
  </div>`;
}

function pushHistory(q) {
  history.unshift(q); if (history.length > 10) history.pop();
  $("#historyPanel").innerHTML = history.map(h =>
    `<div class="hist-item chip" data-q="${h.replace(/"/g,"&quot;")}" style="display:block; margin-bottom:6px">${esc(trim(h,42))}</div>`).join("");
}

/* ---------- Letter Drafting ---------- */
function bindLetter() {
  $("#lt-btn").addEventListener("click", async () => {
    const btn = $("#lt-btn"); const out = $("#lt-result");
    btn.disabled = true; out.innerHTML = spinner("Drafting…");
    try {
      const data = await api("/api/letter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letter_type: $("#lt-type").value, language: $("#lt-lang").value,
          department: $("#lt-dept").value, recipient: $("#lt-recipient").value,
          subject: $("#lt-subject").value, key_points: $("#lt-points").value,
          use_precedent: $("#lt-precedent").checked,
        }),
      });
      let refs = "";
      if (data.references && data.references.length)
        refs = `<div class="section-label">Precedent referenced</div>` +
          data.references.map(r => `<div class="cite"><span class="cite-id mono">${esc(r.gr_id)}</span> <span class="cite-date">${r.date||""}</span><div class="cite-subj-en" style="margin-top:6px">${esc(r.subject||"")}</div></div>`).join("");
      out.innerHTML = `<div class="section-label">Draft</div>
        <div class="answer ${$("#lt-lang").value==="mr"?"mr":""}">${esc(data.draft||data.error||"")}</div>
        <button class="btn ghost" onclick='copyText(${JSON.stringify(data.draft||"")})'>Copy draft</button>${refs}`;
    } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
    finally { btn.disabled = false; }
  });
}

/* ---------- GR / Circular Analysis ---------- */
function buildAnalysisViews() {
  $$(".an-body").forEach(host => {
    const dt = host.dataset.doctype;
    host.innerHTML = `
      <div class="grid-2">
        <div class="field"><label>Analyze a ${dt==="circular"?"circular":"GR"} in the corpus (GR id)</label>
          <input type="text" class="an-id" placeholder="e.g. 20230815_caste_certificate" /></div>
        <div class="field"><label>Optional question</label>
          <input type="text" class="an-q" placeholder="e.g. What is the RTS time limit?" /></div>
      </div>
      <div class="field"><label>…or paste ${dt==="circular"?"circular":"GR"} text directly</label>
        <textarea class="an-text" placeholder="Paste document text (overrides GR id above)"></textarea></div>
      <button class="btn an-btn">Analyze</button>
      <div class="an-out" style="margin-top:22px"></div>`;
    host.querySelector(".an-btn").addEventListener("click", () => runAnalysis(host, dt));
  });
}

async function runAnalysis(host, docType) {
  const out = host.querySelector(".an-out");
  const gr_id = host.querySelector(".an-id").value.trim();
  const text = host.querySelector(".an-text").value.trim();
  const question = host.querySelector(".an-q").value.trim();
  if (!gr_id && !text) { toast("Enter a GR id or paste text."); return; }
  const btn = host.querySelector(".an-btn"); btn.disabled = true;
  out.innerHTML = spinner("Analyzing…");
  try {
    const data = await api("/api/analyze", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gr_id: gr_id || null, text: text || null, doc_type: docType, question: question || null }),
    });
    if (data.error) { out.innerHTML = `<div class="answer">${esc(data.error)}</div>`; return; }
    const m = data.metadata || {};
    const rows = [
      ["GR / Circular No.", m.gr_number], ["Date", m.date], ["Department", m.department],
      ["Subject", m.subject], ["Effective date", m.effective_date],
      ["Beneficiaries", m.beneficiaries], ["Amount / budget", m.amount_or_budget],
    ].filter(([,v]) => v).map(([k,v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");
    const refs = (m.referenced_grs||[]).length ? `<dt>References</dt><dd>${(m.referenced_grs||[]).map(esc).join(", ")}</dd>` : "";
    const dirs = (m.key_directives||[]).length ? `<div class="section-label">Key directives</div><ul>${(m.key_directives||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>` : "";
    out.innerHTML = `<div class="section-label">Extracted metadata</div>
      <div class="card"><dl class="meta-grid">${rows}${refs}</dl></div>
      ${dirs}
      <div class="section-label">Summary</div><div class="answer">${esc(data.summary||"")}</div>
      ${data.answer ? `<div class="section-label">Answer to your question</div><div class="answer">${esc(data.answer)}</div>` : ""}`;
  } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
  finally { btn.disabled = false; }
}

/* ---------- File Summarization ---------- */
function bindSummarize() {
  $("#sm-btn").addEventListener("click", async () => {
    const f = $("#sm-file").files[0];
    if (!f) { toast("Choose a PDF or .docx file first."); return; }
    const out = $("#sm-result"), btn = $("#sm-btn"); btn.disabled = true;
    out.innerHTML = spinner("Extracting & summarizing…");
    const fd = new FormData(); fd.append("file", f); fd.append("language", $("#sm-lang").value);
    try {
      const data = await api("/api/summarize", { method: "POST", body: fd });
      if (data.error) { out.innerHTML = `<div class="answer">${esc(data.error)}</div>`; return; }
      out.innerHTML = `<div class="section-label">${esc(data.filename)} · ${data.chars} chars · ${data.sections} section(s)</div>
        <div class="answer ${$("#sm-lang").value==="mr"?"mr":""}">${esc(data.summary)}</div>`;
    } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
    finally { btn.disabled = false; }
  });
}

/* ---------- Translation ---------- */
function bindTranslate() {
  $("#tr-btn").addEventListener("click", async () => {
    const text = $("#tr-text").value.trim();
    if (!text) { toast("Paste some text to translate."); return; }
    const out = $("#tr-result"), btn = $("#tr-btn"); btn.disabled = true;
    const target = $("#tr-target").value;
    out.innerHTML = spinner("Translating…");
    try {
      const data = await api("/api/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_lang: target }),
      });
      out.innerHTML = `<div class="section-label">Translation</div>
        <div class="answer ${target==="mr"?"mr":""}">${esc(data.translation||data.error||"")}</div>
        <button class="btn ghost" onclick='copyText(${JSON.stringify("")})' id="tr-copy">Copy</button>`;
      const btnc = $("#tr-copy"); if (btnc) btnc.onclick = () => copyText(data.translation||"");
    } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
    finally { btn.disabled = false; }
  });
  $("#tr-file-btn").addEventListener("click", async () => {
    const f = $("#tr-file").files[0];
    if (!f) { toast("Choose a file to translate."); return; }
    const out = $("#tr-result"), btn = $("#tr-file-btn"); btn.disabled = true;
    const target = $("#tr-file-target").value;
    out.innerHTML = spinner("Extracting & translating…");
    const fd = new FormData(); fd.append("file", f); fd.append("target_lang", target);
    try {
      const data = await api("/api/translate-file", { method: "POST", body: fd });
      if (data.error) { out.innerHTML = `<div class="answer">${esc(data.error)}</div>`; return; }
      out.innerHTML = `<div class="section-label">${esc(data.filename)} · ${data.chars} chars</div>
        <div class="answer ${target==="mr"?"mr":""}">${esc(data.translation)}</div>`;
    } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
    finally { btn.disabled = false; }
  });
}

/* ---------- OCR Intelligence ---------- */
function bindOcr() {
  $("#ocr-btn").addEventListener("click", async () => {
    const f = $("#ocr-file").files[0];
    if (!f) { toast("Choose an image or PDF first."); return; }
    const out = $("#ocr-result"), btn = $("#ocr-btn"); btn.disabled = true;
    out.innerHTML = spinner("Reading document with the vision model…");
    const fd = new FormData(); fd.append("file", f);
    try {
      const data = await api("/api/ocr", { method: "POST", body: fd });
      if (data.error) { out.innerHTML = `<div class="answer">${esc(data.error)}</div>`; return; }
      out.innerHTML = `<div class="section-label">${esc(data.filename)} · ${data.pages} page(s)</div>
        <div class="answer deva">${esc(data.text)}</div>`;
    } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
    finally { btn.disabled = false; }
  });
}

/* ---------- PDF Intelligence ---------- */
function bindPdf() {
  $("#pi-btn").addEventListener("click", async () => {
    const f = $("#pi-file").files[0];
    const q = $("#pi-q").value.trim();
    if (!f) { toast("Choose a PDF or Word file."); return; }
    if (!q) { toast("Enter a question about the document."); return; }
    const out = $("#pi-result"), btn = $("#pi-btn"); btn.disabled = true;
    out.innerHTML = spinner("Reading document & answering…");
    const fd = new FormData(); fd.append("file", f); fd.append("question", q);
    try {
      const data = await api("/api/pdf-intelligence", { method: "POST", body: fd });
      if (data.error) { out.innerHTML = `<div class="answer">${esc(data.error)}</div>`; return; }
      out.innerHTML = `<div class="section-label">${esc(data.filename)} · ${data.chars} chars</div>
        <div class="answer">${esc(data.answer)}</div>`;
    } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
    finally { btn.disabled = false; }
  });
}

/* ---------- Image Understanding ---------- */
function bindImage() {
  $("#im-btn").addEventListener("click", async () => {
    const f = $("#im-file").files[0];
    if (!f) { toast("Choose an image file."); return; }
    const out = $("#im-result"), btn = $("#im-btn"); btn.disabled = true;
    out.innerHTML = spinner("Analyzing image…");
    const fd = new FormData(); fd.append("file", f); fd.append("question", $("#im-q").value.trim());
    try {
      const data = await api("/api/image", { method: "POST", body: fd });
      if (data.error) { out.innerHTML = `<div class="answer">${esc(data.error)}</div>`; return; }
      out.innerHTML = `<div class="section-label">${esc(data.filename)}${data.question?` · “${esc(data.question)}”`:""}</div>
        <div class="answer">${esc(data.analysis)}</div>`;
    } catch (e) { out.innerHTML = `<div class="answer">Error: ${e}</div>`; }
    finally { btn.disabled = false; }
  });
}

/* ---------- helpers ---------- */
function esc(s){ return (s??"").toString().replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }
function trim(s, n){ s = s||""; return s.length > n ? s.slice(0,n) + "…" : s; }
function spinner(t){ return `<div class="empty"><span class="spinner dark" style="margin:0 auto 10px"></span>${t}</div>`; }
function copyText(t){ navigator.clipboard.writeText(t).then(()=>toast("Copied to clipboard")); }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1800); }
window.copyText = copyText;
