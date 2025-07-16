import express from "express";
import userRoutes from "./routes/user.routes";
import cors from "cors";
import authenticateToken from "./middlewares/auth.middleware";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use('/api/v1/auth', userRoutes);
app.use(authenticateToken);

app.listen(5000, (err) => {
    console.log('Server is running on port 5000');
});