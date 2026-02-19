const { $, $$ } = require("./helpers");

// ---------- Navegación móvil ----------
function initNav() {
  const btn = $("#navToggle");
  const menu = $("#navMenu");

  //if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });

  // Cerrar menú al clickear un link (móvil)
  $$("#navMenu a").forEach((a) => {
    a.addEventListener("click", () => {
      $("#navMenu").classList.remove("is-open");
      $("#navToggle").setAttribute("aria-expanded", "false");
    });
  });
}

module.exports = { initNav };
