import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAdmin } from '../services/apiService.js';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function AdminRegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await registerAdmin(formData);
            const adminTag = response.data.adminTag;
            const message = response.data.message;
            navigate('/adminReg-success', {
                state: {
                    message: message || 'Registration Successful!',
                    adminTag: adminTag,
                },
            });
        } catch (err) {
            const message =
                err.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
            setIsLoading(false);
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-bold text-white">
                    Create Your Admin Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Name of Organization
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter organization name"
                            id="name"
                            required
                            onChange={handleChange}
                            value={formData.name}
                            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 p-3 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            id="email"
                            onChange={handleChange}
                            value={formData.email}
                            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 p-3 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter password"
                                id="password"
                                required
                                onChange={handleChange}
                                value={formData.password}
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
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/admin-login"
                            className="font-medium text-blue-400 hover:text-blue-300"
                        >
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AdminRegistrationPage;