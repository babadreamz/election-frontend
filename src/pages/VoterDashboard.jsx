import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getVoterElections, logoutUserAPI } from '../services/apiService';
import { selectCurrentVoter, logoutVoter, setActiveElection } from '../features/auth/authSlice';
import ParticipateModal from '../components/ParticipateModal.jsx';

function VoterDashboard() {
    const voter = useSelector(selectCurrentVoter);
    const [elections, setElections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showElections, setShowElections] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchElections = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getVoterElections();
            setElections(res.data);
            setShowElections(true);
        } catch (e) {
            console.error('Failed to load voter elections', e);
            setError('Failed to load your elections.');
            setElections([]);
            setShowElections(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleToggleElections = () => {
        if (showElections) {
            setShowElections(false);
        } else {
            fetchElections();
        }
    };

    const handleParticipate = () => {
        setIsModalOpen(true);
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (!confirmLogout) return;
        try {
            await logoutUserAPI();
        } catch (error) {
            console.error('Logout API call failed, but logging out anyway:', error);
        } finally {
            dispatch(logoutVoter());
            navigate('/general-login', { replace: true });
        }
    };

    const handleParticipationSuccess = () => {
        fetchElections();
    };

    const handleGoToElection = (electionId) => {
        dispatch(setActiveElection(electionId));
        navigate(`/voter/election/${electionId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="flex items-center justify-between bg-green-700 px-8 py-4 text-white">
                <h1 className="text-xl font-bold">🗳️ Voter Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {voter?.firstName || 'Voter'}!</span>
                    <button onClick={handleLogout} className="font-medium hover:text-red-300">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Actions</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleToggleElections}
                            disabled={isLoading}
                            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Loading...' : (showElections ? 'Hide My Elections' : 'View My Elections')}
                        </button>
                        <button
                            onClick={handleParticipate}
                            className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                        >
                            Participate in an Election
                        </button>
                    </div>
                </div>

                {isLoading && <div className="py-4 text-center">Loading elections...</div>}
                {error && <div className="py-4 text-center text-red-500">{error}</div>}

                {!isLoading && !error && showElections && (
                    <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow">
                        <h3 className="p-4 text-xl font-semibold">My Elections</h3>
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 text-left">Election Title</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {elections.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-4 text-center text-gray-500">
                                        You have not participated in any elections yet.
                                    </td>
                                </tr>
                            ) : (
                                elections.map((election) => (
                                    <tr key={election.publicIdentifier} className="border-t">
                                        <td className="p-3">{election.title}</td>
                                        <td className="p-3">{election.status}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleGoToElection(election.publicIdentifier)}
                                                className="rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50" // <-- NEW BUTTON STYLING
                                                // disabled={election.status !== 'ONGOING'} // Optional: Re-enable if needed
                                            >
                                                View Election
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ParticipateModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                onSuccess={handleParticipationSuccess}
            />
        </div>
    );
}
export default VoterDashboard;