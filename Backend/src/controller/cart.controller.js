import cartModel from '../model/cart.model.js'
import productModel from '../model/product.model.js'
import mongoose from 'mongoose'

export const addToCart = async (req, res) => {
    const { productId, variantId } = req.params;

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
        return res.status(200).json({ message: 'Item added to cart successfully', success: true, });
    }

}

export const getCart = async (req, res) => {
    const user = req.user._id;
    
    const cart = await cartModel.aggregate([
        {
            '$match': {
                'user': new mongoose.Types.ObjectId(user)
            }
        }, {
            '$unwind': {
                'path': '$items'
            }
        }, {
            '$lookup': {
                'from': 'products',
                'localField': 'items.productId',
                'foreignField': '_id',
                'as': 'items.productId'
            }
        }, {
            '$unwind': {
                'path': '$items.productId'
            }
        }, {
            '$unwind': {
                'path': '$items.productId.variants'
            }
        }, {
            '$match': {
                '$expr': {
                    '$eq': [
                        '$items.productId.variants._id', '$items.variantId'
                    ]
                }
            }
        }, {
            '$addFields': {
                'itemPrice': {
                    'amount': {
                        '$multiply': [
                            '$items.quantity', {
                                '$toInt': '$items.productId.variants.price.amount'
                            }
                        ]
                    },
                    'currency': '$items.price.currency'
                }
            }
        }, {
            '$group': {
                '_id': '$_id',
                'totalPrice': {
                    '$sum': '$itemPrice.amount'
                },
                'currency': {
                    '$first': '$itemPrice.currency'
                },
                'items': {
                    '$push': '$items'
                }
            }
        }
    ])
    console.log(`consolling cart`, cart)
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' })
    }
    return res.status(200).json({
        message: 'Cart retrieved successfully',
        success: true,
        cart
    }
    )
}


// increment the cart quantity by one
export const incrementCartQuantity = async (req, res) => {

    const { productId, variantId } = req.params;

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

// decrement the cart quantity by one
export const decrementCartQuantity = async (req, res) => {
    const { productId, variantId } = req.params;
    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.find(item => item.productId.toString() === productId && item.variantId.toString() === variantId);

    if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' })
    }
    if (item.quantity - 1 < 1) {
        return res.status(400).json({ message: 'Quantity cannot be less than 1' })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, 'items.productId': productId, 'items.variantId': variantId },
        { $inc: { 'items.$.quantity': -1 } },
        { new: true }
    );

    return res.status(200).json({ message: 'Cart updated successfully', success: true });
}

export const removeItemFromCart = async (req, res) => {

    const { productId, variantId } = req.params;

    const removeItem = await cartModel.findOneAndUpdate(
        { user: req.user._id, 'items.productId': productId, 'items.variantId': variantId },
        { $pull: { items: { productId, variantId } } },
        { new: true }
    );

    if (!removeItem) {
        return res.status(404).json({ message: 'Cart not found' })
    }

    return res.status(200).json({ message: 'Item removed from cart successfully', success: true });
}
