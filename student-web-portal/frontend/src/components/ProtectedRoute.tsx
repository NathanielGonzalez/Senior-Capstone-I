import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from '../utils/supabaseClient';

const ProtectedRoute: React.FC = () => {
    const user = supabase.auth.getUser();

    // If no user is found, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;