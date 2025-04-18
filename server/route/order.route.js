import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getAllOrders, getOrderDetailsController, paymentController, setOrderStatus, webhookStripe } from '../controllers/order.controller.js'

import { admin } from '../middleware/Admin.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)


orderRouter.get('/all-order-list',auth,admin, getAllOrders)
orderRouter.put('/set-order-status', auth,admin, setOrderStatus)


export default orderRouter