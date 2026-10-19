/**
 * Simple in-memory per-IP rate limiter (best effort, server-side only).
 * Resets automatically when the Next.js server process restarts.
 * Demo Mode never calls these routes, so it is never affected.
 */

interface RateEntry {
  count: number;
  windowStart: number;
}

// Separate maps for each route so limits are independent
const trialBucket = new Map<string, RateEntry>();
const objectionBucket = new Map<string, RateEntry>();

const HOUR_MS = 60 * 60 * 1000;

/** Limits: 5 requests/hour for /api/trial, 15/hour for /api/objection */
const LIMITS: Record<"trial" | "objection", number> = {
  trial: 5,
  objection: 15,
};

/**
 * Check if a given IP is within the allowed rate for the specified route.
 * Returns true when the request is allowed; false when the limit is exceeded.
 */
export function checkRateLimit(ip: string, route: "trial" | "objection"): boolean {
  const bucket = route === "trial" ? trialBucket : objectionBucket;
  const limit = LIMITS[route];
  const now = Date.now();

  const entry = bucket.get(ip);

  if (!entry || now - entry.windowStart >= HOUR_MS) {
    // First request this hour — open a fresh window
    bucket.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= limit) {
    // Window still active and limit reached
    return false;
  }

  // Within the window and under the limit — increment
  entry.count += 1;
  return true;
}
