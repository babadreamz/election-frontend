import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getVoterElectionDetails, applyForCandidacy } from '../services/apiService';
import {
    selectActiveElectionIdentifier,
    selectCurrentVoter
} from '../features/auth/authSlice';

function ApplyCandidacy() {
    const [electionDetails, setElectionDetails] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hasApplied, setHasApplied] = useState(false);

    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);
    const currentVoter = useSelector(selectCurrentVoter);

    useEffect(() => {
        if (!activeElectionId) {
            console.warn("No active election ID, redirecting...");
            navigate('/voter-dashboard');
            return;
        }

        console.log("Using Active Election ID:", activeElectionId); // For debugging

        const fetchDetails = async () => {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');
            setHasApplied(false);
            try {
                const res = await getVoterElectionDetails(activeElectionId);
                setElectionDetails(res.data);
            } catch (err) {
                console.error("Fetch Details Error:", err);
                setError(err.response?.data?.message || 'Could not load election details or positions.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [activeElectionId, navigate]);

    const handleApply = async (e) => {
        e.preventDefault();

        if (!selectedPosition) {
            setError('Please select a position to apply for.');
            return;
        }

        if (!currentVoter || !currentVoter.id) {
            setError('Could not identify voter. Please log in again.');
            return;
        }

        if (!activeElectionId) {
            setError('Could not find the election ID. Please go back and select an election.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            await applyForCandidacy(activeElectionId, currentVoter.id, selectedPosition);

            setSuccessMessage(`Successfully applied for position: ${selectedPosition}. Your application is pending admin approval.`);
            setHasApplied(true);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit application.';
            if (errorMessage.toLowerCase().includes('already applied')) {
                setHasApplied(true);
                setError(errorMessage);
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center">Loading application form...</div>;
    }

    if (error && !electionDetails) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>{error}</p>
                <Link
                    to="/voter-dashboard"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    if (!electionDetails) {
        return <div className="p-6 text-center">Could not load election information.</div>;
    }

    if (electionDetails.status !== 'UPCOMING') {
        return (
            <div className="p-6 text-center">
                <p className="mb-4 text-lg font-semibold text-orange-600">
                    Candidacy applications for this election are currently closed.
                </p>
                <p className="mb-4 text-sm text-gray-700">
                    Applications are only accepted when the election status is "Upcoming". Current status: {electionDetails.status}.
                </p>
                <Link
                    to={`/voter/election/${activeElectionId}`}
                    className="font-medium text-blue-600 hover:underline"
                >
                    Back to Election Menu
                </Link>
            </div>
        );
    }

    const { positions = [], title = 'Apply for Candidacy' } = electionDetails;

    return (
        <div className="p-6">
            <h2 className="mb-6 text-center text-3xl font-bold">Apply for Candidacy: {title}</h2>
            <div className="mx-auto max-w-lg rounded-lg border bg-white p-6 shadow-sm">
                <form onSubmit={handleApply} className="space-y-4">
                    <div>
                        <label htmlFor="positionCode" className="mb-1 block text-sm font-medium text-gray-700">
                            Select Position
                        </label>
                        <select
                            id="positionCode"
                            name="positionCode"
                            value={selectedPosition}
                            onChange={(e) => setSelectedPosition(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            disabled={isSubmitting || hasApplied || positions.length === 0}
                        >
                            <option value="" disabled>-- Select a position --</option>
                            {positions.length > 0 ? (
                                positions.map((pos) => (
                                    <option key={pos.positionCode || pos.id} value={pos.positionCode}>
                                        {pos.name} ({pos.positionCode})
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No positions available for application</option>
                            )}
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting || hasApplied || positions.length === 0 || !selectedPosition}
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting Application...' : (hasApplied ? 'Application Submitted' : 'Apply for Selected Position')}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link
                        to={`/voter/election/${activeElectionId}`}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        Back to Election Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ApplyCandidacy;