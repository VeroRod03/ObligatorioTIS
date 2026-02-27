// =============================================================
// HUELLAS - BUNDLE IIFE PARA NAVEGADOR (SIN require/import)
// Todo se expone en window.*
// =============================================================

//Esto es necesario para que funcione en el navegador
(function (window, document) {
  "use strict";

  // ---------- Helpers ----------
  function $(sel) {
    return document.querySelector(sel);
  }
  function $$(sel) {
    return document.querySelectorAll(sel);
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDateISO(d) {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return y + "-" + m + "-" + day;
  }

  function showToast(msg) {
    var toast = $("#toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("is-show");
    }, 2600);
  }

  function openModal(text) {
    var modal = $("#modal");
    if (!modal) return;
    var txt = $("#modalText");
    if (txt) txt.textContent = text;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    var modal = $("#modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  // Exponer helpers
  window.$ = $;
  window.$$ = $$;
  window.pad2 = pad2;
  window.formatDateISO = formatDateISO;
  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;

  // ---------- Almacenamiento ----------
  var LS_KEYS = {
    users: "huellas_users",
    session: "huellas_session",
    bookings: "huellas_bookings",
  };

  function readLS(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ---------- Datos ----------
  var servicios = [
    {
      id: "med_consulta",
      title: "Consulta médica",
      type: "salud",
      price: 500,
      description:
        "Evaluación clínica general. Medicación no incluida (extras aparte).",
    },
    {
      id: "estetica_completa",
      title: "Estética completa",
      type: "estetica",
      price: 1800,
      description: "Corte de pelo, lavado, secado y corte de uñas.",
    },
  ];

  var profesionales = [
    {
      id: "v1",
      name: "Dra. Sofía Martínez",
      role: "salud",
      specialty: "Clínica general",
      bio: "Atención amable y precisa. Perros y gatos.",
      initials: "SM",
      photo:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "v2",
      name: "Dr. Mateo Silva",
      role: "salud",
      specialty: "Dermatología",
      bio: "Enfoque en piel, alergias y cuidados.",
      initials: "MS",
      photo:
        "https://img.freepik.com/fotos-premium/gato-escucha-veterinario-hombre-estetoscopio-cita-clinica-veterinaria_255667-35330.jpg?w=2000",
    },
    {
      id: "v3",
      name: "Dra. Valentina Ríos",
      role: "salud",
      specialty: "Medicina preventiva",
      bio: "Vacunas, controles y bienestar.",
      initials: "VR",
      photo:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "e1",
      name: "Camila Pérez",
      role: "estetica",
      bio: "Paciencia y cuidado con cada mascota.",
      initials: "CP",
      photo:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "e2",
      name: "Lucas Fernández",
      role: "estetica",
      bio: "Estilos cómodos y seguros según raza.",
      initials: "LF",
      photo:
        "https://media.istockphoto.com/id/2102632990/es/foto/médico-veterinario-de-hombre-feliz-en-uniforme-azul-abrazando-al-perro-corgi-galés-de-pembroke.webp?a=1&b=1&s=612x612&w=0&k=20&c=1Mj0L_QdndYlADIXWk8PQdXpjJN-nyl7LXz_eweSMuM=",
    },
    {
      id: "e3",
      name: "Agustina López",
      role: "estetica",
      bio: "Detalles prolijos para un look saludable.",
      initials: "AL",
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    },
  ];

  var slidesGaleria = [
    {
      label: "Consulta general",
      img: "https://images.unsplash.com/photo-1728013274420-ed02b1f58887?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0",
      fallbackGradient:
        "linear-gradient(135deg, rgba(167,243,208,.75), rgba(122,166,255,.55))",
    },
    {
      label: "Vacunación y control",
      img: "https://images.unsplash.com/photo-1632236542159-809925d85fc0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
      fallbackGradient:
        "linear-gradient(135deg, rgba(251,207,232,.70), rgba(167,243,208,.70))",
    },
    {
      label: "Estética / baño",
      img: "https://images.unsplash.com/photo-1719464454959-9cf304ef4774?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
      fallbackGradient:
        "linear-gradient(135deg, rgba(251,207,232,.75), rgba(122,166,255,.55))",
    },
    {
      label: "Cuidado dental",
      img: "https://images.unsplash.com/photo-1577175889968-f551f5944abd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
      fallbackGradient:
        "linear-gradient(135deg, rgba(122,166,255,.65), rgba(167,243,208,.55))",
    },
  ];

  // ---------- Repos (búsqueda en catálogos) ----------
  function servicioPorId(id) {
    for (var i = 0; i < servicios.length; i++) {
      if (servicios[i].id === id) return servicios[i];
    }
    return undefined;
  }
  function profesionalPorId(id) {
    for (var i = 0; i < profesionales.length; i++) {
      if (profesionales[i].id === id) return profesionales[i];
    }
    return undefined;
  }

  // ---------- Navegación ----------
  function initNav() {
    var btn = $("#navToggle");
    var menu = $("#navMenu");
    if (!btn || !menu) return;

    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });

    var links = $$("#navMenu a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        var m = $("#navMenu");
        var b = $("#navToggle");
        if (m) m.classList.remove("is-open");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }
  }

  // ---------- Router ----------
  var ROUTES = {
    inicio: { view: "view-inicio", scrollTo: "inicio" },
    servicios: { view: "view-inicio", scrollTo: "servicios" },
    equipo: { view: "view-inicio", scrollTo: "equipo" },
    galeria: { view: "view-inicio", scrollTo: "galeria" },
    turno: { view: "view-inicio", scrollTo: "turno" },
    ubicacion: { view: "view-inicio", scrollTo: "ubicacion" },
    admin: { view: "view-admin" },
    acceso: { view: "view-acceso" },
  };

  function showView(viewId) {
    var views = $$(".view");
    for (var i = 0; i < views.length; i++) {
      views[i].classList.remove("is-active");
    }
    var view = document.getElementById(viewId);
    if (view) view.classList.add("is-active");
    window.scrollTo(0, 0);
  }

  function handleRoute() {
    const raw = (location.hash || "#inicio").replace("#", "");
    const route = ROUTES[raw] || ROUTES["inicio"];

    // 🔐 PROTECCIÓN ADMIN
    if (raw === "admin" && !isAdmin()) {
      showToast("Acceso denegado.");
      location.hash = "#inicio";
      return;
    }

    showView(route.view);

    if (route.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(route.scrollTo);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }

  // ---------- Render servicios ----------
  function cargarServicios() {
    var grid = $("#servicesGrid");
    if (!grid) return;

    grid.innerHTML = servicios
      .map(function (s) {
        var imgSrc =
          s.type === "salud"
            ? "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
            : "https://images.unsplash.com/photo-1611173622933-91942d394b04?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0";

        var imgAlt =
          s.type === "salud"
            ? "Servicio veterinario de salud"
            : "Servicio de estética y baño";

        return (
          '<article class="card card--clickable" data-id="' +
          s.id +
          '" role="article">' +
          '  <div class="card__top">' +
          '    <div class="avatar">' +
          '      <img src="' +
          imgSrc +
          '" alt="' +
          imgAlt +
          '">' +
          "    </div>" +
          '    <div class="card__meta">' +
          "      <strong>" +
          s.title +
          "</strong>" +
          '      <span class="muted">' +
          (s.type === "salud" ? "Salud" : "Estética/Baño") +
          "</span>" +
          "    </div>" +
          "  </div>" +
          '  <p class="card__desc">' +
          s.description +
          "</p>" +
          '  <span class="tag">' +
          (s.type === "salud"
            ? "Turno médico · 30 min"
            : "Servicio estético · 1 hora") +
          "  </span>" +
          '  <div class="price">$' +
          s.price +
          "</div>" +
          "</article>"
        );
      })
      .join("");
    initServiciosClick();
  }

  //funcion para menejar el comportamiento de las tarjetas de servicio
  function initServiciosClick() {
    const cards = document.querySelectorAll(".card--clickable");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const servicioId = card.dataset.id;

        //inicializamos el tipo de servicio en el formulario de reservas
        const serviceSelect = document.querySelector("#serviceType");

        serviceSelect.value = servicioId;

        // Disparar evento change para que cargue a los profesionales
        serviceSelect.dispatchEvent(new Event("change"));

        //scroll suave al formulario
        document.querySelector("#turno").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // ---------- Render equipo ----------
  function cargarEquipo() {
    var grid = $("#teamGrid");
    if (!grid) return;

    grid.innerHTML = profesionales
      .map(function (p) {
        return (
          '<article class="card">' +
          '  <div class="card__top">' +
          '    <div class="avatar avatar--photo" aria-hidden="true">' +
          (p.photo
            ? '<img src="' +
              p.photo +
              '" alt="' +
              p.name +
              '" onerror="this.remove();">'
            : p.initials) +
          "    </div>" +
          '    <div class="card__meta">' +
          "      <strong>" +
          p.name +
          "</strong>" +
          '      <span class="muted">' +
          (p.role === "salud" ? "Veterinaria" : "Estética/Baño") +
          (p.specialty ? " · " + p.specialty : "") +
          "      </span>" +
          "    </div>" +
          "  </div>" +
          '  <p class="card__desc">' +
          p.bio +
          "</p>" +
          '  <span class="tag">' +
          (p.role === "salud"
            ? "Profesional de salud"
            : "Profesional de estética") +
          "</span>" +
          "</article>"
        );
      })
      .join("");
  }

  // ---------- Galería ----------
  function cargarGaleria() {
    var track = $("#carouselTrack");
    var dotsWrap = $("#carouselDots");
    var prev = $("#prevSlide");
    var next = $("#nextSlide");
    if (!track || !dotsWrap || !prev || !next) return;

    track.innerHTML = slidesGaleria
      .map(function (s, i) {
        return (
          '<div class="slide" data-index="' +
          i +
          '">' +
          '  <span class="slide__label">' +
          s.label +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    var slides = $$(".slide");
    for (var i = 0; i < slides.length; i++) {
      (function (el, idx) {
        var s = slidesGaleria[idx];
        el.style.backgroundImage = s.fallbackGradient;
        var img = new Image();
        img.onload = function () {
          el.style.backgroundImage = 'url("' + s.img + '")';
        };
        img.src = s.img;
      })(slides[i], i);
    }

    dotsWrap.innerHTML = slidesGaleria
      .map(function (_, i) {
        return '<span class="dot" data-dot="' + i + '"></span>';
      })
      .join("");

    var dots = $$("#carouselDots .dot");
    var index = 0;

    function go(i) {
      index = (i + slidesGaleria.length) % slidesGaleria.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.remove("is-active");
      }
      if (dots[index]) dots[index].classList.add("is-active");
    }

    prev.addEventListener("click", function () {
      go(index - 1);
      resetAuto();
    });
    next.addEventListener("click", function () {
      go(index + 1);
      resetAuto();
    });

    for (var j = 0; j < dots.length; j++) {
      (function (dot) {
        dot.addEventListener("click", function () {
          go(Number(dot.getAttribute("data-dot")));
          resetAuto();
        });
      })(dots[j]);
    }

    go(0);

    var timer = null;
    function auto() {
      timer = setInterval(function () {
        go(index + 1);
      }, 4200);
    }
    function resetAuto() {
      clearInterval(timer);
      auto();
    }
    auto();
  }

  // ---------- Acceso (Login) ----------
  function isAdmin() {
    const sess = getSession();
    return !!sess?.username && !!sess?.isAdmin;
  }

  function getUsers() {
    return readLS(LS_KEYS.users, [
      { username: "admin", password: "admin1234", isAdmin: true },
    ]);
  }
  function getSession() {
    return readLS(LS_KEYS.session, { username: null, isAdmin: false });
  }
  function setSession(sess) {
    writeLS(LS_KEYS.session, sess);
    updateSessionLabel();
  }

  function updateSessionLabel() {
    var sess = getSession();
    var label = $("#sessionLabel");
    if (label) {
      label.textContent =
        sess && sess.username ? String(sess.username) : "Invitado";
    }
    var isLoggedIn = !!(sess && sess.username);

    var navTurnos = $("#navTurnos");
    if (navTurnos) {
      navTurnos.hidden = !isLoggedIn;
      navTurnos.style.display = isLoggedIn ? "" : "none";
    }

    var navAcceso = $("#navAcceso");
    if (navAcceso) {
      navAcceso.hidden = isLoggedIn;
      navAcceso.style.display = isLoggedIn ? "none" : "";
    }
    var logoutBtn = $("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.hidden = !isLoggedIn;
      logoutBtn.style.display = isLoggedIn ? "" : "none";
    }
  }

  function initAuth() {
    updateSessionLabel();

    var loginForm = $("#loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var username = ($("#logUser").value || "").trim();
        var password = $("#logPass").value;

        var users = getUsers();
        var found = null;
        for (var i = 0; i < users.length; i++) {
          var u = users[i];
          if (
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
          ) {
            found = u;
            break;
          }
        }

        if (!found) {
          showToast("Credenciales incorrectas.");
          return;
        }

        setSession({ username: found.username, isAdmin: !!found.isAdmin });
        loginForm.reset();
        showToast("Sesión iniciada ✅");
        location.hash = "#admin";
      });
    }

    var logoutBtn = $("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        setSession({ username: null, isAdmin: false });
        if (loginForm) loginForm.reset();
        showToast("Sesión cerrada.");
        // Redirige a inicio después de cerrar sesión
        location.hash = "#inicio";
      });
    }
  }

  // ---------- Turnos (persistencia) ----------
  function obtenerTurnos() {
    var hoy = new Date();

    if (hoy.getDay() === 0) {
      hoy.setDate(hoy.getDate() + 1); // pasa a lunes
    }

    return readLS(LS_KEYS.bookings, [
      {
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
  function actualizarTurnos(list) {
    writeLS(LS_KEYS.bookings, list);
  }

  // ---------- Formulario / horarios ----------
  function mostrarOpcionesProfesionales(type) {
    var select = $("#profesionalId");
    if (!select) return;
    var list = type
      ? profesionales.filter(function (p) {
          return p.role === type;
        })
      : profesionales;

    select.innerHTML =
      '<option value="">Elegir...</option>' +
      list
        .map(function (p) {
          return (
            '<option value="' +
            p.id +
            '">' +
            p.name +
            (p.specialty ? " — " + p.specialty : "") +
            "</option>"
          );
        })
        .join("");
  }

  /**
   * Horarios de atención:
   * Lun–Vie 09:00–18:00 (último turno inicia 17:30)
   * Sáb 09:00–12:30 (último turno inicia 12:00)
   * Turnos de 30 min o 60 min
   */
  function estaDentroHorarioAtencion(dateISO, time, durationMin) {
    var d = new Date(dateISO + "T00:00:00");
    var day = d.getDay();
    if (day === 0) return false; // domingo
    var parts = time.split(":");
    var hh = Number(parts[0]);
    var mm = Number(parts[1]);
    var minutes = hh * 60 + mm;
    var open = 9 * 60;
    var close = day === 6 ? 12 * 60 + 30 : 18 * 60;
    return minutes >= open && minutes <= close - durationMin;
  }

  function generarSlotsTiempo(dateISO, durationMin) {
    var d = new Date(dateISO + "T00:00:00");
    var day = d.getDay();
    if (day === 0) return []; // domingo cerrado
    var open = 9 * 60;
    var close = day === 6 ? 12 * 60 + 30 : 18 * 60;
    var slots = [];
    for (var m = open; m <= close - durationMin; m += durationMin) {
      var h = Math.floor(m / 60);
      var mm = m % 60;
      slots.push(pad2(h) + ":" + pad2(mm));
    }
    return slots;
  }

  function actualizarHorariosDisponibles() {
    var dateISO = $("#date").value;
    var profesionalId = $("#profesionalId").value;
    var timeSelect = $("#time");
    if (!timeSelect) return;

    if (!dateISO || !profesionalId) {
      timeSelect.innerHTML = `<option value="">Elegir fecha y profesional primero...</option>`;
      return;
    }

    var serviceId = $("#serviceType").value;
    var service = servicioPorId(serviceId);
    var duration = service && service.type === "estetica" ? 60 : 30;

    var allSlots = generarSlotsTiempo(dateISO, duration);
    if (allSlots.length === 0) {
      timeSelect.innerHTML = '<option value="">Cerrado (domingo)</option>';
      return;
    }

    var bookings = obtenerTurnos();
    var occupiedArr = bookings
      .filter(function (b) {
        return (
          b.status === "activo" &&
          b.dateISO === dateISO &&
          (!profesionalId || b.profesionalId === profesionalId)
        );
      })
      .map(function (b) {
        return b.time;
      });

    var occupied = {};
    for (var i = 0; i < occupiedArr.length; i++) {
      occupied[occupiedArr[i]] = true;
    }

    var options = allSlots
      .map(function (t) {
        var isBusy = !!occupied[t];
        return (
          '<option value="' +
          t +
          '" ' +
          (isBusy ? "disabled" : "") +
          ">" +
          t +
          (isBusy ? " — Ocupado" : "") +
          "</option>"
        );
      })
      .join("");

    timeSelect.innerHTML = '<option value="">Elegir...</option>' + options;
  }

  function formularioTurno() {
    var serviceTypeEl = $("#serviceType");
    var dateEl = $("#date");
    var profEl = $("#profesionalId");
    var resetBtn = $("#resetBooking");
    var form = $("#bookingForm");

    if (!serviceTypeEl || !dateEl || !profEl || !form) return;

    serviceTypeEl.addEventListener("change", function () {
      var serviceId = $("#serviceType").value;
      var service = servicioPorId(serviceId);
      mostrarOpcionesProfesionales((service && service.type) || "");

      $("#time").innerHTML =
        '<option value="">Elegir fecha y profesional primero...</option>';
      $("#date").value = "";
    });

    dateEl.addEventListener("change", actualizarHorariosDisponibles);
    profEl.addEventListener("change", actualizarHorariosDisponibles);

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        $("#time").innerHTML =
          '<option value="">Elegir fecha y profesional primero...</option>';
        mostrarOpcionesProfesionales("");
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var serviceId = $("#serviceType").value;
      var profesionalId = $("#profesionalId").value;
      var dateISO = $("#date").value;
      var time = $("#time").value;
      var ownerName = ($("#ownerName").value || "").trim();
      var petName = ($("#petName").value || "").trim();
      var phone = ($("#phone").value || "").trim();

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

      var service = servicioPorId(serviceId);
      var duration = service && service.type === "estetica" ? 60 : 30;

      var todayISO = formatDateISO(new Date());
      if (dateISO < todayISO) {
        showToast("No es posible reservar en fechas anteriores al día de hoy.");
        return;
      }

      if (!estaDentroHorarioAtencion(dateISO, time, duration)) {
        showToast("Ese horario está fuera del horario de atención.");
        return;
      }

      var bookings = obtenerTurnos();
      var ocupado = false;
      for (var i = 0; i < bookings.length; i++) {
        var b = bookings[i];
        if (
          b.status === "activo" &&
          b.profesionalId === profesionalId &&
          b.dateISO === dateISO &&
          b.time === time
        ) {
          ocupado = true;
          break;
        }
      }

      if (ocupado) {
        showToast("Ese horario ya está ocupado para ese profesional.");
        actualizarHorariosDisponibles();
        return;
      }

      var newBooking = {
        id: crypto.randomUUID(),
        status: "activo",
        ownerName: ownerName,
        petName: petName,
        phone: phone,
        serviceId: serviceId,
        profesionalId: profesionalId,
        dateISO: dateISO,
        time: time,
      };

      bookings.push(newBooking);
      actualizarTurnos(bookings);

      var s = servicioPorId(serviceId);
      var p = profesionalPorId(profesionalId);
      var fecha = new Date(dateISO + "T00:00:00");
      var fechaFormateada = `${pad2(fecha.getDate())}/${pad2(
        fecha.getMonth() + 1,
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

      form.reset();
      $("#time").innerHTML =
        '<option value="">Elegir fecha y profesional primero...</option>';
      mostrarOpcionesProfesionales("");
      renderizarTablaTurnos();
    });

    $("#date").setAttribute("min", formatDateISO(new Date()));
    mostrarOpcionesProfesionales("");
  }

  // ---------- Admin ----------
  var adminFilter = "hoy";
  var adminDateFilter = null; // YYYY-MM-DD o null

  function obtenerIdTurnosSeleccionados() {
    var cbs = $$("#bookingsTbody input[type='checkbox']:checked");
    var ids = [];
    for (var i = 0; i < cbs.length; i++) {
      ids.push(cbs[i].getAttribute("data-id"));
    }
    return ids;
  }

  function renderizarTablaTurnos() {
    var tbody = $("#bookingsTbody");
    if (!tbody) return;

    var bookings = obtenerTurnos();
    var todayISO = formatDateISO(new Date());
    var view = bookings.slice();

    if (adminDateFilter) {
      view = bookings.filter(function (b) {
        return b.dateISO === adminDateFilter;
      });
    } else if (adminFilter === "hoy") {
      view = bookings.filter(function (b) {
        return b.dateISO === todayISO;
      });
    } else if (adminFilter === "activos") {
      view = bookings.filter(function (b) {
        return b.status === "activo";
      });
    } else if (adminFilter === "cancelados") {
      view = bookings.filter(function (b) {
        return b.status === "cancelado";
      });
    }

    view.sort(function (a, b) {
      var keyA = a.dateISO + " " + a.time;
      var keyB = b.dateISO + " " + b.time;
      return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
    });

    if (view.length === 0) {
      tbody.innerHTML =
        "<tr>" +
        '  <td colspan="9" class="muted" style="padding:16px;">' +
        "    No hay turnos para mostrar con este filtro." +
        "  </td>" +
        "</tr>";
      return;
    }

    tbody.innerHTML = view
      .map(function (b) {
        var s = servicioPorId(b.serviceId);
        var p = profesionalPorId(b.profesionalId);
        var fecha = new Date(b.dateISO + "T00:00:00");
        var stateClass =
          b.status === "activo" ? "state--activo" : "state--cancelado";
        return (
          "<tr>" +
          '  <td class="col-check"><input type="checkbox" data-id="' +
          b.id +
          '" aria-label="Seleccionar turno"></td>' +
          '  <td><span class="state ' +
          stateClass +
          '">' +
          b.status +
          "</span></td>" +
          "  <td>" +
          b.ownerName +
          "</td>" +
          "  <td>" +
          b.petName +
          "</td>" +
          "  <td>" +
          (s ? s.title : "-") +
          "</td>" +
          "  <td>" +
          (p ? p.name : "-") +
          "</td>" +
          "  <td>" +
          pad2(fecha.getDate()) +
          "/" +
          pad2(fecha.getMonth() + 1) +
          "/" +
          fecha.getFullYear() +
          "</td>" +
          "  <td>" +
          b.time +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function initAdmin() {
    var chips = $$(".chip[data-admin-filter]");
    for (var i = 0; i < chips.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var all = $$(".chip[data-admin-filter]");
          for (var k = 0; k < all.length; k++)
            all[k].classList.remove("is-active");
          var calBtn = $("#calendarFilterBtn");
          if (calBtn) calBtn.classList.remove("is-active");

          btn.classList.add("is-active");
          adminFilter = btn.getAttribute("data-admin-filter");
          adminDateFilter = null;

          renderizarTablaTurnos();
        });
      })(chips[i]);
    }

    var selectAll = $("#selectAll");
    if (selectAll) {
      selectAll.addEventListener("change", function (e) {
        var checked = e.target.checked;
        var cbs = $$("#bookingsTbody input[type='checkbox']");
        for (var i = 0; i < cbs.length; i++) cbs[i].checked = checked;
      });
    }

    var cancelBtn = $("#cancelSelected");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        var ids = obtenerIdTurnosSeleccionados();
        if (ids.length === 0) {
          showToast("Seleccioná al menos un turno.");
          return;
        }

        var bookings = obtenerTurnos().map(function (b) {
          if (ids.indexOf(b.id) !== -1) {
            var copy = {};
            for (var k in b) copy[k] = b[k];
            copy.status = "cancelado";
            return copy;
          }
          return b;
        });

        actualizarHorariosDisponibles();
        actualizarTurnos(bookings);
        showToast("Turnos cancelados.");
        renderizarTablaTurnos();
        if (selectAll) selectAll.checked = false;
      });
    }

    var dateInput = $("#adminDateFilter");
    var calendarBtn = $("#calendarFilterBtn");
    if (calendarBtn && dateInput) {
      calendarBtn.addEventListener("click", function () {
        if (dateInput.showPicker) dateInput.showPicker();
        else dateInput.click();
      });

      dateInput.addEventListener("change", function () {
        adminDateFilter = dateInput.value;
        var all = $$(".chip[data-admin-filter]");
        for (var k = 0; k < all.length; k++)
          all[k].classList.remove("is-active");
        calendarBtn.classList.add("is-active");
        renderizarTablaTurnos();
      });
    }

    renderizarTablaTurnos();
  }

  // ---------- Modal ----------
  function initModal() {
    document.addEventListener("click", function (e) {
      if (
        e.target &&
        e.target.matches &&
        e.target.matches("[data-close-modal]")
      ) {
        closeModal();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  // ---------- Control de acceso admin ----------
  function controlarAccesoAdmin() {
    const adminSection = document.getElementById("adminSection");
    if (!adminSection) return;

    adminSection.style.display = isAdmin() ? "" : "none";
  }

  // ---------- Main ----------
  function main() {
    initNav();
    cargarGaleria();
    cargarServicios();
    cargarEquipo();
    initAuth();
    controlarAccesoAdmin();
    formularioTurno();
    initAdmin();
    initModal();

    window.addEventListener("hashchange", handleRoute);
    handleRoute();
  }

  // Exponer público
  window.main = main;
})(window, document);
