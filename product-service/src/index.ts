import express from "express";
const app = express();
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 8080;
import { connectToMongoDB } from "./config/db";
import productRouter from "./routers/product.router";
import { connecttoRabbitMQ, getRabbitMqChannel } from "./rabbitmq/connect";
import { getAllProductDetails } from "./controllers/product.controller";
//mongodb connection
connectToMongoDB();
connecttoRabbitMQ().then(() => {
    const channel = getRabbitMqChannel()
    channel.consume("ALLPRODUCTS", async (data:any) => {
        if(data !== null) {
            const orderDetails = JSON.parse(data.content.toString())
            const productDetails = await getAllProductDetails(orderDetails.products)
            channel.ack(data)
            channel.sendToQueue("ALLDETAILS", Buffer.from(JSON.stringify(productDetails)))
        }
    })
})
//middleware
app.use(express.json());

app.use("/product", productRouter);
app.listen(PORT, () => {
  console.log(`Product service is running on port ${PORT}`);
});
