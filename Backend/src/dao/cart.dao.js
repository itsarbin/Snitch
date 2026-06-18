import mongoose from "mongoose";
import Cart from "../model/cart.model.js";

export const getCartDetails =  async (user) => {
  const cart = await Cart.aggregate([
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

    return cart
}
