const {
  obtenerTurnos,
  actualizarTurnos,
  servicioPorId,
  profesionalPorId,
} = require("./turno");
const { formatDateISO, pad2, $, $$, showToast } = require("./helpers");
const { getSession } = require("./sesion");
const { actualizarHorariosDisponibles } = require("./formulario");

// ---------- Admin (tabla + filtros + cancelar) ----------
let adminFilter = "hoy";
let adminDateFilter = null; // YYYY-MM-DD o null

function resetAdminState() {
  adminFilter = "hoy";
  adminDateFilter = null;
}

function initAdmin() {
  const sess = getSession();
  if (!sess?.username) {
    // No hay sesión, no inicializar nada
    return;
  }
  // Marca como seleccionada la opción de filtro seleccionada
  $$(".chip[data-admin-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Reset visual
      $$(".chip[data-admin-filter]").forEach((b) =>
        b.classList.remove("is-active"),
      );
      $("#calendarFilterBtn").classList.remove("is-active");

      // Activar chip
      btn.classList.add("is-active");

      // Estado
      adminFilter = btn.dataset.adminFilter;
      adminDateFilter = null; // limpiar fecha

      renderizarTablaTurnos();
    });
  });

  // Marca como "checked" los turnos seleccionados
  $("#selectAll").addEventListener("change", (e) => {
    const checked = e.target.checked;
    $$("#bookingsTbody input[type='checkbox']").forEach(
      (cb) => (cb.checked = checked),
    );
  });

  // Marca como cancelados los turnos seleccionados
  $("#cancelSelected").addEventListener("click", () => {
    const ids = obtenerIdTurnosSeleccionados();
    if (ids.length === 0) {
      showToast("Seleccioná al menos un turno.");
      return;
    }

    const bookings = obtenerTurnos().map((b) =>
      ids.includes(b.id) ? { ...b, status: "cancelado" } : b,
    );
    actualizarHorariosDisponibles();
    actualizarTurnos(bookings);
    showToast("Turnos cancelados.");
    renderizarTablaTurnos();
    $("#selectAll").checked = false;
  });

  // Opción de filtrado de calendario
  const dateInput = $("#adminDateFilter");
  const calendarBtn = $("#calendarFilterBtn");

  calendarBtn.addEventListener("click", () => {
    dateInput.showPicker ? dateInput.showPicker() : dateInput.click();
  });

  dateInput.addEventListener("change", () => {
    adminDateFilter = dateInput.value;

    $$(".chip[data-admin-filter]").forEach((b) =>
      b.classList.remove("is-active"),
    );

    calendarBtn.classList.add("is-active");
    renderizarTablaTurnos();
  });

  renderizarTablaTurnos();
}

function obtenerIdTurnosSeleccionados() {
  return Array.from($$("#bookingsTbody input[type='checkbox']:checked")).map(
    (cb) => cb.dataset.id,
  );
}

function renderizarTablaTurnos() {
  const tbody = $("#bookingsTbody");
  const bookings = obtenerTurnos();

  const todayISO = formatDateISO(new Date());
  let view = bookings;

  if (adminDateFilter) {
    view = bookings.filter((b) => b.dateISO === adminDateFilter);
  } else if (adminFilter === "hoy") {
    view = bookings.filter((b) => b.dateISO === todayISO);
  } else if (adminFilter === "activos") {
    view = bookings.filter((b) => b.status === "activo");
  } else if (adminFilter === "cancelados") {
    view = bookings.filter((b) => b.status === "cancelado");
  } else {
    view = bookings;
  }

  view = view.slice().sort((a, b) => {
    const keyA = a.dateISO + " " + a.time;
    const keyB = b.dateISO + " " + b.time;
    return keyA.localeCompare(keyB);
  });

  // Slice hace una copia, sort, junto con el compare, ordena los turnos por fecha,
  // la fecha y hora están guardadas como texto, las comparamos como tal, en ese formato

  if (view.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="muted" style="padding:16px;">
          No hay turnos para mostrar con este filtro.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = view
    .map((b) => {
      const s = servicioPorId(b.serviceId);
      const p = profesionalPorId(b.profesionalId);
      const stateClass =
        b.status === "activo" ? "state--activo" : "state--cancelado";
      const fecha = new Date(b.dateISO); // para mostrar la fecha con el formato que queremos
      return `
      <tr>
        <td class="col-check">
          <input type="checkbox" data-id="${b.id}" aria-label="Seleccionar turno" />
        </td>
        <td><span class="state ${stateClass}">${b.status}</span></td>
        <td>${b.ownerName}</td>
        <td>${b.petName}</td>
        <td>${s ? s.title : "-"}</td>
        <td>${p ? p.name : "-"}</td>
        <td>${pad2(fecha.getDate())}/${pad2(fecha.getMonth() + 1)}/${fecha.getFullYear()}</td>
        <td>${b.time}</td>
      </tr>
    `;
    })
    .join("");
}

module.exports = {
  renderizarTablaTurnos,
  obtenerIdTurnosSeleccionados,
  initAdmin,
  resetAdminState,
};
