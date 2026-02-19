const { cargarGaleria } = require("../core/galeria");
const { slidesGaleria } = require("../core/constantes");

//Ponemos esto para que no se generen los slides de la galeria antes de cada test,
//lo que causaria que se vayan acumulando
beforeEach(() => {
  document.body.innerHTML = `
      <div id="carouselTrack"></div>
      <div id="carouselDots"></div>
      <button id="prevSlide"></button>
      <button id="nextSlide"></button>
    `;
});

//Verifica que se generen los slides correctos para la cantidad de imagenes que hay guardadas
test("Debe renderizar la misma cantidad de slides que en slidesGaleria", () => {
  cargarGaleria();

  const slides = document.querySelectorAll(".slide");

  expect(slides.length).toBe(slidesGaleria.length);
});

//Verifica que se genere un dot para cada slide de la galeria
test("Debe crear un dot por cada slide", () => {
  cargarGaleria();

  const dots = document.querySelectorAll("#carouselDots .dot");

  expect(dots.length).toBe(slidesGaleria.length);
});

//Verifica que al iniciar el carrusel se comience en la primera imagen
test("El primer slide debe estar activo al iniciar", () => {
  cargarGaleria();

  const dots = document.querySelectorAll("#carouselDots .dot");

  expect(dots[0].classList.contains("is-active")).toBe(true);
});

//Verifica que el boton next avance correctamente a la siguiente imagen
test("El botón next debe avanzar al siguiente slide", () => {
  cargarGaleria();

  const next = document.getElementById("nextSlide");
  const track = document.getElementById("carouselTrack");

  next.click();

  expect(track.style.transform).toContain("translateX(-100%)");
});

//Verifica que al apretar el boton prev desde el primer slide en el carrusel,
//vaya correctamente al ultimo slide del carrusel
test("El botón prev desde el primero debe ir al último (loop)", () => {
  cargarGaleria();

  const prev = document.getElementById("prevSlide");
  const track = document.getElementById("carouselTrack");

  prev.click();

  const expectedIndex = slidesGaleria.length - 1;
  expect(track.style.transform).toContain(
    `translateX(-${expectedIndex * 100}%)`,
  );
});
