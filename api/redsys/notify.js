import crypto from "crypto";

function text(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(body);
}

function base64urlToBase64(str) {
  return str.replace(/-/g, "+").replace(/_/g, "/");
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
  const cipher = crypto.createCipheriv("des-ede3", key, null);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(orderBuf), cipher.final()]);
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
    decoded = Buffer.from(merchantParameters, "base64").toString("utf8");
  } catch {
    return text(res, 400, "Invalid merchantParameters");
  }
  const mp = safeJsonParse(decoded);
  if (!mp?.Ds_Order && !mp?.Ds_Merchant_Order) return text(res, 400, "Missing order");

  const order = String(mp.Ds_Order || mp.Ds_Merchant_Order);
  const expected = signRedsys({ secretKey, order, merchantParameters });

  // Redsys puede enviar la firma en base64 normal; comparamos en tiempo constante.
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return text(res, 400, "Invalid signature");

  // Aquí podríamos registrar el pago (KV/DB) y decrementar plazas.
  // Respondemos 200 para confirmar recepción.
  return text(res, 200, "OK");
}

