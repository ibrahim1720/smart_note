import {User} from "../models/usersModel.js";
import fs from "fs";

export const updateProfilePicture =  async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePics) {
            const oldProfilePicPath = user.profilePics;

            if (oldProfilePicPath !== null && fs.existsSync(oldProfilePicPath)) {
                fs.unlinkSync(oldProfilePicPath);
            }

        }

        user.profilePics = req.file.path;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            profilePicture: req.file.path
        });
    } catch (error) {
        next(error);
    }
}
