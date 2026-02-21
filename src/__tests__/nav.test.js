const { initNav } = require("../core/nav");



beforeEach(() => {
  document.body.innerHTML = `
      <button id="navToggle" aria-expanded="false"></button>
      <nav id="navMenu">
        <a href="#inicio">Inicio</a>
        <a href="#servicios">Servicios</a>
      </nav>
    `;
});

// Verifica que el menú desplegable que solo aparece en la versión móvil se abra
// al hacer click en el botón
test("Debe abrir el menú al hacer click en el botón", () => {
  initNav();

  const btn = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  btn.click();

  expect(menu.classList.contains("is-open")).toBe(true);
  expect(btn.getAttribute("aria-expanded")).toBe("true");
});

// Verifica que el menú se cierre al hacer click nuevamente en el botón
test("Debe cerrar el menú si se vuelve a hacer click en el botón", () => {
  initNav();

  const btn = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  btn.click(); // abre
  btn.click(); // cierra

  expect(menu.classList.contains("is-open")).toBe(false);
  expect(btn.getAttribute("aria-expanded")).toBe("false");
});

// Verifica que el menú se cierre al hacer click en cualquier link dentro
// del menú, lo referencia como "a"
test("Debe cerrar el menú al hacer click en un link", () => {
  initNav();

  const btn = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const link = document.querySelector("#navMenu a");

  // Abrimos primero
  btn.click();

  expect(menu.classList.contains("is-open")).toBe(true);

  // Click en link
  link.click();

  expect(menu.classList.contains("is-open")).toBe(false);
  expect(btn.getAttribute("aria-expanded")).toBe("false");
});