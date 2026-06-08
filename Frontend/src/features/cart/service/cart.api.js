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

export const updateCartQuantity = async (productId, variantId) => {
    try {
        const response = await cartApi.patch(`/update/${productId}/${variantId}`, { productId, variantId });
        return response.data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
}