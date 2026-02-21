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
  isAdmin,
} = require("../core/sesion");

const { LS_KEYS } = require("../core/constantes");
const { showToast } = require("../core/helpers");

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();

  document.body.innerHTML = `
    <span id="sessionLabel"></span>

    <button id="navTurnos"></button>
    <button id="logoutBtn"></button>
    <button id="logoutBtnAccess"></button>

    <form id="loginForm">
      <input id="logUser" />
      <input id="logPass" />
      <button type="submit">Login</button>
    </form>
  `;
});

// Verifica que getUsers devuelva el usuario admin, que es el único precargado
test("getUsers debe devolver usuario admin por defecto", () => {
  const users = getUsers();

  expect(users).toHaveLength(1);
  expect(users[0].username).toBe("admin");
  expect(users[0].password).toBe("admin1234");
});

// Verifica que getSession devuelva la sesión por defecto (invitado) si no hay nada en localStorage
test("getSession debe devolver sesión por defecto si no hay nada en localStorage", () => {
  const sess = getSession();

  expect(sess.username).toBeNull();
  expect(sess.isAdmin).toBe(false);
});

// Verifica que setSession guarde correctamente la sesión en localStorage
test("setSession debe guardar sesión en localStorage", () => {
  setSession({ username: "admin", isAdmin: true });

  const saved = JSON.parse(localStorage.getItem(LS_KEYS.session));

  expect(saved.username).toBe("admin");
  expect(saved.isAdmin).toBe(true);
});

// Verifica que updateSessionLabel muestre el nombre del usuario cuando hay una sesión activa
// y el botón de "Cerrar sesión" esté visible
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

// Verifica que updateSessionLabel muestre "Invitado" cuando no hay sesión activa
// y que el botón de "Cerrar sesión" esté oculto
test("updateSessionLabel debe mostrar 'Invitado' si no hay sesión", () => {
  updateSessionLabel();

  const label = document.getElementById("sessionLabel");
  const logoutBtn = document.getElementById("logoutBtn");

  expect(label.textContent).toBe("Invitado");
  expect(logoutBtn.hidden).toBe(true);
});

// Verifica que al ingresar credenciales válidas en el formulario de login,
// se inicie sesión correctamente y se muestre el toast de éxito
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

// Verifica que al ingresar credenciales incorrectas en el formulario de login,
// no se inicie sesión y se muestre el toast de error
test("initAuth debe mostrar error si credenciales son incorrectas", () => {
  initAuth();

  document.getElementById("logUser").value = "admin";
  document.getElementById("logPass").value = "incorrecta";

  document.getElementById("loginForm").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true })
  );

  expect(showToast).toHaveBeenCalledWith("Credenciales incorrectas.");
});

// Verifica que al hacer click en el botón de logout, se cierre la sesión correctamente
// y que se muestre el toast de sesión cerrada
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


// Verifica que al iniciar sesión se muestre la sección de turnos en la barra de navegación
test("al iniciar sesión, navTurnos se muestra", () => {
  initAuth();

  document.getElementById("logUser").value = "admin";
  document.getElementById("logPass").value = "admin1234";

  document.getElementById("loginForm").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true })
  );

  const navTurnos = document.getElementById("navTurnos");

  expect(navTurnos.hidden).toBe(false);
  expect(navTurnos.style.display).toBe("");
});

// Verifica que al cerrar sesión, navTurnos se oculte en la barra de navegación
test("al cerrar sesión, navTurnos se oculta", () => {
  initAuth();

  // Simular sesión activa
  localStorage.setItem(
    LS_KEYS.session,
    JSON.stringify({ username: "admin", isAdmin: true })
  );

  // actualizar la UI según sesión
  updateSessionLabel();

  const navTurnos = document.getElementById("navTurnos");
  expect(navTurnos.hidden).toBe(false);

  // Hacer logout
  document.getElementById("logoutBtn").click();

  expect(navTurnos.hidden).toBe(true);
  expect(navTurnos.style.display).toBe("none");
});

// Verifica que isAdmin funcione correctamente
test("isAdmin debe retornar true para admin y false para invitado", () => {
  // Sin sesión
  localStorage.setItem(LS_KEYS.session, JSON.stringify({ username: null, isAdmin: false }));
  expect(isAdmin()).toBe(false);

  // Con sesión admin
  localStorage.setItem(LS_KEYS.session, JSON.stringify({ username: "admin", isAdmin: true }));
  expect(isAdmin()).toBe(true);
});


// test("no falla si sessionLabel y botones no existen en el DOM", () => {
//     // DOM vacío para cubrir las ramas 'false' de los if
//     document.body.innerHTML = ``;

//     expect(() => updateSessionLabel()).not.toThrow();
//   });

