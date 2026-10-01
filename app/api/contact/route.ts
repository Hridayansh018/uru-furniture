import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, subject } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    // --- Nodemailer transporter setup ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const fromAddress = `"URU Furniture" <${process.env.SMTP_USER}>`;

    // --- 1. Customer confirmation email ---
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Thank you for reaching out to URU Furniture",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Thank you — URU Furniture</title>
          <style>
            body { margin: 0; padding: 0; background: #f5f3ef; font-family: Georgia, serif; }
            .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
            .header { background: #1c1917; padding: 40px 40px 32px; text-align: center; }
            .logo { font-size: 36px; letter-spacing: 0.22em; color: #f5f3ef; font-weight: 400; }
            .tagline { font-size: 11px; color: #a8a29e; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 6px; font-family: 'Helvetica Neue', sans-serif; }
            .body { padding: 40px 40px 32px; }
            .greeting { font-size: 22px; color: #1c1917; margin-bottom: 16px; font-weight: 400; }
            .text { font-size: 15px; color: #57534e; line-height: 1.75; margin-bottom: 16px; font-family: 'Helvetica Neue', Helvetica, sans-serif; }
            .highlight { background: #f5f3ef; border-left: 3px solid #d4a96b; padding: 16px 20px; border-radius: 8px; margin: 24px 0; font-family: 'Helvetica Neue', sans-serif; font-size: 14px; color: #44403c; }
            .cta { display: inline-block; padding: 14px 32px; background: #1c1917; color: #ffffff; text-decoration: none; border-radius: 50px; font-family: 'Helvetica Neue', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 8px; }
            .footer { background: #f5f3ef; padding: 24px 40px; text-align: center; border-top: 1px solid #e7e5e4; }
            .footer p { font-size: 11px; color: #a8a29e; line-height: 1.6; font-family: 'Helvetica Neue', sans-serif; margin: 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <div class="logo">URU</div>
              <div class="tagline">Designer Sofas &amp; Custom Living · Bangalore</div>
            </div>
            <div class="body">
              <div class="greeting">Thank you, ${name}.</div>
              <p class="text">We appreciate you reaching out to URU Furniture. Your message has been received and a member of our design team will be in touch with you shortly.</p>
              <div class="highlight">
                <strong>Your enquiry has been noted:</strong><br/>
                ${subject ? `<em>${subject}</em><br/>` : ""}
                <em>${message.slice(0, 180)}${message.length > 180 ? "..." : ""}</em>
              </div>
              <p class="text">We typically respond within <strong>1–2 business hours</strong> during studio hours (Tue–Sun, 10:30 AM – 8:00 PM IST). For urgent inquiries, feel free to reach us directly on WhatsApp.</p>
              <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent("Hi URU Furniture, I just submitted a contact form and wanted to follow up.")}" class="cta">WhatsApp Us Directly</a>
            </div>
            <div class="footer">
              <p>URU Furniture Experience Studio · Plot 42, 100 Feet Road, Indiranagar, Bangalore 560038<br/>
              © ${new Date().getFullYear()} URU Furniture. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // --- 2. Admin lead alert email ---
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `🛋️ New Lead: ${name} — URU Furniture Contact Form`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            body { margin: 0; padding: 0; background: #f5f3ef; font-family: 'Helvetica Neue', Helvetica, sans-serif; }
            .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4; }
            .header { background: #1b4332; padding: 28px 32px; }
            .header h1 { margin: 0; font-size: 18px; color: #fff; font-weight: 600; }
            .header p { margin: 4px 0 0; font-size: 12px; color: #6ee7b7; }
            .body { padding: 28px 32px; }
            .row { display: flex; margin-bottom: 16px; border-bottom: 1px solid #f5f3ef; padding-bottom: 16px; }
            .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #78716c; font-weight: 600; width: 120px; flex-shrink: 0; padding-top: 2px; }
            .value { font-size: 14px; color: #1c1917; line-height: 1.5; }
            .message-box { background: #f5f3ef; border-radius: 8px; padding: 16px; font-size: 14px; color: #44403c; line-height: 1.7; white-space: pre-wrap; }
            .action-btn { display: inline-block; margin-top: 20px; padding: 12px 28px; background: #1b4332; color: #fff; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; }
            .footer { background: #f5f3ef; padding: 16px 32px; font-size: 11px; color: #a8a29e; border-top: 1px solid #e7e5e4; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>🛋️ New Lead from URU Furniture</h1>
              <p>Submitted on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })} IST</p>
            </div>
            <div class="body">
              <div class="row">
                <div class="label">Name</div>
                <div class="value"><strong>${name}</strong></div>
              </div>
              <div class="row">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color:#1b4332;">${email}</a></div>
              </div>
              ${phone ? `<div class="row"><div class="label">Phone</div><div class="value"><a href="tel:${phone}" style="color:#1b4332;">${phone}</a></div></div>` : ""}
              ${subject ? `<div class="row"><div class="label">Subject</div><div class="value">${subject}</div></div>` : ""}
              <div style="margin-top: 8px;">
                <div class="label" style="margin-bottom:8px;">Message</div>
                <div class="message-box">${message}</div>
              </div>
              <a href="https://wa.me/${phone ? phone.replace(/\D/g, "") : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent(`Hi ${name}, thank you for reaching out to URU Furniture! We've received your inquiry and would love to assist you. Could we schedule a quick call or visit?`)}" class="action-btn">💬 Reply via WhatsApp</a>
              <a href="mailto:${email}?subject=Re: Your URU Furniture Inquiry&body=Hi ${name},%0A%0AThank you for reaching out to URU Furniture!%0A%0A" style="display:inline-block; margin-top:20px; margin-left: 12px; padding:12px 28px; background:#292524; color:#fff; border-radius:50px; text-decoration:none; font-size:13px; font-weight:600;">✉️ Reply via Email</a>
            </div>
            <div class="footer">This alert was auto-generated from the URU Furniture contact form. Do not reply to this email directly.</div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (err) {
    console.error("[Contact API Error]", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to send email", details: errorMessage },
      { status: 500 }
    );
  }
}
