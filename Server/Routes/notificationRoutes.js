import { Router } from "express";
import { auth } from "../middleware/middleware.js";
import { getNotifiactions, readNotifications } from "../Controllers/notifications.js";
const router = Router();

router.get("/", auth, getNotifiactions);
router.put("/:id", auth, readNotifications);

export default router;