import type { Request, Response, NextFunction } from "express";
import { SuccessResponse, FailResponse, ErrorCode } from "../types/api.js";
import { upsertFcmToken, deleteFcmToken, findTokensByUserId } from "../repositories/fcmToken.repo.js";
import type { PostSaveFcmTokenBody, PostSaveFcmTokenResponse } from "../dto/fcmToken.js";

// POST /fcm/tokens
export const postSaveFcmToken = async (
  req: Request<{}, PostSaveFcmTokenResponse, PostSaveFcmTokenBody>,
  res: Response<PostSaveFcmTokenResponse>,
  next: NextFunction
) => {
  try {
    const { token, platform, ua } = req.body;
    const userId = req.user?.id; // ← 로그인 미들웨어에서 세팅된다고 가정

    if (!token) {
      return res.status(400);
    }

    await upsertFcmToken({ token, userId, platform: platform || 'web', ua: ua || 'chrome' });
    return res.status(201);
  } catch (err) {
    next(err);
  }
};

// DELETE /fcm/tokens
export const deleteFcmTokenByToken = async (
  req: Request<{}, any, { token: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json(new FailResponse(ErrorCode.BAD_REQUEST));
    }

    await deleteFcmToken(token);
    return res.status(200).json(new SuccessResponse(true));
  } catch (err) {
    next(err);
  }
};

// GET /fcm/tokens
export const getUserFcmTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json(new FailResponse(ErrorCode.UNAUTHORIZED));
    }

    const tokens = await findTokensByUserId(userId);
    return res.status(200).json(new SuccessResponse(tokens));
  } catch (err) {
    next(err);
  }
};