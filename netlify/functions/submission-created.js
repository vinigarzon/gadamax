const RESEND_API_URL = "https://api.resend.com/emails";

export default async (req) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  const resendToEmail = process.env.RESEND_TO_EMAIL || "info@gadamax.com";

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
  const company = data.company?.trim() || "Not provided";
  const service = data.service?.trim() || "Not provided";
  const message = data.message?.trim() || "No message provided.";

  if (!submitterEmail) {
    console.warn("submission-created: missing submitter email");
    return new Response("Missing submitter email", { status: 202 });
  }

  try {
    await Promise.all([
      sendResendEmail({
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
      }),
      sendResendEmail({
        apiKey: resendApiKey,
        from: resendFromEmail,
        to: resendToEmail,
        replyTo: submitterEmail,
        subject: `New Gadamax lead: ${submitterName}`,
        html: buildInternalLeadHtml({
          name: submitterName,
          email: submitterEmail,
          company,
          service,
          message
        }),
        text: buildInternalLeadText({
          name: submitterName,
          email: submitterEmail,
          company,
          service,
          message
        })
      })
    ]);
  } catch (error) {
    console.error("submission-created: failed to send email", error);
    return new Response("Email send failed", { status: 500 });
  }

  return new Response("Autoresponder and internal email sent.", { status: 200 });
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
            <div style="display:inline-block;padding:10px 14px;border-radius:999px;background:rgba(242,139,91,0.16);color:#f28b5b;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
              Gadamax
            </div>
            <h1 style="margin:18px 0 0;color:#ffffff;font-size:32px;line-height:1.05;">
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
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
              If you need to add anything else, simply reply to this email.
            </p>
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

If you need to add anything else, simply reply to this email.

Best,
Gadamax`;
}

function buildInternalLeadHtml({ name, email, company, service, message }) {
  return `
    <div style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#0d1321;">
      <div style="max-width:720px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid rgba(13,19,33,0.08);border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(8,17,31,0.08);">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#0d1321 0%,#16284a 100%);">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#f28b5b;">
              New contact submission
            </p>
            <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.1;">
              ${escapeHtml(name)}
            </h1>
          </div>
          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f28b5b;">Email</td>
                <td style="padding:0 0 16px;font-size:16px;color:#0d1321;">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f28b5b;">Company</td>
                <td style="padding:0 0 16px;font-size:16px;color:#0d1321;">${escapeHtml(company)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f28b5b;">Service</td>
                <td style="padding:0 0 16px;font-size:16px;color:#0d1321;">${escapeHtml(service)}</td>
              </tr>
            </table>
            <div style="margin-top:8px;padding:20px;border-radius:18px;background:#f7f9fc;border:1px solid rgba(13,19,33,0.08);">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f28b5b;">Message</p>
              <p style="margin:0;font-size:16px;line-height:1.7;color:#0d1321;white-space:pre-wrap;">${escapeHtml(message)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildInternalLeadText({ name, email, company, service, message }) {
  return `New contact submission

Name: ${name}
Email: ${email}
Company: ${company}
Service: ${service}

Message:
${message}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
