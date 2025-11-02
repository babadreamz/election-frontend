import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsVoterAuth } from '../features/auth/authSlice';

function VoterPrivateRoute() {
    const isAuth = useSelector(selectIsVoterAuth);
    return isAuth ? <Outlet /> : <Navigate to="/voter-login" replace />;
}

export default VoterPrivateRoute;