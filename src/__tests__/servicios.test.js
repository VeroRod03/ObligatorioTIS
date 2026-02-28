const {
  servicioPorId,
  cargarServicios,
  clickTarjetasServicio,
} = require("../core/servicios");
const { servicios } = require("../core/constantes");

beforeEach(() => {
  document.body.innerHTML = `
      <section id="turno"></section>

      <select id="serviceType">
        <option value="">Elegir...</option>
        <option value="med_consulta">Consulta</option>
        <option value="estetica_completa">Consulta</option>
      </select>

      <article class="card card--clickable" data-id="med_consulta"></article>
      <article class="card card--clickable" data-id="estetica_completa"></article>
    `;
});

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

//Si se selecciona la tarjeta de servicio medico redirige al usuario al formulario
//con el campo de serviceType cargado con ese servicio
test("Funcionamiento de la seleccion de la tarjeta de servicio medico", () => {
  const turnoSection = document.querySelector("#turno");
  turnoSection.scrollIntoView = jest.fn();

  clickTarjetasServicio();

  //simulamos click en la tarjeta
  const cardMed = document.querySelector('[data-id="med_consulta"]');
  cardMed.click();

  expect(document.getElementById("serviceType").value).toBe("med_consulta");
});

//Lo mismo que el anterior pero para el servicio estetico
test("Funcionamiento de la seleccion de la tarjeta de servicio estetico", () => {
  const turnoSection = document.querySelector("#turno");
  turnoSection.scrollIntoView = jest.fn();

  clickTarjetasServicio();

  const cardEstetica = document.querySelector('[data-id="estetica_completa"]');
  cardEstetica.click();

  expect(document.getElementById("serviceType").value).toBe(
    "estetica_completa",
  );
});
