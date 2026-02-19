const { cargarEquipo, profesionalPorId } = require("../core/equipo");
const { profesionales } = require("../core/constantes");

//Verifica que deben haber 6 profesionales registrados
test("Deben existir 6 profesionales en total", () => {
  expect(profesionales.length).toBe(6);
});

//Verifica que la funcion profesionalPorId devuelva al profesional correcto
test("profesionalPorId debe devolver el profesional correcto", () => {
  const primero = profesionales[0];
  const resultado = profesionalPorId(primero.id);

  expect(resultado).toBeDefined();
  expect(resultado.id).toBe(primero.id);
});

//Verifica que hayan 3 profesionales por cada tipo de servicio ofrecido
test("Debe haber exactamente 3 profesionales de salud y 3 de estetica", () => {
  const salud = profesionales.filter((p) => p.role === "salud");
  const estetica = profesionales.filter((p) => p.role === "estetica");

  expect(salud.length).toBe(3);
  expect(estetica.length).toBe(3);
});

//Verifica que la funcion cargarEquipo genere la cantidad correcta (6) de tarjetas
test("cargarEquipo debe renderizar la misma cantidad de cards que profesionales", () => {
  document.body.innerHTML = `<div id="teamGrid"></div>`;

  cargarEquipo();

  const cards = document.querySelectorAll("#teamGrid .card");

  expect(cards.length).toBe(profesionales.length); //6
});

//Verifica que las tarjetas de los profesionales muestren el nombre de ellos
test("Debe mostrar el nombre del profesional", () => {
  document.body.innerHTML = `<div id="teamGrid"></div>`;

  cargarEquipo();

  const html = document.getElementById("teamGrid").innerHTML;

  profesionales.forEach((p) => {
    expect(html).toContain(p.name);
  });
});

//Verifica que las tarjetas de los profesionales muestren los datos correctos segun el tipo de servicio
test("Debe mostrar correctamente el rol traducido", () => {
  document.body.innerHTML = `<div id="teamGrid"></div>`;

  cargarEquipo();

  const html = document.getElementById("teamGrid").innerHTML;

  if (profesionales.some((p) => p.role === "salud")) {
    expect(html).toContain("Veterinaria");
    expect(html).toContain("Profesional de salud");
  }

  if (profesionales.some((p) => p.role === "estetica")) {
    expect(html).toContain("Estética/Baño");
    expect(html).toContain("Profesional de estética");
  }
});

test("Debe mostrar la biografía de cada profesional", () => {
  document.body.innerHTML = `<div id="teamGrid"></div>`;

  cargarEquipo();

  const html = document.getElementById("teamGrid").innerHTML;

  profesionales.forEach((p) => {
    expect(html).toContain(p.bio);
  });
});

test("Si el profesional tiene especialidad, debe mostrarse", () => {
  document.body.innerHTML = `<div id="teamGrid"></div>`;

  cargarEquipo();

  const html = document.getElementById("teamGrid").innerHTML;

  profesionales
    .filter((p) => p.specialty)
    .forEach((p) => {
      expect(html).toContain(p.specialty);
    });
});
