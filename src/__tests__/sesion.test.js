/**
 * @jest-environment jsdom
 */

jest.mock("../core/helpers", () => {
  const original = jest.requireActual("../core/helpers");

  return {
    ...original,
    showToast: jest.fn(),
  };
});

const {
  getUsers,
  getSession,
  setSession,
  updateSessionLabel,
  initAuth,
} = require("../core/sesion");

const { LS_KEYS } = require("../core/constantes");
const { showToast } = require("../core/helpers");

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();

  document.body.innerHTML = `
    <span id="sessionLabel"></span>

    <button id="logoutBtn"></button>
    <button id="logoutBtnAccess"></button>

    <form id="loginForm">
      <input id="logUser" />
      <input id="logPass" />
      <button type="submit">Login</button>
    </form>
  `;
});


// ======================================
// getUsers
// ======================================

test("getUsers debe devolver usuario admin por defecto", () => {
  const users = getUsers();

  expect(users).toHaveLength(1);
  expect(users[0].username).toBe("admin");
  expect(users[0].password).toBe("admin1234");
});


// ======================================
// getSession (default)
// ======================================

test("getSession debe devolver sesión por defecto si no hay nada en localStorage", () => {
  const sess = getSession();

  expect(sess.username).toBeNull();
  expect(sess.isAdmin).toBe(false);
});


// ======================================
// setSession
// ======================================

test("setSession debe guardar sesión en localStorage", () => {
  setSession({ username: "admin", isAdmin: true });

  const saved = JSON.parse(localStorage.getItem(LS_KEYS.session));

  expect(saved.username).toBe("admin");
  expect(saved.isAdmin).toBe(true);
});


// ======================================
// updateSessionLabel - usuario logueado
// ======================================

test("updateSessionLabel debe mostrar nombre cuando hay sesión activa", () => {
  localStorage.setItem(
    LS_KEYS.session,
    JSON.stringify({ username: "admin", isAdmin: true })
  );

  updateSessionLabel();

  const label = document.getElementById("sessionLabel");
  const logoutBtn = document.getElementById("logoutBtn");

  expect(label.textContent).toBe("admin");
  expect(logoutBtn.hidden).toBe(false);
});


// ======================================
// updateSessionLabel - invitado
// ======================================

test("updateSessionLabel debe mostrar 'Invitado' si no hay sesión", () => {
  updateSessionLabel();

  const label = document.getElementById("sessionLabel");
  const logoutBtn = document.getElementById("logoutBtn");

  expect(label.textContent).toBe("Invitado");
  expect(logoutBtn.hidden).toBe(true);
});


// ======================================
// Login correcto
// ======================================

test("initAuth debe iniciar sesión correctamente con credenciales válidas", () => {
  initAuth();

  document.getElementById("logUser").value = "admin";
  document.getElementById("logPass").value = "admin1234";

  document.getElementById("loginForm").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true })
  );

  const session = JSON.parse(localStorage.getItem(LS_KEYS.session));

  expect(session.username).toBe("admin");
  expect(session.isAdmin).toBe(true);
  expect(showToast).toHaveBeenCalledWith("Sesión iniciada ✅");
});


// ======================================
// Login incorrecto
// ======================================

test("initAuth debe mostrar error si credenciales son incorrectas", () => {
  initAuth();

  document.getElementById("logUser").value = "admin";
  document.getElementById("logPass").value = "incorrecta";

  document.getElementById("loginForm").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true })
  );

  expect(showToast).toHaveBeenCalledWith("Credenciales incorrectas.");
});


// ======================================
// Logout desde nav
// ======================================

test("Debe cerrar sesión al hacer click en logoutBtn", () => {
  initAuth();

  // Simulamos sesión activa
  localStorage.setItem(
    LS_KEYS.session,
    JSON.stringify({ username: "admin", isAdmin: true })
  );

  document.getElementById("logoutBtn").click();

  const session = JSON.parse(localStorage.getItem(LS_KEYS.session));

  expect(session.username).toBeNull();
  expect(session.isAdmin).toBe(false);
  expect(showToast).toHaveBeenCalledWith("Sesión cerrada.");
});


// ======================================
// Logout desde pantalla acceso
// ======================================

test("Debe cerrar sesión al hacer click en logoutBtnAccess", () => {
  initAuth();

  localStorage.setItem(
    LS_KEYS.session,
    JSON.stringify({ username: "admin", isAdmin: true })
  );

  document.getElementById("logoutBtnAccess").click();

  const session = JSON.parse(localStorage.getItem(LS_KEYS.session));

  expect(session.username).toBeNull();
  expect(showToast).toHaveBeenCalledWith("Sesión cerrada.");
});