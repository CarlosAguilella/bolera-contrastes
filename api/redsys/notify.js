import crypto from "crypto";

function text(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(body);
}

function base64urlToBase64(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return b64 + pad;
}

function decodeRedsysKey(secretKey) {
  try {
    return Buffer.from(base64urlToBase64(secretKey), "base64");
  } catch {
    return Buffer.from(secretKey, "utf8");
  }
}

function encodeMerchantParams(obj) {
  return Buffer.from(JSON.stringify(obj), "utf8").toString("base64");
}

function key3DES(secret, order) {
  const key = decodeRedsysKey(secret);
  const orderBuf = Buffer.from(order, "utf8");
  const padLen = (8 - (orderBuf.length % 8)) % 8;
  const orderPadded = padLen ? Buffer.concat([orderBuf, Buffer.alloc(padLen, 0)]) : orderBuf;
  const iv = Buffer.alloc(8, 0);
  const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv);
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(orderPadded), cipher.final()]);
}

function signRedsys({ secretKey, order, merchantParameters }) {
  const derived = key3DES(secretKey, order);
  const hmac = crypto.createHmac("sha256", derived);
  hmac.update(merchantParameters, "utf8");
  return hmac.digest("base64");
}

function readBody(req) {
  return new Promise((resolve) => {
    let payload = "";
    req.on("data", (chunk) => (payload += chunk));
    req.on("end", () => resolve(payload));
  });
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return text(res, 405, "Method not allowed");

  const secretKey = process.env.REDSYS_SECRET_KEY;
  if (!secretKey) return text(res, 500, "Missing REDSYS_SECRET_KEY");

  const raw = await readBody(req);
  const params = new URLSearchParams(raw);
  const signatureVersion = params.get("Ds_SignatureVersion") || "";
  const merchantParameters = params.get("Ds_MerchantParameters") || "";
  const signature = params.get("Ds_Signature") || "";

  if (signatureVersion !== "HMAC_SHA256_V1") return text(res, 400, "Invalid signature version");
  if (!merchantParameters || !signature) return text(res, 400, "Missing params");

  let decoded;
  try {
    // Redsys suele enviar Base64 estándar; aceptamos base64url también por si acaso.
    const mpB64 = /[-_]/.test(merchantParameters) ? base64urlToBase64(merchantParameters) : merchantParameters;
    decoded = Buffer.from(mpB64, "base64").toString("utf8");
  } catch {
    return text(res, 400, "Invalid merchantParameters");
  }
  const mp = safeJsonParse(decoded);
  if (!mp?.Ds_Order && !mp?.Ds_Merchant_Order) return text(res, 400, "Missing order");

  const order = String(mp.Ds_Order || mp.Ds_Merchant_Order);
  const expected = signRedsys({ secretKey, order, merchantParameters });

  // Redsys puede enviar la firma en base64 o base64url. Normalizamos a base64 estándar.
  const normalizeSig = (s) => {
    const str = String(s || "");
    return /[-_]/.test(str) ? base64urlToBase64(str).replace(/=+$/g, "") : str.replace(/=+$/g, "");
  };
  const a = Buffer.from(normalizeSig(expected), "utf8");
  const b = Buffer.from(normalizeSig(signature), "utf8");
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return text(res, 400, "Invalid signature");

  // Registrar el pago si hay Vercel KV configurado (opcional).
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    const amount = String(mp.Ds_Amount || mp.Ds_Merchant_Amount || "");
    const response = String(mp.Ds_Response || "");
    const status = /^\d+$/.test(response) && Number(response) < 100 ? "OK" : `RESP_${response || "?"}`;
    const record = {
      date: new Date().toISOString(),
      order,
      amount: amount ? Number(amount) : null,
      status,
      rawResponse: response || null,
    };
    try {
      await fetch(`${kvUrl}/lpush`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "bolera:payments", elements: [JSON.stringify(record)] }),
      });
    } catch {
      // ignore
    }
  }

  // Respondemos 200 para confirmar recepción.
  return text(res, 200, "OK");
}
