// Rate limiter with optional Vercel KV backing and in-memory fallback.
// To enable Vercel KV use set `VERCEL_KV=1` and configure the Vercel KV environment.

const WINDOW_DEFAULT = 60 * 60; // seconds (1 hour)
const MAX_DEFAULT = 5;

type Result = { count: number; allowed: boolean };

const memMap = new Map<string, { ts: number[] }>();

export async function incrementAndCheck(
  ip: string,
  windowSeconds = WINDOW_DEFAULT,
  max = MAX_DEFAULT
): Promise<Result> {
  // Prefer KV when enabled
  if (process.env.VERCEL_KV) {
    try {
      // lazy-load @vercel/kv
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { kv } = require('@vercel/kv');
      const key = `rate:${ip}`;
      // incr the key and set TTL on first creation
      const count = await kv.incr(key);
      if (count === 1) {
        // set expire in seconds
        await kv.expire(key, windowSeconds);
      }
      return { count: Number(count), allowed: Number(count) <= max };
    } catch (err) {
      // fall through to in-memory fallback
      // eslint-disable-next-line no-console
      console.warn('Vercel KV rate limiter failed, falling back to memory', err?.message ?? err);
    }
  }

  // In-memory fallback (per-instance only)
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = memMap.get(ip) || { ts: [] };
  const recent = entry.ts.filter((t) => t > now - windowMs);
  recent.push(now);
  entry.ts = recent;
  memMap.set(ip, entry);
  const count = recent.length;
  return { count, allowed: count <= max };
}

export function resetInMemoryLimiterForTests() {
  memMap.clear();
}
