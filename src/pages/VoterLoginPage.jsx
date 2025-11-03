import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginVoter } from '../services/apiService';
import { loginVoter as loginVoterAction } from '../features/auth/authSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function VoterLoginPage() {
    const [formData, setFormData] = useState({
        voterId: '',
        voterKey: '',
    });
    const [showKey, setShowKey] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await loginVoter(formData);

            dispatch(loginVoterAction(response.data));
            navigate('/voter-dashboard', { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid Voter ID or Key.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 text-white">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-2xl">
                <h2 className="mb-4 text-center text-3xl font-bold">Voter Login</h2>
                <p className="mb-6 text-center text-sm text-gray-400">
                    Enter your Voter ID and Key to log in.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="voterId" className="block text-sm font-medium text-gray-300">
                            Voter ID
                        </label>
                        <input
                            type="text"
                            name="voterId"
                            id="voterId"
                            placeholder="Enter Voter ID"
                            value={formData.voterId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="voterKey" className="block text-sm font-medium text-gray-300">
                            Voter Key
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showKey ? 'text' : 'password'}
                                name="voterKey"
                                id="voterKey"
                                placeholder="Enter Voter Key"
                                value={formData.voterKey}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-gray-700 p-3 text-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                            >
                                {showKey ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
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
                            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md disabled:opacity-50"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        <Link to="/general-login" className="font-medium text-blue-400 hover:text-blue-300">
                            Back to role selection
                        </Link>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        <Link to="/voter-register" className="font-medium text-blue-400 hover:text-blue-300">
                           Register Here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default VoterLoginPage;
