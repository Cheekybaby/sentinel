import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            default: "",
        },
        email : {
            type: String,
            required: true,
            unique: true,
        },
        password : {
            type: String,
            required: true,
            minLength: 6,
        },
        avatar : {
            type: String,
            default: "",
        },
        isVerfied : {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);

const User = new mongoose.model('User', userSchema);

export default User;