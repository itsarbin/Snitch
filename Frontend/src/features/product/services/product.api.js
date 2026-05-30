import axios from "axios";

const productApi = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})


export const createProduct = async(formData)=>{
    const response = await productApi.post('/',formData);
    return response.data
}

export const getSellerProducts = async()=>{
    const response = await productApi.get('/sellerProducts');
    return response.data
}

export const getAllProducts = async()=>{
    const response = await productApi.get('/home');
    return response.data
}

export const fetchProductDetails = async(productId)=>{
    const response = await productApi.get(`details/${productId}`);
    return response.data
}

export const fetchSellerProductDetails = async(productId)=>{
    const response = await productApi.get(`sellerProduct/${productId}`);
    return response.data
}

export const createVariant = async(productId, formData)=>{
    const response = await productApi.post(`sellerProduct/${productId}/variants`, formData);
    return response.data
}

export const updateVariantStock = async(productId, variantId, stock)=>{
    const response = await productApi.patch(`sellerProduct/${productId}/variants/${variantId}/stock`, { stock });
    return response.data
}

export const deleteVariant = async(productId, variantId)=>{
    const response = await productApi.delete(`sellerProduct/${productId}/variants/${variantId}`);
    return response.data
}