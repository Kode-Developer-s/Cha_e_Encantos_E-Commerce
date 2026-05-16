import { Router } from 'express'
import { getAllActivities, getActivityById, createActivity } from '../controllers/activity'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/', getAllActivities)
router.get('/:id', getActivityById)
router.post('/', authMiddleware, createActivity)

export default router
