import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
    attributes:{
        type: Map,
        of: String
    },
    price:{
        amount: String,
        currency: String
    },
    stock:{
        type: Number,
        default: 0
    },
    images:[
        {
            url:{
                type: String,
            }
        }
    ]

})

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
        ref: 'user',
        required: true
    },
    images:[
        {
            url:{
                type:String,
                required:true
            }
        }
    ],
    variants:[productVariantSchema]
    
},
{
    timestamps:true
})

const productModel = mongoose.model('product',productSchema)

export default productModel
