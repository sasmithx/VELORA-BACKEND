import { PrismaClient } from "../generated/prisma";
import User from "../models/user.model";

const prisma = new PrismaClient();

export class UserRepository {
    async createUser(user: User) {
        const existingUsername = await prisma.user.findUnique({
            where: {
                username: user.username
            }
        });
        if (existingUsername) {
            throw new Error('A user with this username already exists');
        }

        const existingEmail = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });
        if (existingEmail) {
            throw new Error('A user with this email already exists');
        }

        return prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
            },
        });
    }

    async findUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }
}