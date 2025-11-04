import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getVoterElectionDetails, getMyParticipation } from '../services/apiService';

function ElectionBallot() {
    const navigate = useNavigate();
    const { electionId } = useParams();

    const [electionDetails, setElectionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedVotes, setSelectedVotes] = useState({});

    const [electionVoterId, setElectionVoterId] = useState(null);

    useEffect(() => {
        if (!electionId) {
            console.warn("No election ID found, redirecting.");
            navigate('/voter-dashboard');
            return;
        }
        const fetchDetails = async () => {
            setIsLoading(true);
            setError('');
            try {
                const detailsRes = await getVoterElectionDetails(electionId);
                setElectionDetails(detailsRes.data);

                const participationRes = await getMyParticipation(electionId);

                setElectionVoterId(participationRes.data.id);
            } catch (e) {
                console.error("Failed to load ballot:", e);
                setError('Failed to load ballot details. Have you participated in this election?');
            } finally {
                setIsLoading(false);
            }
        };
        void fetchDetails();
    }, [electionId, navigate]);

    const { positions = [], candidates = [], title = 'Ballot', status } = electionDetails || {};

    const handleSelect = (positionCode, candidateTag) => {
        setSelectedVotes((prev) => ({ ...prev, [positionCode]: candidateTag }));
    };

    const allPositionsVoted = useMemo(() => {
        return Array.isArray(positions) && positions.length > 0 && Object.keys(selectedVotes).length === positions.length;
    }, [selectedVotes, positions]);


    const handleSubmitSelection = () => {
        if (!allPositionsVoted || !electionVoterId) return; // Guard against missing ID

        navigate(`/voter/election/${electionId}/review`, {
            state: {
                selectedVotes,
                electionDetails,
                electionVoterId: electionVoterId
            },
        });
    };

    if (isLoading) return <div className="p-6 text-center">Loading Ballot...</div>;
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h2 className="mb-6 text-center text-3xl font-bold">
                🗳️ {title} Ballot
            </h2>
            <div className="space-y-8">
                {Array.isArray(positions) && positions.map((position) => {
                    const candidatesForPosition = Array.isArray(candidates) ? candidates.filter(
                        (c) => c.positionCode === position.positionCode
                    ) : [];
                    const currentSelection = selectedVotes[position.positionCode];

                    return (
                        <div key={position.positionCode} className="rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                {position.name} ({position.positionCode})
                            </h3>
                            {candidatesForPosition.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {candidatesForPosition.map((candidate) => {
                                        const isSelected = currentSelection === candidate.candidateTag;
                                        return (
                                            <button
                                                key={candidate.candidateTag}
                                                onClick={() => handleSelect(position.positionCode, candidate.candidateTag)}
                                                className={`rounded-md border p-3 text-left transition ${
                                                    isSelected
                                                        ? 'border-blue-600 bg-blue-100 ring-2 ring-blue-500'
                                                        : 'border-gray-300 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className="font-medium text-gray-900">
                                                    {candidate.firstName} {candidate.lastName}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="ml-4 text-sm text-gray-500">
                                    No candidates registered for this position.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleSubmitSelection}
                    className={`rounded-lg px-8 py-3 text-lg font-semibold text-white shadow-md ${
                        allPositionsVoted
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'cursor-not-allowed bg-gray-400'
                    }`}
                    disabled={!allPositionsVoted || !electionVoterId}
                >
                    {allPositionsVoted ? 'Submit Selections for Review' : 'Complete All Selections'}
                </button>
                <div className="mt-4">
                    <Link
                        to={`/voter/election/${electionId}`}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        Back to Election Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ElectionBallot;

