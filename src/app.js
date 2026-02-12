/* =========================
   Huellas — App JS (local)
   SPA por hash: muestra/oculta VISTAS
   ========================= */

const LS_KEYS = {
  users: "huellas_users",
  session: "huellas_session",
  bookings: "huellas_bookings",
};

// ---------- Datos precargados ----------
const servicios = [
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

const profesionales = [
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
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "v3",
    name: "Dra. Valentina Ríos",
    role: "salud",
    specialty: "Medicina preventiva",
    bio: "Vacunas, controles y bienestar.",
    initials: "VR",
    photo:
      "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "e1",
    name: "Camila Pérez",
    role: "estetica",
    bio: "Paciencia y cuidado con cada mascota.",
    initials: "CP",
    photo:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "e2",
    name: "Lucas Fernández",
    role: "estetica",
    bio: "Estilos cómodos y seguros según raza.",
    initials: "LF",
    photo:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=800&q=80",
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

// Galería con imágenes REALES (online) + fallback
const slidesGaleria = [
  {
    label: "Consulta general",
    img: "https://images.unsplash.com/photo-1728013274420-ed02b1f58887?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fallbackGradient:
      "linear-gradient(135deg, rgba(167,243,208,.75), rgba(122,166,255,.55))",
  },
  {
    label: "Vacunación y control",
    img: "https://images.unsplash.com/photo-1632236542159-809925d85fc0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fallbackGradient:
      "linear-gradient(135deg, rgba(251,207,232,.70), rgba(167,243,208,.70))",
  },
  {
    label: "Estética / baño",
    img: "https://images.unsplash.com/photo-1719464454959-9cf304ef4774?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fallbackGradient:
      "linear-gradient(135deg, rgba(251,207,232,.75), rgba(122,166,255,.55))",
  },
  {
    label: "Cuidado dental",
    img: "https://images.unsplash.com/photo-1577175889968-f551f5944abd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fallbackGradient:
      "linear-gradient(135deg, rgba(122,166,255,.65), rgba(167,243,208,.55))",
  },
];

// ---------- Helpers ----------

/*
estas constantes son solo para no escribir documentquerySelector constantentemente,
le pasas el nombre de selector de css. $ busca el primer elemento que matchee, $$ busca todos
*/
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* read y write nos permiten manejar la informacion sin una base de datos */

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/*agrega 0 a la izquierda en caso de ser necesario; como siguiendo un formato*/

function pad2(n) {
  return String(n).padStart(2, "0");
}
function formatDateISO(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("is-show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-show"), 2600);
}

function openModal(text) {
  const modal = $("#modal");
  $("#modalText").textContent = text;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  const modal = $("#modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[s],
  );
}

// ---------- Navegación móvil ----------
function initNav() {
  const btn = $("#navToggle");
  const menu = $("#navMenu");

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });

  // Cerrar menú al clickear un link (móvil)
  $$("#navMenu a").forEach((a) => {
    a.addEventListener("click", () => {
      $("#navMenu").classList.remove("is-open");
      $("#navToggle").setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Router (hash) ----------
const ROUTES = {
  inicio: { view: "view-inicio", scrollTo: "inicio" },
  servicios: { view: "view-inicio", scrollTo: "servicios" },
  equipo: { view: "view-inicio", scrollTo: "equipo" },
  galeria: { view: "view-inicio", scrollTo: "galeria" },
  reserva: { view: "view-inicio", scrollTo: "reserva" },
  ubicacion: { view: "view-inicio", scrollTo: "ubicacion" },

  admin: { view: "view-admin" },
  acceso: { view: "view-acceso" },
};

function showView(viewId) {
  $$(".view").forEach((v) => v.classList.remove("is-active"));
  const view = document.getElementById(viewId);
  if (view) view.classList.add("is-active");
  window.scrollTo(0, 0);
}

function handleRoute() {
  const raw = (location.hash || "#inicio").replace("#", "");
  const route = ROUTES[raw] || ROUTES["inicio"];

  showView(route.view);

  if (route.scrollTo) {
    setTimeout(() => {
      const el = document.getElementById(route.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }
}

// ---------- Render servicios ----------
function renderServices(filter = "all") {
  const grid = $("#servicesGrid");
  const list =
    filter === "all" ? servicios : servicios.filter((s) => s.type === filter);

  grid.innerHTML = list
    .map((s) => {
      const imgSrc =
        s.type === "salud"
          ? "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : "https://images.unsplash.com/photo-1611173622933-91942d394b04?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

      const imgAlt =
        s.type === "salud"
          ? "Servicio veterinario de salud"
          : "Servicio de estética y baño";

      return `
        <article class="card" role="article">
          <div class="card__top">
            <div class="avatar">
              <img src="${imgSrc}" alt="${imgAlt}">
            </div>
            <div class="card__meta">
              <strong>${s.title}</strong>
              <span class="muted">${s.type === "salud" ? "Salud" : "Estética/Baño"}</span>
            </div>
          </div>

          <p class="card__desc">${s.description}</p>
          <span class="tag">
            ${
              s.type === "salud"
                ? "Turno médico · 30 min"
                : "Servicio estético · 1 hora"
            }
          </span>
          <div class="price">$${s.price}</div>
        </article>
      `;
    })
    .join("");
}

function initServiceFilters() {
  $$(".chip[data-service-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".chip[data-service-filter]").forEach((b) =>
        b.classList.remove("is-active"),
      );
      btn.classList.add("is-active");
      renderServices(btn.dataset.serviceFilter);
    });
  });
}

// ---------- Render equipo ----------
function renderTeam() {
  const grid = $("#teamGrid");
  grid.innerHTML = profesionales
    .map(
      (p) => `
    <article class="card">
      <div class="card__top">
        <div class="avatar avatar--photo" aria-hidden="true">
          <img src="${p.photo || ""}" alt="${escapeHtml(p.name)}" onerror="this.remove(); this.parentElement.textContent='${p.initials}'">
        </div>
        <div class="card__meta">
          <strong>${p.name}</strong>
          <span class="muted">
            ${p.role === "salud" ? "Veterinaria" : "Estética/Baño"}
            ${p.specialty ? " · " + p.specialty : ""}
          </span>
        </div>
      </div>
      <p class="card__desc">${p.bio}</p>
      <span class="tag">${p.role === "salud" ? "Profesional de salud" : "Profesional de estética"}</span>
    </article>
  `,
    )
    .join("");
}

// ---------- Carousel ----------
function initCarousel() {
  const track = $("#carouselTrack");
  const dotsWrap = $("#carouselDots");
  const prev = $("#prevSlide");
  const next = $("#nextSlide");

  track.innerHTML = slidesGaleria
    .map(
      (s, i) => `
    <div class="slide" data-index="${i}">
      <span class="slide__label">${s.label}</span>
    </div>
  `,
    )
    .join("");

  $$(".slide").forEach((el, i) => {
    const s = slidesGaleria[i];
    el.style.backgroundImage = s.fallbackGradient;

    const img = new Image();
    img.onload = () => (el.style.backgroundImage = `url("${s.img}")`);
    img.src = s.img;
  });

  dotsWrap.innerHTML = slidesGaleria
    .map((_, i) => `<span class="dot" data-dot="${i}"></span>`)
    .join("");
  const dots = $$("#carouselDots .dot");

  let index = 0;
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

// ---------- Acceso (Registro/Login) ----------
function getUsers() {
  return readLS(LS_KEYS.users, [
    { username: "admin", password: "admin1234", isAdmin: true },
  ]);
}
function setUsers(users) {
  writeLS(LS_KEYS.users, users);
}

function getSession() {
  return readLS(LS_KEYS.session, { username: null, isAdmin: false });
}
function setSession(sess) {
  writeLS(LS_KEYS.session, sess);
  updateSessionLabel();
}

function updateSessionLabel() {
  const sess = getSession();
  $("#sessionLabel").textContent = sess?.username
    ? `${sess.username}${sess.isAdmin ? " (admin)" : ""}`
    : "Invitado";
}

function initAuth() {
  updateSessionLabel();

  $("#registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = $("#regUser").value.trim();
    const password = $("#regPass").value;

    if (!username) {
      showToast("Ingresá un nombre de usuario.");
      return;
    }
    if (password.length < 8) {
      showToast("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    const users = getUsers();
    if (
      users.some((u) => u.username.toLowerCase() === username.toLowerCase())
    ) {
      showToast("Ese usuario ya existe. Probá otro.");
      return;
    }

    users.push({ username, password, isAdmin: false });
    setUsers(users);
    showToast("Registro exitoso ✅ Ya podés iniciar sesión.");
    $("#registerForm").reset();
  });

  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = $("#logUser").value.trim();
    const password = $("#logPass").value;

    const users = getUsers();
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password,
    );

    if (!found) {
      showToast("Credenciales incorrectas.");
      return;
    }

    setSession({ username: found.username, isAdmin: !!found.isAdmin });
    showToast("Sesión iniciada ✅");
    location.hash = "#inicio";
  });

  $("#logoutBtn").addEventListener("click", () => {
    setSession({ username: null, isAdmin: false });
    showToast("Sesión cerrada.");
  });

  // ---------- Toggle Login / Registro ----------
  const loginCard = $("#loginCard");
  const registerCard = $("#registerCard");
  const showRegisterBtn = $("#showRegister");
  const showLoginBtn = $("#showLogin");

  if (showRegisterBtn && showLoginBtn) {
    showRegisterBtn.addEventListener("click", () => {
      loginCard.hidden = true;
      registerCard.hidden = false;
    });

    showLoginBtn.addEventListener("click", () => {
      registerCard.hidden = true;
      loginCard.hidden = false;
    });
  }
}

// ---------- Reserva (horarios + validación) ----------
function getBookings() {
  return readLS(LS_KEYS.bookings, [
    {
      id: crypto.randomUUID(),
      status: "pendiente",
      username: "admin",
      ownerName: "Juana Fernández",
      petName: "Milo",
      phone: "09 111 111",
      serviceId: "med_consulta",
      profesionalId: "v1",
      dateISO: formatDateISO(new Date()),
      time: "10:00",
    },
    {
      id: crypto.randomUUID(),
      status: "cancelada",
      username: "pablo03",
      ownerName: "Juana Fernández",
      petName: "Manchitas",
      phone: "07 222 333",
      serviceId: "estetica_completa",
      profesionalId: "e1",
      dateISO: formatDateISO(new Date()),
      time: "14:00",
    },
  ]);
}
function setBookings(list) {
  writeLS(LS_KEYS.bookings, list);
}

function serviceById(id) {
  return servicios.find((s) => s.id === id);
}
function profById(id) {
  return profesionales.find((p) => p.id === id);
}

function initBooking() {
  // --- Cambio de servicio ---
  $("#serviceType").addEventListener("change", () => {
    const serviceId = $("#serviceType").value;
    const service = serviceById(serviceId);

    // Recarga profesionales según el tipo
    renderProfessionalOptions(service?.type || "");

    // Resetea horarios
    $("#time").innerHTML = `<option value="">Elegir fecha primero...</option>`;
  });

  // --- Cambio de fecha o profesional ---
  $("#date").addEventListener("change", updateAvailableTimes);
  $("#profesionalId").addEventListener("change", updateAvailableTimes);

  // --- Botón limpiar ---
  $("#resetBooking").addEventListener("click", () => {
    $("#bookingForm").reset();
    $("#time").innerHTML = `<option value="">Elegir fecha primero...</option>`;
    renderProfessionalOptions("");

  });

  $("#bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const serviceId = $("#serviceType").value;
    const profesionalId = $("#profesionalId").value;
    const dateISO = $("#date").value;
    const time = $("#time").value;
    const ownerName = $("#ownerName").value.trim();
    const petName = $("#petName").value.trim();
    const phone = $("#phone").value.trim();

    // Validación básica
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

    // Duración según servicio
    const service = serviceById(serviceId);
    const duration = service?.type === "estetica" ? 60 : 30;

    // Validación de horario con nueva duración
    if (!isWithinOpeningHours(dateISO, time, duration)) {
      showToast("Ese horario está fuera del horario de atención.");
      return;
    }

    // Verificar que el horario no esté ocupado
    const bookings = getBookings();
    const ocupado = bookings.some(
      (b) =>
        b.status === "pendiente" &&
        b.profesionalId === profesionalId &&
        b.dateISO === dateISO &&
        b.time === time
    );

    if (ocupado) {
      showToast("Ese horario ya está ocupado para ese profesional.");
      updateAvailableTimes();
      return;
    }

    // Crear turno
    const newBooking = {
      id: crypto.randomUUID(),
      status: "pendiente",
      ownerName,
      petName,
      phone,
      serviceId,
      profesionalId,
      dateISO,
      time,
    };

    bookings.push(newBooking);
    setBookings(bookings);

    // Mostrar confirmación en modal
    const s = serviceById(serviceId);
    const p = profById(profesionalId);

    const fecha = new Date(dateISO); // para mostrar la fecha con el formato que queremos

    openModal(
      `Turno para ${petName} (${ownerName}) — ${s.title} con ${p.name} el ${pad2(fecha.getDay())}/${pad2(fecha.getMonth())}/${fecha.getFullYear()} a las ${time}.`
    );

    showToast("Reserva registrada ✅");

    // Reset del formulario
    $("#bookingForm").reset();
    $("#time").innerHTML = `<option value="">Elegir fecha primero...</option>`;
    renderProfessionalOptions("");
    renderAdminTable();
  });

  // Fecha mínima = hoy
  $("#date").min = formatDateISO(new Date());

  // Inicializar profesionales (vacío hasta elegir servicio)
  renderProfessionalOptions("");
}

function renderProfessionalOptions(type) {
  const select = $("#profesionalId");
  const list = type
    ? profesionales.filter((p) => p.role === type)
    : profesionales;

  select.innerHTML =
    `<option value="">Elegir...</option>` +
    list
      .map(
        (p) =>
          `<option value="${p.id}">
            ${p.name}${p.specialty ? " — " + p.specialty : ""}
          </option>`,
      )
      .join("");
}

/**
 * Horarios de atención:
 * Lun–Vie 09:00–18:00 (último turno inicia 17:30)
 * Sáb 09:00–12:30 (último turno inicia 12:00)
 * Turno 30 min.
 */
function isWithinOpeningHours(dateISO, time, durationMin) {
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

function generateTimeSlots(dateISO, durationMin) {
  const d = new Date(dateISO + "T00:00:00");
  const day = d.getDay();
  if (day === 0) return []; // domingo cerrado

  const open = 9 * 60;
  const close = day === 6 ? 12 * 60 + 30 : 18 * 60;

  const slots = [];
  for (let m = open; m <= close - durationMin; m += durationMin) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${pad2(h)}:${pad2(mm)}`);
  }
  return slots;
}

function updateAvailableTimes() {
  const dateISO = $("#date").value;
  const profesionalId = $("#profesionalId").value;
  const timeSelect = $("#time");

  if (!dateISO) {
    timeSelect.innerHTML = `<option value="">Elegir fecha primero...</option>`;
    return;
  }

  // Duración según servicio seleccionado
  const serviceId = $("#serviceType").value;
  const service = serviceById(serviceId);
  const duration = service?.type === "estetica" ? 60 : 30;

  const allSlots = generateTimeSlots(dateISO, duration);
  if (allSlots.length === 0) {
    timeSelect.innerHTML = `<option value="">Cerrado (domingo)</option>`;
    return;
  }

  const bookings = getBookings();
  const occupied = new Set(
    bookings
      .filter(
        (b) =>
          b.status === "pendiente" &&
          b.dateISO === dateISO &&
          (!profesionalId || b.profesionalId === profesionalId),
      )
      .map((b) => b.time),
  );

  const options = allSlots
    .map((t) => {
      const isBusy = occupied.has(t);
      return `<option value="${t}" ${isBusy ? "disabled" : ""}>${t}${isBusy ? " — Ocupado" : ""}</option>`;
    })
    .join("");

  timeSelect.innerHTML = `<option value="">Elegir...</option>` + options;
}

// ---------- Admin (tabla + filtros + cancelar) ----------
let adminFilter = "hoy";
let adminDateFilter = null; // YYYY-MM-DD o null

function initAdmin() {
  $$(".chip[data-admin-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // reset visual
      $$(".chip[data-admin-filter]").forEach((b) =>
        b.classList.remove("is-active"),
      );
      $("#calendarFilterBtn").classList.remove("is-active");

      // activar chip
      btn.classList.add("is-active");

      // estado
      adminFilter = btn.dataset.adminFilter;
      adminDateFilter = null; // limpiar fecha

      renderAdminTable();
    });
  });

  $("#selectAll").addEventListener("change", (e) => {
    const checked = e.target.checked;
    $$("#bookingsTbody input[type='checkbox']").forEach(
      (cb) => (cb.checked = checked),
    );
  });

  $("#cancelSelected").addEventListener("click", () => {
    const ids = getSelectedBookingIds();
    if (ids.length === 0) {
      showToast("Seleccioná al menos un turno.");
      return;
    }

    const bookings = getBookings().map((b) =>
      ids.includes(b.id) ? { ...b, status: "cancelada" } : b,
    );
    setBookings(bookings);
    showToast("Turnos cancelados.");
    renderAdminTable();
    $("#selectAll").checked = false;
  });

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
    renderAdminTable();
  });

  renderAdminTable();
}

function getSelectedBookingIds() {
  return Array.from($$("#bookingsTbody input[type='checkbox']:checked")).map(
    (cb) => cb.dataset.id,
  );
}

function renderAdminTable() {
  const tbody = $("#bookingsTbody");
  const bookings = getBookings();

  const todayISO = formatDateISO(new Date());
  let view = bookings;

  if (adminDateFilter) {
    view = bookings.filter((b) => b.dateISO === adminDateFilter);
  } else if (adminFilter === "hoy") {
    view = bookings.filter((b) => b.dateISO === todayISO);
  } else if (adminFilter === "pendientes") {
    view = bookings.filter((b) => b.status === "pendiente");
  } else if (adminFilter === "canceladas") {
    view = bookings.filter((b) => b.status === "cancelada");
  } else {
    view = bookings;
  }

  view = view.slice().sort((a, b) => {
    const keyA = a.dateISO + " " + a.time;
    const keyB = b.dateISO + " " + b.time;
    return keyA.localeCompare(keyB);
  });

  //slice hace una copia, sort, junto con el compare, ordena los turnos por fecha
  //la fecha y hora están guardadas como texto, las comparamos como tal, en ese formato

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
      const s = serviceById(b.serviceId);
      const p = profById(b.profesionalId);
      const stateClass =
        b.status === "pendiente" ? "state--pendiente" : "state--cancelada";

      return `
      <tr>
        <td class="col-check">
          <input type="checkbox" data-id="${b.id}" aria-label="Seleccionar turno" />
        </td>
        <td><span class="state ${stateClass}">${b.status}</span></td>
        <td>${escapeHtml(b.ownerName)}</td>
        <td>${escapeHtml(b.petName)}</td>
        <td>${s ? escapeHtml(s.title) : "-"}</td>
        <td>${p ? escapeHtml(p.name) : "-"}</td>
        <td>${b.dateISO}</td>
        <td>${b.time}</td>
      </tr>
    `;
    })
    .join("");
}

// ---------- Modal events ----------
function initModal() {
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// ---------- Init ----------
function main() {
  initNav();
  initCarousel();

  renderServices("all");
  initServiceFilters();
  renderTeam();

  initAuth();
  initBooking();
  initAdmin();
  initModal();

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

document.addEventListener("DOMContentLoaded", main);
/*
if (typeof module !== "undefined") {​
  module.exports = {​
    readLS,
    writeLS,
    pad2,
    formatDateISO,
    showToast,
    openModal,
    closeModal,
    escapeHtml,
    initNav,
    showView,
    handleRoute,
    renderServices,
    initServiceFilters,
    renderTeam,
    initCarousel,
    getUsers,
    setUsers,
    getSession,
    setSession,
    updateSessionLabel,
    initAuth,
    getBookings,
    setBookings,
    serviceById,
    profById,
    initBooking,
    renderProfessionalOptions,
    isWithinOpeningHours,
    generateTimeSlots,
    updateAvailableTimes,
    initAdmin,
    getSelectedBookingIds,
    renderAdminTable,
    initModal,
    main
  };​
}​
*/
