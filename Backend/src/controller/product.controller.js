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


export const getAllProducts = async (req,res)=>{
    try{
        const products = await productModel.find().sort({ createdAt: -1 });

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

export const fetchProductDetails = async (req,res)=>{
    const productId = req.params.id;
    try{
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }
        res.status(200).json({
            message: "Product fetched successfully",
            product,
            success: true
        })
    }catch(error){
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message,
            success: false
        })
    }
}

export const addProductVariant = async (req,res)=>{
    const productId = req.params.id;

    const product = await productModel.findById({
        _id: productId,
        seller: req.user.id
    })

    if(!product){
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }
    

    const files = req.files;

    let imageUrls = [];

    if(files || files.length !== 0){
    
        imageUrls= await Promise.all(files.map(async (file)=>{
            const uploaded = await uploadImage({
                buffer: file.buffer,
                fileName: file.originalname,
            })

            return {
                url: uploaded.url
            }
        }))
        
    }

    const priceAmount = req.body.priceAmount;
    const stock = req.body.stock;

    const attributes = JSON.parse(req.body.attributes) || {};


    const variant = {
        images: imageUrls,
        price: {
            amount: priceAmount || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    };

    product.variants.push(variant);

    await product.save();

    res.status(201).json({
        message: "Variant added successfully",
        variant,
        success: true
    })
    // console.log("variant added", imageUrls, priceAmount, stock, attributes)
}
