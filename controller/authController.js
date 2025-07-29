import { User } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import {BlacklistedToken} from "../models/blacklistedToken.js";
import nodemailer from "nodemailer";
import {Otp} from "../models/otp.js";
import {ErrorClass} from "../errorClass.js";

dotenv.config();


export const register = async (req, res, next) => {
    const { email, password } = req.body;
    const emailExists = await User.exists({ email: email });
    if (emailExists) {
        return next(new ErrorClass(400, "Email is already exists", "register"));
    }
    const user = new User({email, password})
    await user.save();
    res.status(201).json({message: "User registered successfully"});
}

export const login = async (req, res, next) =>{
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
        return next(new ErrorClass(404, 'Invalid email or password', "login"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new ErrorClass(401, 'Invalid email or password', "login"));
    }

    const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1y' }
    );

    res.status(200).json({
        token : "Bearer " + token,
    });
}

export const logout = async (req, res, next) => {
    const token = req.token;
    if (!token) return next(new ErrorClass(400, "Token is required", "logout"));
    const expiryDate = new Date(Date.now() + 5 * 60 * 1000);
    const blacklistedTokenExists = await BlacklistedToken({ token, expiresAt: expiryDate });
    await blacklistedTokenExists.save();
    res.status(200).json({ message: 'Logout successful.' });
};

export const forgetPassword = async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return next(new ErrorClass(404, 'User not found', "forgetPassword"));
    }

    //creating otp
    const otp = (Math.floor(Math.random() * 1000) + 1000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    await Otp.findOneAndUpdate(
        { user: user._id },
        { otp: hashedOTP, createdAt: Date.now() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    //sending email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        return next(new ErrorClass(500, 'Error sending email', "forgetPassword"));
    }
    res.status(200).json({message: 'OTP sent to your email'});
}

export const resetPassword = async (req, res, next) => {
        const {password, otp, email} = req.body;

        if(!password || !otp || !email){
            return next(new ErrorClass(400, 'password, otp and email are required', "resetPassword"));
        }

        if(password.length < 6){
            return next(new ErrorClass(400, 'Password must be at least 6 characters long', "resetPassword"));
        }
        const user = await User.findOne({email});
        if (!user) {
            return next(new ErrorClass(404, 'User not found', "resetPassword"));
        }
        const otpRecord = await Otp.findOne({ user: user._id });
        const isOtpValid = await bcrypt.compare(otp.toString(), otpRecord.otp);
        if(isOtpValid)
        {
            user.password = password;
            await user.save();
            await otpRecord.deleteOne();
            return res.status(200).json({message: 'password reset successfully'});
        }
        return next(new ErrorClass(400, 'Invalid OTP', "resetPassword"));
}