import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        amount:{
            type: String,
            required: true
        },
        currency:{
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
            required: true,
        }
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images:[
        {
            url:{
                type:String,
                required:true
            }
        }
    ]
    
},
{
    timestamps:true
})

const productModel = mongoose.model('Product',productSchema)

export default productModel