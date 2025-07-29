import { User } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import {BlacklistedToken} from "../models/blacklistedToken.js";
dotenv.config();


export const register = async (req, res) => {
    try{
        const { email, password } = req.body;
        const emailExists = await User.exists({ email: email });
        if (emailExists) {
            return res.status(400).send("Email is already exists");
        }
        const user = new User({email, password})
        const result = await user.save();
        res.send(result);
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
