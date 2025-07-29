import {extractFromToken} from "../middleware/auth.js";
import {multerMiddleware} from "../middleware/multerMiddleware.js";
import {updateProfilePicture} from "../controller/userController.js";
import {Router} from "express";

const router = Router();

router.patch("/upload-profile-pic", extractFromToken, multerMiddleware({filePath:"profilePic"}).single("image"), updateProfilePicture);

export default router;