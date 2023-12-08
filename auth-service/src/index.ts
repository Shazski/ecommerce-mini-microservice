import express from "express";
const app = express();
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 8080;
import { connectToMongoDB } from "./config/db";
import authRouter from './router/auth.router'
//mongodb connection
connectToMongoDB();

app.use(express.json());

app.use('/auth',authRouter)
app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
});
