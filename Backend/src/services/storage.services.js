import ImageKit from "imagekit";
import Config from "../config/config.js";

const client = new ImageKit({
    publicKey: Config.IMAGEKIT_PUBLIC_KEY,
    privateKey: Config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: Config.IMAGEKIT_URL_ENDPOINT
})


export const uploadImage = async ({buffer, fileName, folder='snitch'})=>{
     const result = await client.upload({
        file:buffer,
        fileName,
        folder
     })

     return result;

}