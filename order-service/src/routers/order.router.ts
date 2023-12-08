import { Router } from "express"
import { getAllOrders } from "../controllers/order.controller"

const router = Router()

router.get('/getAllOrders/:id', getAllOrders)

export default router