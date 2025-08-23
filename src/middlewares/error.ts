import { type NextFunction, type Request, type Response } from 'express';
import { ApiResponse, ErrorCode, FailResponse } from '../types/api.js';

export function notFound(_req: Request, res: Response<ApiResponse<null>>) {
  res.status(404).json(new FailResponse(ErrorCode.NOT_FOUND));
}

// 에러 핸들러는 반드시 4-파라미터
export function errorHandler(err: unknown, _req: Request, res: Response<ApiResponse<null>>, _next: NextFunction) {
  console.error(err);
  res.status(500).json(new FailResponse(ErrorCode.SERVER_ERROR));
}