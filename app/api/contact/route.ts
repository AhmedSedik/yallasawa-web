const RESEND_API_KEY = process.env.RESEND_API_KEY;

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
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set");
    return Response.json({ error: "Email service not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const recipient = getRecipient(subject);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "YallaSawa Contact <info@yalla-sawa.com>",
        to: [recipient],
        reply_to: email,
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
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", res.status, err);
      return Response.json({ error: "Failed to send message" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
