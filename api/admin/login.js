import crypto from "crypto";
import { json, readJson, signToken } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SECRET || "";
  if (!adminPassword || !secret) {
    return json(res, 500, { error: "Admin not configured" });
  }

  const body = await readJson(req);
  if (!body) return json(res, 400, { error: "Invalid JSON" });

  const password = String(body.password || "");
  const ok =
    password.length &&
    crypto.timingSafeEqual(Buffer.from(password, "utf8"), Buffer.from(adminPassword, "utf8"));
  if (!ok) return json(res, 401, { error: "Invalid password" });

  const token = signToken(
    { role: "admin", exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 },
    secret,
  );
  return json(res, 200, { token });
}

