import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { ErrorCode, FailResponse, SuccessResponse, type ApiResponse } from "../types/api.js";
import { createUser, findUserByEmail } from "../repositories/user.repo.js";
import type { SignInBody, SignUpBody } from "../schemas/auth.schema.js";
import type { PostRefreshTokenType, PostSignInResponseType, PostSignUpResponseType } from "../dto/auth.js";
import { getAT, getRT } from "../lib/jwt.js";
import { RT_KEY, setRefreshToken } from "../lib/cookie.js";
import jwt from 'jsonwebtoken';

export const postSignUp = async (
  req: Request<{}, PostSignUpResponseType, SignUpBody>,
  res: Response<PostSignUpResponseType>,
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

export const postSignIn = async (
  req: Request<{}, PostSignInResponseType, SignInBody>,
  res: Response<PostSignInResponseType>,
  next: NextFunction
) => {
  // 1. 계정이 존재하는지 체크
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail({ email });
    
    if (!user) {      
      return res.status(400).json(new FailResponse(ErrorCode.NO_ACCOUNT));
    }      

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json(new FailResponse(ErrorCode.NO_ACCOUNT));
    }

    const at = getAT(user.id.toString());
    const rt = getRT(user.id.toString());

    setRefreshToken(res, rt);
    
    return res.status(200).json(new SuccessResponse({
      ...user,
      access_token: at,
    }));
  } catch (err) {
    next(err);
  }
};

export const postRefreshToken = async (req: Request, res: Response<PostRefreshTokenType>) => {
  try {
    const rt = req.cookies[RT_KEY];

    if (!rt) return res.status(401).json(new FailResponse(ErrorCode.UNAUTHORIZED))

    const payload = jwt.verify(rt, RT_KEY) as { sub: string };

    const newAt = getAT(payload.sub);

    return res.status(200).json(new SuccessResponse({ access_token: newAt }));    
  } catch (err) {
    return res.status(401).json(new FailResponse(ErrorCode.UNAUTHORIZED));
  }
}