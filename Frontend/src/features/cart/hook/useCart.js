import {addToCart, getCart, incrementCartQuantity, decrementCartQuantity, removeItemFromCart, createRazorpayOrder, verifyPayment} from '../service/cart.api'
import {setCart,addItem, incrementItemQuantity, decrementItemQuantity, removeItem} from '../state/cart.slice'
import {useDispatch} from 'react-redux'

export const useCart = () => {
    const dispatch = useDispatch()
    const handleAddToCart = async (productId, variantId) => {
        try{
            const data = await addToCart(productId, variantId)
            return data
            console.log('Add to cart response:', data);
        }catch(error){
            console.error('Error adding to cart:', error);
            throw error;        
        }
    }

    const handleGetCart = async () => {
        try{
            const data = await getCart()
            const cartData = data.cart && data.cart.length > 0 ? data.cart[0] : { items: [], totalPrice: 0, currency: 'INR' }
            dispatch(setCart(cartData))
        }catch(error){
            console.error('Error fetching cart:', error);
            throw error;
        }

    }

    const handleIncrementCartQuantity = async (productId, variantId) => {
        try {
            const data = await incrementCartQuantity(productId, variantId);
            dispatch(incrementItemQuantity({ productId, variantId }));
            return data;
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            throw error;
        }
    }

    const handleDecrementCartQuantity = async (productId, variantId) => {
        try {
            const data = await decrementCartQuantity(productId, variantId);
            dispatch(decrementItemQuantity({ productId, variantId }));
            return data;
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            throw error;
        }
    }

    const handleRemoveItemFromCart = async (productId, variantId) => {
        try {
            const data = await removeItemFromCart(productId, variantId);
            dispatch(removeItem({ productId, variantId }));
            return data;
        } catch (error) {
            console.error('Error removing item from cart:', error);
            throw error;
        }
    }
     
    const handleCreateRazorpayOrder = async () => {
        try {
            const data = await createRazorpayOrder();
            return data.order;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw error;
        }
    }

    const handleVerifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
        try {
            const data = await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            return data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }

    return {handleAddToCart, handleGetCart, handleIncrementCartQuantity, handleDecrementCartQuantity, handleRemoveItemFromCart, handleCreateRazorpayOrder, handleVerifyPayment}
}
