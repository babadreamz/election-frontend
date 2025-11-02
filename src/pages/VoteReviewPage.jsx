import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { castVote } from '../services/apiService';
import { selectCurrentVoter } from '../features/auth/authSlice';

function VoteReviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { electionId } = useParams();
    const voter = useSelector(selectCurrentVoter);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { selectedVotes, electionDetails } = location.state || {};

    useEffect(() => {
        if (!selectedVotes || !electionDetails || !voter?.id || !voter?.voterId) {
            console.error('Missing data for review page (state, voter, or voter IDs), redirecting.');
            navigate(`/voter/election/${electionId || ''}/ballot`, { replace: true });
        }
    }, [selectedVotes, electionDetails, voter, navigate, electionId]);

    if (!selectedVotes || !electionDetails || !voter?.id || !voter?.voterId) {
        return <div className="p-6 text-center">Loading review...</div>;
    }


    const { positions = [], candidates = [], title } = electionDetails;

    const getPayload = () => {
        const voteEntries = Object.entries(selectedVotes).map(
            ([positionCode, candidateTag]) => ({ positionCode, candidateTag })
        );
        return {
            electionPublicId: electionId,
            electionVoterId: voter.id,
            voterId: voter.voterId,
            voteEntries,
        };
    };


    const handleCastVote = async () => {
        setIsLoading(true);
        setError('');
        const payload = getPayload();
        console.log("Casting vote with payload:", payload);
        if (!payload.electionVoterId || !payload.voterId) {
            setError("Could not identify voter. Please log out and log back in.");
            setIsLoading(false);
            return;
        }

        try {
            await castVote(payload);
            navigate('/vote-success', { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to cast vote. You may have already voted.';
            setError(message);
            if (message.toLowerCase().includes("expired") || message.toLowerCase().includes("unauthorized")) {
                localStorage.removeItem("voterToken");
                navigate("/voter-login", { replace: true });
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h2 className="mb-6 text-center text-3xl font-bold">
                🗳️ Review Your Vote for {title}
            </h2>

            <div className="mx-auto max-w-lg rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Your Selections:</h3>
                <ul className="mb-6 space-y-2">
                    {Object.entries(selectedVotes).map(([posCode, candTag]) => {
                        const position = positions.find((p) => p.positionCode === posCode);
                        const candidate = candidates.find((c) => c.candidateTag === candTag);
                        const posName = position?.name || posCode;
                        const candName = candidate ? `${candidate.firstName} ${candidate.lastName}` : candTag;

                        return (
                            <li key={posCode} className="border-b pb-1">
                                <span className="font-medium text-gray-700">{posName}:</span>{' '}
                                <span className="text-gray-900">{candName}</span>
                            </li>
                        );
                    })}
                </ul>

                {error && (
                    <p className="mb-4 text-center text-sm text-red-500">{error}</p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Link
                        to={`/voter/election/${electionId}/ballot`}
                        state={{ selectedVotes, electionDetails }}
                        className={`w-full rounded-lg bg-gray-500 px-6 py-3 text-center font-semibold text-white shadow-md hover:bg-gray-600 sm:w-auto ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        aria-disabled={isLoading}
                    >
                        Edit Ballot
                    </Link>
                    <button
                        onClick={handleCastVote}
                        disabled={isLoading}
                        className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-green-700 disabled:opacity-50 sm:w-auto"
                    >
                        {isLoading ? 'Casting Vote...' : 'Confirm and Cast Vote'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VoteReviewPage;