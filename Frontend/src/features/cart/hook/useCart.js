import {addToCart, getCart, updateCartQuantity} from '../service/cart.api'
import {setItems,addItem} from '../state/cart.slice'
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
            dispatch(setItems(data.cart.items))
            
        }catch(error){
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    const handleUpdateCartQuantity = async (productId, variantId) => {
        try {
            const data = await updateCartQuantity(productId, variantId);
            return data;
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            throw error;
        }
    }

    return {handleAddToCart, handleGetCart, handleUpdateCartQuantity}
}
