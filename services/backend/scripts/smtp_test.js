const nodemailer = require('nodemailer');

const to = process.argv[2];
if (!to) {
  console.error('Usage: node smtp_test.js <email>');
  process.exit(1);
}

// Read SMTP config from env or use MailHog defaults
const host = process.env.SMTP_HOST || '127.0.0.1';
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 1025;
const user = process.env.SMTP_USER || '';
const pass = process.env.SMTP_PASS || '';

async function run() {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: user && pass ? { user, pass } : undefined,
  });

  const info = await transporter.sendMail({
    from: 'no-reply@example.com',
    to,
    subject: 'Test email from cat-dog app',
    text: 'This is a test email sent to verify SMTP configuration (MailHog/Mailtrap).',
    html: '<p>This is a test email sent to verify SMTP configuration (MailHog/Mailtrap).</p>',
  });

  console.log('Message sent:', info && info.messageId ? info.messageId : info);
}

run().catch(err => {
  console.error('SMTP test failed:', err);
  process.exit(2);
});
