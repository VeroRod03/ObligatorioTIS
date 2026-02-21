/*utilizamos jest.mock para que las pruebas de listado.test.js no dependan del correcto funcionamiento
de las funciones de helpers o de turno, sino que se pueda testear de manera aislada
con jest.fn se define una funcion sin comportamiento que mas adelante podemos controlar; lo que devuelve,
su manera de implementarse, etc.
*/

jest.mock("../core/turno", () => ({
  obtenerTurnos: jest.fn(),
  actualizarTurnos: jest.fn(),
  servicioPorId: jest.fn(),
  profesionalPorId: jest.fn(),
}));

jest.mock("../core/helpers", () => ({
  formatDateISO: jest.fn(),
  pad2: jest.fn(),
  $: jest.fn(),
  $$: jest.fn(),
  showToast: jest.fn(),
}));

jest.mock("../core/sesion", () => ({
  getSession: jest.fn(),
}));

const {
  obtenerTurnos,
  actualizarTurnos,
  servicioPorId,
  profesionalPorId,
} = require("../core/turno");

const { formatDateISO, pad2, $, $$, showToast } = require("../core/helpers");

const { getSession } = require("../core/sesion");

const {
  renderizarTablaTurnos,
  obtenerIdTurnosSeleccionados,
  initAdmin,
  resetAdminState,
} = require("../core/listado");
const { LS_KEYS } = require("../core/constantes");

/*
se ejecuta el beforeEach antes de cada test para resetear y ser consistentes
el clearAllMocks resetea el historial de llamadas de los jest.fn, si no podrían chocar
después tenemos el html "fake" como en los demás tests
*/
beforeEach(() => {
  jest.clearAllMocks();

  document.body.innerHTML = `
    <button class="chip is-active" data-admin-filter="hoy" id="chipHoy">Hoy</button>
    <button class="chip" data-admin-filter="activos" id="chipActivos">Activos</button>
    <button class="chip" data-admin-filter="cancelados" id="chipCancelados">Cancelados</button>

    <button id="calendarFilterBtn" class="chip">Calendario</button>
    <input id="adminDateFilter" type="date" />

    <input id="selectAll" type="checkbox" />
    <button id="cancelSelected">Cancelar seleccionados</button>

    <table><tbody id="bookingsTbody"></tbody></table>
  `;

  jest.resetModules();

  // Iniciamos sesión por defecto
  localStorage.setItem(
    LS_KEYS.session,
    JSON.stringify({ username: "admin", isAdmin: true })
  );
  getSession.mockReturnValue({ username: "admin", isAdmin: true });

  // definiendo los helpers $, $$
  $.mockImplementation((sel) => document.querySelector(sel));
  $$.mockImplementation((sel) => document.querySelectorAll(sel));

  // “hoy” fijo para que el filtro 'hoy' sea determinístico, hacemos que "hoy" siempre sea 20 de febrero
  formatDateISO.mockReturnValue("2026-02-20");
  pad2.mockImplementation((n) => String(n).padStart(2, "0"));

  // Para que renderizarTablaTurnos muestre nombres
  servicioPorId.mockImplementation((id) => {
    if (id === "med_consulta") return { title: "Consulta médica" };
    if (id === "estetica_completa") return { title: "Estética/Baño" };
    return null;
  });

  profesionalPorId.mockImplementation((id) => {
    if (id === "v1") return { name: "Dra. Ana" };
    if (id === "e1") return { name: "Peluquera Sofi" };
    return null;
  });
});


//verifica que devuelve los ids correctos al seleccionar los checkboxes del listado de turnos
test("obtenerIdTurnosSeleccionados debe devolver los ids seleccionados", () => {
  document.getElementById("bookingsTbody").innerHTML = `
    <tr><td><input type="checkbox" data-id="a1" checked /></td></tr>
    <tr><td><input type="checkbox" data-id="b1" /></td></tr>
    <tr><td><input type="checkbox" data-id="c1" checked /></td></tr>
  `;

  const ids = obtenerIdTurnosSeleccionados();
  expect(ids).toEqual(["a1", "c1"]);
});

//hace que obtenerTurnos devuelva un arreglo vacío, renderiza la tabla, y chequea que se muestre
//el mensaje que corresponde (no hay turnos)
test("renderizarTablaTurnos: si no hay turnos muestra mensaje vacío", () => {
  obtenerTurnos.mockReturnValue([]);

  renderizarTablaTurnos();

  const html = document.getElementById("bookingsTbody").innerHTML;
  expect(html).toContain("No hay turnos para mostrar con este filtro.");
});

//obtenerTurnos devuelve 2 turnos, uno con la fecha de hoy, y al renderizar
// la tabla, verifica que por defecto muestra sólo ese
test("renderizarTablaTurnos: por defecto filtra por HOY", () => {
  obtenerTurnos.mockReturnValue([
    {
      id: "a1",
      status: "activo",
      ownerName: "Juana",
      petName: "Milo",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "10:00",
    },
    {
      id: "b1",
      status: "activo",
      ownerName: "Jorgelina",
      petName: "Luna",
      serviceId: "estetica_completa",
      profesionalId: "e1",
      dateISO: "2026-02-19",
      time: "11:00",
    },
  ]);

  renderizarTablaTurnos();

  const html = document.getElementById("bookingsTbody").innerHTML;
  expect(html).toContain("a1");
  expect(html).not.toContain("b1");
});

//verifica que al clickear el botón "Activos" para filtrar sólo por turnos activos, se muestren esos
test("initAdmin: chip 'activos' filtra solo status activo", () => {
  obtenerTurnos.mockReturnValue([
    {
      id: "a1",
      status: "activo",
      ownerName: "A",
      petName: "A",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "10:00",
    },
    {
      id: "b1",
      status: "cancelado",
      ownerName: "B",
      petName: "B",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "11:00",
    },
  ]);

  initAdmin();

  document.getElementById("chipActivos").click();

  const html = document.getElementById("bookingsTbody").innerHTML;
  expect(html).toContain("a1");
  expect(html).not.toContain("b1");
});

//crea 2 turnos y verifica que al clickear seleccionar todos, la cantidad de checkboxes sea 2
test("initAdmin: selectAll marca todos los checkboxes del listado", () => {
  obtenerTurnos.mockReturnValue([
    {
      id: "a1",
      status: "activo",
      ownerName: "A",
      petName: "A",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "10:00",
    },
    {
      id: "b1",
      status: "activo",
      ownerName: "B",
      petName: "B",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "11:00",
    },
  ]);

  initAdmin();

  const selectAll = document.getElementById("selectAll");
  selectAll.click();

  const cbs = document.querySelectorAll("#bookingsTbody input[type='checkbox']");
  expect(cbs.length).toBe(2);
  cbs.forEach((cb) => expect(cb.checked).toBe(true));
});

//hay un turno, no se selecciona, y se clickea el botón de cancelar seleccionados. se verifica
//que se muestre el toast de seleccionar al menos uno
test("initAdmin: cancelar sin selección muestra toast y no actualiza", () => {
  obtenerTurnos.mockReturnValue([
    {
      id: "a1",
      status: "activo",
      ownerName: "A",
      petName: "A",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "10:00",
    },
  ]);

  initAdmin();

  document.getElementById("cancelSelected").click();

  expect(showToast).toHaveBeenCalledWith("Seleccioná al menos un turno.");
  expect(actualizarTurnos).not.toHaveBeenCalled();
});

/*
se crean 2 turnos, se selecciona el checkbox de uno, y se presiona cancelar seleccionados.
se chequea que se haya llamado la función "actualizar turnos" una vez. 
en updated se guardan los turnos actualizados (que en realidad son todos los que estaban en la tabla)
se verifica que el estado del seleccionado (a1) modificado a cancelado.
se chequea que aparezca el toast con el mensaje de turnos cancelados, y se valida que no 
se haya seleccionado el botón de seleccionar todos
*/
test("initAdmin: cancelar con selección marca status cancelado y llama actualizarTurnos", () => {
  obtenerTurnos.mockReturnValue([
    {
      id: "a1",
      status: "activo",
      ownerName: "A",
      petName: "A",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "10:00",
    },
    {
      id: "b1",
      status: "activo",
      ownerName: "B",
      petName: "B",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "11:00",
    },
  ]);

  initAdmin();

  const cbA = document.querySelector("#bookingsTbody input[type='checkbox'][data-id='a1']");
  cbA.checked = true;

  document.getElementById("cancelSelected").click();

  expect(actualizarTurnos).toHaveBeenCalledTimes(1);

  const updated = actualizarTurnos.mock.calls[0][0];
  expect(updated.find((t) => t.id === "a1").status).toBe("cancelado");
  expect(updated.find((t) => t.id === "b1").status).toBe("activo");

  expect(showToast).toHaveBeenCalledWith("Turnos cancelados.");
  expect(document.getElementById("selectAll").checked).toBe(false);
});

/*
se crean 3 turnos, 2 con la fecha por la que se va a filtrar, y 1 con otra.
se le asigna el valor de fecha, simulando la selección en el calendario, 
y se verifica que se muestren los turnos que coincidan con esa fecha
*/
test("initAdmin: filtro por calendario muestra los turnos de esa fecha y activa el botón del calendario", () => {
  obtenerTurnos.mockReturnValue([
    // misma fecha (deberían aparecer los 2)
    {
      id: "a1",
      status: "activo",
      ownerName: "A",
      petName: "A",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-11",
      time: "10:00",
    },
    {
      id: "b1",
      status: "activo",
      ownerName: "B",
      petName: "B",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-11",
      time: "11:00",
    },
    // otra fecha (no debe aparecer)
    {
      id: "c1",
      status: "activo",
      ownerName: "C",
      petName: "C",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-10",
      time: "12:00",
    },
  ]);

  initAdmin();

  const dateInput = document.getElementById("adminDateFilter");
  dateInput.value = "2026-02-11";
  dateInput.dispatchEvent(new Event("change"));

  const rows = document.querySelectorAll("#bookingsTbody tr");
  expect(rows.length).toBe(2);

  const html = document.getElementById("bookingsTbody").innerHTML;
  expect(html).toContain("a1");
  expect(html).toContain("b1");
  expect(html).not.toContain("c1");
});


test("no permite inicializar admin si no hay sesión activa", () => {
  // Simulamos que no hay sesión
  getSession.mockReturnValue({ username: null, isAdmin: false });

  // Llamamos initAdmin
  initAdmin();

  // Como no hay sesión, renderizarTablaTurnos no debería ser llamada
  expect(document.getElementById("bookingsTbody").innerHTML).toBe("");
});


test("permite visualizar el listado si hay sesión activa", () => {
  // Simulamos sesión activa
  getSession.mockReturnValue({ username: "admin", isAdmin: true });

  obtenerTurnos.mockReturnValue([
    { id: "a1", status: "activo", ownerName: "Juanita Fernandez", petName: "A", serviceId: "med_consulta", profesionalId: "v1", dateISO: "2026-02-20", time: "10:00" },
  ]);
  // reseteamos los filtros
  resetAdminState();
  document.getElementById("chipHoy").classList.add("is-active");
  document.getElementById("chipActivos").classList.remove("is-active");
  document.getElementById("chipCancelados").classList.remove("is-active");
  initAdmin();
  expect(document.getElementById("bookingsTbody").innerHTML).toContain("Juanita Fernandez");
});
