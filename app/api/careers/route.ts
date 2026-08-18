import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

/* Careers intake. Every application is persisted to a JSON-lines file in the
   same volume as leads, and when RESEND_API_KEY is set it is also emailed. */

const DATA_DIR = process.env.LEADS_DIR || path.join(process.cwd(), "data");

export async function POST(req: Request) {
  let data: {
    name?: string;
    email?: string;
    role?: string;
    link?: string;
    message?: string;
  };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const name = String(data.name || "").slice(0, 200).trim();
  const email = String(data.email || "").slice(0, 200).trim();
  const role = String(data.role || "").slice(0, 100).trim();
  const link = String(data.link || "").slice(0, 400).trim();
  const message = String(data.message || "").slice(0, 5000).trim();
  if (!name || !email || !role || !message) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const entry = { at: new Date().toISOString(), name, email, role, link, message };
  console.log(`[careers] ${entry.at} ${JSON.stringify({ name, email, role })}`);

  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(
      path.join(DATA_DIR, "applications.jsonl"),
      JSON.stringify(entry) + "\n"
    );
  } catch (e) {
    console.error("[careers] persist failed:", e);
  }

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
          subject: `New application: ${role} (${name})`,
          text: `${name} <${email}>\nRole: ${role}\nLink: ${link || "none"}\n\n${message}`,
        }),
      });
      if (!r.ok) {
        console.error("[careers] email failed:", r.status, await r.text());
      }
    } catch (e) {
      console.error("[careers] email error:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
