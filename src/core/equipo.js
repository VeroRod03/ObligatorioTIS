const { $ } = require("./helpers");
const { profesionales } = require("./constantes");

function profesionalPorId(id) {
  return profesionales.find((p) => p.id === id);
}

// ---------- Render equipo ----------
function cargarEquipo() {
  const grid = $("#teamGrid");
  grid.innerHTML = profesionales
    .map(
      (p) => `
    <article class="card">
      <div class="card__top">
        <div class="avatar avatar--photo" aria-hidden="true">
          <img src="${p.photo || ""}" alt="${p.name}" onerror="this.remove(); this.parentElement.textContent='${p.initials}'">
        </div>
        <div class="card__meta">
          <strong>${p.name}</strong>
          <span class="muted">
            ${p.role === "salud" ? "Veterinaria" : "Estética/Baño"}
            ${p.specialty ? " · " + p.specialty : ""}
          </span>
        </div>
      </div>
      <p class="card__desc">${p.bio}</p>
      <span class="tag">${p.role === "salud" ? "Profesional de salud" : "Profesional de estética"}</span>
    </article>
  `,
    )
    .join("");
}

module.exports = {
  profesionalPorId,
  cargarEquipo,
};
