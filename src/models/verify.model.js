import mongoose from 'mongoose';

const verifyUserSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true,
        },
        hashedOTP : {
            type : String,
        },
        otpExpiresAt : {
            type : Date,
        },
        userData : {
            type : Object,
        }
    },
    {
        timestamps: true
    }
)

const VerifyUser = new mongoose.model("VerifyUser", verifyUserSchema);
export default VerifyUser;