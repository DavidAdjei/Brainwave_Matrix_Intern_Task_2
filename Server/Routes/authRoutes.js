import { Router } from 'express';
import { register, login, googleAuth, isAuth, getUser, followUser, editUser, changePassword, getToken, verifyUser, forgotPassword, resetPassword, updatePreferences } from '../Controllers/authController.js';
import { auth } from '../middleware/middleware.js';

const router = Router();
//get routes
router.get("/forgot-password/:email", forgotPassword);
router.get("/check-auth", auth, isAuth);
router.get("/get-user/:id", getUser);
router.get("/initiate-verification", auth, getToken);

//post routes
router.post('/register', register);
router.post('/login', login);
router.post("/google-auth", googleAuth);

//put routes
router.put("/", auth, editUser);
router.put("/change-password", auth, changePassword)
router.put("/follow/:id", auth, followUser);
router.put("/verify-user/:token", verifyUser);
router.put("/reset-password/:token", resetPassword);
router.put("/preferences", auth, updatePreferences)


export default router;