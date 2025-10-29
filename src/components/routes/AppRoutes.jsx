import { Navigate, Route, Routes } from "react-router-dom";
import CreateProduct from "../products/CreateProduct/CreateProduct";
import ProductList from "../products/ProductList/ProductList";
import CreatePurchase from "../purchases/CreatePurchase/CreatePurchase";
import CreateSupplier from "../suppliers/CreateSupplier/CreateSupplier";
import SupplierList from "../suppliers/SupplierList/SupplierList";
import CreateSale from "../sales/CreateSale/CreateSale";
import CreateCustomer from "../customers/CreateCustomer/CreateCustomer";
import CustomerList from "../customers/CustomerList/CustomerList";
import ProductCatalog from "../products/ProductCatalog/ProductCatalog";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta raíz - Redireccionar a una página por defecto */}
      <Route path="/" element={<Navigate to="/products" replace />} />

      {/* ============== PRODUCTOS ============== */}
      <Route path="products">
        <Route index element={<ProductList />} /> {/* /products */}
        <Route path="create" element={<CreateProduct />} /> {/* /products/create */}
        <Route path="edit/:id" element={<CreateProduct />} /> {/* /products/edit/:id */}
      </Route>

      {/* ============== COMPRAS ============== */}
      <Route path="purchases">
        <Route path="create" element={<CreatePurchase />} />
      </Route>

      {/* ============== PROVEEDORES ============== */}
      <Route path="suppliers">
        <Route index element={<SupplierList />} /> {/* /suppliers */}
        <Route path="create" element={<CreateSupplier />} />
        <Route path="edit/:id" element={<CreateSupplier />} />
      </Route>

      {/* ============== VENTAS ============== */}
      <Route path="sales">
        <Route path="create" element={<CreateSale />} />
      </Route>

      {/* ============== CLIENTES ============== */}
      <Route path="customers">
        <Route index element={<CustomerList />} /> {/* /customers */}
        <Route path="create" element={<CreateCustomer />} />
        <Route path="edit/:id" element={<CreateCustomer />} />
      </Route>

      {/* ============== CATÁLOGO DE PRODUCTOS ============== */}
      <Route path="products/catalog" element={<ProductCatalog />} />

      {/* Ruta 404 - Página no encontrada */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
};