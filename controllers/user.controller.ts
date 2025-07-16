import { UserService } from "../services/user.service";
import { Request, Response } from 'express';
import User from "../models/user.model";

const userService = new UserService();

export const register = async (req: Request, res:Response) => {
    const user: User = req.body;
    console.log(user);
    try {
        await userService.register(user);
        res.status(201).json('User registered successfully');
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json(error.message);
        } else {
            res.status(400).json('Unexpected error occurred');
        }
    }
};

export const login = async (req: Request, res:Response) => {
    const { email, password } = req.body;
    try {
        console.log(email, password);
        const tokens = await userService.login(email, password);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(400).json('Login failed');
    }
};

export const refreshToken = async (req: Request, res:Response) => {
    const authHeader = req.headers.authorization;
    try {
        const token = await userService.refreshToken(authHeader);
        res.status(200).json(token);
    } catch (err) {
        res.status(400).send("error refreshing token");
    }
};

export const findUserByEmail = async (req: Request, res:Response) => {
    const email = req.body.email;
    try {
        const user = await userService.findUserByEmail(email);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json('User not found');
    }
};