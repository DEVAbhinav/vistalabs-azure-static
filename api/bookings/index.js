const { Resend } = require('resend');

const requiredEnv = ['RESEND_API_KEY', 'RESEND_TO_EMAIL'];

const buildHeaders = origin => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json'
});

const sanitize = value => (typeof value === 'string' ? value.trim() : '');
const escapeHtml = value =>
  sanitize(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

module.exports = async function (context, req) {
  const origin = req.headers?.origin || '*';
  const headers = buildHeaders(origin);

  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers
    };
    return;
  }

  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
    return;
  }

  const missingEnv = requiredEnv.filter(key => !process.env[key]);
  if (missingEnv.length) {
    context.log.error('Missing required environment variables for Resend:', missingEnv.join(', '));
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({ error: 'Email service is not configured.' })
    };
    return;
  }

  const { name, email, company, timeline, message } = req.body || {};
  const safeName = sanitize(name);
  const safeEmail = sanitize(email);
  const safeCompany = sanitize(company);
  const safeTimeline = sanitize(timeline);
  const safeMessage = sanitize(message);
  const htmlName = escapeHtml(name);
  const htmlEmail = escapeHtml(email);
  const htmlCompany = escapeHtml(company);
  const htmlTimeline = escapeHtml(timeline);
  const htmlMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  if (!safeName || !safeEmail || !safeMessage) {
    context.res = {
      status: 400,
      headers,
      body: JSON.stringify({ error: 'Name, email, and message are required.' })
    };
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #0f172a;">
      <h2 style="margin-bottom: 16px;">New booking enquiry</h2>
  <p><strong>Name:</strong> ${htmlName}</p>
  <p><strong>Email:</strong> ${htmlEmail}</p>
  ${safeCompany ? `<p><strong>Organisation:</strong> ${htmlCompany}</p>` : ''}
  ${safeTimeline ? `<p><strong>Desired go-live:</strong> ${htmlTimeline}</p>` : ''}
  <p style="margin-top: 24px;"><strong>Message:</strong><br/>${htmlMessage}</p>
    </div>
  `;

  const textBody = `New booking enquiry\n\nName: ${safeName}\nEmail: ${safeEmail}\nOrganisation: ${safeCompany || 'Not provided'}\nDesired go-live: ${safeTimeline || 'Not provided'}\n\nMessage:\n${safeMessage}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL,
      cc: process.env.RESEND_CC_EMAIL ? [process.env.RESEND_CC_EMAIL] : undefined,
      reply_to: safeEmail,
      subject: `New booking enquiry from ${safeName}`,
      text: textBody,
      html: htmlBody
    });

    context.res = {
      status: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    context.log.error('Failed to send booking email via Resend:', error);
    const message = error?.message || 'We could not send the booking request.';
    context.res = {
      status: 502,
      headers,
      body: JSON.stringify({ error: message })
    };
  }
};
