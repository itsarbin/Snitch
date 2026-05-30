import productModel from "../model/product.model.js";
import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controller/product.controller.js";
import { getSellerProducts, getAllProducts, fetchProductDetails, addProductVariant } from "../controller/product.controller.js";
import { validateCreateProduct } from "../validator/product.validator.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer(
    {
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }
)

const router = Router();

//create product
router.post('/', authenticateSeller, upload.array('images',7), validateCreateProduct, createProduct)

//fetch all the seller products
router.get('/sellerProducts', authenticateSeller,getSellerProducts)

//fetch all products
router.get('/home',getAllProducts)

//fetch a product by id
router.get('/details/:id', fetchProductDetails)

//seller product detail page
router.get('/sellerProduct/:id', authenticateSeller, fetchProductDetails)

//adding variant to a product
router.post('/sellerProduct/:id/variants', authenticateSeller, upload.array('images',7), addProductVariant )

export default router
