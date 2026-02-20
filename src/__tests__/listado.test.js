// __tests__/listado.test.js

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

const {
  obtenerTurnos,
  actualizarTurnos,
  servicioPorId,
  profesionalPorId,
} = require("../core/turno");

const { formatDateISO, pad2, $, $$, showToast } = require("../core/helpers");

const {
  renderizarTablaTurnos,
  obtenerIdTurnosSeleccionados,
  initAdmin,
} = require("../core/listado");

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

  // helpers apuntando al DOM real
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

test("obtenerIdTurnosSeleccionados debe devolver los ids seleccionados", () => {
  document.getElementById("bookingsTbody").innerHTML = `
    <tr><td><input type="checkbox" data-id="a1" checked /></td></tr>
    <tr><td><input type="checkbox" data-id="b1" /></td></tr>
    <tr><td><input type="checkbox" data-id="c1" checked /></td></tr>
  `;

  const ids = obtenerIdTurnosSeleccionados();
  expect(ids).toEqual(["a1", "c1"]);
});

test("renderizarTablaTurnos: si no hay turnos muestra mensaje vacío", () => {
  obtenerTurnos.mockReturnValue([]);

  renderizarTablaTurnos();

  const html = document.getElementById("bookingsTbody").innerHTML;
  expect(html).toContain("No hay turnos para mostrar con este filtro.");
});

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