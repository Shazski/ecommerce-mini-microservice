import { Request, Response } from "express";
import { OrderModel } from "../models/orderSchema";

export const createUserOrder = async (products:any, userEmail:string) => {
    let total = 0
    let product_ids:string[] = []
    for(let t = 0; t < products.length; ++t) {
        product_ids.push(products[t]._id)
        total += products[t].price
    }
  const newOrder =  await OrderModel.create({products:product_ids.map((product_id) => ({ product_id })), user:userEmail, totalPrice:total })
  return newOrder
} 