import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";

import AdminLayout from "../layouts/AdminLayout";
import VendorLayout from "../layouts/VendorLayout";
import FarmerLayout from "../layouts/FarmerLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "../components/protected/ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>

                <Route element={<AuthLayout />}>

                    <Route path="/" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                </Route>

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="Admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                </Route>

                <Route
                    path="/vendor"
                    element={
                        <ProtectedRoute role="Vendor">
                            <VendorLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<VendorDashboard />} />
                </Route>

                <Route
                    path="/farmer"
                    element={
                        <ProtectedRoute role="Farmer">
                            <FarmerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<FarmerDashboard />} />
                </Route>

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;