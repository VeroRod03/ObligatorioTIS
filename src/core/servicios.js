const { $ } = require("./helpers");
const { servicios } = require("./constantes");

function servicioPorId(id) {
  return servicios.find((s) => s.id === id);
}

// ---------- Render servicios ----------
function cargarServicios() {
  const grid = $("#servicesGrid");

  grid.innerHTML = servicios
    .map((s) => {
      const imgSrc =
        s.type === "salud"
          ? "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : "https://images.unsplash.com/photo-1611173622933-91942d394b04?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

      const imgAlt =
        s.type === "salud"
          ? "Servicio veterinario de salud"
          : "Servicio de estética y baño";

      return `
        <article class="card card--clickable" data-id="${s.id}" role="article">
          <div class="card__top">
            <div class="avatar">
              <img src="${imgSrc}" alt="${imgAlt}">
            </div>
            <div class="card__meta">
              <strong>${s.title}</strong>
              <span class="muted">${s.type === "salud" ? "Salud" : "Estética/Baño"}</span>
            </div>
          </div>

          <p class="card__desc">${s.description}</p>
          <span class="tag">
            ${
              s.type === "salud"
                ? "Turno médico · 30 min"
                : "Servicio estético · 1 hora"
            }
          </span>
          <div class="price">$${s.price}</div>
        </article>
      `;
    })
    .join("");
  //manejamos los clicks a las tarjetas
  clickTarjetasServicio();
}

//funcion para menejar el comportamiento de las tarjetas de servicio
function clickTarjetasServicio() {
  const cards = document.querySelectorAll(".card--clickable");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const servicioId = card.dataset.id;

      //inicializamos el tipo de servicio en el formulario de reservas
      const serviceSelect = document.querySelector("#serviceType");

      serviceSelect.value = servicioId;

      //disparar evento change para que cargue a los profesionales
      serviceSelect.dispatchEvent(new Event("change"));

      //scroll suave al formulario
      document.querySelector("#turno").scrollIntoView({ behavior: "smooth" });
    });
  });
}

module.exports = {
  servicioPorId,
  cargarServicios,
  clickTarjetasServicio,
};
