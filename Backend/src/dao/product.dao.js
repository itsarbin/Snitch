import productModel from '../model/product.model.js';

export const variantStock = async (productId,variantId)=>{
        const product = await productModel.findById(productId);
        if(!product){
            throw new Error('Product not found');
        }
        const variant = product.variants.find(v => v._id.toString() === variantId);
        if(!variant){
            throw new Error('Variant not found');
        }

        return variant.stock;
}