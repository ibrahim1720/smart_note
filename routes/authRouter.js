import { Router } from 'express';
import {register, login, logout} from "../controller/authController.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";
import {loginSchema, registerSchema} from "../validators/auth.js";
import {extractFromToken} from "../middleware/auth.js";

const router = Router();

router.post("/login", validationMiddleware(loginSchema),login);
router.post("/register", validationMiddleware(registerSchema),register);
router.post("/logout", extractFromToken, logout);

export default router;