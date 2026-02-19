const { LS_KEYS } = require("./constants");
const { readLS, writeLS, $, showToast } = require("./helpers");

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

  // Oculta los botones de cerrar sesión
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.hidden = !isLoggedIn;
    logoutBtn.style.display = isLoggedIn ? "" : "none";
  }

  const logoutBtnAccess = $("#logoutBtnAccess");
  if (logoutBtnAccess) {
    logoutBtnAccess.hidden = !isLoggedIn;
    logoutBtnAccess.style.display = isLoggedIn ? "" : "none";
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
    });
  }

  // Logout (pantalla acceso)
  const logoutBtnAccess = $("#logoutBtnAccess");
  if (logoutBtnAccess) {
    logoutBtnAccess.addEventListener("click", () => {
      setSession({ username: null, isAdmin: false });
      if (loginForm) loginForm.reset();
      showToast("Sesión cerrada.");
    });
  }
}

module.exports = {
  getUsers,
  getSession,
  setSession,
  updateSessionLabel,
  initAuth,
};
