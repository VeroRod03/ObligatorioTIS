
jest.mock("../core/helpers", () => ({
  $: jest.fn(),
  pad2: jest.fn(),
  formatDateISO: jest.fn(),
  showToast: jest.fn(),
  openModal: jest.fn(),
}));

jest.mock("../core/turno", () => ({
  servicioPorId: jest.fn(),
  profesionalPorId: jest.fn(),
  obtenerTurnos: jest.fn(),
  actualizarTurnos: jest.fn(),
}));

jest.mock("../core/constantes", () => ({
  profesionales: [
    { id: "v1", name: "Dra. Ana", role: "salud", specialty: "Cirugía" },
    { id: "v2", name: "Dr. Luis", role: "salud", specialty: "" },
    { id: "e1", name: "Sofi", role: "estetica", specialty: "Baño" },
  ],
}));

const { $: $, pad2, formatDateISO, showToast, openModal } = require("../core/helpers");
const {
  servicioPorId,
  profesionalPorId,
  obtenerTurnos,
  actualizarTurnos,
} = require("../core/turno");

// ⬇️ Cambiá este require por el archivo real donde está este código
const {
  mostrarOpcionesProfesionales,
  generarSlotsTiempo,
  actualizarHorariosDisponibles,
  formularioTurno,
} = require("../core/formulario"); // <-- CAMBIAR SI TU ARCHIVO SE LLAMA DISTINTO

function setupDOM() {
  document.body.innerHTML = `
  <form id="bookingForm">
    <select id="serviceType">
      <option value="">Elegir...</option>
      <option value="med_consulta">Consulta</option>
      <option value="estetica_completa">Estética</option>
    </select>

    <select id="profesionalId">
      <option value="">Elegir...</option>
      <option value="v1">Dra. Ana</option>
      <option value="e1">Sofi</option>
    </select>

    <input id="date" type="date" />

    <select id="time">
      <option value="">Elegir...</option>
      <option value="10:00">10:00</option>
      <option value="11:00">11:00</option>
    </select>

    <input id="ownerName" />
    <input id="petName" />
    <input id="phone" />

    <button id="resetBooking" type="button">Limpiar</button>
    <button type="submit">Reservar</button>
  </form>
  `;

  // mock de $ para que use el DOM real
  $.mockImplementation((sel) => document.querySelector(sel));

  // mocks helpers
  pad2.mockImplementation((n) => String(n).padStart(2, "0"));
  formatDateISO.mockImplementation(() => "2026-02-20");
}

beforeEach(() => {
  jest.clearAllMocks();
  setupDOM();

  // globales que tu módulo usa pero no importa en el snippet
  global.estaDentroHorarioAtencion = jest.fn(() => true);
  global.renderizarTablaTurnos = jest.fn();

  // crypto.randomUUID
  global.crypto = { randomUUID: jest.fn(() => "uuid-1") };

  // mocks turno
  servicioPorId.mockImplementation((id) => {
    if (id === "med_consulta") return { id, type: "salud", title: "Consulta médica" };
    if (id === "estetica_completa") return { id, type: "estetica", title: "Estética/Baño" };
    return null;
  });

  profesionalPorId.mockImplementation((id) => {
    if (id === "v1") return { id, name: "Dra. Ana" };
    if (id === "e1") return { id, name: "Sofi" };
    return null;
  });

  obtenerTurnos.mockReturnValue([]);
});

describe("mostrarOpcionesProfesionales()", () => {
  test("si type es 'salud', carga solo profesionales de salud", () => {
    mostrarOpcionesProfesionales("salud");

    const html = document.getElementById("profesionalId").innerHTML;
    expect(html).toContain('value="v1"');
    expect(html).toContain('value="v2"');
    expect(html).not.toContain('value="e1"');
  });

  test("si type es vacío, carga todos", () => {
    mostrarOpcionesProfesionales("");

    const html = document.getElementById("profesionalId").innerHTML;
    expect(html).toContain('value="v1"');
    expect(html).toContain('value="v2"');
    expect(html).toContain('value="e1"');
  });

  test("si tiene specialty, la muestra con ' — '", () => {
    mostrarOpcionesProfesionales("salud");

    const html = document.getElementById("profesionalId").innerHTML;
    expect(html).toContain("Dra. Ana — Cirugía");
  });
});

describe("generarSlotsTiempo()", () => {
  test("domingo devuelve []", () => {
    // 2026-02-22 es domingo
    const slots = generarSlotsTiempo("2026-02-22", 30);
    expect(slots).toEqual([]);
  });

  test("lunes-viernes con 30 min: empieza 09:00 y termina 17:30", () => {
    // 2026-02-20 es viernes
    const slots = generarSlotsTiempo("2026-02-20", 30);
    expect(slots[0]).toBe("09:00");
    expect(slots[slots.length - 1]).toBe("17:30");
  });

  test("sábado con 30 min: termina 12:00", () => {
    // 2026-02-21 es sábado
    const slots = generarSlotsTiempo("2026-02-21", 30);
    expect(slots[0]).toBe("09:00");
    expect(slots[slots.length - 1]).toBe("12:00");
  });

  test("lunes-viernes con 60 min: termina 17:00", () => {
    const slots = generarSlotsTiempo("2026-02-20", 60);
    expect(slots[0]).toBe("09:00");
    expect(slots[slots.length - 1]).toBe("17:00");
  });
});

describe("actualizarHorariosDisponibles()", () => {
  test("si no hay fecha, muestra 'Elegir fecha primero...'", () => {
    document.getElementById("date").value = "";
    actualizarHorariosDisponibles();

    expect(document.getElementById("time").innerHTML).toContain("Elegir fecha primero...");
  });

  test("si es domingo, muestra 'Cerrado (domingo)'", () => {
    document.getElementById("date").value = "2026-02-22"; // domingo
    document.getElementById("serviceType").value = "med_consulta";

    actualizarHorariosDisponibles();

    expect(document.getElementById("time").innerHTML).toContain("Cerrado (domingo)");
  });

  test("deshabilita horarios ocupados y agrega '— Ocupado'", () => {
    document.getElementById("date").value = "2026-02-20";
    document.getElementById("serviceType").value = "med_consulta"; // 30 min
    document.getElementById("profesionalId").value = "v1";

    obtenerTurnos.mockReturnValue([
      { id: "t1", status: "activo", dateISO: "2026-02-20", time: "10:00", profesionalId: "v1" },
      { id: "t2", status: "activo", dateISO: "2026-02-20", time: "11:00", profesionalId: "v1" },
    ]);

    actualizarHorariosDisponibles();

    const html = document.getElementById("time").innerHTML;
    expect(html).toContain('value="10:00" disabled');
    expect(html).toContain("10:00 — Ocupado");
    expect(html).toContain('value="11:00" disabled');
  });

  test("si no hay profesional seleccionado, ocupa por fecha (cualquier profesional)", () => {
    document.getElementById("date").value = "2026-02-20";
    document.getElementById("serviceType").value = "med_consulta";
    document.getElementById("profesionalId").value = ""; // ninguno

    obtenerTurnos.mockReturnValue([
      { id: "t1", status: "activo", dateISO: "2026-02-20", time: "10:00", profesionalId: "v1" },
    ]);

    actualizarHorariosDisponibles();

    const html = document.getElementById("time").innerHTML;
    expect(html).toContain('value="10:00" disabled');
  });
});

describe("formularioTurno()", () => {
  test("al cambiar servicio: carga profesionales de ese type y resetea fecha + time", () => {
    formularioTurno();

    const serviceSelect = document.getElementById("serviceType");
    serviceSelect.value = "estetica_completa";
    serviceSelect.dispatchEvent(new Event("change"));

    expect(document.getElementById("date").value).toBe("");
    expect(document.getElementById("time").innerHTML).toContain("Elegir fecha primero...");
    // y se cargaron opciones de estética:
    const html = document.getElementById("profesionalId").innerHTML;
    expect(html).toContain('value="e1"');
    expect(html).not.toContain('value="v1"');
  });

  test("botón reset: resetea form, resetea time y carga todos los profesionales", () => {
    formularioTurno();

    // ensuciar valores
    document.getElementById("serviceType").value = "med_consulta";
    document.getElementById("date").value = "2026-02-20";

    document.getElementById("resetBooking").click();

    expect(document.getElementById("time").innerHTML).toContain("Elegir fecha primero...");
    // profesionales todos (porque mostrarOpcionesProfesionales('') )
    const html = document.getElementById("profesionalId").innerHTML;
    expect(html).toContain('value="v1"');
    expect(html).toContain('value="e1"');
  });

  test("submit: si faltan campos muestra toast y no guarda", () => {
    formularioTurno();

    // faltan todos
    document.getElementById("bookingForm").dispatchEvent(new Event("submit"));

    expect(showToast).toHaveBeenCalledWith("Completá todos los campos obligatorios.");
    expect(actualizarTurnos).not.toHaveBeenCalled();
  });

  test("submit: si fecha es anterior a hoy, muestra toast", () => {
    formularioTurno();

    document.getElementById("serviceType").value = "med_consulta";
    document.getElementById("profesionalId").value = "v1";
    document.getElementById("date").value = "2026-02-19"; // antes de 2026-02-20
    document.getElementById("time").value = "10:00";
    document.getElementById("ownerName").value = "Juan";
    document.getElementById("petName").value = "Milo";
    document.getElementById("phone").value = "099";

    document.getElementById("bookingForm").dispatchEvent(new Event("submit"));

    expect(showToast).toHaveBeenCalledWith("No es posible reservar en fechas anteriores al día de hoy.");
    expect(actualizarTurnos).not.toHaveBeenCalled();
  });

  test("submit: si estaDentroHorarioAtencion da false, muestra toast", () => {
    global.estaDentroHorarioAtencion.mockReturnValue(false);

    formularioTurno();

    document.getElementById("serviceType").value = "med_consulta";
    document.getElementById("profesionalId").value = "v1";
    document.getElementById("date").value = "2026-02-20";
    document.getElementById("time").value = "11:00";
    document.getElementById("ownerName").value = "Juan";
    document.getElementById("petName").value = "Milo";
    document.getElementById("phone").value = "099";

    document.getElementById("bookingForm").dispatchEvent(new Event("submit"));

    expect(showToast).toHaveBeenCalledWith("Ese horario está fuera del horario de atención.");
    expect(actualizarTurnos).not.toHaveBeenCalled();
  });

test("submit: si horario está ocupado, muestra toast y llama actualizarHorariosDisponibles", () => {
  // dejamos el slot ocupado
  obtenerTurnos.mockReturnValue([
    {
      id: "t1",
      status: "activo",
      serviceType: "med_consulta",
      profesionalId: "v1",
      dateISO: "2026-02-20",
      time: "10:00",
      ownerName: "Juana",
      petName: "Milo",
      phone: "099"
    },
  ]);

  // mockeamos actualizarHorariosDisponibles
  const formularioModule = require("../core/formulario");
  formularioModule.actualizarHorariosDisponibles = jest.fn();

  formularioTurno();

  document.getElementById("serviceType").value = "med_consulta";
  document.getElementById("profesionalId").value = "v1";
  document.getElementById("date").value = "2026-02-20";
  document.getElementById("time").value = "10:00";
  document.getElementById("ownerName").value = "Juan";
  document.getElementById("petName").value = "Milo";
  document.getElementById("phone").value = "099";

  document
    .getElementById("bookingForm")
    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  expect(showToast).toHaveBeenCalledWith(
    "Ese horario ya está ocupado para ese profesional."
  );

  expect(formularioModule.actualizarHorariosDisponibles).toHaveBeenCalled();

  expect(actualizarTurnos).not.toHaveBeenCalled();
});

  test("submit: caso OK guarda turno, abre modal, muestra toast, resetea form y renderiza tabla", () => {
    obtenerTurnos.mockReturnValue([]); // no hay ocupados

    formularioTurno();

    document.getElementById("serviceType").value = "med_consulta";
    document.getElementById("profesionalId").value = "v1";
    document.getElementById("date").value = "2026-02-20";
    document.getElementById("time").value = "10:00";
    document.getElementById("ownerName").value = "Juan";
    document.getElementById("petName").value = "Milo";
    document.getElementById("phone").value = "099";

    document.getElementById("bookingForm").dispatchEvent(new Event("submit"));

    // guarda
    expect(actualizarTurnos).toHaveBeenCalledTimes(1);
    const updated = actualizarTurnos.mock.calls[0][0];
    expect(updated).toHaveLength(1);
    expect(updated[0]).toMatchObject({
    status: "activo",
    ownerName: "Juan",
    petName: "Milo",
    phone: "099",
    profesionalId: "v1",
    serviceId: "med_consulta",
    dateISO: "2026-02-20",
    time: "10:00",
    });

    expect(updated[0].id).toBeDefined();

    // modal + toast
    expect(openModal).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith("Turno registrado ✅");

    // resetea time y recarga profesionales vacío
    expect(document.getElementById("time").innerHTML).toContain("Elegir fecha primero...");

    // render tabla
    expect(global.renderizarTablaTurnos).toHaveBeenCalled();
  });

  test("setea date.min = hoy al inicializar", () => {
    formularioTurno();
    expect(document.getElementById("date").min).toBe("2026-02-20");
  });
});