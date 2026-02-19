const { servicioPorId, cargarServicios } = require("../core/servicios");
const { servicios } = require("../core/constantes");

//Verifica que existan 2 servicios
test("Debe existir exactamente 2 servicios definidos", () => {
  expect(servicios).toHaveLength(2);
});

//Verifica que los servicios sean de tipo Salud o Estetica
test("Los servicios deben ser solo de tipo 'salud' o 'estetica'", () => {
  const tipos = servicios.map((s) => s.type);

  expect(tipos).toContain("salud");
  expect(tipos).toContain("estetica");

  const tiposValidos = ["salud", "estetica"];
  tipos.forEach((t) => {
    expect(tiposValidos).toContain(t);
  });
});

//Verifica que la funcion servicioPorId retorne el servicio correcto
test("servicioPorId debe devolver el servicio correcto", () => {
  const servicio = servicioPorId("med_consulta");

  expect(servicio).toBeDefined();
  expect(servicio.title).toBe("Consulta médica");
  expect(servicio.price).toBe(500);
});

//Verifica que la funcion cargarServicios genere correctamente 2 tarjetas
test("cargarServicios debe renderizar 2 tarjetas en el DOM", () => {
  document.body.innerHTML = `<div id="servicesGrid"></div>`;

  cargarServicios();

  const cards = document.querySelectorAll("#servicesGrid .card");

  expect(cards.length).toBe(2);
});

//Verifica que la funcion cargarServicios muestre el precio de cada uno correctamente
test("cargarServicios debe mostrar el precio correctamente", () => {
  document.body.innerHTML = `<div id="servicesGrid"></div>`;

  cargarServicios();

  const html = document.getElementById("servicesGrid").innerHTML;

  expect(html).toContain("$500");
  expect(html).toContain("$1800");
});

//Verifica que la funcion cargarServicios muestre los tipos de servicio correctamente
test("Las tarjetas deben mostrar el tipo de servicio correctamente", () => {
  document.body.innerHTML = `<div id="servicesGrid"></div>`;

  cargarServicios();

  const html = document.getElementById("servicesGrid").innerHTML;

  expect(html).toContain("Salud");
  expect(html).toContain("Estética/Baño");
});
