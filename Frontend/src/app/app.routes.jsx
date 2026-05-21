import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register"; 
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/product/pages/CreateProduct";

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
        path:'/create-product',
        element:<CreateProduct/>
    }
])