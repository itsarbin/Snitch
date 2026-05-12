import { register } from "../service/auth.api";
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
                return data.user
        }catch (error) {
            dispatch(setError({
                message: error.response?.data?.message || error.message || "Registration failed"
            }))
        } finally {
            dispatch(setLoading(false))
        }

        
    }


    return {
        handleRegister
    }
}
