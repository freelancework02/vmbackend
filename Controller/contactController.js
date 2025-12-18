// controllers/contactController.js
const nodemailer = require("nodemailer");

// Simple HTML escaping to avoid broken markup / XSS
const escapeHtml = (unsafe = "") => {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sendContactForm = async (req, res) => {
  try {
    const { name, email, phone, msg, toEmail } = req.body;

    // Basic validation
    if (!name || !email || !msg) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Escape unsafe input
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "");
    const safeMsg = escapeHtml(msg);
    const msgHtml = safeMsg.replace(/\n/g, "<br>");

    // TEXT fallback
    const textBody = `
New enquiry from VMFinancialSolutions.com

Name:  ${safeName}
Email: ${safeEmail}
Phone: ${safePhone || "Not provided"}

Message:
${msg}
`.trim();

    // 🎨 VM Financial Solutions – Brand Theme
    // Primary Blue: #0a2540
    // Accent Gold: #c9a24d
    // Light Background: #f4f6f8

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>New Enquiry - VM Financial Solutions</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @media (max-width: 600px) {
    .vm-container { width: 100% !important; border-radius: 0 !important; }
    .vm-inner { padding: 18px !important; }
    .vm-header, .vm-footer { padding-left: 18px !important; padding-right: 18px !important; }
    .vm-btn { width: 100% !important; text-align: center !important; }
  }
</style>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
  <tr>
    <td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" class="vm-container"
        style="max-width:650px;background:#ffffff;border-radius:16px;overflow:hidden;
        box-shadow:0 12px 30px rgba(0,0,0,0.15);">

        <!-- HEADER -->
        <tr>
          <td class="vm-header"
            style="background:#0a2540;padding:26px 32px;color:#ffffff;">
            <div style="font-size:24px;font-weight:700;letter-spacing:0.03em;">
              VM Financial Solutions
            </div>
            <div style="font-size:13px;margin-top:4px;color:#d1d5db;">
              Wealth • Insurance • Financial Planning
            </div>
          </td>
        </tr>

        <!-- SUB HEADER -->
        <tr>
          <td style="background:#f9fafb;padding:14px 32px;
          border-bottom:1px solid #e5e7eb;color:#0a2540;font-size:14px;">
            <strong style="color:#c9a24d;">New website enquiry received</strong><br>
            <a href="https://vmfinancialsolutions.com"
               style="color:#0a2540;text-decoration:none;font-weight:600;">
              vmfinancialsolutions.com
            </a>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="vm-inner" style="padding:28px 32px;">

            <!-- DETAILS CARD -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f9fafb;border-radius:14px;
              border:1px solid #e5e7eb;margin-bottom:20px;">

              <tr>
                <td style="padding:18px;border-bottom:1px solid #e5e7eb;">
                  <div style="font-size:11px;text-transform:uppercase;
                  letter-spacing:0.12em;color:#6b7280;">Name</div>
                  <div style="font-size:17px;font-weight:600;color:#0a2540;">
                    ${safeName}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:18px;border-bottom:1px solid #e5e7eb;">
                  <div style="font-size:11px;text-transform:uppercase;
                  letter-spacing:0.12em;color:#6b7280;">Email</div>
                  <a href="mailto:${safeEmail}"
                     style="font-size:16px;color:#0a2540;text-decoration:none;">
                    ${safeEmail}
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding:18px;border-bottom:1px solid #e5e7eb;">
                  <div style="font-size:11px;text-transform:uppercase;
                  letter-spacing:0.12em;color:#6b7280;">Phone</div>
                  <a href="tel:${safePhone}"
                     style="font-size:16px;color:#0a2540;text-decoration:none;">
                    ${safePhone || "Not provided"}
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding:18px;">
                  <div style="font-size:11px;text-transform:uppercase;
                  letter-spacing:0.12em;color:#6b7280;">Message</div>
                  <div style="font-size:15px;line-height:1.6;color:#0a2540;">
                    ${msgHtml}
                  </div>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <a href="mailto:${safeEmail}" class="vm-btn"
              style="display:inline-block;padding:12px 28px;border-radius:40px;
              background:#c9a24d;color:#0a2540;font-weight:700;
              text-decoration:none;font-size:15px;">
              Reply to ${safeName}
            </a>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td class="vm-footer"
            style="background:#f9fafb;padding:16px 32px;
            border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
            This enquiry was submitted via
            <a href="https://vmfinancialsolutions.com"
               style="color:#0a2540;font-weight:600;text-decoration:none;">
              VM Financial Solutions
            </a>
            <br>
            © ${new Date().getFullYear()} VM Financial Solutions. All rights reserved.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
`.trim();

    const mailOptions = {
      from: `"VM Financial Solutions" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: toEmail || process.env.CONTACT_TO_EMAIL,
      subject: `New enquiry from ${safeName}`,
      text: textBody,
      html: htmlBody,
      headers: {
        "X-Mailer": "VMFinancialSolutions-ContactForm",
      },
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact form email error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again.",
    });
  }
};

module.exports = { sendContactForm };
