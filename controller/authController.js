import { User } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import {BlacklistedToken} from "../models/blacklistedToken.js";
import nodemailer from "nodemailer";
import {Otp} from "../models/otp.js";

dotenv.config();


export const register = async (req, res) => {
    try{
        const { email, password } = req.body;
        const emailExists = await User.exists({ email: email });
        if (emailExists) {
            return res.status(400).send("Email is already exists");
        }
        const user = new User({email, password})
        await user.save();
        res.status(201).json({message: "User registered successfully"});
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
    
}

export const login = async (req, res) =>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
        );

        res.status(200).json({
            token : "Bearer " + token,
        });
    }catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

export const logout = async (req, res) => {
    const token = req.token;
    if (!token) return res.status(400).json({ message: 'No token provided' });

    try {
        const expiryDate = new Date(Date.now() + 5 * 60 * 1000);
        const blacklistedTokenExists = await BlacklistedToken({ token, expiresAt: expiryDate });
        await blacklistedTokenExists.save();
        res.status(200).json({ message: 'Logout successful.' });
    } catch (err) {
        res.status(500).json({ message: 'Logout failed', error: err.message });
    }
};

export const forgetPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        //creating otp
        const otp = (Math.floor(Math.random() * 1000) + 1000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        const otpModel = await Otp.findOneAndUpdate(
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
            return res.status(500).json({message: 'Error sending email'});
        }
        res.status(200).json({message: 'OTP sent to your email'});
    }catch (e) {
        res.status(500).send("Internal Server Error");
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {password, otp, email} = req.body;

        if(!password || !otp || !email){
            return res.status(400).json({ message: 'password, otp and email are required' });
        }

        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const otpRecord = await Otp.findOne({ user: user._id });
        const isOtpValid = await bcrypt.compare(otp.toString(), otpRecord.otp);
        if(isOtpValid)
        {
            user.password = password;
            await user.save();
            await otpRecord.deleteOne();
            return res.status(200).json({message: 'password reset successfully'});
        }else{
            res.status(400).json({message: 'Invalid OTP'});
        }
    }catch (e) {
        res.status(500).send("Internal Server Error");
    }
}