import { Router } from 'express';
import { register, login, googleAuth, isAuth, getUser, followUser, editUser, changePassword } from '../Controllers/authController.js';
import { auth } from '../middleware/middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post("/google-auth", googleAuth);
router.put("/", auth, editUser);
router.put("/change-password", auth, changePassword)
router.put("/follow/:id", auth, followUser);
router.get("/check-auth", auth, isAuth);
router.get("/get-user/:id", getUser);

export default router;
