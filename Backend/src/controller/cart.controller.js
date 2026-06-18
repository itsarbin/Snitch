import config from '../config/config.js'
import cartModel from '../model/cart.model.js'
import productModel from '../model/product.model.js'
import paymentModel from '../model/payment.model.js'
import mongoose from 'mongoose'
import {createOrder} from '../services/razorpay.service.js'
import {getCartDetails} from '../dao/cart.dao.js'
import {validatePaymentVerification} from 'razorpay/dist/utils/razorpay-utils.js'


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
    
    const cart = await getCartDetails(user);

    if (!cart) {
        return res.status(200).json({ message: 'Cart is empty', cart: [] });
    }

    return res.status(200).json({
        message: 'Cart retrieved successfully',
        success: true,
        cart
    });
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

export const createRazorpayOrder = async (req, res) => {
    const user = req.user._id;
  
    const cart = await getCartDetails(user);

  const order = await createOrder({
    amount: cart[0].totalPrice, // Convert to paise
    currency: cart[0].currency
  })

   const payment = await paymentModel.create({
    user: user,
    razorpay:{
        orderId: order.id,
    },
    price:{
        amount: cart[0].totalPrice,
        currency: cart[0].currency
    },
    orderItems: cart[0].items.map(item => ({
        title: item.productId.title,
        productId: item.productId._id,
        variantId: item.variantId,
        quantity: item.quantity,
        images: item.productId.variants.images || item.productId.images, 
        description: item.productId.description,
        price: {
            amount: item.productId.variants.price.amount || item.productId.price.amount,
            currency: item.productId.variants.price.currency || item.productId.price.currency
        }
    }))
   })
   

    res.status(200).json({ message: 'Order created successfully', success: true, order});


}

export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const paymentRecord = await paymentModel.findOne({
        'razorpay.orderId': razorpay_order_id,
        status: 'pending'
    })

    if (!paymentRecord) {
        return res.status(404).json({ message: 'Payment record not found' })
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_API_SECRET);

    if (!isPaymentValid) {
        return res.status(400).json({ message: 'Invalid payment signature' })
    }

    paymentRecord.status = 'paid';
    paymentRecord.razorpay.paymentId = razorpay_payment_id;
    paymentRecord.razorpay.signature = razorpay_signature;
    await paymentRecord.save();

    return res.status(200).json({ message: 'Payment verified successfully', success: true });


}
