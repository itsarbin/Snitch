import { Router } from "express";
import multer from "multer";
import { authSellerMiddleware } from "../middleware/auth.middleware.js";
import { createProduct } from "../controller/product.controller.js";
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
}); // Limit file size to 5MB

const router = Router();

router.post ('/', authSellerMiddleware, upload.array('images',7), createProduct);


export default router;