const { $ } = require("./helpers");

// Lo mismo pero para el cartel de confirmación de reserva de turno
function openModal(text) {
  const modal = $("#modal");
  $("#modalText").textContent = text;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  const modal = $("#modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

// ---------- Modal events ----------
// Su función es cerrar el cartel de confirmación de reserva al apretar el botón de cerrar o escape
function initModal() {
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

module.exports = {
  openModal,
  closeModal,
  initModal,
};
