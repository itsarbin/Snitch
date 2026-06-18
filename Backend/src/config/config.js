import {config} from "dotenv";
config();


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables");
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables");
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in environment variables");
}
if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("IMAGEKIT_PUBLIC_KEY is not defined in environment variables");
}
if(!process.env.IMAGEKIT_URL_ENDPOINT){
    throw new Error("IMAGEKIT_URL_ENDPOINT is not defined in environment variables");
}
if(!process.env.RAZORPAY_API_KEY){
    throw new Error("RAZORPAY_API_KEY is not defined in environment variables");
}
if(!process.env.RAZORPAY_API_SECRET){
    throw new Error("RAZORPAY_API_SECRET is not defined in environment variables");
}

const Config = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
    RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET
}

export default Config;
