import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";

export const authSellerMiddleware = async (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({message: "Invalid token"});
        }
        if(user.role !== "seller"){
            return res.status(403).json({message: "Forbidden"});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
}
