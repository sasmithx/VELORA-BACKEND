interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
}

export default User;