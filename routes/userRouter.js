import {extractFromToken} from "../middleware/auth.js";
import {multerMiddleware} from "../middleware/multerMiddleware.js";
import {updateProfilePicture} from "../controller/userController.js";
import {Router} from "express";
import {errorHandler} from "../middleware/errorhandlerMiddleware.js";

const router = Router();

router.patch("/upload-profile-pic", errorHandler(extractFromToken), errorHandler(multerMiddleware({filePath:"profilePic"}).single("image")), errorHandler(updateProfilePicture));

export default router;