import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
})

export const register = async ({fullName, email, password, contact, role,isSeller})=>{
    const response = await authApiInstance.post('/register',{
        fullName,
        email,
        password,
        contact,
        role,
        isSeller
    })

    return response.data;
}