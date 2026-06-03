import {Router} from 'express'
import {authenticateUser} from '../middleware/auth.middleware.js'
import { addToCart, getCart } from '../controller/cart.controller.js'

const  router = Router()

router.post('/add',authenticateUser, addToCart)
router.get('/', authenticateUser, getCart)



export default router