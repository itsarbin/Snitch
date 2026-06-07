import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            variantId:{
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            quantity:{
                type: Number,
                default: 1
            },
            price:{
                amount: String,
                currency: String
            }
           
        }
    ],
  
})

const cartModel = mongoose.model('cart', cartSchema);

export default cartModel;
