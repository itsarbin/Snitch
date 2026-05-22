import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register"; 
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/product/pages/CreateProduct";
import SellerDashbord from "../features/product/pages/SellerDashbord";

export const routes = createBrowserRouter([
    {
        path:'/',
        element:<h1>Welcome to the Snitch</h1>
    },
    {
        path:'/register',
        element:<Register />
    },
    {
        path:'/login',
        element:<Login />
    },
    {
       path:'/seller',
       children:[
        {
            path:'create-product',
            element:<CreateProduct />
        },
        {
            path:'dashboard',
            element:<SellerDashbord/>
        }
       ]
    }
])