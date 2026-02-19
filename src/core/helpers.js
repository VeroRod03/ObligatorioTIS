// ---------- Helpers ----------

/* Estas constantes son solo para evitar escribir documentquerySelector constantentemente,
recibe el nombre de selector de css. $ busca el primer elemento que coincida, $$ busca todos */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* Read y write nos permiten manejar la información sin una base de datos,
write guarda en localStorage convirtiendo a JSON string,
read lee de local storage parseando json,
el try catch es para que no crashee la app por las dudas */
function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Agrega 0 a la izquierda en caso de ser necesario, como siguiendo un formato
function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDateISO(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

// Es para los popups, lo rellena con un mensaje, lo hace visible con el is-show,
// el clearTimeout es para cancelar el timer anterior si ya había uno, 2600 es para que dure 2.6 segundos
function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("is-show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-show"), 2600);
}

module.exports = {
  $,
  $$,
  readLS,
  writeLS,
  pad2,
  formatDateISO,
  showToast,
};
