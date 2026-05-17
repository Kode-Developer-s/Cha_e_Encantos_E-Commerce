import { Router } from 'express'
import { getAllOrders, getOrderById, createOrder } from '../controllers/order'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/', authMiddleware, getAllOrders)
router.get('/:id', authMiddleware, getOrderById)
router.post('/', authMiddleware, createOrder)

export default router
