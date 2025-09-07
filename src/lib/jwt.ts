import jwt from 'jsonwebtoken';
const AT_SECRET = process.env.AT_SECRET || "access-secret";
const RT_SECRET = process.env.RT_SECRET || "refresh-secret";

export const getAT = (userId: string) => jwt.sign({ sub: userId }, AT_SECRET, { expiresIn: '15h' });

export const getRT = (userId: string) => jwt.sign({ sub: userId }, RT_SECRET, { expiresIn: "1h" });

export function verifyAccessToken(token: string) {
  return jwt.verify(token, AT_SECRET) as { sub: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, RT_SECRET) as { sub: string; sid: string };
}