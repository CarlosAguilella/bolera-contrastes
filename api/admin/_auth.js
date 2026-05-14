import crypto from "crypto";

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, "base64");
}

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export async function readJson(req) {
  return new Promise((resolve) => {
    let payload = "";
    req.on("data", (c) => (payload += c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(payload || "{}"));
      } catch {
        resolve(null);
      }
    });
  });
}

export function signToken(payloadObj, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const enc = (o) => b64url(Buffer.from(JSON.stringify(o), "utf8"));
  const head = enc(header);
  const payload = enc(payloadObj);
  const data = `${head}.${payload}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${b64url(sig)}`;
}

export function verifyToken(token, secret) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const [head, payload, sig] = parts;
  const data = `${head}.${payload}`;
  const expected = crypto.createHmac("sha256", secret).update(data).digest();
  const got = fromB64url(sig);
  if (got.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(got, expected)) return null;
  try {
    const obj = JSON.parse(fromB64url(payload).toString("utf8"));
    if (obj?.exp && Date.now() / 1000 > obj.exp) return null;
    return obj;
  } catch {
    return null;
  }
}

export function requireAdmin(req, res) {
  const secret = process.env.ADMIN_SECRET || "";
  if (!secret) {
    json(res, 500, { error: "Missing ADMIN_SECRET" });
    return null;
  }
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const payload = verifyToken(token, secret);
  if (!payload) {
    json(res, 401, { error: "Unauthorized" });
    return null;
  }
  return payload;
}

