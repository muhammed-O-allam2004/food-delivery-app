import express from 'express';
import authMiddleware from '../middleware/auth.js';
// ✅ 1. تم إضافة getDashboardStats في الاستدعاء
import { listOrders, placeOrder,updateStatus,userOrders, verifyOrder, placeOrderCod, getDashboardStats } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list",listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",updateStatus);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/placecod",authMiddleware,placeOrderCod);

// ✅ 2. الراوت الجديد للإحصائيات
orderRouter.get("/dashboard", getDashboardStats);

export default orderRouter;