/* ============================================================
   SWAMP FORCE STORE — ONE SETTING
   Paste your Printify Pop-Up Store URL between the quotes, e.g.
   var PRINTIFY_POPUP_URL = "https://swampforce.printify.me/";
   Leave it empty ("") to show "The shop opens soon".
   ============================================================ */
var PRINTIFY_POPUP_URL = "https://swamp-force.printify.me/";

(function () {
  var url = (typeof PRINTIFY_POPUP_URL === 'string') ? PRINTIFY_POPUP_URL.trim() : '';
  if (!/^https:\/\//i.test(url)) return;              // empty or not https → keep "opens soon"
  var ph = document.getElementById('store-placeholder');
  var live = document.getElementById('store-live');
  var frame = document.getElementById('store-frame');
  var btn = document.getElementById('store-open-btn');
  if (ph) ph.hidden = true;
  if (live) live.hidden = false;
  if (btn) btn.href = url;
  /* Printify blocks embedding (frame-ancestors), so hide the frame and use the button */
  if (frame && frame.parentNode) frame.parentNode.hidden = true;
  /* Header/footer Shop buttons go straight to the store once it is live */
  document.querySelectorAll('a.shop-btn').forEach(function (a) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; });
})();
