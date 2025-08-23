export enum ErrorCode {
  SERVER_ERROR = 'SERVER_ERROR',  
  NOT_FOUND = 'NOT_FOUND',
  // 이메일의 양식이 유효하지 않은 경우
  INVALID_EMAIL = 'INVALID_EMAIL',
  // 이름의 양식이 유효하지 않은 경우
  INVALID_NAME = 'INVALID_NAME',
  // 이미 계정이 존재하는 경우
  ACCOUNT_EXISTS = 'ACCOUNT_EXISTS',
}

export abstract class ApiResponse<T> {
  constructor(
    public readonly ok: boolean,
    public readonly data: T | null,
    public readonly error_code: ErrorCode | null,   
  ) {}
}

export class SuccessResponse<T> extends ApiResponse<T> {
  constructor(data: T) {
    super(true, data, null);
  }
}

export class FailResponse<T = null> extends ApiResponse<T> {
  constructor(errorCode: ErrorCode, data: T | null = null) {
    super(false, data, errorCode)
  }
}