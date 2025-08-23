import type { RequestHandler, Request, Response, NextFunction } from 'express';
import { z } from 'zod/v4';

export const validateBody = <S extends z.ZodType>(schema: S): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.safeParseAsync(req.body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
        code: i.code
      }));
      return res.status(400).json({
        ok: false,
        data: null,
        error_code: 'BAD_REQUEST',
        issues,
      })
    }

    req.body = parsed.data;
    next();
  }
}
