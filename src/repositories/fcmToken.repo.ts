import { prisma } from "../lib/prisma.js";

export const upsertFcmToken = async (args: {
  token: string;
  userId: number;
  platform: string;
  ua: string;
}) => {
  return prisma.fcmToken.upsert({
    where: { token: args.token },
    update: {
      userId: args.userId,
      platform: args.platform,
      ua: args.ua,
      lastSeenAt: new Date(),
    },
    create: {
      token: args.token,
      userId: args.userId,
      platform: args.platform,
      ua: args.ua,
    },
  });
};

export const deleteFcmToken = async (token: string) => {
  return prisma.fcmToken.delete({ where: { token } });
};

export const findTokensByUserId = async (userId: number) => {
  return prisma.fcmToken.findMany({ where: { userId } });
};