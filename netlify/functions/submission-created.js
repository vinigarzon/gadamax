const RESEND_API_URL = "https://api.resend.com/emails";
const GADAMAX_LOGO_URL = "https://www.gadamax.com/assets/images/brand-logo-gadamax.png";

export default async (req) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !resendFromEmail) {
    console.warn(
      "submission-created: missing RESEND_API_KEY or RESEND_FROM_EMAIL environment variable"
    );
    return new Response("Autoresponder skipped: missing email configuration.", {
      status: 202
    });
  }

  let body;

  try {
    body = await req.json();
  } catch (error) {
    console.error("submission-created: invalid JSON payload", error);
    return new Response("Invalid payload", { status: 400 });
  }

  const payload = body?.payload ?? {};
  const data = payload?.data ?? {};
  const formName = payload?.form_name ?? data["form-name"];

  if (formName !== "contact") {
    return new Response("Ignored non-contact form submission.", { status: 200 });
  }

  const submitterName = data.name?.trim() || "there";
  const submitterEmail = data.email?.trim();
  const service = data.service?.trim() || "Not provided";

  if (!submitterEmail) {
    console.warn("submission-created: missing submitter email");
    return new Response("Missing submitter email", { status: 202 });
  }

  try {
    await sendResendEmail({
      apiKey: resendApiKey,
      from: resendFromEmail,
      to: submitterEmail,
      subject: "We received your message — Gadamax will follow up shortly",
      html: buildAutoReplyHtml({
        name: submitterName,
        service
      }),
      text: buildAutoReplyText({
        name: submitterName,
        service
      })
    });
  } catch (error) {
    console.error("submission-created: failed to send email", error);
    return new Response("Email send failed", { status: 500 });
  }

  return new Response("Autoresponder sent.", { status: 200 });
};

async function sendResendEmail({
  apiKey,
  from,
  to,
  replyTo,
  subject,
  html,
  text
}) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error ${response.status}: ${body}`);
  }
}

function buildAutoReplyHtml({ name, service }) {
  return `
    <div style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#0d1321;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid rgba(13,19,33,0.08);border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(8,17,31,0.08);">
          <div style="padding:32px;background:linear-gradient(135deg,#0d1321 0%,#16284a 100%);">
            <div style="margin-bottom:24px;">
              <img
                src="${GADAMAX_LOGO_URL}"
                alt="Gadamax"
                width="152"
                height="40"
                style="display:block;width:152px;max-width:100%;height:auto;"
              />
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:1.05;">
              We received your message.
            </h1>
          </div>
          <div style="padding:32px;">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
              Hi ${escapeHtml(name)},
            </p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
              Thank you for reaching out to Gadamax. Your message is in, and our team will review it shortly.
            </p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
              We typically respond with a practical next step after reviewing the goals, context, and scope behind the request.
            </p>
            <div style="margin:24px 0;padding:18px 20px;border-radius:18px;background:#f8f3ef;border:1px solid rgba(242,139,91,0.2);">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f28b5b;">
                Service focus
              </p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#0d1321;">
                ${escapeHtml(service)}
              </p>
            </div>
            <p style="margin:0;font-size:16px;line-height:1.7;">
              Best,<br />
              <strong>Gadamax</strong><br />
              Strategy, brand, and software for businesses ready to move faster
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildAutoReplyText({ name, service }) {
  return `Hi ${name},

Thank you for reaching out to Gadamax. We received your message and our team will review it shortly.

Service focus: ${service}

We typically respond with a practical next step after reviewing the goals, context, and scope behind the request.

Best,
Gadamax`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
