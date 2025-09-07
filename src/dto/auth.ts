import type { Prisma } from "@prisma/client";
import type { ApiResponse } from "../types/api.js";

export type UserType = Prisma.UserCreateInput;

export type PostSignUpResponseType = ApiResponse<boolean>;

interface PostSignInResponse extends UserType {
  access_token: string;
}
export type PostSignInResponseType = ApiResponse<PostSignInResponse>;

export type PostRefreshTokenType = ApiResponse<{ access_token: string }>;