import express from "express";
const app = express();
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 8080;
import { connectToMongoDB } from "./config/db";
import productRouter from "./routers/product.router";
import {connecttoRabbitMQ} from "./rabbitmq/connect"
//mongodb connection
connectToMongoDB();
connecttoRabbitMQ()
//middleware
app.use(express.json());

app.use("/product", productRouter);
app.listen(PORT, () => {
  console.log(`Product service is running on port ${PORT}`);
});
