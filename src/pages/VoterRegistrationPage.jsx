import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerVoter } from '../services/apiService';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function VoterRegistrationPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        voterKey: '',
    });
    const [showKey, setShowKey] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            await registerVoter(formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/voter-login');
            }, 2000);

        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-bold text-white">
                    Register as a Voter
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="text-white"> First Name </label>
                    <input
                        type="text" name="firstName" placeholder="First Name" required
                        onChange={handleChange} value={formData.firstName}
                        className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                    />
                    <label className="text-white"> Last Name </label>
                    <input
                        type="text" name="lastName" placeholder="Last Name" required
                        onChange={handleChange} value={formData.lastName}
                        className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                    />
                    <label className="text-white"> Date of Birth </label>
                    <input
                        type="date" name="dateOfBirth" placeholder="Date of Birth" required
                        onChange={handleChange} value={formData.dateOfBirth}
                        className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                    />
                    <label className="text-white"> Email </label>
                    <input
                        type="email" name="email" placeholder="Email Address" required
                        onChange={handleChange} value={formData.email}
                        className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                    />
                    <label className="text-white"> Voter Key </label>
                    <div className="relative">
                        <input
                            type={showKey ? 'text' : 'password'}
                            name="voterKey"
                            placeholder="Voter Key (Password)" required
                            onChange={handleChange} value={formData.voterKey}
                            className="block w-full rounded-md bg-gray-700 p-3 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Voter key must be at least <span className="font-semibold">8 characters</span>,
                            include an <span className="font-semibold">uppercase letter</span>, a
                            <span className="font-semibold"> number</span>, and a
                            <span className="font-semibold"> special character</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                        >
                            {showKey ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                    {success && (
                        <p className="text-center text-sm text-green-400">{success}</p>
                    )}
                    {error && (
                        <p className="text-center text-sm text-red-400">{error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md disabled:opacity-50"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                        Already registered?{' '}
                        <Link to="/voter-login" className="font-medium text-blue-400 hover:text-blue-300">
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VoterRegistrationPage;