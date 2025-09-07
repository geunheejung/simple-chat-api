import { Router } from "express";
import { validateBody } from "../middlewares/validate.js";
import { signUpSchema, signInSchema } from "../schemas/auth.schema.js";
import { postSignUp, postSignIn } from "../controllers/auth.controller.js";
import { ROUTES } from "../constants/routes.js";

const router = Router();

router.post(ROUTES.AUTH.SIGNUP, validateBody(signUpSchema), postSignUp);
router.post(ROUTES.AUTH.SIGNIN, validateBody(signInSchema), postSignIn);

export default router;