import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/product/pages/CreateProduct";
import SellerDashbord from "../features/product/pages/SellerDashbord";
import Home from "../features/product/pages/Home";
import Protected from "../features/auth/components/Protected";
import ProductDetail from "../features/product/pages/ProductDetail";
import SellerProductDetail from "../features/product/pages/SellerProductDetail";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/product/:productId',
        element: <ProductDetail />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/seller',
        children: [
            {
                path: 'create-product',
                element: <Protected role='seller'>
                    <CreateProduct />
                </Protected>
            },
            {
                path: 'dashboard',
                element: <Protected role='seller'>
                    <SellerDashbord />
                </Protected>
            },
            {
                path: 'product/:productId',
                element: <Protected role='seller'>
                    <SellerProductDetail />
                </Protected>
            }
        ]
    }
])