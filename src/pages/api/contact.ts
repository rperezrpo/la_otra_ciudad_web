import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Runs as a Vercel serverless function, not a static page.
export const prerender = false;

// Where notifications are sent, and the verified sender address.
// Override via env in Vercel if you use different addresses.
const TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL ?? 'info@laotraciudad.org';
const FROM_EMAIL = import.meta.env.CONTACT_FROM_EMAIL ?? 'web@laotraciudad.org';

const ASUNTO_LABELS: Record<string, string> = {
  alianza: 'Alianza institucional',
  voluntariado: 'Voluntariado',
  medios: 'Medios y prensa',
  consulta: 'Consulta general',
  otro: 'Otro',
};

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return json({ error: 'El formulario no está configurado. Intenta más tarde.' }, 500);
  }

  let data: Record<string, string> = {};
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const form = await request.formData();
      data = Object.fromEntries(
        [...form.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : ''])
      );
    }
  } catch {
    return json({ error: 'No pudimos leer el formulario.' }, 400);
  }

  const nombre = (data.nombre ?? '').trim();
  const email = (data.email ?? '').trim();
  const asunto = (data.asunto ?? '').trim();
  const mensaje = (data.mensaje ?? '').trim();

  if (!nombre || !email || !asunto || !mensaje) {
    return json({ error: 'Por favor completa todos los campos.' }, 400);
  }
  if (!isEmail(email)) {
    return json({ error: 'El correo electrónico no es válido.' }, 400);
  }

  const asuntoLabel = ASUNTO_LABELS[asunto] ?? asunto;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `La Otra Ciudad <${FROM_EMAIL}>`,
    to: [TO_EMAIL],
    replyTo: email,
    subject: `[Web] ${asuntoLabel} — ${nombre}`,
    html: `
      <h2>Nuevo mensaje desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
      <p><strong>Asunto:</strong> ${escapeHtml(asuntoLabel)}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-line;">${escapeHtml(mensaje)}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return json({ error: 'No pudimos enviar tu mensaje. Intenta de nuevo.' }, 502);
  }

  return json({ ok: true }, 200);
};
