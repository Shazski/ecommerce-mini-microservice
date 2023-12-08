import { Router } from "express"
import Product from "../models/productModel"
import { isAuthenticated } from "../authentication"
import { createProduct, buyProducts  } from "../controllers/product.controller"

const router:Router = Router()

router.post('/create',isAuthenticated,createProduct)
router.post('/buy', isAuthenticated, buyProducts)

export default router