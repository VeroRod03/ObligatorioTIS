const { LS_KEYS } = require("./constantes");
const { readLS, writeLS, $, showToast } = require("./helpers");

function isAdmin() {
  const sess = getSession();
  return !!sess?.username && !!sess?.isAdmin;
}

function getUsers() {
  return readLS(LS_KEYS.users, [
    { username: "admin", password: "admin1234", isAdmin: true },
  ]);
}

function getSession() {
  return readLS(LS_KEYS.session, { username: null, isAdmin: false });
}
function setSession(sess) {
  writeLS(LS_KEYS.session, sess);
  updateSessionLabel();
}

function updateSessionLabel() {
  const sess = getSession();
  // Se fija si hay una sesión activa (usuario logueado), en ese caso se muestra
  // el nombre del usuario, de lo contrario muestra "Invitado"
  const label = $("#sessionLabel");
  if (label) {
    label.textContent = sess?.username ? `${sess.username}` : "Invitado";
  }
  const isLoggedIn = !!sess?.username;

  // Ocultar/ mostrar botón Turnos según sesión
  const navTurnos = $("#navTurnos");
  if (navTurnos) {
    navTurnos.hidden = !isLoggedIn;
    navTurnos.style.display = isLoggedIn ? "" : "none";
  }

  // Ocultar/mostrar botón Portal Admin según sesión
  const navAcceso = $("#navAcceso");
  if (navAcceso) {
    navAcceso.hidden = isLoggedIn;
    navAcceso.style.display = isLoggedIn ? "none" : "";
  }  

  // Ocultar/ mostrar botón de cerrar sesión
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.hidden = !isLoggedIn;
    logoutBtn.style.display = isLoggedIn ? "" : "none";
  }
}

function initAuth() {
  updateSessionLabel();

  // Login
  const loginForm = $("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = $("#logUser").value.trim();
      const password = $("#logPass").value;

      const users = getUsers();
      const found = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.password === password,
      );

      if (!found) {
        showToast("Credenciales incorrectas.");
        return;
      }

      setSession({ username: found.username, isAdmin: !!found.isAdmin });
      // Limpiar campos del login luego de iniciar sesión
      loginForm.reset();
      showToast("Sesión iniciada ✅");
      location.hash = "#inicio";
    });
  }

  // Logout (nav)
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setSession({ username: null, isAdmin: false });
      if (loginForm) loginForm.reset();
      showToast("Sesión cerrada.");
      // Redirige a inicio después de cerrar sesión
      location.hash = "#inicio";
    });
  }

}

module.exports = {
  getUsers,
  getSession,
  setSession,
  updateSessionLabel,
  initAuth,
  isAdmin
};