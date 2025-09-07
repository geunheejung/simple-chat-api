import type { Response } from "express";

export const RT_KEY = '__Secure-refresh-token';
export function setRefreshToken(res: Response, token: string) {
  res.cookie(RT_KEY, token, {
    // document.cookie로 접근 불가, 서버에서만 읽고 쓸 수 있음.
    httpOnly: true,
    // HTTPS 연결에서만 전송.
    secure: false,        
    sameSite: 'lax',
    domain: ".localhost",
    path: "/"
  })
}