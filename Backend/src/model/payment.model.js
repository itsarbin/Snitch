import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    status:{
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price:{
        amount: Number,
        currency: String
    },
    razorpay:{
        orderId:{
            type: String,
            required: true
        },
        paymentId: String,
        signature: String
    },
    orderItems:[
        {
            title: String,
            productId: mongoose.Schema.Types.ObjectId,
            variantId: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            images:[
                {
                    url: String,
                }
            ],
            description: String,
            price:{
                amount: Number,
                currency: String
            }
        }
    ]


})

const paymentModel = mongoose.model('payment', paymentSchema);

export default paymentModel;