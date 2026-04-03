import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Route to the right inbox based on subject category
function getRecipient(subject: string): string {
  const lower = subject.toLowerCase();
  if (lower.includes("legal") || lower.includes("privacy") || lower.includes("قانون")) {
    return "legal@yalla-sawa.com";
  }
  if (lower.includes("bug") || lower.includes("خلل")) {
    return "support@yalla-sawa.com";
  }
  if (lower.includes("feature") || lower.includes("ميزة")) {
    return "info@yalla-sawa.com";
  }
  // General / default
  return "info@yalla-sawa.com";
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const recipient = getRecipient(subject);

  try {
    await transporter.sendMail({
      from: `"YallaSawa Contact" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h3 style="color: #ffbf00;">New Contact Message</h3>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Routed to:</strong> ${recipient}</p>
          <hr style="border: none; border-top: 1px solid #333;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
