import {useDispatch} from 'react-redux'
import { setSellerProducts, setAllProducts } from '../state/product.slice'
import { createProduct, getSellerProducts,getAllProducts, fetchProductDetails, fetchSellerProductDetails, createVariant, updateVariantStock, deleteVariant} from '../services/product.api'


export  const useProduct = ()=>{

    const dispatch= useDispatch();

    const handleCreateNewProduct = async(formData)=>{
        try{
            const data = await createProduct(formData);
            return data
        }catch(error){
            console.error('Error creating product:', error);
            throw error;
        }
    }

    const handleFetchSellerProducts = async()=>{
        try{
            const data = await getSellerProducts();
            dispatch(setSellerProducts(data.products))
            return data.products
        }catch(error){
            console.error('Error fetching seller products:', error);
            throw error;
        }
    }

    const handleFetchAllProducts = async()=>{
        try{
            const data = await getAllProducts();
            dispatch(setAllProducts(data.products))
        }catch(error){
            console.error("Error Fetching all products:", error);
            throw error;
        }
    }
    const handleProductDetails = async(productId)=>{
        try{
            const data = await fetchProductDetails(productId);
            return data;
        }catch(error){
            console.error("Error fetching product by ID:", error);
            throw error;
        }
    }

    const handleSellerProductDetails = async(productId)=>{
        try{
            const data = await fetchSellerProductDetails(productId);
            return data;
        }catch(error){
            console.error("Error fetching seller product by ID:", error);
            throw error;
        }
    }

    const handleCreateVariant = async(productId, formData)=>{
        try{
            const data = await createVariant(productId, formData);
            return data;
        }catch(error){
            console.error("Error creating variant:", error);
            throw error;
        }
    }

    const handleUpdateVariantStock = async(productId, variantId, stock)=>{
        try{
            const data = await updateVariantStock(productId, variantId, stock);
            return data;
        }catch(error){
            console.error("Error updating variant stock:", error);
            throw error;
        }
    }

    const handleDeleteVariant = async(productId, variantId)=>{
        try{
            const data = await deleteVariant(productId, variantId);
            return data;
        }catch(error){
            console.error("Error deleting variant:", error);
            throw error;
        }
    }

    return { handleCreateNewProduct, handleFetchSellerProducts, handleFetchAllProducts, handleProductDetails, handleSellerProductDetails, handleCreateVariant, handleUpdateVariantStock, handleDeleteVariant };
}