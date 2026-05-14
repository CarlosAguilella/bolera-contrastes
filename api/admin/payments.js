import { json, requireAdmin } from "./_auth.js";

async function kvFetch(path, bodyObj) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObj),
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function handler(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  // If KV isn't configured, return empty list.
  const data = await kvFetch("/lrange", { key: "bolera:payments", start: 0, stop: 99 });
  const raw = data?.result || [];
  const payments = raw
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return json(res, 200, { payments });
}

