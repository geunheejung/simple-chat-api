import { z } from 'zod';
import { ErrorCode } from '../types/api.js';

export const BaseUserSchema = z.object({
  email: z.email({ error: ErrorCode.INVALID_EMAIL }),
  name: z.string().min(1, { error: ErrorCode.INVALID_NAME }),
})

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
});


export type SignUpBody = z.infer<typeof signUpSchema>;