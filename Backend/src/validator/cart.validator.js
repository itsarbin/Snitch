import {param, validationResult} from 'express-validator';

function validateRequest(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateCartItem = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    param('variantId').isMongoId().withMessage('Invalid variant ID'),
    validateRequest
]