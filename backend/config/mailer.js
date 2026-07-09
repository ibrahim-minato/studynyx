const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendResetEmail = async (to, resetUrl) => {
  await transporter.sendMail({
    from: `"StudyNyx" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reset your StudyNyx password",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#060A14;color:#EDF0FF;border-radius:16px;padding:36px;border:1px solid #1A2235;">
        <div style="margin-bottom:28px;">
          <span style="font-size:20px;font-weight:700;color:#EDF0FF;">📚 StudyNyx</span>
        </div>
        <h2 style="font-size:22px;font-weight:700;margin-bottom:10px;color:#EDF0FF;">Reset your password</h2>
        <p style="color:#5E7094;font-size:14px;line-height:1.65;margin-bottom:24px;">
          We received a request to reset your password. Click the button below to create a new one. This link expires in <strong style="color:#A78BFA;">1 hour</strong>.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6D28D9,#7C3AED);color:white;text-decoration:none;padding:13px 28px;border-radius:11px;font-weight:600;font-size:14px;margin-bottom:24px;">
          Reset Password →
        </a>
        <p style="color:#374469;font-size:12px;margin-top:24px;border-top:1px solid #1A2235;padding-top:16px;">
          If you didn't request this, you can safely ignore this email. This link expires in 1 hour.
        </p>
      </div>
    `,
  });
};

module.exports = { sendResetEmail };
