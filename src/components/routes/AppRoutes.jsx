import { Navigate, Route, Routes } from "react-router-dom";
import CreateProduct from "../products/CreateProduct/CreateProduct";
import CreatePurchase from "../purchases/CreatePurchase/CreatePurchase";


export const AppRoutes = () => {
    return (
        <Routes>

            <Route
                path="products/create"
                element={<CreateProduct />}
            />
            <Route
                path="purchases/create"
                element={<CreatePurchase />}
            />
        </Routes>
    )
}
