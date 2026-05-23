import {useSelector} from "react-redux";
import {Navigate} from "react-router";

const Protected = ({role, children}) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return <div>You need to login to access this page</div>
    }

    if(user.role !== role){
        console.log('User role:', user.role, ', Required role:', role);
        return <Navigate to='/' replace />
    }

    

  return children
}

export default Protected