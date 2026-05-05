const CONFIG = {
  // Rellena estos datos cuando los tengáis.
  phoneE164: "+34964771290",
  // WhatsApp: en el futuro se puede activar añadiendo aquí el número.
  whatsappE164: "",
  facebookUrl:
    "https://www.facebook.com/pages/Cafetería-Bolera/482807545246007?hc_ref=ARRu2X54p8aDwlRwTI6s7B8jLxlFIIMAgbA1x4olzI203ynzBJ9aRJQOpoFfcHwk2NY&fref=tag",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Carrer%20del%20Ceramista%20Abad%2C%209%2C%2012200%20Onda%2C%20Castell%C3%B3",
};

function setLink(selector, href) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (!href) return;
  el.href = href;
  el.removeAttribute("aria-disabled");
}

function getReserveMessage() {
  const root = document.querySelector(".reserve__form");
  if (!root) return "Hola, quería reservar una mesa.";

  const nombre = root.querySelector('[name="nombre"]')?.value?.trim();
  const personas = root.querySelector('[name="personas"]')?.value?.trim();
  const fecha = root.querySelector('[name="fecha"]')?.value?.trim();
  const hora = root.querySelector('[name="hora"]')?.value?.trim();
  const notas = root.querySelector('[name="notas"]')?.value?.trim();

  const parts = [
    "Hola, quería reservar.",
    nombre ? `Nombre: ${nombre}` : null,
    personas ? `Personas: ${personas}` : null,
    fecha ? `Fecha: ${fecha}` : null,
    hora ? `Hora: ${hora}` : null,
    notas ? `Notas: ${notas}` : null,
  ].filter(Boolean);

  return parts.join("\n");
}

function setup() {
  if (CONFIG.facebookUrl) setLink("[data-facebook]", CONFIG.facebookUrl);
  if (CONFIG.mapsUrl) setLink("[data-maps]", CONFIG.mapsUrl);

  if (CONFIG.phoneE164) {
    setLink("[data-llamar]", `tel:${CONFIG.phoneE164}`);
  }

  // WhatsApp reservas (futuro): si se define `whatsappE164`, se puede volver a activar aquí.
}

setup();
