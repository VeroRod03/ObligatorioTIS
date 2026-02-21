/**
 * @jest-environment jsdom
 */

const { openModal, closeModal, initModal } = require("../core/modal");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modal" class="" aria-hidden="true">
      <p id="modalText"></p>
      <button data-close-modal>Cerrar</button>
    </div>
  `;
});


// ===============================
// openModal
// ===============================

test("openModal debe mostrar el modal y setear el texto correctamente", () => {
  openModal("Reserva confirmada");

  const modal = document.getElementById("modal");
  const text = document.getElementById("modalText");

  expect(text.textContent).toBe("Reserva confirmada");
  expect(modal.classList.contains("is-open")).toBe(true);
  expect(modal.getAttribute("aria-hidden")).toBe("false");
});


// ===============================
// closeModal
// ===============================

test("closeModal debe cerrar el modal correctamente", () => {
  // primero lo abrimos
  openModal("Test");
  
  closeModal();

  const modal = document.getElementById("modal");

  expect(modal.classList.contains("is-open")).toBe(false);
  expect(modal.getAttribute("aria-hidden")).toBe("true");
});


// ===============================
// initModal - click botón cerrar
// ===============================

test("initModal debe cerrar el modal al hacer click en botón con data-close-modal", () => {
  initModal();
  openModal("Test");

  const boton = document.querySelector("[data-close-modal]");
  boton.click();

  const modal = document.getElementById("modal");

  expect(modal.classList.contains("is-open")).toBe(false);
  expect(modal.getAttribute("aria-hidden")).toBe("true");
});


// ===============================
// initModal - tecla Escape
// ===============================

test("initModal debe cerrar el modal al presionar Escape", () => {
  initModal();
  openModal("Test");

  const event = new KeyboardEvent("keydown", { key: "Escape" });
  document.dispatchEvent(event);

  const modal = document.getElementById("modal");

  expect(modal.classList.contains("is-open")).toBe(false);
  expect(modal.getAttribute("aria-hidden")).toBe("true");
});


// 2 extra para llegar al 100% de cobertura

test("initModal NO debe cerrar si se hace click en otro elemento", () => {
  initModal();
  openModal("Test");

  const otroElemento = document.createElement("div");
  document.body.appendChild(otroElemento);

  otroElemento.click();

  const modal = document.getElementById("modal");

  expect(modal.classList.contains("is-open")).toBe(true);
  expect(modal.getAttribute("aria-hidden")).toBe("false");
});

test("initModal NO debe cerrar si se presiona otra tecla", () => {
  initModal();
  openModal("Test");

  const event = new KeyboardEvent("keydown", { key: "Enter" });
  document.dispatchEvent(event);

  const modal = document.getElementById("modal");

  expect(modal.classList.contains("is-open")).toBe(true);
  expect(modal.getAttribute("aria-hidden")).toBe("false");
});