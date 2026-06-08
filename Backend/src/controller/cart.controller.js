import cartModel from '../model/cart.model.js'
import productModel from '../model/product.model.js'

export const addToCart = async (req, res) => {
    const { productId, variantId } = req.params ;

    const product = await productModel.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' })
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
        return res.status(404).json({ message: 'Variant not found' })
    }

    let cart = await cartModel.findOne({ user: req.user._id }) || await cartModel.create({ user: req.user._id });

    const existingItem = cart.items.find(item => item.productId.toString() === productId && item.variantId.toString() === variantId);

   

    const stock = variant.stock;
    if (existingItem) {

        const quantityInCart = existingItem.quantity;
        if (quantityInCart + 1 > stock) {
            return res.status(400).json({ message: 'Not enough stock available' })
        }

        existingItem.quantity += 1;

        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully', success: true });

    } else {

        if (stock < 1) {
            return res.status(400).json({ message: 'Not enough stock available' })
        }


        cart.items.push({ productId, variantId, quantity: 1, price: variant.price },);
        await cart.save();
        return res.status(200).json({ message: 'Item added to cart successfully', success: true,  });
    }

}

export const getCart = async (req, res) => {
    const user = req.user._id;
    const cart = await cartModel.findOne({user}).populate('items.productId')
    if(!cart){
        return res.status(404).json({message: 'Cart not found'})
    }
    return res.status(200).json({
        message: 'Cart retrieved successfully',
        success: true,
        cart
    }
    )
}


// update the cart quantity by one
export const updateCartQuantity = async (req, res) => {

    const { productId, variantId } = req.params ;

    const product = await productModel.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' })
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
        return res.status(404).json({ message: 'Variant not found' })
    }

    const stock = variant.stock;
    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.find(item => item.productId.toString() === productId && item.variantId.toString() === variantId);

    if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' })
    }


    if (item.quantity + 1 > stock) {
        return res.status(400).json({ message: 'Not enough stock available' })
    }   

    await cartModel.findOneAndUpdate(
        { user: req.user._id, 'items.productId': productId, 'items.variantId': variantId },
        { $inc: { 'items.$.quantity': 1 } },
        { new: true }
    ); 

    return res.status(200).json({ message: 'Cart updated successfully', success: true });

}

