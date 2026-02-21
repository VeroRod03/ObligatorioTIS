const {
  servicioPorId,
  profesionalPorId,
  obtenerTurnos,
  actualizarTurnos,
  estaDentroHorarioAtencion,
} = require("../core/turno");

const { LS_KEYS, profesionales, servicios } = require("../core/constantes");

beforeEach(() => {
  localStorage.clear();
});

// Verifica que servicioPorId devuelva el servicio correcto dado un id
test("servicioPorId debe devolver el servicio correcto", () => {
  const servicio = servicios[0];
  const resultado = servicioPorId(servicio.id);

  expect(resultado).toBeDefined();
  expect(resultado.id).toBe(servicio.id);
});

// Verifica que profesionalPorId devuelva el profesional correcto dado un id
test("profesionalPorId debe devolver el profesional correcto", () => {
  const profesional = profesionales[0];
  const resultado = profesionalPorId(profesional.id);

  expect(resultado).toBeDefined();
  expect(resultado.id).toBe(profesional.id);
});

// Verifica que obtenerTurnos devuelva los turnos precargados si localStorage está vacío
test("obtenerTurnos debe devolver los turnos precargados si localStorage está vacío", () => {
  const turnos = obtenerTurnos();

  expect(turnos.length).toBeGreaterThanOrEqual(2);
});

// Verifica que actualizarTurnos guarde correctamente la lista de turnos en localStorage
test("actualizarTurnos debe guardar la lista en localStorage", () => {
  const lista = [
    {
      id: "1",
      ownerName: "Ana",
      petName: "Luna",
      status: "activo",
      phone: "091 222 333",
      serviceId: "estetica_completa",
      profesionalId: "e1",
      dateISO: "2026-02-25",
      time: "14:00",
    },
  ];

  actualizarTurnos(lista);

  const guardado = JSON.parse(localStorage.getItem(LS_KEYS.bookings));

  expect(guardado).toHaveLength(1);
  expect(guardado[0].ownerName).toBe("Ana");
});

// Verifica que estaDentroHorarioAtencion devuelva true para un turno válido dentro del horario de atención
// Caso válido lunes
test("Debe permitir turno válido un lunes dentro del horario", () => {
  const fecha = "2026-02-23"; // lunes
  const hora = "10:00";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(true);
});

// Verifica que estaDentroHorarioAtencion devuelva false para un turno fuera del horario de atención
// No permitir domingo
test("No debe permitir turnos los domingos", () => {
  const fecha = "2026-02-22"; // domingo
  const hora = "10:00";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(false);
});

// Verifica que estaDentroHorarioAtencion devuelva false para un turno que inicia después
// del horario de cierre
// No permitir horario fuera de rango lunes
test("No debe permitir turno después del horario de cierre", () => {
  const fecha = "2026-02-23"; // lunes
  const hora = "18:00"; // no entra turno de 30

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(false);
});

// Verifica que estaDentroHorarioAtencion devuelva true para un turno que termina
// exactamente a la hora de cierre
// Sábado último turno válido
test("Debe permitir último turno válido del sábado a las 12:00", () => {
  const fecha = "2026-02-21"; // sábado
  const hora = "12:00";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(true);
});

// Verifica que estaDentroHorarioAtencion devuelva false para un turno que inicia
// exactamente a la hora de cierre
// Sábado fuera de horario
test("No debe permitir turno sábado 12:30 con duración 30", () => {
  const fecha = "2026-02-21"; // sábado
  const hora = "12:30";

  const resultado = estaDentroHorarioAtencion(fecha, hora, 30);

  expect(resultado).toBe(false);
});