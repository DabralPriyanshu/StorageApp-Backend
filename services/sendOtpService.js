import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

export async function sendOtpService(email) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Upsert OTP (replace if it already exists)
  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true },
  );

  const html = `
    <div style="font-family:sans-serif;">
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  // Mail options setup
  const mailOptions = {
    from: "File Storing App <priyanshudabral07@gmail.com>",
    to: email,
    subject: "Storage App OTP",
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: `OTP sent successfully on ${email}` };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, message: "Failed to send OTP" };
  }
}
