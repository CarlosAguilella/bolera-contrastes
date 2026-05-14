const STORAGE_KEY = "bolera_admin_token";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const c of children) node.append(c);
  return node;
}

function getToken() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function setToken(t) {
  localStorage.setItem(STORAGE_KEY, t);
}

function clearToken() {
  localStorage.removeItem(STORAGE_KEY);
}

async function api(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

function renderPayments(wrap, payments) {
  wrap.innerHTML = "";
  if (!payments?.length) {
    wrap.append(el("div", { class: "admin-empty", text: "Sin pagos registrados todavía." }));
    return;
  }

  const header = el("div", { class: "admin-row admin-row--head" }, [
    el("div", { text: "Fecha" }),
    el("div", { text: "Pedido" }),
    el("div", { text: "Importe" }),
    el("div", { text: "Estado" }),
  ]);

  wrap.append(header);
  for (const p of payments) {
    wrap.append(
      el("div", { class: "admin-row" }, [
        el("div", { text: p.date || "-" }),
        el("div", { text: p.order || "-" }),
        el("div", { text: p.amount ? `${(Number(p.amount) / 100).toFixed(2)} €` : "-" }),
        el("div", { text: p.status || "-" }),
      ]),
    );
  }
}

async function refresh() {
  const status = document.querySelector("[data-status]");
  const paymentsWrap = document.querySelector("[data-payments]");
  status.textContent = "Cargando…";
  try {
    const data = await api("/api/admin/payments");
    status.textContent = "OK";
    renderPayments(paymentsWrap, data.payments);
  } catch (e) {
    status.textContent = "Error";
    throw e;
  }
}

async function init() {
  const loginWrap = document.querySelector("[data-login]");
  const adminWrap = document.querySelector("[data-admin]");
  const msg = document.querySelector("[data-login-msg]");
  const pass = document.querySelector("[data-password]");
  const loginBtn = document.querySelector("[data-login-btn]");
  const logoutBtn = document.querySelector("[data-logout-btn]");
  const refreshBtn = document.querySelector("[data-refresh]");

  const setMode = async () => {
    const has = Boolean(getToken());
    adminWrap.hidden = !has;
    logoutBtn.hidden = !has;
    loginBtn.hidden = has;
    pass.closest("label").hidden = has;
    msg.textContent = "";
    if (has) {
      try {
        await refresh();
      } catch (e) {
        msg.textContent = e.message;
      }
    }
  };

  loginBtn.addEventListener("click", async () => {
    msg.textContent = "";
    loginBtn.disabled = true;
    loginBtn.textContent = "Entrando…";
    try {
      const data = await api("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass.value }),
      });
      setToken(data.token);
      await setMode();
    } catch (e) {
      msg.textContent = "Contraseña incorrecta o panel no configurado.";
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Entrar";
    }
  });

  logoutBtn.addEventListener("click", async () => {
    clearToken();
    await setMode();
  });

  refreshBtn.addEventListener("click", async () => {
    msg.textContent = "";
    try {
      await refresh();
    } catch (e) {
      msg.textContent = e.message;
    }
  });

  await setMode();
}

init();

