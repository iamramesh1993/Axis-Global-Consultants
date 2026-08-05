import { Resend } from "resend";
import type { LeadParsed } from "@/lib/validation";

/**
 * Lead notifications. Both channels are optional and fail soft: a notification
 * problem must never lose a lead that is already saved in the database.
 */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildRows(lead: LeadParsed) {
  return [
    ["Name", lead.fullName],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Qualification", lead.qualification],
    ["Destination", lead.targetCountry],
    ["Intake", lead.intake],
    ["Budget", lead.budgetRange || "—"],
    ["Message", lead.message || "—"],
    ["Source", lead.source || "direct"],
  ] as const;
}

export async function sendLeadEmail(lead: LeadParsed): Promise<{
  sent: boolean;
  reason?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { sent: false, reason: "resend-not-configured" };
  }

  const rows = buildRows(lead);
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:640px">
      <h2 style="margin:0 0 4px">New assessment request</h2>
      <p style="margin:0 0 20px;color:#666;font-size:14px">
        ${escapeHtml(lead.targetCountry)} · ${escapeHtml(lead.intake)}
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px 8px 0;color:#666;vertical-align:top;white-space:nowrap">${label}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(String(value))}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#888">
        Reply within one working day — that promise is on the website.
      </p>
    </div>`;

  const text = rows.map(([l, v]) => `${l}: ${v}`).join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: lead.email,
      subject: `New lead — ${lead.fullName} (${lead.targetCountry}, ${lead.intake})`,
      html,
      text,
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      reason: err instanceof Error ? err.message : "unknown",
    };
  }
}

/**
 * WhatsApp Cloud API notification.
 * Deliberately inert in Phase 1: WHATSAPP_ENABLED must be exactly "true" and
 * credentials must be present, otherwise this is a no-op.
 */
export async function sendLeadWhatsApp(lead: LeadParsed): Promise<{
  sent: boolean;
  reason?: string;
}> {
  if (process.env.WHATSAPP_ENABLED !== "true") {
    return { sent: false, reason: "disabled" };
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const to = process.env.WHATSAPP_NOTIFY_TO;

  if (!token || !phoneId || !to) {
    return { sent: false, reason: "whatsapp-not-configured" };
  }

  const body = [
    "*New assessment request*",
    `${lead.fullName} — ${lead.targetCountry}, ${lead.intake}`,
    `${lead.phone} · ${lead.email}`,
    `Qualification: ${lead.qualification}`,
    lead.budgetRange ? `Budget: ${lead.budgetRange}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        }),
      },
    );
    if (!res.ok) {
      return { sent: false, reason: `whatsapp-http-${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      reason: err instanceof Error ? err.message : "unknown",
    };
  }
}
