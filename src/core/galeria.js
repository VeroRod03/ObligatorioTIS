const { $ } = require("./helpers");
const { slidesGaleria } = require("./constants");

// ---------- Galería ----------
function cargarGaleria() {
  const track = $("#carouselTrack");
  const dotsWrap = $("#carouselDots");
  const prev = $("#prevSlide");
  const next = $("#nextSlide");

  // Primero crea los slides y le pone los labels
  track.innerHTML = slidesGaleria
    .map(
      (s, i) => `
    <div class="slide" data-index="${i}">
      <span class="slide__label">${s.label}</span>
    </div>
  `,
    )
    .join("");

  // Acá primero pone un gradiente mientras la imagen carga, y después crea/carga la imagen en si
  $$(".slide").forEach((el, i) => {
    const s = slidesGaleria[i];
    el.style.backgroundImage = s.fallbackGradient;

    const img = new Image();
    img.onload = () => (el.style.backgroundImage = `url("${s.img}")`);
    img.src = s.img;
  });

  // Crea los puntos, uno por slide y guarda el índice
  dotsWrap.innerHTML = slidesGaleria
    .map((_, i) => `<span class="dot" data-dot="${i}"></span>`)
    .join("");
  const dots = $$("#carouselDots .dot");

  let index = 0;

  /* 
  - Primero controla que el índice siempre quede dentro del rango 0-3
  - Lo de transorm le va restando 100% como para que el track se vaya corriendo a la izquierda y
  muestre la siguiente
  - Después "apaga" todos los dots y selecciona cual encender, el del actual
  */
  function go(i) {
    index = (i + slidesGaleria.length) % slidesGaleria.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d) => d.classList.remove("is-active"));
    dots[index]?.classList.add("is-active");
  }

  prev.addEventListener("click", () => {
    go(index - 1);
    resetAuto();
  });
  next.addEventListener("click", () => {
    go(index + 1);
    resetAuto();
  });
  dots.forEach((d) =>
    d.addEventListener("click", () => {
      go(Number(d.dataset.dot));
      resetAuto();
    }),
  );

  go(0);

  // Para que haya autoplay, cada 4.2 segundos van pasando. Cada vez que apretemos un botón
  // el timer se resetea y vuelve a llamar a auto
  let timer = null;
  function auto() {
    timer = setInterval(() => go(index + 1), 4200);
  }
  function resetAuto() {
    clearInterval(timer);
    auto();
  }
  auto();
}

module.exports = { cargarGaleria };
