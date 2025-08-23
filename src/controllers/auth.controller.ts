import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { ErrorCode, FailResponse, SuccessResponse, type ApiResponse } from "../types/api.js";
import type { SignUpBody } from "../schemas/auth.schema.js";
import { createUser, findUserByEmail } from "../repositories/user.repo.js";

export const postSignUp = async (
  req: Request<{}, ApiResponse<boolean>, SignUpBody>,
  res: Response<ApiResponse<boolean>>,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const user = await findUserByEmail({ email });
    
    if (user) {      
      return res.status(400).json(new FailResponse(ErrorCode.ACCOUNT_EXISTS));
    }

    const hash = await bcrypt.hash(password, 10);
    
    await createUser({ email, name, password: hash, })
      
    return res.status(201).json(new SuccessResponse(true));
  } catch (err) {
    next(err);
  }
};