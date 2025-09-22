import { Navigate, Route, Routes } from "react-router-dom";
import CreateProduct from "../products/CreateProduct/CreateProduct";


export const AppRoutes = () => {
    return (
        <Routes>

            <Route
                path="products/create"
                element={<CreateProduct />}
            />
            {/* <Route
                path="products/list"
                element={<ListUser />}
            /> */}
        </Routes>
    )
}
