import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createPosition, getElectionDetails } from '../services/apiService';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';

function CreatePositionPage() {
    const [formData, setFormData] = useState({ positionCode: '', name: '' });
    const [electionDetails, setElectionDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);
    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);

    useEffect(() => {
        if (!activeElectionId) {
            console.warn('No active election identifier found, redirecting.');
            navigate('/admin');
            return;
        }

        const fetchDetails = async () => {
            setIsLoadingDetails(true);
            setError(null);
            try {
                const res = await getElectionDetails(activeElectionId);
                setElectionDetails(res.data);
            } catch (err) {
                console.error("Failed to fetch election details:", err);
                setError("Could not load election context.");
                setElectionDetails(null);
            } finally {
                setIsLoadingDetails(false);
            }
        };

        fetchDetails();
    }, [activeElectionId, navigate]);


    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const payload = {
            ...formData,
            electionPublicId: activeElectionId,
        };

        if (!payload.electionPublicId) {
            setError("Election context is missing. Cannot create position.");
            setIsLoading(false);
            return;
        }

        try {
            await createPosition(payload);
            navigate('/election-positions');

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create position.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingDetails) {
        return <div className="p-6 text-center text-white">Loading election context...</div>;
    }

    if (error && !electionDetails) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!electionDetails) {
        return <div className="p-6 text-center text-white">Could not load election information.</div>;
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 text-white">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-bold">Add New Position</h2>
                <p className="mb-4 text-center text-sm text-gray-400">For Election: {electionDetails.title}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="positionCode" className="block text-sm font-medium text-gray-300">
                            Position Code
                        </label>
                        <input
                            type="text"
                            name="positionCode"
                            id="positionCode"
                            placeholder="Unique Position Code (e.g., PRES)"
                            value={formData.positionCode}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Position Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Position Name (e.g., President)"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 p-3 text-white"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <p className="text-center text-sm text-red-400">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || isLoadingDetails}
                            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Position'}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                        <Link
                            to="/election-positions"
                            className="font-medium text-blue-400 hover:text-blue-300"
                        >
                            Back to Positions List
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default CreatePositionPage;