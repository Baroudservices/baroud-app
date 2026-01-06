<script>
/* =========================
   Global Custom Modal Alert
   ========================= */

(function () {
  // إذا معمول من قبل، ما نعيدو
  if (window.__customAlertLoaded) return;
  window.__customAlertLoaded = true;

  // إنشاء الـ HTML
  const modalHTML = `
  <div id="appModalOverlay" style="
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:999999;
  ">
    <div style="
      width:90%;
      max-width:380px;
      background:#0f172a;
      border-radius:18px;
      padding:18px;
      color:#fff;
      box-shadow:0 30px 80px rgba(0,0,0,.6);
      border:1px solid rgba(255,255,255,.08);
      text-align:center;
      font-family:system-ui,Arial;
    ">
      <div id="appModalTitle" style="
        font-size:18px;
        font-weight:900;
        margin-bottom:8px;
      ">Message</div>

      <div id="appModalMsg" style="
        font-size:14px;
        opacity:.85;
        line-height:1.4;
        margin-bottom:14px;
        white-space:pre-wrap;
      ">...</div>

      <button id="appModalOk" style="
        width:100%;
        padding:12px;
        border-radius:14px;
        border:0;
        background:linear-gradient(90deg,#0ea5e9,#2563eb);
        color:#fff;
        font-weight:900;
        cursor:pointer;
      ">OK</button>
    </div>
  </div>
  `;

  // إدخال بالـ body
  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const overlay = document.getElementById("appModalOverlay");
    const titleEl = document.getElementById("appModalTitle");
    const msgEl = document.getElementById("appModalMsg");
    const okBtn = document.getElementById("appModalOk");

    okBtn.onclick = () => {
      overlay.style.display = "none";
      if (overlay.__onClose) overlay.__onClose();
      overlay.__onClose = null;
    };

    // Override alert()
    window.alert = function (message) {
      titleEl.textContent = "Notice";
      msgEl.textContent = message ?? "";
      overlay.style.display = "flex";
    };

    // Custom function (اختياري)
    window.showMsg = function (title, message, onClose) {
      titleEl.textContent = title;
      msgEl.textContent = message ?? "";
      overlay.__onClose = onClose || null;
      overlay.style.display = "flex";
    };
  });
})();
</script>
