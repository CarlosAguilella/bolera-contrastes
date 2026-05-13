const EVENTS = [
  {
    id: "paella",
    title: "Paella gigante",
    subtitle: "Plazas limitadas",
    dateText: "Sábado · 14:00",
    pricePerSeat: 12,
    capacity: 30,
    sold: 0, // actualiza manualmente cuando confirméis reservas
    description:
      "Reserva tu plaza. Te damos un código para confirmar por teléfono (y evitar overbooking).",
    highlights: ["Incluye bebida", "Pago en el local", "Confirmación por teléfono"],
  },
];

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

function currencyEUR(amount) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
}

function centsEUR(amount) {
  return Math.round(Number(amount) * 100);
}

function getPhone() {
  return document.documentElement.dataset.phoneE164 || "";
}

function randomCode() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BC-${part()}-${part()}`;
}

function openModal(content) {
  const overlay = el("div", { class: "modal-overlay", role: "dialog", "aria-modal": "true" });
  const panel = el("div", { class: "modal" }, [content]);
  overlay.append(panel);

  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") close();
    },
    { once: true },
  );

  document.body.append(overlay);
  return { close };
}

function renderEventCard(event) {
  const remaining = Math.max(0, event.capacity - event.sold);
  const soldPct = Math.min(100, Math.round((event.sold / event.capacity) * 100));

  const bar = el("div", { class: "event__bar" }, [
    el("div", { class: "event__barFill", style: `width:${soldPct}%` }),
  ]);

  const meta = el("div", { class: "event__meta" }, [
    el("div", { class: "event__pill", text: event.dateText }),
    el("div", { class: "event__pill event__pill--accent", text: `${remaining} plazas` }),
  ]);

  const highlights = el(
    "div",
    { class: "event__highlights" },
    (event.highlights ?? []).map((t) => el("span", { class: "event__tag", text: t })),
  );

  const btn = el("button", { class: "btn", type: "button", text: "Reservar plaza" });
  btn.addEventListener("click", () => openReserveFlow(event));

  return el("article", { class: "event" }, [
    meta,
    el("h3", { class: "event__title", text: event.title }),
    el("div", { class: "event__subtitle", text: event.subtitle }),
    el("div", { class: "event__price", text: `${currencyEUR(event.pricePerSeat)} / plaza` }),
    highlights,
    el("div", { class: "event__desc", text: event.description }),
    bar,
    el("div", { class: "event__actions" }, [btn]),
  ]);
}

function openReserveFlow(event) {
  const phone = getPhone();
  const remaining = Math.max(0, event.capacity - event.sold);

  const qty = el("input", {
    class: "modal__input",
    type: "number",
    min: "1",
    max: String(Math.max(1, remaining)),
    value: "2",
    inputmode: "numeric",
  });
  const name = el("input", { class: "modal__input", type: "text", placeholder: "Nombre" });
  const phoneInput = el("input", { class: "modal__input", type: "tel", placeholder: "Teléfono (opcional)" });

  const total = el("div", { class: "modal__total", text: "" });
  const updateTotal = () => {
    const n = Math.max(1, Number(qty.value || 1));
    total.textContent = `Total estimado: ${currencyEUR(n * event.pricePerSeat)}`;
  };
  qty.addEventListener("input", updateTotal);
  updateTotal();

  const code = randomCode();
  const codeBox = el("div", { class: "code" }, [
    el("div", { class: "code__k", text: "Código de pre-reserva" }),
    el("div", { class: "code__v", text: code }),
    el("button", { class: "tool-btn tool-btn--ghost", type: "button", text: "Copiar" }),
  ]);
  codeBox.querySelector("button")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      codeBox.querySelector("button").textContent = "Copiado";
      setTimeout(() => (codeBox.querySelector("button").textContent = "Copiar"), 1200);
    } catch {
      // ignore
    }
  });

  const payBtn = el("button", { class: "btn", type: "button", text: "Pagar y reservar" });
  payBtn.addEventListener("click", async () => {
    const n = Math.max(1, Number(qty.value || 1));
    payBtn.disabled = true;
    payBtn.textContent = "Abriendo pago…";
    try {
      // Prioridad de pago:
      // - Redsys (si está configurado en Vercel)
      // - Stripe (si está configurado)
      // El backend devolverá los campos necesarios para redirigir al pago.
      const resp = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${event.title} (${event.dateText})`,
          pricePerSeatCents: centsEUR(event.pricePerSeat),
          quantity: n,
          currency: "eur",
          metadata: {
            event_id: event.id,
            code,
            customer_name: name.value?.trim() || "",
            customer_phone: phoneInput.value?.trim() || "",
          },
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Payment init failed");

      if (data?.type === "redirect" && data?.url) {
        window.location.href = data.url;
        return;
      }

      if (data?.type === "redsys" && data?.redsysUrl && data?.fields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.redsysUrl;
        for (const [k, v] of Object.entries(data.fields)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = String(v);
          form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
        return;
      }

      throw new Error("Unexpected payment response");
    } catch (err) {
      payBtn.disabled = false;
      payBtn.textContent = "Pagar y reservar";
      const msg =
        err?.message && String(err.message) !== "[object Object]"
          ? String(err.message)
          : "No se pudo iniciar el pago.";
      alert(`${msg} Inténtalo de nuevo.`);
      console.error(err);
    }
  });

  const callBtn = el("a", {
    class: "tool-btn tool-btn--ghost",
    href: phone ? `tel:${phone}` : "#",
    "aria-disabled": phone ? "false" : "true",
    text: phone ? "Reservar por teléfono" : "Añadir teléfono en CONFIG",
  });

  const content = el("div", { class: "modal__content" }, [
    el("div", { class: "modal__title", text: `Reserva · ${event.title}` }),
    el("div", { class: "modal__hint", text: `Quedan ${remaining} plazas.` }),
    el("div", { class: "modal__grid" }, [
      el("label", { class: "modal__field" }, [el("span", { text: "Plazas" }), qty]),
      el("label", { class: "modal__field" }, [el("span", { text: "Nombre" }), name]),
      el("label", { class: "modal__field" }, [el("span", { text: "Tu teléfono (opcional)" }), phoneInput]),
    ]),
    total,
    codeBox,
    el("div", { class: "modal__hint", text: "Paga online para confirmar tu plaza." }),
    el("div", { class: "modal__actions" }, [payBtn]),
    el("div", { class: "modal__alt" }, [
      el("div", { class: "modal__altText", text: "¿Prefieres no pagar online?" }),
      callBtn,
    ]),
    el("button", { class: "modal__close", type: "button", text: "Cerrar" }),
  ]);

  const { close } = openModal(content);
  content.querySelector(".modal__close")?.addEventListener("click", close);
}

function initEvents() {
  const wrap = document.querySelector("[data-events]");
  if (!wrap) return;
  wrap.innerHTML = "";
  for (const e of EVENTS) wrap.append(renderEventCard(e));
}

initEvents();
