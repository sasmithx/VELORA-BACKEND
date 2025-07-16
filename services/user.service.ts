import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";
import {UserRepository} from "../repositories/user.repository";
import User from "../models/user.model";

const {SECRET_KEY, REFRESH_TOKEN} = process.env;

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(user: User) {
        user.password = await bcrypt.hash(user.password, 10);
        return await this.userRepository.createUser(user);
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials or unverified email");
        }

        const token = jwt.sign({username: user.email}, SECRET_KEY as Secret, {expiresIn: "1m"});
        const refreshToken = jwt.sign({username: user.email}, REFRESH_TOKEN as Secret, {expiresIn: "7d"});

        return {accessToken: token, refreshToken: refreshToken, user: {...user, password: undefined}};
    }

    async refreshToken(authHeader: string | undefined) {
        const refresh_token = authHeader?.split(' ')[1];

        if (!refresh_token) throw new Error("No token provided");

        const payload = jwt.verify(refresh_token as string, REFRESH_TOKEN as Secret) as {username: string, iat: number};
        const token = jwt.sign({username: payload.username}, SECRET_KEY as Secret, {expiresIn: "1m"});
        return {accessToken: token};
    }

    async findUserByEmail(email: string | undefined) {
        if (!email) throw new Error("No email provided");
        const user = await this.userRepository.findUserByEmail(email);
        return {...user, password: undefined};
    }
}