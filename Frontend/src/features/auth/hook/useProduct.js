import {useDispatch} from 'react-redux'
import { setSellerProducts } from '../state/product.slice'
import { createProduct, getSellerProducts} from '../service/product.api'


export  const useProduct = ()=>{

    const dispatch= useDispatch();

    const handleCreateNewProduct = async(formData)=>{
        try{
            const data = await createProduct(formData);
            return data.product
        }catch(error){
            console.error('Error creating product:', error);
            throw error;
        }
    }

    const handleFetchSellerProducts = async()=>{
        try{
            const data = await getSellerProducts();
            dispatch(setSellerProducts(data.sellerProducts))
            return data.products
        }catch(error){
            console.error('Error fetching seller products:', error);
            throw error;
        }
    }

    return { handleCreateNewProduct, handleFetchSellerProducts };
}