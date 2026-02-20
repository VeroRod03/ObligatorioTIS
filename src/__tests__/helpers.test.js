const {
  $,
  $$,
  readLS,
  writeLS,
  pad2,
  formatDateISO,
  showToast,
} = require("../core/helpers");

beforeEach(() => {
  // limpiar DOM y storage antes de cada test
  document.body.innerHTML = "";
  localStorage.clear();
});

//hace dos elementos de clase x, verificando que devuelva solo el primero
test("$ debe devolver el primer elemento que coincide", () => {
  document.body.innerHTML = `
    <div class="x">uno</div>
    <div class="x">dos</div>
  `;

  const el = $(".x");
  expect(el).toBeDefined();
  expect(el.textContent).toBe("uno");
});

//hace dos elementos de clase x, verificando que devuelva todos
test("$$ debe devolver todos los elementos que coinciden", () => {
  document.body.innerHTML = `
    <div class="x">uno</div>
    <div class="x">dos</div>
  `;

  const els = $$(".x");
  expect(els.length).toBe(2);
  expect(els[0].textContent).toBe("uno");
  expect(els[1].textContent).toBe("dos");
});

//cuando son menos de 2 numeros agrega un 0 a la izquierda
test("pad2 agrega 0 a la izquierda cuando corresponde", () => {
  expect(pad2(0)).toBe("00");
  expect(pad2(7)).toBe("07");
  expect(pad2(10)).toBe("10");
  expect(pad2(123)).toBe("123");
});

//crea una nueva fecha, y verifica que formatDateISO la transforme al formato correspondiente
test("formatDateISO devuelve fecha en formato YYYY-MM-DD", () => {
  // el mes en new Date(y, m, d) empieza en 0, no en 1
  const d = new Date(2026, 1, 5); // 5 Feb 2026
  expect(formatDateISO(d)).toBe("2026-02-05");
});

//crea un valor que guarda bajo la clave "k", y después lo lee viendo si coincide con el equals
test("writeLS guarda y readLS lee correctamente", () => {
  writeLS("k", [{ a: 1}]);
  const v = readLS("k", []);
  expect(v).toEqual([{ a: 1 }]);
});

//si no existe la clave verifica que devuelva fallback
test("readLS devuelve fallback si la key no existe", () => {
  const v = readLS("no-existe", [1, 2, 3]);
  expect(v).toEqual([1, 2, 3]);
});

//en caso de que el valor no se pueda transformar a un string de json, devuelve fallback
test("readLS devuelve fallback si el JSON está corrupto", () => {
  localStorage.setItem("k", "{esto-no-es-json");
  const v = readLS("k", ["fallback"]);
  expect(v).toEqual(["fallback"]);
});

//deshabilita los timers, verifica que se muestre el toast, lo avanza 2.6 segundos y verifica que 
//ya no se muestre
test("showToast muestra el mensaje y luego se oculta", () => {
  document.body.innerHTML = `<div id="toast"></div>`;
  jest.useFakeTimers();

  showToast("Hola");

  const toast = document.getElementById("toast");
  expect(toast.textContent).toBe("Hola");
  expect(toast.classList.contains("is-show")).toBe(true);

  // pasa el tiempo del timeout
  jest.advanceTimersByTime(2600);
  expect(toast.classList.contains("is-show")).toBe(false);

  jest.useRealTimers();
});

//llama a la funcion mostrarToast 2 veces, reemplazando el 2do por el 1ero, y al pasar
//los 2,6 segundos, se deja de mostrar también
test("showToast reemplaza el timeout anterior si se llama dos veces", () => {
  document.body.innerHTML = `<div id="toast"></div>`;
  jest.useFakeTimers();

  showToast("Primero");
  showToast("Segundo"); // debería cancelar el anterior

  const toast = document.getElementById("toast");
  expect(toast.textContent).toBe("Segundo");
  expect(toast.classList.contains("is-show")).toBe(true);

  jest.advanceTimersByTime(2600);
  expect(toast.classList.contains("is-show")).toBe(false);

  jest.useRealTimers();
});