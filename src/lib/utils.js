import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
export const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.ENVIRONMENT !== "development",
    });

    return token;
  } catch (error) {
    console.error("Error generating token", error);
  }
};

export const generateOTP = (length = 6) => {
  const otp = crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, "0");

  return otp;
};

export const sendMail = async (email, otp) => {
  const resend = new Resend(process.env.RESEND_API_KEY); // Resend API key goes here
  const { error } = await resend.emails.send({
    from: "terminallyillgineer@raashah.me",
    to: [email],
    subject: "OTP Verification",
    html: `<strong>OTP : ${otp}</strong>`,
  });

  if (error) throw new Error(error.message);
};
