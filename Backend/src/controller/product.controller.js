import productModel from "../model/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const createProduct = async (req, res)=>{
    const {title, description, priceAmount , priceCurrency} = req.body;
    const seller = req.user._id;

    const images = await Promise.all(req.files.map(async (file)=>{
        const uploaded = await uploadImage({
            buffer: file.buffer,
            fileName: file.originalname
        })
        return {url: uploaded.url};
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency
        },
        seller,
        images
    })

    res.status(201).json({message: "Product created successfully", product});
}