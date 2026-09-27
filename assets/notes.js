/* Beta review notes (only included while BETA_BANNER is True in build.py). Saved in this browser (localStorage). */
(function () {
  var KEY = "sf-review-notes-v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function save(o) { localStorage.setItem(KEY, JSON.stringify(o)); }
  var page = (location.pathname.split("/").pop() || "index.html");
  function title(h) { return (h.getAttribute("data-note-title") || h.textContent || "").replace("✎ Add note", "").replace("✎ Edit note", "").replace(/\s+/g, " ").trim(); }
  function k(sec) { return page + " || " + sec; }
  function count() { return Object.keys(load()).length; }
  function refreshCount() { var b = document.getElementById("sf-notes-open"); if (b) b.textContent = "My notes (" + count() + ")"; }
  function asText() {
    var o = load(), by = {}, out = [];
    Object.keys(o).forEach(function (key) { var n = o[key]; (by[n.page] = by[n.page] || []).push(n); });
    Object.keys(by).sort().forEach(function (p) { by[p].forEach(function (n) { out.push("Page: " + n.page + "\nSection: " + n.section + "\nNote: " + n.note + "\n"); }); });
    return out.join("\n");
  }
  function copyText(t) {
    function fallback() { var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(fallback); else fallback();
  }
  function download(t) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/plain" }));
    a.download = "swampforce-review-notes.txt"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function editor(h) {
    var sec = title(h), o = load(), cur = (o[k(sec)] || {}).note || "";
    var box = document.createElement("div"); box.className = "sf-note-box";
    box.innerHTML = '<p class="sf-note-h"></p><textarea rows="5"></textarea><div class="sf-note-actions"><button type="button" data-a="save">Save note</button><button type="button" data-a="del">Delete</button><button type="button" data-a="close">Close</button></div>';
    box.querySelector(".sf-note-h").textContent = "Note for: " + sec;
    var ta = box.querySelector("textarea"); ta.value = cur;
    box.addEventListener("click", function (ev) {
      var a = ev.target.getAttribute("data-a"); if (!a) return;
      var o2 = load();
      if (a === "save") { if (ta.value.trim()) o2[k(sec)] = { page: page, section: sec, note: ta.value.trim(), at: new Date().toISOString() }; else delete o2[k(sec)]; save(o2); }
      if (a === "del") { delete o2[k(sec)]; save(o2); }
      box.remove(); mark(h); refreshCount();
    });
    var old = h.nextElementSibling; if (old && old.classList.contains("sf-note-box")) old.remove();
    h.insertAdjacentElement("afterend", box); ta.focus();
  }
  function mark(h) {
    var has = !!load()[k(title(h))], b = h.querySelector(".sf-note-btn");
    if (b) { b.textContent = has ? "✎ Edit note" : "✎ Add note"; b.classList.toggle("has-note", has); }
  }
  function panel() {
    var old = document.getElementById("sf-notes-panel"); if (old) { old.remove(); return; }
    var p = document.createElement("div"); p.id = "sf-notes-panel";
    var o = load(), by = {};
    Object.keys(o).forEach(function (key) { var n = o[key]; (by[n.page] = by[n.page] || []).push(n); });
    var html = '<div class="sf-np-top"><strong>My notes (' + Object.keys(o).length + ')</strong><button type="button" data-a="x">Close</button></div>' +
      '<div class="sf-np-actions"><button type="button" data-a="copy">Copy all notes</button><button type="button" data-a="dl">Download notes</button><button type="button" data-a="clear">Clear all</button></div><div class="sf-np-list"></div>';
    p.innerHTML = html;
    var list = p.querySelector(".sf-np-list");
    if (!Object.keys(by).length) list.textContent = "No notes yet. Use “✎ Add note” next to any section title.";
    Object.keys(by).sort().forEach(function (pg) {
      var h = document.createElement("h3"); var a = document.createElement("a"); a.href = pg; a.textContent = pg; h.appendChild(a); list.appendChild(h);
      by[pg].forEach(function (n) { var d = document.createElement("div"); d.className = "sf-np-item"; var s = document.createElement("b"); s.textContent = n.section; var t = document.createElement("p"); t.textContent = n.note; d.appendChild(s); d.appendChild(t); list.appendChild(d); });
    });
    p.addEventListener("click", function (ev) {
      var a = ev.target.getAttribute("data-a"); if (!a) return;
      if (a === "x") p.remove();
      if (a === "copy") { copyText(asText()); ev.target.textContent = "Copied ✓"; }
      if (a === "dl") download(asText());
      if (a === "clear" && confirm("Delete all notes on all pages?")) { save({}); p.remove(); refreshCount(); document.querySelectorAll("h2[data-note]").forEach(mark); }
    });
    document.body.appendChild(p);
  }
  function init() {
    var ban = document.querySelector(".sf-beta-banner");
    if (ban && !document.getElementById("sf-notes-open")) {
      var b = document.createElement("button"); b.type = "button"; b.id = "sf-notes-open"; b.addEventListener("click", panel); ban.appendChild(b); refreshCount();
    }
    document.querySelectorAll("main h2, #main h2").forEach(function (h) {
      if (h.hasAttribute("data-note") || h.closest("header, footer, nav, .sf-note-box, #sf-notes-panel")) return;
      h.setAttribute("data-note", ""); h.setAttribute("data-note-title", title(h));
      var b = document.createElement("button"); b.type = "button"; b.className = "sf-note-btn";
      b.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); editor(h); });
      h.appendChild(b); mark(h);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
