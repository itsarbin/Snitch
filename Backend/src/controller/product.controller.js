import productModel from "../model/product.model.js";
import { uploadImage } from "../services/storage.services.js";


export const createProduct = async (req, res) => {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const sellerId = req.user.id;
    const images = req.files;

    try {
        const imageUrls = await Promise.all(images.map(async (img) => {
            const uploaded = await uploadImage({
                buffer: img.buffer,
                fileName: img.originalname,
            })

            return {
                url: uploaded.url
            }
        }))

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency
            },
            images: imageUrls,
            seller: sellerId
        })

        res.status(201).json({
            message: "Product created successfully",
            product,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message,
            success: false
        })
    }
}


export const getSellerProducts = async (req, res) => {
    const sellerId = req.user.id;

    try {

        const products = await productModel.find({ seller: sellerId });

        res.status(200).json({
            message: "Products fetched successfully",
            products,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
            success: false
        })
    }

}