import Stripe from "stripe";

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

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json(res, 500, { error: "Missing STRIPE_SECRET_KEY env var" });
  }

  let payload = "";
  req.on("data", (chunk) => {
    payload += chunk;
  });

  req.on("end", async () => {
    let data;
    try {
      data = JSON.parse(payload || "{}");
    } catch {
      return json(res, 400, { error: "Invalid JSON" });
    }

    const {
      title,
      pricePerSeatCents,
      quantity,
      currency = "eur",
      metadata = {},
    } = data || {};

    const qty = Number(quantity);
    const unitAmount = Number(pricePerSeatCents);

    if (!title || !Number.isFinite(qty) || qty < 1 || qty > 30) {
      return json(res, 400, { error: "Invalid quantity/title" });
    }
    if (!Number.isFinite(unitAmount) || unitAmount < 50 || unitAmount > 50000) {
      return json(res, 400, { error: "Invalid pricePerSeatCents" });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
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
              product_data: {
                name: title,
              },
            },
            quantity: qty,
          },
        ],
        metadata: {
          source: "bolera-contrastes",
          ...metadata,
        },
        success_url: `${baseUrl}/pago/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pago/cancel.html`,
      });

      return json(res, 200, { url: session.url });
    } catch (err) {
      return json(res, 500, { error: "Stripe error", details: String(err?.message || err) });
    }
  });
}

