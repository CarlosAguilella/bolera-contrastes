const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "lacteos", label: "Lácteos" },
  { id: "huevo", label: "Huevo" },
  { id: "pescado", label: "Pescado" },
  { id: "moluscos", label: "Moluscos" },
  { id: "crustaceos", label: "Crustáceos" },
  { id: "frutos_secos", label: "Frutos secos" },
  { id: "soja", label: "Soja" },
  { id: "sulfitos", label: "Sulfitos" },
];

const MENU = [
  {
    id: "para_picar",
    label: "Para Picar",
    title: "Para Picar",
    color: "red",
    note: null,
    items: [
      {
        name: "Tablas de jamón y Queso",
        price: "14.00€",
        allergens: ["lacteos"],
        imageSrc: "/assets/productos/tabla_jamon_queso.png",
      },
      {
        name: "Ensaladilla Rusa",
        price: "7.00€",
        allergens: ["huevo", "pescado"],
        imageSrc: "/assets/productos/ensaladilla_rusa.png",
      },
      {
        name: "Gamba al Ajillo",
        price: "13.00€",
        allergens: ["crustaceos"],
        imageSrc: "/assets/productos/gamba_ajillo.png",
      },
      {
        name: "Boquerones en vinagre",
        price: "7.00€",
        allergens: ["pescado"],
        imageSrc: "/assets/productos/boquerones_en_vinagre.png",
      },
      {
        name: "Calamares Rebozado",
        price: "12.00€",
        allergens: ["gluten", "moluscos", "huevo"],
        imageSrc: "/assets/productos/calamares_rebozado.png",
      },
      {
        name: "Sepia",
        price: "14.00€",
        allergens: ["moluscos"],
        imageSrc: "/assets/productos/sepia.png",
      },
      {
        name: "Albóndigas de bacalao",
        price: "8.00€",
        allergens: ["gluten", "pescado", "huevo"],
        imageSrc: "/assets/productos/albondigas_de_bacalao.png",
      },
      {
        name: "Chipirón plancha",
        price: "12.00€",
        allergens: ["moluscos"],
        imageSrc: "/assets/productos/chipiron_plancha.png",
      },
      {
        name: "Alitas de pollo",
        price: "7.00€",
        allergens: ["gluten"],
        imageSrc: "/assets/productos/alitas_de_pollo.png",
      },
      {
        name: "Nuggets de pollo",
        price: "7.00€",
        allergens: ["gluten", "frutos_secos"],
        imageSrc: "/assets/productos/nuggets_de_pollo.png",
      },
      {
        name: "Mollejas",
        price: "7.00€",
        allergens: [],
        imageSrc: "/assets/productos/mollejas.png",
      },
      {
        name: "Bravas",
        price: "7.00€",
        allergens: ["huevo", "sulfitos"],
        imageSrc: "/assets/productos/bravas.png",
      },
      {
        name: "Patatas fritas",
        price: "6.00€",
        allergens: [],
        imageSrc: "/assets/productos/patatas_fritas.png",
      },
      {
        name: "Bocaditos Queso de Cabra",
        desc: "Con Arándanos.",
        price: "7.00€",
        allergens: ["lacteos"],
        imageSrc: "/assets/productos/bocaditos_queso_de_cabra.png",
      },
      {
        name: "Huevos rotos con jamón",
        price: "12.00€",
        allergens: ["huevo"],
        imageSrc: "/assets/productos/huevos_rotos_con_jamon.png",
      },
    ],
  },
  {
    id: "ensaladas",
    label: "Ensaladas",
    title: "Ensaladas",
    color: "green",
    note: null,
    items: [
      {
        name: "Mixta",
        desc: "Lechuga, tomate, atún, huevo y aceitunas.",
        price: "10.00€",
        allergens: ["huevo", "pescado"],
        imageSrc: "/assets/productos/mixta.png",
      },
      {
        name: "Contrastes",
        desc: "Variedades de lechugas, frutos secos, rulo de cabra y salsa contrastes.",
        price: "12.00€",
        allergens: ["lacteos", "frutos_secos", "sulfitos"],
        imageSrc: "/assets/productos/contrastes.png",
      },
    ],
  },
  {
    id: "sandwiches_burgers",
    label: "Sándwiches & Burgers",
    title: "Sándwiches & Hamburguesas",
    color: "black",
    note: "* Acompañados de patatas fritas",
    groups: [
      {
        title: "Sándwiches",
        items: [
          { name: "De Siempre", desc: "Doble piso, jamón york y queso.", price: "6.50€", allergens: ["gluten", "lacteos"] },
          { name: "Normal", desc: "Jamón york y queso.", price: "4.50€", allergens: ["gluten", "lacteos"] },
          { name: "Sin Gluten", desc: "Jamón york y queso.", price: "5.00€", allergens: ["lacteos"] },
        ],
      },
      {
        title: "Hamburguesas",
        items: [
          { name: "De Siempre", desc: "Queso y huevo.", price: "9.00€", allergens: ["gluten", "lacteos", "huevo"] },
          {
            name: "Contrastes",
            desc: "Doble de carne, bacon, queso y huevo.",
            price: "11.00€",
            allergens: ["gluten", "lacteos", "huevo"],
            highlight: "red",
          },
        ],
      },
    ],
  },
  {
    id: "platos_combinados",
    label: "Platos Combinados",
    title: "Platos Combinados",
    color: "red",
    note: null,
    items: [
      { name: "Lomo con huevo", desc: "Pimiento y patatas.", price: "12.00€", allergens: ["huevo"] },
      { name: "Hamburguesa con huevo", desc: "Y patatas.", price: "12.00€", allergens: ["gluten", "huevo", "sulfitos"] },
      { name: "Calamares con huevo", desc: "Y patatas.", price: "14.00€", allergens: ["gluten", "moluscos", "huevo"] },
      { name: "Entrecot, patatas y huevo", price: "16.00€", allergens: ["huevo"] },
      { name: "Emperador, patatas y huevo", price: "16.00€", allergens: ["pescado", "huevo"] },
      { name: "Enterita, patatas y huevo", price: "15.00€", allergens: ["huevo"] },
    ],
  },
  {
    id: "bocatas",
    label: "Bocatas",
    title: "Bocatas",
    color: "black",
    note: "* Acompañados de patatas fritas. Todos contienen gluten.",
    items: [
      { name: "De Siempre", desc: "Bacon, queso y huevo", price: "7.50€", allergens: ["gluten", "lacteos", "huevo"] },
      { name: "Contrastes", desc: "Bacon, paté, queso, huevo y tomate", price: "8.50€", allergens: ["gluten", "lacteos", "huevo", "sulfitos"] , highlight: "red"},
      { name: "Sepia", price: "10.00€", allergens: ["gluten", "moluscos"] },
      { name: "Tortilla Francesa", price: "5.00€", allergens: ["gluten", "huevo"] },
      { name: "Tortilla de Gambas", price: "8.00€", allergens: ["gluten", "huevo", "crustaceos"], highlight: "red" },
      { name: "Tortilla al gusto", desc: "Queso, jamón, bacon, atún…", price: "7.00€", allergens: ["gluten", "huevo"] },
      { name: "Bacon", price: "5.00€", allergens: ["gluten"] },
      { name: "Bacon Completo", desc: "Queso, huevo y tomate", price: "6.00€", allergens: ["gluten", "lacteos", "huevo"] },
      { name: "Paté", price: "5.00€", allergens: ["gluten", "sulfitos"] },
      { name: "Paté Completo", desc: "Queso, huevo y tomate", price: "6.00€", allergens: ["gluten", "lacteos", "huevo", "sulfitos"] },
      { name: "Lomo", price: "6.00€", allergens: ["gluten"] },
      { name: "Lomo Completo", desc: "Queso, huevo y tomate", price: "7.00€", allergens: ["gluten", "lacteos", "huevo"] },
      { name: "King", desc: "Lomo, queso, cebolla frita y pimiento", price: "7.00€", allergens: ["gluten", "lacteos"], highlight: "green" },
      { name: "Jamón", desc: "Queso y tomate", price: "7.00€", allergens: ["gluten", "lacteos"] },
      { name: "Torræta de anchoas", price: "6.00€", allergens: ["gluten", "pescado"] },
      { name: "Torræta de sobrasada", price: "6.00€", allergens: ["gluten"] },
      { name: "Longanizas", price: "6.00€", allergens: ["gluten", "sulfitos"] },
    ],
  },
  {
    id: "postres",
    label: "Postres",
    title: "Postres",
    color: "red",
    note: null,
    items: [
      { name: "Tartas caseras", price: "4.50€", allergens: ["gluten", "huevo", "lacteos"] },
      { name: "Flan de huevo", price: "4.00€", allergens: ["huevo", "lacteos"] },
      { name: "Tarta helada Contessa", price: "4.00€", allergens: ["gluten", "huevo", "lacteos", "frutos_secos"] },
      { name: "Tarta helada al whisky", price: "4.00€", allergens: ["gluten", "huevo", "lacteos", "sulfitos"] },
      { name: "Fruta", price: "3.50€", allergens: [] , highlight: "green"},
    ],
  },
  {
    id: "bebidas_vinos",
    label: "Bebidas & Vinos",
    title: "Bebidas y Vinos",
    color: "black",
    note: null,
    groups: [
      {
        title: "Refrescos y Cervezas",
        items: [
          { name: "Agua mineral .500 CL", price: "1.60€", allergens: [] },
          { name: "Agua mineral 1.5 LITRO", price: "2.50€", allergens: [] },
          { name: "Gaseosa", price: "1.70€", allergens: [] },
          { name: "Agua con gas", price: "1.70€", allergens: [] },
          { name: "Coca-Cola (Zero, Limon) 220 cc.", price: "1.70€", allergens: [] },
          { name: "Coca-cola 370 cc / Tónica 220cc", price: "2.10€", allergens: [] },
          { name: "Mahou 5*", price: "2.10€", allergens: ["gluten"], highlight: "red" },
          { name: "Mahou Tostada", price: "2.20€", allergens: ["gluten"], highlight: "red" },
          { name: "Jarra Barril", price: "2.10€", allergens: ["gluten"], highlight: "red" },
          { name: "Tanque", price: "3.10€", allergens: ["gluten"], highlight: "red" },
          { name: "Alhambra", price: "3.00€", allergens: ["gluten"], highlight: "red" },
        ],
      },
      {
        title: "Vino Blanco",
        items: [
          { name: "Ramón Bilbao (Verdejo)", price: "16.00€", allergens: ["sulfitos"] },
          { name: "Adra (Verdejo)", price: "14.00€", allergens: ["sulfitos"] },
          { name: "Villa Nuñez (Albariño)", price: "12.00€", allergens: ["sulfitos"] },
          { name: "Mareas vivas (Albariño)", price: "15.00€", allergens: ["sulfitos"] },
          { name: "Terras Vellas (Albariño)", price: "22.00€", allergens: ["sulfitos"] },
        ],
      },
      {
        title: "Vino Tinto Rioja",
        items: [
          { name: "Ramón Bilbao (Crianza)", price: "18.00€", allergens: ["sulfitos"] },
          { name: "Luis Cañas (Crianza)", price: "20.00€", allergens: ["sulfitos"] },
          { name: "Ivanto (Crianza)", price: "14.00€", allergens: ["sulfitos"] },
        ],
      },
      {
        title: "Tinto Ribera del Duero",
        items: [
          { name: "Pago de los Capellanes (Crianza)", price: "32.00€", allergens: ["sulfitos"] },
          { name: "Torremoron (Crianza)", price: "22.00€", allergens: ["sulfitos"] },
          { name: "Torremoron (Roble)", price: "18.00€", allergens: ["sulfitos"] },
          { name: "Torremoron (Cosecha)", price: "14.00€", allergens: ["sulfitos"] },
        ],
      },
      {
        title: "Cavas y Champagne",
        items: [{ name: "Dominio Requena Brut Nature", price: "18.00€", allergens: ["sulfitos"] }],
      },
    ],
  },
];

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key.startsWith("data-")) node.setAttribute(key, value);
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

function byAllergenId(id) {
  return ALLERGENS.find((a) => a.id === id) ?? null;
}

function allergenSvg(id) {
  // Iconos SVG (sin emojis). Diseñados para leerse bien a tamaños pequeños.
  const common =
    'viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"';
  switch (id) {
    case "gluten":
      return `<svg ${common}><path d="M12 3c2.3 1.8 3.5 4 3.5 6.7 0 2.8-1.2 5-3.5 6.8-2.3-1.8-3.5-4-3.5-6.8C8.5 7 9.7 4.8 12 3Z"/><path d="M12 2v20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.2 6.2l-1.6 1.6M14.8 6.2l1.6 1.6M9 9.6l-2 2M15 9.6l2 2M9.3 13.3l-1.5 1.5M14.7 13.3l1.5 1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    case "lacteos":
      return `<svg ${common}><path d="M9 2h6v4l1.2 2.2V20a2 2 0 0 1-2 2H9.8a2 2 0 0 1-2-2V8.2L9 6V2Z"/><path d="M8 10h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10.5 2h3v2h-3z"/></svg>`;
    case "huevo":
      return `<svg ${common}><path d="M12 2c4.2 0 7.5 6.3 7.5 11.6A7.5 7.5 0 0 1 12 21a7.5 7.5 0 0 1-7.5-7.4C4.5 8.3 7.8 2 12 2Z"/><path d="M12 9.2c1.6 0 2.9 1.6 2.9 3.5S13.6 16.2 12 16.2s-2.9-1.6-2.9-3.5S10.4 9.2 12 9.2Z" opacity="0.28"/></svg>`;
    case "pescado":
      return `<svg ${common}><path d="M4 12c2.6-3.4 6.2-5.4 10.2-5.4 1.9 0 3.8.4 5.8 1.6l-2.3 1.8 2.3 1.8c-2 1.2-3.9 1.6-5.8 1.6-4 0-7.6-2-10.2-5.4Z"/><path d="M20 10.8l2-1.8-2-1.8" /><circle cx="11" cy="10.5" r="1.2"/></svg>`;
    case "moluscos":
      return `<svg ${common}><path d="M12 3c5 0 9 3.8 9 9 0 6.1-4 9-9 9s-9-2.9-9-9c0-5.2 4-9 9-9Z"/><path d="M7 12c2.1-2 7.9-2 10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7.2 15.2c2.5-1.8 7.1-1.8 9.6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.7"/></svg>`;
    case "crustaceos":
      return `<svg ${common}><path d="M8.2 9.6c0-2.2 1.7-4 3.8-4s3.8 1.8 3.8 4c0 5-1.8 10-3.8 10s-3.8-5-3.8-10Z"/><path d="M6 10.2c-1.1-.2-2-1.2-2-2.4 0-1.7 1.6-3 3.4-2.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 10.2c1.1-.2 2-1.2 2-2.4 0-1.7-1.6-3-3.4-2.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 13.2H6m12 0h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    case "frutos_secos":
      return `<svg ${common}><path d="M12 3c4.2 2.8 6.8 6.8 6.8 11.1A6.8 6.8 0 0 1 12 21a6.8 6.8 0 0 1-6.8-6.9C5.2 9.8 7.8 5.8 12 3Z"/><path d="M10 8.8c.8-1 3.2-1 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 8.2v12.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.8"/></svg>`;
    case "soja":
      return `<svg ${common}><path d="M9 4c2.6 0 4.8 2.6 4.8 5.8S11.6 16 9 16s-4.8-2.6-4.8-5.8S6.4 4 9 4Z"/><path d="M15 8c2.6 0 4.8 2.6 4.8 5.8S17.6 20 15 20s-4.8-2.6-4.8-5.8S12.4 8 15 8Z"/><path d="M10.7 7.2c3.2 1.2 5.5 4.7 5.8 9.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    case "sulfitos":
      return `<svg ${common}><path d="M9 3h6v5l-2 3v8a3 3 0 0 1-6 0v-8l-2-3V3Z"/><path d="M7 11h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 6h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.8"/></svg>`;
    default:
      return `<svg ${common}><circle cx="12" cy="12" r="9"/></svg>`;
  }
}

function autoImageForItem(name) {
  // Prioridad:
  // 1) `imageSrc` (si se define en el item)
  // 2) Imagen local por slug: `/assets/productos/<slug>.jpg`
  // 3) Fallback online (Unsplash) para prototipar
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `/assets/productos/${slug}.jpg`;
}

function renderAllergenRow(allergenIds) {
  const list = (allergenIds ?? []).map(byAllergenId).filter(Boolean);
  if (!list.length) return null;

  return el(
    "div",
    { class: "menu-item__allergens", "aria-label": "Alérgenos" },
    list.map((a) =>
      el("span", { class: "allergen-chip", title: a.label, "aria-label": a.label }, [
        (() => {
          const wrap = el("span", { class: "allergen-chip__svg" });
          wrap.innerHTML = allergenSvg(a.id);
          return wrap;
        })(),
      ]),
    ),
  );
}

function renderMenuItem(item) {
  const card = el("article", { class: "product-card" });

  const media = el("div", { class: "product-card__media" }, [
    el("div", { class: "product-card__media-bg", "aria-hidden": "true" }),
  ]);

  const img = el("img", {
    class: "product-card__img",
    src: item.imageSrc ?? autoImageForItem(item.name),
    alt: item.name,
    loading: "lazy",
    referrerpolicy: "no-referrer",
  });
  img.addEventListener("error", () => {
    // Fallback online para que no quede vacío si falta el JPG local.
    // Nota: si este endpoint falla, pásame imágenes propias y quedará 100% local.
    const query = encodeURIComponent(item.name.toLowerCase());
    img.src = `https://loremflickr.com/800/600/food,${query}`;
  });
  media.append(img);

  const body = el("div", { class: "product-card__body" }, [
    el("div", { class: "product-card__name", text: item.name }),
    item.desc ? el("div", { class: "product-card__desc", text: item.desc }) : el("div"),
  ]);

  const footer = el("div", { class: "product-card__footer" }, [
    el("div", { class: "product-card__price", text: item.price }),
  ]);

  const allergens = renderAllergenRow(item.allergens);
  if (allergens) allergens.classList.add("product-card__allergens");

  card.append(media, body, allergens ?? el("div"), footer);

  if (item.highlight === "red") card.setAttribute("data-accent", "red");
  if (item.highlight === "green") card.setAttribute("data-accent", "green");
  return card;
}

function renderSection(section) {
  const grid = document.querySelector("[data-menu-grid]");
  if (!grid) return;
  grid.innerHTML = "";

  const title = document.querySelector("[data-section-title]");
  if (title) title.textContent = section.title;

  if (section.note) {
    grid.append(el("div", { class: "menu-note", text: section.note }));
  }

  if (section.groups?.length) {
    for (const group of section.groups) {
      const header = el("div", { class: "menu-card__header" }, [el("h2", { text: group.title })]);
      const items = el("div", { class: "items-grid" }, group.items.map(renderMenuItem));
      grid.append(el("section", { class: "menu-block" }, [header, items]));
    }
  } else {
    grid.append(el("div", { class: "items-grid" }, (section.items ?? []).map(renderMenuItem)));
  }
}

function renderTabs(activeId) {
  const wrap = document.querySelector("[data-tabs] .menu-tabs__inner");
  if (!wrap) return;
  wrap.innerHTML = "";

  for (const section of MENU) {
    const btn = el("button", {
      type: "button",
      class: "tab",
      "data-tab": section.id,
      "aria-current": section.id === activeId ? "page" : "false",
      text: section.label,
    });

    btn.addEventListener("click", () => setActiveSection(section.id));
    wrap.append(btn);
  }
}

function setActiveSection(id) {
  const section = MENU.find((s) => s.id === id) ?? MENU[0];
  if (!section) return;
  renderTabs(section.id);
  renderSection(section);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAllergenLegend() {
  const wrap = document.querySelector("[data-allergens]");
  if (!wrap) return;
  wrap.innerHTML = "";

  for (const a of ALLERGENS) {
    wrap.append(
      el("div", { class: "legend-item" }, [
        el("span", { class: "legend-item__icon" }, [
          (() => {
            const i = el("span", { class: "legend-item__svg" });
            i.innerHTML = allergenSvg(a.id);
            return i;
          })(),
        ]),
        el("span", { text: a.label }),
      ]),
    );
  }
}

renderAllergenLegend();
setActiveSection(MENU[0]?.id);
