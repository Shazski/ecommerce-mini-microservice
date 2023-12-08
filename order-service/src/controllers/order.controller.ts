import { Request, Response } from "express";
import { OrderModel } from "../models/orderSchema";
import { request } from "http";
import { getRabbitMqChannel } from "../rabbitmq/connect";
export const createUserOrder = async (products: any, userEmail: string) => {
  let total = 0;
  let product_ids: string[] = [];
  for (let t = 0; t < products.length; ++t) {
    product_ids.push(products[t]._id);
    total += products[t].price;
  }
  const newOrder = await OrderModel.create({
    products: product_ids.map((product_id) => ({ product_id })),
    user: userEmail,
    totalPrice: total,
  });
  return newOrder;
};

export const getAllOrders = async (req: Request, res:Response) => {
    let proDetails:any
    const id = req.params.id
    const channel = getRabbitMqChannel()
    console.log("get all order details")
    const orders = await OrderModel.findById(id);
    let newOrder:any = orders?.toObject()
    console.log(newOrder,"my orders")
    channel.sendToQueue("ALLPRODUCTS", Buffer.from(JSON.stringify(orders)))
    channel.assertQueue("ALLDETAILS")
    channel.consume("ALLDETAILS", (data:any) => {
        if(data !== null) {
            proDetails = JSON.parse(data.content.toString())
            if(newOrder) {
                newOrder.products = proDetails
            }
        }
        channel.ack(data)
        res.status(200).json(newOrder);
    })
}
