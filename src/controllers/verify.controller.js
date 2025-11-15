import { generateToken } from "../lib/utils.js";
import VerifyUser from "../models/verify.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const verifySignin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "Please Enter the OTP",
      });
    }

    const tempuser = await VerifyUser.findOne({ email });

    if (!tempuser) {
      return res.status(400).json({
        message: "Please enter the OTP",
      });
    }

    // compare the incoming otp
    const currTime = new Date();
    const isOTPCorrect = await bcrypt.compare(otp, tempuser.hashedOTP);
    let isOTPValid = false;

    if (currTime < tempuser.otpExpiresAt && isOTPCorrect) {
      isOTPValid = true;
    }

    if (!isOTPValid) {
      return res.status(400).json({
        message: "OTP Invalid",
      });
    }

    // generate token and send it to the user.
    const user = await User.findOne({ email });
    generateToken(user._id, res);
    // delete the current record from the VerifyUser collection.
    await VerifyUser.findOneAndDelete({ email });

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      userName: user.userName,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error in verifySignIn controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const verifySignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "Please Enter the OTP",
      });
    }

    const tempuser = await VerifyUser.findOne({ email });

    if (!tempuser) {
      return res.status(400).json({
        message: "Please enter the OTP",
      });
    }

    const currTime = new Date();
    const isOTPCorrect = await bcrypt.compare(otp, tempuser.hashedOTP);
    let isOTPValid = false;

    if (currTime < tempuser.otpExpiresAt && isOTPCorrect) {
      isOTPValid = true;
    }

    if (!isOTPValid) {
      return res.status(400).json({
        message: "OTP Invalid",
      });
    }

    // now create the user in User db
    const userdata = tempuser.userData;
    const newUser = new User({
      ...userdata,
      verifiedUser: true,
    });
    await newUser.save();
    // generate token
    generateToken(newUser._id, res);
    // delete the entry from verified user
    await VerifyUser.findOneAndDelete({ email });

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      userName: newUser.userName,
      avatar: newUser.avatar,
    });
  } catch (error) {
    console.error("Error in verifySignup controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
