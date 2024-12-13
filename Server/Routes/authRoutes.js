import { Router } from 'express';
import  {register, login, googleAuth, isAuth}  from '../Controllers/authController.js';
import { auth } from '../middleware/middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post("/google-auth", googleAuth);
router.get("/check-auth", auth, isAuth);

export default router;
