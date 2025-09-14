// FCM Token 저장 요청 Body
export type PostSaveFcmTokenBody = {
  token: string;
  platform?: string;
  ua?: string;
};

// FCM Token 저장 응답
export type PostSaveFcmTokenResponse = {
  ok: boolean;
  data?: boolean;
  error?: string;
};

// FCM Token 삭제 요청 Body
export type DeleteFcmTokenBody = {
  token: string;
};

// FCM Token 삭제 응답
export type DeleteFcmTokenResponse = {
  ok: boolean;
  data?: boolean;
  error?: string;
};

// 유저별 토큰 조회 응답
export type GetUserFcmTokensResponse = {
  ok: boolean;
  data?: { token: string; platform?: string; ua?: string; lastSeenAt: string }[];
  error?: string;
};