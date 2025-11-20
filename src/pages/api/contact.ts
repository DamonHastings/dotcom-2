import type { NextApiRequest, NextApiResponse } from 'next';
import { sendContactEmail } from '../../lib/email';
import { saveContactMessage } from '../../lib/db';
import { incrementAndCheck } from '../../lib/rateLimiter';

type Data = {
  success: boolean;
  message?: string;
};

// Simple in-memory rate limiter. For production use a shared store (Redis).
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max requests per window per IP

function stripTags(s: string) {
  return String(s)
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // not configured -> skip verification
  if (!token) return false;

  try {
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const json = await resp.json();
    return json.success === true;
  } catch (err) {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, message, recaptchaToken } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // rate limiting by IP (supports Vercel KV when `VERCEL_KV` env var is set)
  const ip =
    (req.headers['x-forwarded-for'] as string) ||
    (req.socket && (req.socket as any).remoteAddress) ||
    'unknown';
  const rl = await incrementAndCheck(ip, RATE_LIMIT_WINDOW_MS / 1000, RATE_LIMIT_MAX);
  if (!rl.allowed) {
    return res.status(429).json({ success: false, message: 'Rate limit exceeded' });
  }

  // optional reCAPTCHA verification
  const okRecaptcha = await verifyRecaptcha(recaptchaToken);
  if (!okRecaptcha) {
    return res.status(400).json({ success: false, message: 'Failed reCAPTCHA verification' });
  }

  // sanitize inputs
  const clean = {
    name: stripTags(name).slice(0, 200),
    email: stripTags(email).slice(0, 200),
    message: stripTags(message).slice(0, 2000),
    ip: ip as string,
    userAgent: (req.headers['user-agent'] as string) || null,
  };

  try {
    // persist (best-effort) and notify
    await Promise.allSettled([
      saveContactMessage({
        name: clean.name,
        email: clean.email,
        message: clean.message,
        ip: clean.ip,
        userAgent: clean.userAgent,
      }),
      sendContactEmail({
        name: clean.name,
        email: clean.email,
        message: clean.message,
        ip: clean.ip,
        userAgent: clean.userAgent,
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('contact handler error', err);
    return res.status(500).json({ success: false, message: 'Internal error' });
  }
}
