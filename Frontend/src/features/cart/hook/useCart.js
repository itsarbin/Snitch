import {addToCart, getCart} from '../service/cart.api'
import {setItems,addItem} from '../state/cart.slice'
import {useDispatch} from 'react-redux'

export const useCart = () => {
    const dispatch = useDispatch()
 q
    const handleAddToCart = async (productId, variantId) => {
        try{
            const data = await addToCart(productId, variantId)
            return data
        }catch(error){
            console.error('Error adding to cart:', error);
            throw error;        
        }
    }

    const handleGetCart = async () => {
        try{
            const data = await getCart()
            dispatch(setItems(data.cart.items))
            console.log('Cart items:', data.cart.items);
        }catch(error){
            console.error('Error fetching cart:', error);
            throw error;
        }
    }
    return {handleAddToCart, handleGetCart}
}