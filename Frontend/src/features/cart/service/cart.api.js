import axios from 'axios'

const cartApi = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export const addToCart = async (productId, variantId) => {
    try {
        const response = await cartApi.post(`/add/${productId}/${variantId}`, { productId, variantId });
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;    
    }
}

export const getCart = async () => {
    try {
        const response = await cartApi.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;    
    }
}

export const incrementCartQuantity = async (productId, variantId) => {
    try {
        const response = await cartApi.patch(`/increment/${productId}/${variantId}`, { productId, variantId });
        return response.data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
}

export const decrementCartQuantity = async (productId, variantId) => {
    try {
        const response = await cartApi.patch(`/decrement/${productId}/${variantId}`, { productId, variantId });
        return response.data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
}

export const removeItemFromCart = async (productId, variantId) => {
    try {
        const response = await cartApi.delete(`/remove/${productId}/${variantId}`, {productId, variantId});
        return response.data;
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
    }
}
