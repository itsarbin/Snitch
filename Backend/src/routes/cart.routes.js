import {Router} from 'express'
import {authenticateUser} from '../middleware/auth.middleware.js'
import { addToCart, getCart, incrementCartQuantity, decrementCartQuantity,removeItemFromCart } from '../controller/cart.controller.js'
import { validateCartItem } from '../validator/cart.validator.js'

const  router = Router()

router.post('/add/:productId/:variantId',authenticateUser, validateCartItem, addToCart)
router.get('/', authenticateUser, getCart)
// increment the cart quantity by one
router.patch('/increment/:productId/:variantId', authenticateUser, validateCartItem, incrementCartQuantity)
// decrement the cart quantity by one
router.patch('/decrement/:productId/:variantId', authenticateUser, validateCartItem, decrementCartQuantity)

//delete item from cart
router.delete('/remove/:productId/:variantId', authenticateUser, validateCartItem, removeItemFromCart)




export default router