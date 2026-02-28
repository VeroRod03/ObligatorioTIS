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
  estaDentroHorarioAtencion: jest.fn(() => true),
}));

jest.mock("../core/listado", () => ({
  renderizarTablaTurnos: jest.fn(),
}));

jest.mock("../core/constantes", () => ({
  profesionales: [
    { id: "v1", name: "Dra. Ana", role: "salud", specialty: "Cirugía" },
    { id: "v2", name: "Dr. Luis", role: "salud", specialty: "" },
    { id: "e1", name: "Sofi", role: "estetica", specialty: "Baño" },
  ],
}));

const {
  $: $,
  pad2,
  formatDateISO,
  showToast,
  openModal,
} = require("../core/helpers");
const {
  servicioPorId,
  profesionalPorId,
  obtenerTurnos,
  actualizarTurnos,
  estaDentroHorarioAtencion,
} = require("../core/turno");

const {
  mostrarOpcionesProfesionales,
  generarSlotsTiempo,
  actualizarHorariosDisponibles,
  formularioTurno,
} = require("../core/formulario");

const { renderizarTablaTurnos } = require("../core/listado");

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
      <option value="v2">Dr. Luis</option>
      <option value="e1">Sofi</option>
    </select>

    <input id="date" type="date" />

    <select id="time">
      <option value="">Elegir fecha y profesional primero...</option>
      <option value="10:00">10:00</option>
      <option value="11:00">11:00</option>
    </select>

    <input id="ownerName" />
    <input id="petName" />
    <input id="phone" />

    <button id="resetBooking" type="button">Limpiar</button>
    <button type="submit">Reservar</button>
  </form>
    <div id="confirmReservaModal" class="confirmModal confirmModal--hidden">
        <div class="confirmModal__card">
          <p class="confirmModal__text">
            ¿Está seguro que quiere reservar este turno?
          </p>

          <div class="confirmModal__actions">
            <button class="btn btn--primary" id="btnConfirmarSi">Sí</button>
            <button class="btn btn--ghost" id="btnConfirmarNo">No</button>
          </div>
        </div>
      </div>
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

  /* // globales que tu módulo usa pero no importa en el snippet
   global.estaDentroHorarioAtencion = jest.fn(() => true);
   renderizarTablaTurnos = jest.fn();*/

  // crypto.randomUUID
  global.crypto = { randomUUID: jest.fn(() => "uuid-1") };

  // mocks turno
  servicioPorId.mockImplementation((id) => {
    if (id === "med_consulta")
      return { id, type: "salud", title: "Consulta médica" };
    if (id === "estetica_completa")
      return { id, type: "estetica", title: "Estética/Baño" };
    return null;
  });

  profesionalPorId.mockImplementation((id) => {
    if (id === "v1") return { id, name: "Dra. Ana" };
    if (id === "e1") return { id, name: "Sofi" };
    return null;
  });

  obtenerTurnos.mockReturnValue([]);
});

// Verifica que la función mostrarProfesionales filtre correctamente por tipo de servicio
test("si type es 'salud', carga solo profesionales de salud", () => {
  mostrarOpcionesProfesionales("salud");

  const html = document.getElementById("profesionalId").innerHTML;
  expect(html).toContain('value="v1"');
  expect(html).toContain('value="v2"');
  expect(html).not.toContain('value="e1"');
});

// Verifica que la función mostrarProfesionales muestre todos los profesionales si el type es vacío
test("si type es vacío, carga todos", () => {
  mostrarOpcionesProfesionales("");

  const html = document.getElementById("profesionalId").innerHTML;
  expect(html).toContain('value="v1"');
  expect(html).toContain('value="v2"');
  expect(html).toContain('value="e1"');
});

// Verifica que generarSlotsTiempo no devuelva ningún slot si el día es domingo (veterinaria cerrada)
test("domingo devuelve []", () => {
  // 2026-02-22 es domingo
  const slots = generarSlotsTiempo("2026-02-22", 30);
  expect(slots).toEqual([]);
});

/*
  Verifica que generarSlotsTiempo genere los slots de tiempo correctos para lunes-viernes con intervalo de 30 min, 
  estableciendo correctamente que el primer slot sea el horario de aprtura (09:00) y el último slot sea el último
  horario de atención (17:30)
*/
test("lunes-viernes con 30 min: empieza 09:00 y termina 17:30", () => {
  // 2026-02-20 es viernes
  const slots = generarSlotsTiempo("2026-02-20", 30);
  expect(slots[0]).toBe("09:00");
  expect(slots[slots.length - 1]).toBe("17:30");
});

// Testea lo mismo que el anterior pero para los sábados
test("sábado con 30 min: termina 12:00", () => {
  // 2026-02-21 es sábado
  const slots = generarSlotsTiempo("2026-02-21", 30);
  expect(slots[0]).toBe("09:00");
  expect(slots[slots.length - 1]).toBe("12:00");
});

// Teste lo mismo que los anteriores pero para turnos de 60 minutos
test("lunes-viernes con 60 min: termina 17:00", () => {
  const slots = generarSlotsTiempo("2026-02-20", 60);
  expect(slots[0]).toBe("09:00");
  expect(slots[slots.length - 1]).toBe("17:00");
});

// Testea lo mismo que el anterior pero para los sábados
test("sábado con 60 min: termina 11:00", () => {
  // 2026-02-21 es sábado
  const slots = generarSlotsTiempo("2026-02-21", 60);
  expect(slots[0]).toBe("09:00");
  expect(slots[slots.length - 1]).toBe("11:00");
});

// Verifica que no permita al usuario elegir un horario si no ha elegido una fecha
test("si no hay una fecha, muestra 'Elegir fecha y profesional primero...'", () => {
  document.getElementById("date").value = "";
  actualizarHorariosDisponibles();

  expect(document.getElementById("time").innerHTML).toContain(
    "Elegir fecha y profesional primero...",
  );
});

// Verifica que no permita al usuario elegir un horario si no ha elegido un profesional
test("si no hay un profesional seleccionado, muestra 'Elegir fecha y profesional primero...'", () => {
  document.getElementById("profesionalId").value = "";
  actualizarHorariosDisponibles();

  expect(document.getElementById("time").innerHTML).toContain(
    "Elegir fecha y profesional primero...",
  );
});

// Verifica que si el día elegido es domingo, se muestre "Cerrado (domingo)" y no se puedan elegir horarios
test("si es domingo, muestra 'Cerrado domingo'", () => {
  document.getElementById("serviceType").value = "med_consulta";
  document.getElementById("profesionalId").value = "v1";
  document.getElementById("date").value = "2026-02-22"; // domingo
  actualizarHorariosDisponibles();

  expect(document.getElementById("time").innerHTML).toContain(
    "Cerrado (domingo)",
  );
});

// Verifica que si ya hay una reserva para el profesional, fecha y hora seleccionados, el horario
// aparezca como ocupado y no se pueda seleccionar
test("deshabilita horarios ocupados y agrega '— Ocupado'", () => {
  document.getElementById("date").value = "2026-02-20";
  document.getElementById("serviceType").value = "med_consulta"; // 30 min
  document.getElementById("profesionalId").value = "v1";

  obtenerTurnos.mockReturnValue([
    {
      id: "t1",
      status: "activo",
      dateISO: "2026-02-20",
      time: "10:00",
      profesionalId: "v1",
    },
    {
      id: "t2",
      status: "activo",
      dateISO: "2026-02-20",
      time: "11:00",
      profesionalId: "v1",
    },
  ]);
  actualizarHorariosDisponibles();

  const html = document.getElementById("time").innerHTML;
  expect(html).toContain('value="10:00" disabled');
  expect(html).toContain("10:00 — Ocupado");
  expect(html).toContain('value="11:00" disabled');
  expect(html).toContain("11:00 — Ocupado");
});

// Verifica que al cambiar de servicio se recarguen los profesionales correspondientes al tipo de
// servicio y se reseteen los campos de fecha y hora
test("al cambiar servicio: carga profesionales de ese type y resetea fecha + time", () => {
  formularioTurno();

  const serviceSelect = document.getElementById("serviceType");
  serviceSelect.value = "estetica_completa";
  serviceSelect.dispatchEvent(new Event("change"));

  expect(document.getElementById("date").value).toBe("");
  expect(document.getElementById("time").innerHTML).toContain(
    "Elegir fecha y profesional primero...",
  );
  // y se cargaron opciones de estética:
  const html = document.getElementById("profesionalId").innerHTML;
  expect(html).toContain('value="e1"');
  expect(html).not.toContain('value="v1"');
});

// Verifica que al presionar el boton "Limpiar" del formulario, se resetee el formulario, se
// recarguen todos los profesionales y se reseteen los horarios disponibles
test("botón reset: resetea form, resetea time y carga todos los profesionales", () => {
  formularioTurno();
  // ensuciar valores
  document.getElementById("serviceType").value = "med_consulta";
  document.getElementById("date").value = "2026-02-20";

  document.getElementById("resetBooking").click();

  expect(document.getElementById("time").innerHTML).toContain(
    "Elegir fecha y profesional primero...",
  );
  // profesionales todos (porque mostrarOpcionesProfesionales('') )
  const html = document.getElementById("profesionalId").innerHTML;
  expect(html).toContain('value="v1"');
  expect(html).toContain('value="v2"');
  expect(html).toContain('value="e1"');
  // y se reseteó el form
  expect(document.getElementById("serviceType").innerHTML).toContain(
    "Elegir...",
  );
  expect(document.getElementById("date").value).toBe("");
});

// Verifica que al enviar el formulario vacío o incompleto, se muestre un toast indicando
// que se deben completar los campos obligatorios y no se guarde el turno
test("submit: si faltan campos muestra toast y no guarda", () => {
  formularioTurno();
  // faltan todos
  document.getElementById("bookingForm").dispatchEvent(new Event("submit"));

  expect(showToast).toHaveBeenCalledWith(
    "Completá todos los campos obligatorios.",
  );
  expect(actualizarTurnos).not.toHaveBeenCalled();
});

// Verifica que al enviar el formulario con una fecha anterior a la actual, se muestre un
// toast indicando que no se pueden reservar fechas anteriores a hoy y no se guarde el turno
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

  expect(showToast).toHaveBeenCalledWith(
    "No es posible reservar en fechas anteriores al día de hoy.",
  );
  expect(actualizarTurnos).not.toHaveBeenCalled();
});

/*
 Verifica que al enviar el formulario con un horario fuera del horario de atención, se 
 muestre un mensaje indicandolo. Con el mockReturnValue(false) fuerza a la que el horario
 de atención sea inválido sin importar la fecha y hora ingresados
*/
test("submit: si estaDentroHorarioAtencion da false, muestra toast", () => {
  estaDentroHorarioAtencion.mockReturnValue(false);
  formularioTurno();

  document.getElementById("serviceType").value = "med_consulta";
  document.getElementById("profesionalId").value = "v1";
  document.getElementById("date").value = "2026-02-20";
  document.getElementById("time").value = "11:00";
  document.getElementById("ownerName").value = "Juan";
  document.getElementById("petName").value = "Milo";
  document.getElementById("phone").value = "099";

  document.getElementById("bookingForm").dispatchEvent(new Event("submit"));

  expect(showToast).toHaveBeenCalledWith(
    "Ese horario está fuera del horario de atención.",
  );
  expect(actualizarTurnos).not.toHaveBeenCalled();
});

// Verifica que si el horario elegido ya está ocupado, se muestre un toast indicándolo, se
// bloqueé el horario en el select y no se guarde el turno
test("submit: si horario está ocupado, muestra toast y llama actualizarHorariosDisponibles", () => {
  // reseteamos el valor del mock para este test
  estaDentroHorarioAtencion.mockReturnValue(true);
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
      phone: "099",
    },
  ]);

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
    "Ese horario ya está ocupado para ese profesional.",
  );
  // valida que el slot quedó bloqueado
  const html = document.getElementById("time").innerHTML;
  expect(html).toContain('value="10:00" disabled');
  expect(html).toContain("10:00 — Ocupado");

  expect(actualizarTurnos).not.toHaveBeenCalled();
});

// Verifica que al enviar el formulario correctamente, se guarde el turno, se abra un modal
// con la confirmación, se muestre un toast, se reseteen los campos del formulario y se
// renderice la tabla de turnos
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

  document.getElementById("btnConfirmarSi").click();

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

  // verificamos que todos los campos estén vacíos o reseteados
  expect(document.getElementById("serviceType").innerHTML).toContain(
    "Elegir...",
  );
  expect(document.getElementById("profesionalId").innerHTML).toContain(
    "Elegir...",
  );
  expect(document.getElementById("date").value).toBe("");
  expect(document.getElementById("time").innerHTML).toContain(
    "Elegir fecha y profesional primero...",
  );
  expect(document.getElementById("ownerName").value).toBe("");
  expect(document.getElementById("petName").value).toBe("");
  expect(document.getElementById("phone").value).toBe("");

  // render tabla
  expect(renderizarTablaTurnos).toHaveBeenCalled();
});

// Verifica que al inicializar el formulario, se setee la fecha mínima (date.min) como la fecha actual
test("setea date.min = hoy al inicializar", () => {
  formularioTurno();
  expect(document.getElementById("date").min).toBe("2026-02-20");
});
