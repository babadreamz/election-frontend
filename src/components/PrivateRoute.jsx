import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAdminAuth } from '../features/auth/authSlice';

function PrivateRoute() {
    const isAuth = useSelector(selectIsAdminAuth);
    return isAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
}
export default PrivateRoute;