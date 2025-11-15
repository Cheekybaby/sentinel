import { generateOTP, sendMail } from "../lib/utils.js";
import User from "../models/user.model.js";
import VerifyUser  from "../models/verify.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
export const signup = async (req, res) => {
  let session;
  try {
    let { fullName, email, password } = req.body;
    fullName = fullName.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6 || password == "") {
      return res.status(400).json({
        message: "Password should at least be minimum 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // generate OTP and hash it.
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, salt);
    const otpExpiresAt = new Date(Date.now() + (5 * 60 * 1000));

    // Create the User in VerifyUser.
    session = await mongoose.startSession();
    session.startTransaction();
    
    // clean before creating
    await VerifyUser.findOneAndDelete({ email }).session(session);
    
    const tempUser = new VerifyUser({
      email,
      hashedOTP,
      otpExpiresAt,
      userData: {
        fullName,
        email,
        password: hashedPassword,
        avatar: "",
      },
    });
    await tempUser.save({ session });
    // send email
    await sendMail(email, otp);

    await session.commitTransaction();

    res.status(200).json({
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Error in signup controller", error);
    if (session) await session.abortTransaction();
    res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    if (session) session.endSession();
  }
};

export const signin = async (req, res) => {
  let session;
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    password = password.trim();

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6 || password == "") {
      return res.status(400).json({
        message: "Password should at least be minimum 6 characters",
      });
    }

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Invalid credentials",
        })
    }

    const salt = await bcrypt.genSalt(10);
    // generate OTP and hash it
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, salt);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // create the user in VerifyUser
    session = await mongoose.startSession();
    session.startTransaction();

    // clean before creating
    await VerifyUser.findOneAndDelete({ email }).session(session);

    const tempUser = new VerifyUser({
      email,
      hashedOTP,
      otpExpiresAt,
    });
    await tempUser.save({ session });
    // send email
    await sendMail(email, otp);

    await session.commitTransaction();

    res.status(200).json({
      message: "OTP sent successfully to your email.",
    });
    // email the otp
  } catch (error) {
    console.error("Error in signin controller", error);
    if (session) await session.abortTransaction();
    res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    if (session) session.endSession();
  }
};

export const signout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            message: "Signed out successfully",
        })
    } catch(error) {
        console.error("Error in signout controller", error);
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}
