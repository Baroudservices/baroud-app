/* =========================
   Baroud App UI (Global)
   - Custom Alert Modal (override alert)
   - Confirm Modal (confirmMsg)
   - Language Toggle (EN/AR) + auto apply
   - Auto add 🌐 button next to WA (if exists)
   ========================= */

(function () {
  if (window.__appUiLoaded) return;
  window.__appUiLoaded = true;

  /* =========================
     1) Global Custom Modal Alert
     ========================= */
  (function () {
    if (window.__customAlertLoaded) return;
    window.__customAlertLoaded = true;

    let overlay, titleEl, msgEl, okBtn, cancelBtn;
    let pendingMsg = null;

    function ensureCancelBtn(){
      if (!overlay) return;

      cancelBtn = document.getElementById("appModalCancel");
      if (cancelBtn) return cancelBtn;

      cancelBtn = document.createElement("button");
      cancelBtn.id = "appModalCancel";
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.cssText = `
        width:100%;
        padding:12px;
        border-radius:14px;
        border:1px solid rgba(255,255,255,.12);
        background:rgba(255,255,255,.06);
        color:#fff;
        font-weight:900;
        cursor:pointer;
        margin-top:10px;
        display:none;
      `;
      okBtn.parentElement.appendChild(cancelBtn);
      return cancelBtn;
    }

    function resetButtonsToAlertMode(){
      if (!overlay) return;

      const c = ensureCancelBtn();
      c.style.display = "none";

      // رجّع OK للـ alert/showMsg العادي
      okBtn.onclick = () => {
        overlay.style.display = "none";
        if (overlay.__onClose) overlay.__onClose();
        overlay.__onClose = null;
      };
    }

    function buildModal() {
      if (overlay) return;

      document.body.insertAdjacentHTML("beforeend", `
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
            ">Notice</div>

            <div id="appModalMsg" style="
              font-size:14px;
              opacity:.85;
              line-height:1.4;
              margin-bottom:14px;
              white-space:pre-wrap;
            "></div>

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
      `);

      overlay = document.getElementById("appModalOverlay");
      titleEl = document.getElementById("appModalTitle");
      msgEl = document.getElementById("appModalMsg");
      okBtn = document.getElementById("appModalOk");

      ensureCancelBtn();
      resetButtonsToAlertMode();

      if (pendingMsg !== null) {
        showAlert(pendingMsg);
        pendingMsg = null;
      }
    }

    function showAlert(message) {
      if (!overlay) {
        pendingMsg = message;
        return;
      }
      resetButtonsToAlertMode();
      titleEl.textContent = "Notice";
      msgEl.textContent = message ?? "";
      overlay.style.display = "flex";
    }

    // Override alert()
    window.alert = function (message) {
      showAlert(message);
    };

    // Custom showMsg()
    window.showMsg = function (title, message, onClose) {
      if (!overlay) {
        pendingMsg = message;
        return;
      }
      resetButtonsToAlertMode();
      titleEl.textContent = title || "Notice";
      msgEl.textContent = message ?? "";
      overlay.__onClose = onClose || null;
      overlay.style.display = "flex";
    };

    /* =========================
       ✅ Confirm Modal (Promise)
       ========================= */
    window.confirmMsg = function(title, message){
      return new Promise((resolve)=>{
        if (!overlay) {
          // fallback
          resolve(window.confirm(message || ""));
          return;
        }

        titleEl.textContent = title || "Confirm";
        msgEl.textContent = message ?? "";

        const c = ensureCancelBtn();
        c.style.display = "block";

        // نظف onClose تبع showMsg
        overlay.__onClose = null;

        okBtn.onclick = () => {
          overlay.style.display = "none";
          c.style.display = "none";
          resetButtonsToAlertMode();
          resolve(true);
        };

        c.onclick = () => {
          overlay.style.display = "none";
          c.style.display = "none";
          resetButtonsToAlertMode();
          resolve(false);
        };

        overlay.style.display = "flex";
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", buildModal);
    } else {
      buildModal();
    }
  })();


  /* =========================
     2) Language (Global)
     ========================= */

  function getLang(){
    return localStorage.getItem("lang") || "en";
  }

  function applyLang(lang){
    document.documentElement.lang = lang;
    document.documentElement.dir  = (lang === "ar") ? "rtl" : "ltr";
    document.documentElement.classList.toggle("rtl", lang === "ar");
  }

  window.toggleLang = function(){
    const cur = getLang();
    const next = (cur === "en") ? "ar" : "en";
    localStorage.setItem("lang", next);
    applyLang(next);
    location.reload();
  };

  applyLang(getLang());


  /* =========================
     3) Auto add 🌐 button next to WA
     ========================= */

  function ensureLangButton(){
    if (document.getElementById("langBtn")) return;

    const wa =
      document.querySelector('.social a[href*="wa.me"]') ||
      [...document.querySelectorAll(".social a")].find(a => (a.textContent || "").trim().toUpperCase() === "WA");

    if (!wa) return;

    const a = document.createElement("a");
    a.href = "#";
    a.id = "langBtn";
    a.title = "Language";
    a.style.userSelect = "none";
    a.style.webkitTapHighlightColor = "transparent";

    const cur = getLang();
    a.textContent = (cur === "ar") ? "EN" : "AR";

    a.addEventListener("click", function(e){
      e.preventDefault();
      window.toggleLang();
    });

    wa.insertAdjacentElement("afterend", a);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureLangButton);
  } else {
    ensureLangButton();
  }

})();
