import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';

// Runs as a Vercel serverless function, not a static page.
export const prerender = false;

// Wompi (Bancolombia) — Colombian payment gateway.
// PUBLIC_WOMPI_PUBLIC_KEY  → safe to expose, used to open the checkout.
// WOMPI_INTEGRITY_SECRET   → server-side ONLY. Used to sign the transaction so
//                            the amount can't be tampered with in the URL.
// Create both at https://comercios.wompi.co → Desarrolladores.
const PUBLIC_KEY = import.meta.env.PUBLIC_WOMPI_PUBLIC_KEY;
const INTEGRITY_SECRET = import.meta.env.WOMPI_INTEGRITY_SECRET;

// Wompi only ever settles in COP. Donors may choose a foreign currency, in
// which case we convert the amount to COP here before charging.
const SETTLE_CURRENCY = 'COP';
const SUPPORTED = ['COP', 'USD', 'EUR', 'CHF'] as const;
type Currency = (typeof SUPPORTED)[number];

// Minimum donation accepted, per currency (whole units).
const MINIMUMS: Record<Currency, number> = { COP: 10000, USD: 3, EUR: 3, CHF: 3 };

// Fallback FX rates (1 unit → COP) used only if the live rate API is down.
// Update occasionally; live rates are preferred and override these.
const FALLBACK_TO_COP: Record<Exclude<Currency, 'COP'>, number> = {
  USD: 4000,
  EUR: 4300,
  CHF: 4500,
};

// Wompi Web Checkout (redirect flow).
const CHECKOUT_URL = 'https://checkout.wompi.co/p/';

/** Convert a whole-unit amount in `currency` to whole COP. */
async function toCop(amount: number, currency: Currency): Promise<number> {
  if (currency === 'COP') return Math.round(amount);
  try {
    // open.er-api.com — free, no key, includes COP.
    const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
    const data = await res.json();
    const rate = data?.rates?.COP;
    if (typeof rate === 'number' && rate > 0) return Math.round(amount * rate);
  } catch {
    /* fall through to fallback rate */
  }
  return Math.round(amount * FALLBACK_TO_COP[currency]);
}

export const GET: APIRoute = async ({ url, request }) => {
  if (!PUBLIC_KEY || !INTEGRITY_SECRET) {
    console.error('Wompi keys are not set (PUBLIC_WOMPI_PUBLIC_KEY / WOMPI_INTEGRITY_SECRET)');
    return new Response('Las donaciones no están configuradas todavía. Intenta más tarde.', {
      status: 500,
    });
  }

  // Currency chosen on the form (defaults to COP).
  const currencyParam = (url.searchParams.get('currency') ?? 'COP').toUpperCase();
  const currency = (SUPPORTED as readonly string[]).includes(currencyParam)
    ? (currencyParam as Currency)
    : 'COP';

  // Amount in whole units of the chosen currency (e.g. 25 for USD, 50000 for COP).
  const rawAmount = Number(url.searchParams.get('amount'));
  const amount = Math.floor(rawAmount);

  if (!Number.isFinite(amount) || amount < MINIMUMS[currency]) {
    return new Response(
      `El monto mínimo de donación es ${MINIMUMS[currency].toLocaleString('es-CO')} ${currency}.`,
      { status: 400 },
    );
  }

  // Convert to COP — the only currency Wompi can charge.
  const amountCop = await toCop(amount, currency);
  // Wompi expects the amount in cents.
  const amountInCents = amountCop * 100;

  // Unique reference per attempt — records the donor's original currency/amount.
  const reference =
    `donacion-${currency}${amount}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Integrity signature: SHA256(reference + amountInCents + currency + secret).
  const signature = createHash('sha256')
    .update(`${reference}${amountInCents}${SETTLE_CURRENCY}${INTEGRITY_SECRET}`)
    .digest('hex');

  // Where Wompi sends the donor back after paying. Derive from the current
  // request so it works in dev, preview and production without extra config.
  const origin = new URL(request.url).origin;
  const redirectUrl = `${origin}/donar/gracias`;

  // Build the URL manually — URLSearchParams encodes ':' as '%3A', but Wompi's
  // WAF requires the literal key "signature:integrity" (colon unencoded).
  const query = [
    `public-key=${encodeURIComponent(PUBLIC_KEY)}`,
    `currency=${SETTLE_CURRENCY}`,
    `amount-in-cents=${amountInCents}`,
    `reference=${encodeURIComponent(reference)}`,
    `signature:integrity=${signature}`,
    `redirect-url=${encodeURIComponent(redirectUrl)}`,
  ].join('&');

  return new Response(null, {
    status: 302,
    headers: { Location: `${CHECKOUT_URL}?${query}` },
  });
};
