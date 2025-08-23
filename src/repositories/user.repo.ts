import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

type FindUserByEmailDTO = Pick<Prisma.UserCreateInput, 'email'>;

export const findUserByEmail = (data: FindUserByEmailDTO) => prisma.user.findUnique({ where: data });

type CreateUserDTO = Omit<Prisma.UserCreateInput, 'createdAt'>;

export const createUser = (data: CreateUserDTO) => {
  return prisma.user.create({ data });
}