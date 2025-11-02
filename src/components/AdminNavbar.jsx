import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';
import { selectCurrentAdmin, logoutAdmin } from '../features/auth/authSlice';
import { logoutUserAPI } from '../services/apiService';

function AdminNavbar() {
    const admin = useSelector(selectCurrentAdmin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        try {
            await logoutUserAPI();
        } catch (error) {
            console.error("Logout API call failed, but logging out anyway:", error);
        } finally {
            dispatch(logoutAdmin());
            navigate("/admin-login");
        }
    };

    return (
        <nav className="flex items-center justify-between bg-blue-700 px-8 py-4 text-white">
            <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold">🗳️ E-Vote</h1>
                <button className="font-semibold">Dashboard</button>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="hover:text-red-300">
                    Logout
                </button>
                <User className="h-6 w-6" />
                <span>{admin ? admin.name : 'Admin'}</span>
            </div>
        </nav>
    );
}

export default AdminNavbar;