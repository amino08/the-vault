import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

export const emailTemplates = {
  commissionInquiry: "commission-inquiry",
  paymentReceived: "payment-received",
  statusUpdate: "status-update",
  renderApproval: "render-approval-request",
} as const;
