const { initNav } = require("../core/nav");

describe("ERF – Navegación móvil", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="navToggle" aria-expanded="false"></button>
      <nav id="navMenu">
        <a href="#inicio">Inicio</a>
        <a href="#servicios">Servicios</a>
      </nav>
    `;
  });

  test("Debe abrir el menú al hacer click en el botón", () => {
    initNav();

    const btn = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");

    btn.click();

    expect(menu.classList.contains("is-open")).toBe(true);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
  });

  test("Debe cerrar el menú si se vuelve a hacer click en el botón", () => {
    initNav();

    const btn = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");

    btn.click(); // abre
    btn.click(); // cierra

    expect(menu.classList.contains("is-open")).toBe(false);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
  });

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

});