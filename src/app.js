const { initNav } = require("./nav");
const { handleRoute } = require("./router");
const { cargarGaleria } = require("./galeria");
const { cargarServicios } = require("./servicios");
const { cargarEquipo } = require("./equipo");
const { initAuth } = require("./sesion");
const { formularioTurno } = require("./formulario");
const { initAdmin, renderizarTablaTurnos } = require("./listado");
const { initModal } = require("./modal");

// Para que listado.js pueda llamar desde el navegador si hace falta
if (typeof window !== "undefined") {
  window.renderizarTablaTurnos = renderizarTablaTurnos;
}

const { getSession, isAdmin } = require("./sesion");
const { showToast } = require("./helpers");

function controlarAccesoAdmin() {
  const adminSection = document.getElementById("adminSection");
  if (!adminSection) return;

  adminSection.style.display = isAdmin() ? "" : "none";
}

window.addEventListener("hashchange", () => {
  if (location.hash === "#admin" && !isAdmin()) {
    showToast("Acceso denegado.");
    location.hash = "#inicio";
  }

  controlarAccesoAdmin();
});


// ---------- Init ----------
function main() {
  initNav();
  cargarGaleria();

  cargarServicios();
  cargarEquipo();

  initAuth();
  controlarAccesoAdmin();
  formularioTurno();
  initAdmin();
  initModal();

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", main);
}

module.exports = { main };
