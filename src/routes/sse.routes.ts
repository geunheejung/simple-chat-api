import { Router } from "express";
import { ROUTES } from "../constants/routes.js";
import { handleNotifications, handleSSEConnect } from "../controllers/sse.controller.js";

const router = Router();

router.get(ROUTES.SSE.CONNECT, handleSSEConnect);
router.get(ROUTES.SSE.NOTIFICATIONS, handleNotifications);

export default router;