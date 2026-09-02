const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

/**
 * Best-effort in-process throttle. It is deliberately simple: it survives a
 * single instance only, so treat it as a speed bump in front of the mail
 * provider rather than a security control. Move it to Redis or the platform's
 * own rate limiter when the site runs on more than one instance.
 */
export function allowRequest(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [entryKey, timestamps] of hits) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) hits.delete(entryKey);
    }
  }

  return true;
}
