import { getResend } from "@/lib/resend/client";
import { siteConfig } from "@/config/site";
import type { Commission } from "@/types";

function hasResend(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendInquiryReceivedEmail(
  toEmail: string,
  commission: Pick<Commission, "title" | "reference_number">,
) {
  if (!hasResend()) {
    console.info("[sendInquiryReceivedEmail] RESEND_API_KEY not set — skipping email");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? siteConfig.contactEmail;

  try {
    await getResend().emails.send({
      from,
      to: toEmail,
      subject: `Inquiry received — ${commission.reference_number}`,
      html: `
        <div style="font-family: Georgia, serif; color: #0A0A0A;">
          <p style="letter-spacing: 0.2em; text-transform: uppercase; font-size: 12px; color: #C9A962;">The Vault</p>
          <h1 style="font-weight: 400;">Your commission inquiry is received</h1>
          <p><strong>${commission.title}</strong></p>
          <p>Reference: ${commission.reference_number}</p>
          <p>Our team will review your story and respond within one business day.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[sendInquiryReceivedEmail]", err);
  }
}

export async function sendAdminInquiryNotification(
  commission: Pick<Commission, "title" | "reference_number" | "story_narrative">,
  clientEmail: string,
) {
  if (!hasResend()) return;

  const adminEmails = (process.env.VAULT_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length === 0) return;

  const from = process.env.RESEND_FROM_EMAIL ?? siteConfig.contactEmail;

  try {
    await getResend().emails.send({
      from,
      to: adminEmails,
      subject: `New inquiry — ${commission.reference_number}`,
      html: `
        <h2>New Commission Inquiry</h2>
        <p><strong>${commission.title}</strong></p>
        <p>Client: ${clientEmail}</p>
        <p>Reference: ${commission.reference_number}</p>
        <p>${commission.story_narrative ?? ""}</p>
      `,
    });
  } catch (err) {
    console.error("[sendAdminInquiryNotification]", err);
  }
}
