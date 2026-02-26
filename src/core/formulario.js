const { $, pad2, formatDateISO, showToast, openModal } = require("./helpers");
const {
  servicioPorId,
  profesionalPorId,
  obtenerTurnos,
  actualizarTurnos,
  estaDentroHorarioAtencion,
} = require("./turno");
const { renderizarTablaTurnos } = require("./listado");
const { profesionales } = require("./constantes");

/* Recibe un tipo de servicio y busca en la lista de los profesionales los que
coincidan con ese tipo. Luego los carga en la lista de opciones */
function mostrarOpcionesProfesionales(type) {
  const select = $("#profesionalId");
  const list = type
    ? profesionales.filter((p) => p.role === type)
    : profesionales;

  select.innerHTML =
    `<option value="">Elegir...</option>` +
    list
      .map(
        (p) =>
          `<option value="${p.id}">
            ${p.name}${p.specialty ? " — " + p.specialty : ""}
          </option>`,
      )
      .join("");
}

function actualizarHorariosDisponibles() {
  const dateISO = $("#date").value;
  const profesionalId = $("#profesionalId").value;
  const timeSelect = $("#time");

  if (!dateISO || !profesionalId) {
    timeSelect.innerHTML = `<option value="">Elegir fecha y profesional primero...</option>`;
    return;
  }

  // Duración según servicio seleccionado
  const serviceId = $("#serviceType").value;
  const service = servicioPorId(serviceId);
  const duration = service?.type === "estetica" ? 60 : 30;

  const allSlots = generarSlotsTiempo(dateISO, duration);
  if (allSlots.length === 0) {
    timeSelect.innerHTML = `<option value="">Cerrado (domingo)</option>`;
    return;
  }

  /* Obtiene todos los turnos y genera una lista (occupied) con todos los horarios de los
   turnos activos en la fecha seleccionada y del profesional seleccionado (todos los 
   horarios no disponibles) */
  const bookings = obtenerTurnos();
  const occupied = new Set(
    bookings
      .filter(
        (b) =>
          b.status === "activo" &&
          b.dateISO === dateISO &&
          (!profesionalId || b.profesionalId === profesionalId),
      )
      .map((b) => b.time),
  );

  // Se deshabilitan como opción los horarios ocupados
  const options = allSlots
    .map((t) => {
      const isBusy = occupied.has(t);
      return `<option value="${t}" ${isBusy ? "disabled" : ""}>${t}${isBusy ? " — Ocupado" : ""}</option>`;
    })
    .join("");

  timeSelect.innerHTML = `<option value="">Elegir...</option>` + options;
}

function formularioTurno() {
  // --- Cambio de servicio ---
  // Según el tipo de servicio seleccionado, carga los profesionales de ese tipo de servicio
  $("#serviceType").addEventListener("change", () => {
    const serviceId = $("#serviceType").value;
    const service = servicioPorId(serviceId);

    mostrarOpcionesProfesionales(service?.type || "");

    // Resetea fecha y horarios
    $("#time").innerHTML = `<option value="">Elegir fecha y profesional primero...</option>`;
    $("#date").value = "";
  });

  // --- Cambio de fecha o profesional ---
  $("#date").addEventListener("change", actualizarHorariosDisponibles);
  $("#profesionalId").addEventListener("change", actualizarHorariosDisponibles);

  // --- Botón limpiar ---

  /* La sección de #time también se reinicia al resetear toda la seccion de bookingForm,
  pero queremos que aparezca ese mensaje específicamente */
  $("#resetBooking").addEventListener("click", () => {
    $("#bookingForm").reset();
    $("#time").innerHTML = `<option value="">Elegir fecha y profesional primero...</option>`;
    mostrarOpcionesProfesionales("");
  });

  $("#bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const serviceId = $("#serviceType").value;
    const profesionalId = $("#profesionalId").value;
    const dateISO = $("#date").value;
    const time = $("#time").value;
    const ownerName = $("#ownerName").value.trim();
    const petName = $("#petName").value.trim();
    const phone = $("#phone").value.trim();

    // Validación básica
    if (
      !serviceId ||
      !profesionalId ||
      !dateISO ||
      !time ||
      !ownerName ||
      !petName ||
      !phone
    ) {
      showToast("Completá todos los campos obligatorios.");
      return;
    }

    // Duración según servicio
    const service = servicioPorId(serviceId);
    const duration = service?.type === "estetica" ? 60 : 30;

    // Valida que la fecha ingresada no sea anterior a la fecha actual
    const todayISO = formatDateISO(new Date());

    if (dateISO < todayISO) {
      showToast("No es posible reservar en fechas anteriores al día de hoy.");
      return;
    }

    // Validación de horario con nueva duración
    if (!estaDentroHorarioAtencion(dateISO, time, duration)) {
      showToast("Ese horario está fuera del horario de atención.");
      return;
    }

    // Verifica que el horario no esté ocupado
    const bookings = obtenerTurnos();
    const ocupado = bookings.some(
      (b) =>
        b.status === "activo" &&
        b.profesionalId === profesionalId &&
        b.dateISO === dateISO &&
        b.time === time,
    );

    // Es una validación extra para asegurarse que no se pueda ingresar un horario ocupado
    if (ocupado) {
      showToast("Ese horario ya está ocupado para ese profesional.");
      //actualizarHorariosDisponibles();
      module.exports.actualizarHorariosDisponibles();
      return;
    }

    // Crear turno
    const newBooking = {
      id: crypto.randomUUID(),
      status: "activo",
      ownerName,
      petName,
      phone,
      serviceId,
      profesionalId,
      dateISO,
      time,
    };

    bookings.push(newBooking);
    actualizarTurnos(bookings);

    // Mostrar confirmación en modal
    const s = servicioPorId(serviceId);
    const p = profesionalPorId(profesionalId);

    const fecha = new Date(dateISO); // para mostrar la fecha con el formato que queremos
    const fechaFormateada = `${pad2(fecha.getDate())}/${pad2(
      fecha.getMonth() + 1
    )}/${fecha.getFullYear()}`;

    openModal(
      `Mascota: ${petName}
      Titular: ${ownerName}
      Servicio: ${s.title}
      Profesional: ${p.name}
      Fecha: ${fechaFormateada}
      Hora: ${time}`,
    );

    showToast("Turno registrado ✅");

    // Reset del formulario
    $("#bookingForm").reset();
    $("#time").innerHTML = `<option value="">Elegir fecha y profesional primero...</option>`;
    mostrarOpcionesProfesionales("");
    renderizarTablaTurnos();
  });

  // Fecha mínima = hoy
  $("#date").min = formatDateISO(new Date());

  // Inicializar profesionales (vacío hasta elegir servicio)
  mostrarOpcionesProfesionales("");
}

/*
  - Open y close son los horarios de apertura y cierre pero en minutos
  - Con el for se van rellenando los slots disponibles según la duración mínima (30 o 60)
  - Se elimina el incremento de la última iteración para respetar el horario de cierre 
  - Luego se pasa de nuevo a formato de horas con la división entre 60 y se utiliza el
  módulo entre 60 para obtener el resto 30 o 0
*/
function generarSlotsTiempo(dateISO, durationMin) {
  const d = new Date(dateISO + "T00:00:00");
  const day = d.getDay();
  if (day === 0) return []; // domingo cerrado

  const open = 9 * 60;
  const close = day === 6 ? 12 * 60 + 30 : 18 * 60;

  const slots = [];
  for (let m = open; m <= close - durationMin; m += durationMin) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${pad2(h)}:${pad2(mm)}`);
  }
  return slots;
}

module.exports = {
  mostrarOpcionesProfesionales,
  generarSlotsTiempo,
  actualizarHorariosDisponibles,
  formularioTurno,
};
