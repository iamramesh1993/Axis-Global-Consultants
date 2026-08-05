import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { getDb } from "@/lib/db";
import { leads } from "@/db/schema";
import { sendLeadEmail, sendLeadWhatsApp } from "@/lib/notify";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
/** Never cached — it's a write endpoint. */
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  // --- Rate limit -----------------------------------------------------------
  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        message: "Too many submissions. Please try again in a few minutes.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  // --- Parse body -----------------------------------------------------------
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "payload_too_large",
          message: "That message is too long.",
        },
        { status: 413 },
      );
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_json",
        message: "Something went wrong. Please try again.",
      },
      { status: 400 },
    );
  }

  // --- Validate (server-side, independent of the client) --------------------
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json(
      {
        ok: false,
        error: "validation_failed",
        message: "Please check the highlighted fields.",
        fieldErrors,
      },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // --- Honeypot -------------------------------------------------------------
  // A filled hidden field means a bot. Return 200 so it can't tell it failed.
  if (lead.website) {
    return NextResponse.json({ ok: true, stored: false });
  }

  // --- Persist --------------------------------------------------------------
  const db = getDb();
  let stored = false;

  if (db) {
    try {
      await db.insert(leads).values({
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        qualification: lead.qualification,
        targetCountry: lead.targetCountry,
        intake: lead.intake,
        budgetRange: lead.budgetRange || null,
        message: lead.message || null,
        consent: lead.consent,
        source: lead.source || null,
      });
      stored = true;
    } catch (err) {
      console.error("[leads] insert failed", err);
      // The lead is real and the student is waiting. Fall through to notify —
      // an email in the inbox is better than losing the enquiry entirely.
    }
  } else {
    console.warn("[leads] DATABASE_URL not set — lead not persisted");
  }

  // --- Notify ---------------------------------------------------------------
  const [email, whatsapp] = await Promise.all([
    sendLeadEmail(lead),
    sendLeadWhatsApp(lead),
  ]);

  if (!email.sent) console.warn("[leads] email not sent:", email.reason);
  if (!whatsapp.sent && whatsapp.reason !== "disabled") {
    console.warn("[leads] whatsapp not sent:", whatsapp.reason);
  }

  // If we neither stored nor notified, the enquiry is genuinely lost. Say so
  // rather than showing a success screen that isn't true.
  if (!stored && !email.sent) {
    return NextResponse.json(
      {
        ok: false,
        error: "delivery_failed",
        message:
          "We couldn't submit that. Please WhatsApp us on +92 313 5155868 and we'll pick it up straight away.",
      },
      { status: 503 },
    );
  }

  // TODO: CAPI — forward this conversion to the Meta Conversions API server-side
  // once the pixel is live, using a hashed email + the event_id we return here.

  return NextResponse.json({ ok: true, stored });
}

/** Anything other than POST is a mistake — be explicit rather than 404. */
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "method_not_allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
