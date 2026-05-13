import { register,login } from "../service/auth.api";
import { useDispatch } from "react-redux";
import { setUser,setLoading,setError } from "../state/auth.slice";

export const useAuth = ()=>{
    const dispatch = useDispatch()

    const handleRegister = async ({fullName,email,password,contact,isSeller=false})=>{
        try {
                dispatch(setLoading(true))
             const data = await register({fullName,email,password,contact,isSeller})
                dispatch(setUser(data.user))
                dispatch(setError(null))
                return {success: true, user: data.user}
        }catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Registration failed"
            dispatch(setError({
                message: errorMessage
            }))
            return {success: false, message: errorMessage}
        } finally {
            dispatch(setLoading(false))
        }

        
    }

    const handleLogin = async ({email,password})=>{
        dispatch(setLoading(true))
        try{
            const data = await login({email,password})
            dispatch(setUser(data.user))
            dispatch(setError(null))
            return {success: true, user: data.user}
        }catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Login failed"
            dispatch(setError({
                message: errorMessage
            }))
            return {success: false, message: errorMessage}
        } finally {
            dispatch(setLoading(false))
        }
    } 


    return {
        handleRegister,
        handleLogin
    }
}
