import { Request, Response } from "express";
import { getRabbitMqChannel } from "../rabbitmq/connect";
import { Message } from "amqplib";
import Product from "../models/productModel";
interface CustomRequest extends Request {
  user?: any;
}
let order: any;
export const createProduct = async (req: Request, res: Response) => {
  console.log(req.body, "my body data");
  const { name, description, price } = req.body;
  const newProduct = await Product.create({ name, description, price });
  res.status(201).json(newProduct);
};

export const buyProducts = async (req: CustomRequest, res: Response) => {
  const channel = getRabbitMqChannel();
  const { ids } = req.body;
  const products = await Product.find({ _id: { $in: ids } });
  const msg = {
    products,
    userEmail: req.user.email,
  };
  channel.sendToQueue("ORDER", Buffer.from(JSON.stringify(msg)));
  console.log(msg,"my orderss amqp");
  await channel.consume("PRODUCT", (data: any) => {
    order = JSON.parse(data.content.toString());
    channel.ack(data)
});
res.json(order);
};

export const getAllProductDetails = async (productDetails:{product_id:string, _id:string}[]) => {
    const productIds = productDetails.map(detail => detail.product_id);
    const orders = await Product.find({ _id: { $in: productIds } });
    return orders
}
