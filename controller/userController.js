import {User} from "../models/usersModel.js";
import fs from "fs";
import {ErrorClass} from "../errorClass.js";

export const updateProfilePicture =  async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorClass(400, 'No file uploaded', 'updateProfilePicture'));
    }
    const user = await User.findById(req.userId);
    if (!user) {
        return next(new ErrorClass(403, 'User not found', 'updateProfilePicture'));
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
}
