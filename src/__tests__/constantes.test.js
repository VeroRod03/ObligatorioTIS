const { LS_KEYS, servicios, profesionales, slidesGaleria } = require("../core/constantes");

//verifica que haya 2 servicios
test("Debe haber exactamente 2 servicios definidos", () => {
  expect(servicios).toHaveLength(2);
});

//con truthy chequea que el campo tiene que existir y no puede ser falsy (undefined, null, "", etc.)
test("Los servicios deben tener campos obligatorios y type válido", () => {
  const tiposValidos = ["salud", "estetica"];

  servicios.forEach((s) => {
    expect(s.id).toBeTruthy();
    expect(s.title).toBeTruthy();
    expect(tiposValidos).toContain(s.type);
    expect(typeof s.price).toBe("number");
    expect(s.price).toBeGreaterThan(0);
    expect(s.description).toBeTruthy();
  });
});

//new set crea un conjunto nuevo que elimina duplicados. con el toBe chequea que el tamaño
//sea igual que el length, verificando que no hay ids repetidos
test("Los IDs de servicios deben ser únicos", () => {
  const ids = servicios.map((s) => s.id);
  expect(new Set(ids).size).toBe(ids.length);
});

//Verifica que deben haber 6 profesionales registrados
test("Debe haber exactamente 6 profesionales", () => {
  expect(profesionales).toHaveLength(6);
});

//Verifica que hayan 3 profesionales por cada tipo de servicio ofrecido
test("Debe haber 3 profesionales de salud y 3 de estetica", () => {
  const salud = profesionales.filter((p) => p.role === "salud");
  const estetica = profesionales.filter((p) => p.role === "estetica");

  expect(salud).toHaveLength(3);
  expect(estetica).toHaveLength(3);
});

//igual que con los servicios
test("Los profesionales deben tener campos obligatorios", () => {
  const rolesValidos = ["salud", "estetica"];

  profesionales.forEach((p) => {
    expect(p.id).toBeTruthy();
    expect(p.name).toBeTruthy();
    expect(rolesValidos).toContain(p.role);
    expect(p.bio).toBeTruthy();
    expect(p.initials).toBeTruthy();
    expect(p.photo).toBeTruthy(); // puede ser URL externa, pero al menos que exista
  });
});

//chequea que los ids sean unicos
test("Los IDs de profesionales deben ser únicos", () => {
  const ids = profesionales.map((p) => p.id);
  expect(new Set(ids).size).toBe(ids.length);
});