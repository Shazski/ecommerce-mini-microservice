import express from "express";
const app = express();
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 8080;
import { connectToMongoDB } from "./config/db";
import orderRouter from "./routers/order.router"
import { connecttoRabbitMQ, getRabbitMqChannel } from "./rabbitmq/connect";
import { createUserOrder } from "./controllers/order.controller";
//mongodb connection
connectToMongoDB();
connecttoRabbitMQ().then(() => {
    const channel = getRabbitMqChannel()
    channel.consume("ORDER", async(data:any) => {
        if(data !== null) {
            const {products, userEmail} = JSON.parse(data.content.toString())
            const newOrder =await createUserOrder(products, userEmail)
            channel.ack(data)
            channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify(newOrder)))
        }
    })
})
app.use(express.json());

app.use("order", orderRouter)
app.listen(PORT, () => {
  console.log(`Order service is running on port ${PORT}`);
});
