const { LS_KEYS, servicios, profesionales } = require("./constantes");
const { readLS, writeLS, formatDateISO } = require("./helpers");

function servicioPorId(id) {
  return servicios.find((s) => s.id === id);
}

function profesionalPorId(id) {
  return profesionales.find((p) => p.id === id);
}

function actualizarTurnos(list) {
  writeLS(LS_KEYS.bookings, list);
}

// ---------- Turno (horarios + validación) ----------
function obtenerTurnos() {

  const hoy = new Date();

  // Si hoy es domingo, se setea la fecha a lunes para que los turnos "precargados"
  // no queden con fecha de domingo (día no hábil)
  if (hoy.getDay() === 0) {
    hoy.setDate(hoy.getDate() + 1); // pasa a lunes
  }

  // A readLS  se le pasa como parámetro "fallback" estos 2 turnos como para
  // "precargarlas" en caso de no haber ninguno. Se crean con la fecha de hoy
  return readLS(LS_KEYS.bookings, [
    {
      // crypto.randomUUID es para generar un id random
      id: crypto.randomUUID(),
      status: "activo",
      ownerName: "Juana Fernández",
      petName: "Milo",
      phone: "091 111 111",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: formatDateISO(hoy),
      time: "10:00",
    },
    {
      id: crypto.randomUUID(),
      status: "cancelado",
      ownerName: "Juana Fernández",
      petName: "Manchitas",
      phone: "091 222 333",
      serviceId: "estetica_completa",
      profesionalId: "e1",
      dateISO: formatDateISO(hoy),
      time: "14:00",
    },
  ]);
}

/**
 * Horarios de atención:
 * Lun–Vie 09:00–18:00 (último turno inicia 17:30)
 * Sáb 09:00–12:30 (último turno inicia 12:00)
 * Turnos de 30 min o 60 min
 */
function estaDentroHorarioAtencion(dateISO, time, durationMin) {
  const d = new Date(dateISO + "T00:00:00");
  const day = d.getDay();
  if (day === 0) return false; // domingo

  const [hh, mm] = time.split(":").map(Number);
  const minutes = hh * 60 + mm;

  const open = 9 * 60;
  const close = day === 6 ? 12 * 60 + 30 : 18 * 60;

  // El inicio debe permitir que termine ANTES o IGUAL al cierre
  return minutes >= open && minutes <= close - durationMin;
}

module.exports = {
  servicioPorId,
  profesionalPorId,
  obtenerTurnos,
  actualizarTurnos,
  estaDentroHorarioAtencion,
};
