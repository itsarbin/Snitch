import axios from 'axios'

const cartApi = axios.create({
    baseURL: 'http://localhost:5000/api/cart',
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