import axios from 'axios'

const authApi = axios.create({
    baseURL: '/api/auth',
    withCredentials: true,
})

export const register = async ({fullName,email,password,contact,isSeller})=>{
    const response = await authApi.post('/register',{fullName,email,password,contact,isSeller})
    return response.data
}

export const login = async ({email,password})=>{
    const response = await authApi.post('/login',{email,password})
    return response.data
}
