import{body,validationResult} from 'express-validator';

function validateRequest(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateRegisterUser = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullName').notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
    body('contact').notEmpty().withMessage('Contact number is required')
    .matches(/^\d{10}$/).withMessage('Contact number must be 10 digits'),
    body('isSeller').isBoolean().withMessage('isSeller must be a boolean value'),

    validateRequest
]


export const vlidateLoginUser = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),

    validateRequest
]
