import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  

// 🔹 Create test account ONCE
const testAccount = await nodemailer.createTestAccount();

// 🔹 Create transporter ONCE
const transporter = nodemailer.createTransport({
  host: testAccount.smtp.host,
  port: testAccount.smtp.port,
  secure: testAccount.smtp.secure,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

  const info = await transporter.sendMail({
    from: '"MyStore 👋" <no-reply@mystore.com>',
    to,
    subject,
    html,
  });

  console.log("📧 Ethereal Email Sent");
  console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
};
