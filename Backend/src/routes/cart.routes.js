import {Router} from 'express'
import {authenticateUser} from '../middleware/auth.middleware.js'
import { addToCart, getCart, updateCartQuantity } from '../controller/cart.controller.js'
import { validateAddToCart } from '../validator/cart.validator.js'

const  router = Router()

router.post('/add/:productId/:variantId',authenticateUser, validateAddToCart, addToCart)
router.get('/', authenticateUser, getCart)
// update the cart quantity by one
router.patch('/update/:productId/:variantId', authenticateUser, validateAddToCart, updateCartQuantity)



export default router