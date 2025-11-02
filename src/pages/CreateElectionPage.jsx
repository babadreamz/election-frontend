import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createElection } from '../services/apiService';

function CreateElectionPage() {
    const [formData, setFormData] = useState({ title: '', startDate: '', endDate: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await createElection(formData);

            navigate('/election-success', { state: res.data });

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create election. Please try again.';
            setError(message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 text-white">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-bold">Create New Election</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                            Election Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Election Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                            Start Date and Time
                        </label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            id="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                            End Date and Time
                        </label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            id="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                            required
                        />
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
                            {isLoading ? 'Creating...' : 'Create Election'}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                        <Link to="/admin" className="font-medium text-blue-400 hover:text-blue-300">
                            Back to Dashboard
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default CreateElectionPage;