const { $$ } = require("./helpers");
const { isAdmin } = require("./sesion");
const { showToast } = require("./helpers");

// El id del view es view inicio, admin, o acceso. Por eso funciona que oculte/muestre
// toda esa seccion

// ---------- Router (hash) ----------
const ROUTES = {
  inicio: { view: "view-inicio", scrollTo: "inicio" },
  servicios: { view: "view-inicio", scrollTo: "servicios" },
  equipo: { view: "view-inicio", scrollTo: "equipo" },
  galeria: { view: "view-inicio", scrollTo: "galeria" },
  turno: { view: "view-inicio", scrollTo: "turno" },
  ubicacion: { view: "view-inicio", scrollTo: "ubicacion" },

  admin: { view: "view-admin" },
  acceso: { view: "view-acceso" },
};

function showView(viewId) {
  $$(".view").forEach((v) => v.classList.remove("is-active"));
  const view = document.getElementById(viewId);
  if (view) view.classList.add("is-active");
  window.scrollTo(0, 0);
}

function handleRoute() {
  const raw = (location.hash || "#inicio").replace("#", "");
  const route = ROUTES[raw] || ROUTES["inicio"];

  // PROTECCIÓN ADMIN
  if (raw === "admin" && !isAdmin()) {
    showToast("Acceso denegado.");
    location.hash = "#inicio";
    return;
  }  

  showView(route.view);

  if (route.scrollTo) {
    setTimeout(() => {
      const el = document.getElementById(route.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }
}

module.exports = {
  showView,
  handleRoute,
};
