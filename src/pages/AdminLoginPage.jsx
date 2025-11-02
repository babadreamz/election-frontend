import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../services/apiService';
import { loginAdmin as loginAdminAction } from '../features/auth/authSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function AdminLoginPage() {
    const [formData, setFormData] = useState({
        adminTag: '',
        adminPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await loginAdmin(formData);
            dispatch(loginAdminAction(response.data));
            navigate('/admin', { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'Login Failed. Check credentials.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-bold text-white">
                    Admin Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="adminTag" className="block text-sm font-medium text-gray-300">
                            Admin Tag
                        </label>
                        <input
                            type="text"
                            name="adminTag"
                            placeholder="Admin Tag"
                            id="adminTag"
                            required
                            onChange={handleChange}
                            value={formData.adminTag}
                            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 p-3 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Admin Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="adminPassword"
                                placeholder="Enter Admin password"
                                id="password"
                                required
                                onChange={handleChange}
                                value={formData.adminPassword}
                                className="block w-full rounded-md border-gray-700 bg-gray-700 p-3 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible size={20} />
                                ) : (
                                    <AiOutlineEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <p className="text-center text-sm text-red-400">{error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/create" className="font-medium text-blue-400 hover:text-blue-300">
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AdminLoginPage;

