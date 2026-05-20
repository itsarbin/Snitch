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