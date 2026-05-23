import {useDispatch} from 'react-redux'
import { setSellerProducts, setAllProducts } from '../state/product.slice'
import { createProduct, getSellerProducts,getAllProducts} from '../services/product.api'


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

    return { handleCreateNewProduct, handleFetchSellerProducts, handleFetchAllProducts };
}