import { Router } from 'express';
import {register, login, logout, forgetPassword, resetPassword} from "../controller/authController.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";
import {loginSchema, registerSchema} from "../validators/auth.js";
import {extractFromToken} from "../middleware/auth.js";
import {errorHandler} from "../middleware/errorhandlerMiddleware.js";

const router = Router();

router.post("/login",errorHandler(validationMiddleware(loginSchema)) ,errorHandler(login));
router.post("/register", errorHandler(validationMiddleware(registerSchema)),errorHandler(register));
router.post("/logout", errorHandler(extractFromToken), errorHandler(logout));
router.post("/forget-password", errorHandler(forgetPassword))
router.post("/reset-password", errorHandler(resetPassword))

export default router;