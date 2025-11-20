export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  ip?: string | null;
  userAgent?: string | null;
};

export async function sendContactEmail(payload: ContactPayload) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('Missing SENDGRID_API_KEY');
  }

  // lazy-load to keep tests lightweight (so package isn't required at import time)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(apiKey);

  const from = process.env.SENDGRID_FROM || `no-reply@${process.env.VERCEL_URL ?? 'example.com'}`;
  const to = process.env.SENDGRID_TO || from;

  const subject = `New contact from ${payload.name}`;
  const text = `${payload.message}\n\n— ${payload.name} <${payload.email}>\nIP: ${
    payload.ip ?? 'unknown'
  }\nUA: ${payload.userAgent ?? 'unknown'}`;
  const html = `<p>${escapeHtml(payload.message)}</p>\n    <p>— ${escapeHtml(
    payload.name
  )} &lt;${escapeHtml(payload.email)}&gt;</p>\n    <p>IP: ${escapeHtml(
    payload.ip ?? 'unknown'
  )}</p>\n    <p>UA: ${escapeHtml(payload.userAgent ?? 'unknown')}</p>`;

  await sgMail.send({
    to,
    from,
    subject,
    text,
    html,
  });
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
