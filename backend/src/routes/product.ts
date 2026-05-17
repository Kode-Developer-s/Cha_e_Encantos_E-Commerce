import { Router } from 'express'
import { getAllProducts, getProductById, createProduct } from '../controllers/product'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', authMiddleware, createProduct)

export default router
