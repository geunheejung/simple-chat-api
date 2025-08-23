import { Router } from "express";
import { validateBody } from "../middlewares/validate.js";
import { signUpSchema } from "../schemas/auth.schema.js";
import { postSignUp } from "../controllers/auth.controller.js";
import { ROUTES } from "../constants/routes.js";

const router = Router();

router.post(ROUTES.AUTH.SIGNUP, validateBody(signUpSchema), postSignUp);

export default router;