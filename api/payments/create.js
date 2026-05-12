import Stripe from "stripe";
import crypto from "crypto";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function getBaseUrl(req) {
  const proto = (req.headers["x-forwarded-proto"] || "https").toString();
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").toString();
  return `${proto}://${host}`;
}

function readBody(req) {
  return new Promise((resolve) => {
    let payload = "";
    req.on("data", (chunk) => (payload += chunk));
    req.on("end", () => resolve(payload));
  });
}

function base64urlToBase64(str) {
  return str.replace(/-/g, "+").replace(/_/g, "/");
}

function encodeMerchantParams(obj) {
  return Buffer.from(JSON.stringify(obj), "utf8").toString("base64");
}

function decodeRedsysKey(secretKey) {
  // Redsys clave SHA256 viene en Base64 (habitualmente). Si no, lo tratamos como texto.
  try {
    return Buffer.from(base64urlToBase64(secretKey), "base64");
  } catch {
    return Buffer.from(secretKey, "utf8");
  }
}

function key3DES(secret, order) {
  // Deriva la clave 3DES con el número de pedido (Ds_Merchant_Order).
  // Redsys: encripta el order con 3DES (CBC, IV=0, PKCS#7).
  const key = decodeRedsysKey(secret);
  const orderPadded = Buffer.from(order, "utf8");
  const iv = Buffer.alloc(8, 0);
  const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv);
  cipher.setAutoPadding(true);
  const out = Buffer.concat([cipher.update(orderPadded), cipher.final()]);
  return out;
}

function signRedsys({ secretKey, order, merchantParameters }) {
  const derived = key3DES(secretKey, order);
  const hmac = crypto.createHmac("sha256", derived);
  hmac.update(merchantParameters, "utf8");
  return hmac.digest("base64");
}

function nowOrderId() {
  // Redsys suele requerir pedido de 4-12 caracteres; en la práctica, lo más compatible es numérico.
  // Generamos 12 dígitos (timestamp + random).
  const ts = Date.now().toString().slice(-8); // 8 dígitos
  const rnd = Math.floor(Math.random() * 10_000)
    .toString()
    .padStart(4, "0"); // 4 dígitos
  return `${ts}${rnd}`.slice(0, 12);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const raw = await readBody(req);
  let data;
  try {
    data = JSON.parse(raw || "{}");
  } catch {
    return json(res, 400, { error: "Invalid JSON" });
  }

  const { title, pricePerSeatCents, quantity, currency = "eur", metadata = {} } = data || {};
  const qty = Number(quantity);
  const unitAmount = Number(pricePerSeatCents);
  if (!title || !Number.isFinite(qty) || qty < 1 || qty > 30) return json(res, 400, { error: "Invalid quantity/title" });
  if (!Number.isFinite(unitAmount) || unitAmount < 50 || unitAmount > 50000) return json(res, 400, { error: "Invalid pricePerSeatCents" });

  // Redsys (si está configurado)
  const redsysMerchantCode = process.env.REDSYS_MERCHANT_CODE;
  const redsysTerminal = process.env.REDSYS_TERMINAL || "1";
  const redsysSecretKey = process.env.REDSYS_SECRET_KEY;
  const redsysEnv = (process.env.REDSYS_ENV || "test").toLowerCase();

  if (redsysMerchantCode && redsysSecretKey) {
    const baseUrl = getBaseUrl(req);
    const order = nowOrderId();
    const total = unitAmount * qty;

    const merchantUrl = `${baseUrl}/api/redsys/notify`;
    const urlOk = `${baseUrl}/pago/success.html`;
    const urlKo = `${baseUrl}/pago/cancel.html`;

    const paramsObj = {
      Ds_Merchant_Amount: String(total),
      Ds_Merchant_Currency: "978",
      Ds_Merchant_Order: order,
      Ds_Merchant_MerchantCode: String(redsysMerchantCode),
      Ds_Merchant_Terminal: String(redsysTerminal),
      Ds_Merchant_TransactionType: "0",
      Ds_Merchant_MerchantURL: merchantUrl,
      Ds_Merchant_UrlOK: urlOk,
      Ds_Merchant_UrlKO: urlKo,
      Ds_Merchant_ProductDescription: String(title).slice(0, 125),
      Ds_Merchant_MerchantName: "Bolera Contrastes",
      Ds_Merchant_MerchantData: Buffer.from(JSON.stringify(metadata)).toString("base64").slice(0, 512),
      // 3DS está controlado en el TPV; aquí no forzamos.
    };

    const merchantParameters = encodeMerchantParams(paramsObj);
    const signature = signRedsys({ secretKey: redsysSecretKey, order, merchantParameters });

    const redsysUrl =
      redsysEnv === "prod"
        ? "https://sis.redsys.es/sis/realizarPago"
        : "https://sis-t.redsys.es:25443/sis/realizarPago";

    return json(res, 200, {
      type: "redsys",
      redsysUrl,
      fields: {
        Ds_SignatureVersion: "HMAC_SHA256_V1",
        Ds_MerchantParameters: merchantParameters,
        Ds_Signature: signature,
      },
    });
  }

  // Stripe (fallback)
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
    const baseUrl = getBaseUrl(req);
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              unit_amount: unitAmount,
              product_data: { name: title },
            },
            quantity: qty,
          },
        ],
        metadata: { source: "bolera-contrastes", ...metadata },
        success_url: `${baseUrl}/pago/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pago/cancel.html`,
      });
      return json(res, 200, { type: "redirect", url: session.url });
    } catch (err) {
      return json(res, 500, { error: "Stripe error", details: String(err?.message || err) });
    }
  }

  return json(res, 500, { error: "No payment provider configured (Redsys/Stripe)" });
}
