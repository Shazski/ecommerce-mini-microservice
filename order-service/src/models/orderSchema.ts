import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  products: { product_id: string }[];
  user: string;
  totalPrice: number;
  createdAt: Date;
}

// Define the Order schema
const orderSchema: Schema<IOrder> = new Schema({
  products: [{ product_id: { type: String, required: true } }],
  user: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


const OrderModel = mongoose.model<IOrder>("Order", orderSchema);

export { OrderModel, IOrder };
