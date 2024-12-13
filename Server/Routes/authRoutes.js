import { Router } from 'express';
import  {register, login, googleAuth, isAuth, getUser}  from '../Controllers/authController.js';
import { auth } from '../middleware/middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post("/google-auth", googleAuth);
router.get("/check-auth", auth, isAuth);
router.get("/get-user/:id", getUser);

export default router;
