import { register } from "../service/auth.api"
import { useDispatch } from "react-redux";
import {setUser, setLoading, setError} from "../state/auth.slice";

const useAuth = ()=>{

    const dispatch = useDispatch();

    const handleRegister = async ({fullName, email, password, contact, role,isSeller=false})=>{
        const data = await register({fullName, email, password, contact, role,isSeller});

        dispatch(setUser(data.user));
    }

    return {
        handleRegister
    }


}