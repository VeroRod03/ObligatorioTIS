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

// Galería de imágenes
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

module.exports = {
  LS_KEYS,
  servicios,
  profesionales,
  slidesGaleria
}