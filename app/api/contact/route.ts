import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

/* Contact intake. Every submission is persisted to a JSON-lines file (the
   compose file mounts a volume for it), and when RESEND_API_KEY is set the
   message is also emailed to CONTACT_TO. Without a key the file still catches
   every lead, and the page shows the direct address beside the form. */

const DATA_DIR = process.env.LEADS_DIR || path.join(process.cwd(), "data");

export async function POST(req: Request) {
  let data: { name?: string; email?: string; message?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const name = String(data.name || "").slice(0, 200).trim();
  const email = String(data.email || "").slice(0, 200).trim();
  const message = String(data.message || "").slice(0, 5000).trim();
  if (!name || !email || !message) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const entry = { at: new Date().toISOString(), name, email, message };
  console.log(`[contact] ${entry.at} ${JSON.stringify({ name, email })}`);

  /* 1. durable local record, works with zero configuration */
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(
      path.join(DATA_DIR, "leads.jsonl"),
      JSON.stringify(entry) + "\n"
    );
  } catch (e) {
    console.error("[contact] persist failed:", e);
  }

  /* 2. email delivery, active the moment a key is configured */
  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.CONTACT_FROM ||
            "Growblic Website <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO || "hello@growblic.com"],
          reply_to: email,
          subject: `New project enquiry from ${name}`,
          text: `${name} <${email}>\n\n${message}`,
        }),
      });
      if (!r.ok) {
        console.error("[contact] email failed:", r.status, await r.text());
      }
    } catch (e) {
      console.error("[contact] email error:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
