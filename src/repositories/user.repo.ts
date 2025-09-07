import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export const findUserByEmail = (data: Pick<Prisma.UserCreateInput, 'email'>) => prisma.user.findUnique({ where: data });

export const createUser = (data: Omit<Prisma.UserCreateInput, 'createdAt'>) => {
  return prisma.user.create({ data });
}