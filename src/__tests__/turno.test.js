/**
 * @jest-environment jsdom
 */

const {
  servicioPorId,
  profesionalPorId,
  obtenerTurnos,
  actualizarTurnos,
  estaDentroHorarioAtencion,
} = require("../core/turno");

const { LS_KEYS, profesionales } = require("../core/constantes");

beforeEach(() => {
  localStorage.clear();
});


// ===============================
// servicioPorId
// ===============================

test("servicioPorId debe devolver el servicio correcto", () => {
  const servicio = servicioPorId("med_consulta");

  expect(servicio).toBeDefined();
  expect(servicio.id).toBe("med_consulta");
});


// ===============================
// profesionalPorId
// ===============================

test("profesionalPorId debe devolver el profesional correcto", () => {
  const profesional = profesionales[0];

  const resultado = profesionalPorId(profesional.id);

  expect(resultado).toBeDefined();
  expect(resultado.id).toBe(profesional.id);
});


// ===============================
// obtenerTurnos
// ===============================

test("obtenerTurnos debe devolver los turnos precargados si localStorage está vacío", () => {
  const turnos = obtenerTurnos();

  expect(turnos.length).toBeGreaterThanOrEqual(2);
  expect(turnos[0]).toHaveProperty("ownerName");
  expect(turnos[0]).toHaveProperty("status");
});


// ===============================
// actualizarTurnos
// ===============================

test("actualizarTurnos debe guardar la lista en localStorage", () => {
  const lista = [
    {
      id: "1",
      ownerName: "Ana",
      petName: "Luna",
      status: "activo",
    },
  ];

  actualizarTurnos(lista);

  const guardado = JSON.parse(localStorage.getItem(LS_KEYS.bookings));

  expect(guardado).toHaveLength(1);
  expect(guardado[0].ownerName).toBe("Ana");
});


// ===============================
// estaDentroHorarioAtencion
// ===============================

// Caso válido lunes
test("Debe permitir turno válido un lunes dentro del horario", () => {
  const fecha = "2026-02-23"; // lunes
  const hora = "10:00";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(true);
});

// No permitir domingo
test("No debe permitir turnos los domingos", () => {
  const fecha = "2026-02-22"; // domingo
  const hora = "10:00";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(false);
});

// No permitir horario fuera de rango lunes
test("No debe permitir turno después del horario de cierre", () => {
  const fecha = "2026-02-23"; // lunes
  const hora = "18:00"; // no entra turno de 30

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(false);
});

// Sábado último turno válido
test("Debe permitir último turno válido del sábado a las 12:00", () => {
  const fecha = "2026-02-21"; // sábado
  const hora = "12:00";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(true);
});

// Sábado fuera de horario
test("No debe permitir turno sábado 12:30 con duración 30", () => {
  const fecha = "2026-02-21"; // sábado
  const hora = "12:30";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(false);
});