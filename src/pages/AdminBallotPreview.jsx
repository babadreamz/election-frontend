import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getElectionDetails } from '../services/apiService';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';

function AdminBallotPreview() {
    const [electionDetails, setElectionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);

    useEffect(() => {
        if (!activeElectionId) {
            console.warn('No active election identifier found, redirecting.');
            navigate('/admin');
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await getElectionDetails(activeElectionId);
                setElectionDetails(res.data);
            } catch (e) {
                console.error('Failed to load election details:', e);
                setError('Failed to load election details.');
                setElectionDetails(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [activeElectionId, navigate]);

    if (isLoading) {
        return <div className="p-6 text-center">Loading ballot preview...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!electionDetails) {
        return <div className="p-6 text-center">Could not load election details.</div>;
    }

    const { title, positions = [], candidates = [] } = electionDetails;

    return (
        <div className="p-6">
            <h2 className="mb-6 text-center text-3xl font-bold">
                Ballot Preview: {title}
            </h2>

            {positions.map((position) => {
                const candidatesForPosition = candidates.filter(
                    (c) => c.positionCode === position.positionCode || c.position?.positionCode === position.positionCode
                );
                return (
                    <div key={position.positionCode || position.id} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                            {position.name} ({position.positionCode})
                        </h3>
                        {candidatesForPosition.length > 0 ? (
                            <ul className="list-disc space-y-2 pl-5">
                                {candidatesForPosition.map((candidate) => (
                                    <li key={candidate.candidateTag || candidate.id} className="text-gray-700">
                                        {candidate.firstName} {candidate.lastName}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="ml-4 text-sm text-gray-500">
                                No candidates currently assigned to this position.
                            </p>
                        )}
                    </div>
                );
            })}

            <div className="mt-6 text-center">
                <Link
                    to="/election-overview"
                    className="font-medium text-blue-600 hover:text-blue-800"
                >
                    Back to Election Overview
                </Link>
            </div>
        </div>
    );
}

export default AdminBallotPreview;