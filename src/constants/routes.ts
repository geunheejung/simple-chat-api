// src/constants/routes.ts
export const ROUTES = {
  AUTH: {
    SIGNUP: '/signup',
    SIGNIN: '/signin',
    SIGNOUT: '/signout',
  },  
  SSE: {
    CONNECT: '/sse',
    NOTIFICATIONS: '/notifications',
  }
} as const;