import userModel from "../model/user.model.js";
import Config from "../config/config.js";
import jwt from "jsonwebtoken";


const sendTokenResponse = (user,res,message)=>{
    const token = jwt.sign({
        id:user._id,
    }, Config.JWT_SECRET,{
        expiresIn: "7d"
    });

    res.cookie("token", token)

    res.status(200).json({
        message,
        success:true,
        user

    })
}

export const register = async (req, res)=>{
    const {fullName, email, password, contact, role, isSeller} = req.body;
    try{
        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })

        if(existingUser){
            return res.status(400).json({
                message: "User with this email or contact already exists"
                
            })
        }

        const user = await userModel.create({
            fullName,
            email,
            password,
            contact,
            role: isSeller ? 'seller' : 'buyer'
        })

       sendTokenResponse(user,res,"User registered successfully")


        
                
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}
