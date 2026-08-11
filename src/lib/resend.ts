import { Resend } from "resend";

let resend: Resend | null = null;

/**
 * Server-only Resend client. Never import this module from client components.
 */
export function getResend(): Resend {
  if (resend) return resend;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY must be set in your environment.");
  }

  resend = new Resend(apiKey);
  return resend;
}

export async function sendFulfillmentEmail({
  to,
  customerName,
  accessUrl,
}: {
  to: string;
  customerName?: string | null;
  accessUrl: string;
}) {
  const firstName = (customerName ?? "there").split(" ")[0];
  const from = process.env.RESEND_FROM ?? "Founder Vault <vault@entrepreneursjantaparty.com>";

  const { error } = await getResend().emails.send({
    from,
    to,
    replyTo: "entrepreneursjantaparty@gmail.com",
    subject: "Welcome to Founder Vault — Your Access Is Ready",
    html: `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f4f4f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f2;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6e6e2;">
            <tr>
              <td style="background-color:#111111;padding:28px 32px;text-align:center;">
                <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Founder Vault</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 8px 0;font-size:14px;color:#9a9a9a;">Payment received</p>
                <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#111111;letter-spacing:-0.02em;">
                  Welcome to Founder Vault, ${firstName}
                </h1>
                <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#555555;">
                  Your one-time payment of <strong>₹149</strong> for Founder Vault was successful.
                  Your access is ready — dive into verified investor data, pitch decks,
                  business planning templates, financial projections, legal documents and
                  founder resources.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:8px 0 24px 0;">
                  <tr>
                    <td align="center">
                      <a href="${accessUrl}"
                         style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;">
                        ACCESS FOUNDER VAULT →
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9a;">
                  This link is personal to you — please don't share it. Questions?
                  <a href="mailto:entrepreneursjantaparty@gmail.com" style="color:#111111;">Contact us</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f8f8f7;padding:20px 32px;text-align:center;">
                <span style="font-size:12px;color:#9a9a9a;">Founder Vault by Entrepreneurs Janta Party</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  });

  if (error) {
    throw new Error(`Resend failed: ${error.message}`);
  }
}
