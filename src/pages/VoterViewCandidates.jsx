import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { viewApprovedCandidates, getVoterElectionDetails } from '../services/apiService';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';

const CandidatesDisplayTable = ({ candidates }) => {
    if (!candidates || candidates.length === 0) {
        return <p className="mt-4 text-center text-gray-500">No candidates found for this election.</p>;
    }
    return (
        <div className="mt-4 overflow-x-auto">
            <table className="min-w-full rounded-lg bg-white shadow-md">
                <thead className="bg-green-700 text-white">
                <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Candidate Tag</th>
                    <th className="px-4 py-3 text-left">Position Name</th>
                    <th className="px-4 py-3 text-left">Position Code</th>
                </tr>
                </thead>
                <tbody>
                {candidates.map((candidate) => (
                    <tr key={candidate.id || candidate.candidateTag} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{`${candidate.firstName} ${candidate.lastName}`}</td>
                        <td className="px-4 py-3">{candidate.candidateTag || 'N/A'}</td>
                        <td className="px-4 py-3">{candidate.positionName || 'N/A'}</td>
                        <td className="px-4 py-3">{candidate.positionCode || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};


function VoterViewCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [electionDetails, setElectionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);

    useEffect(() => {
        if (!activeElectionId) {
            console.warn("No active election ID, redirecting...");
            navigate('/voter-dashboard');
            return;
        }

        const loadData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const [detailsRes, candidatesRes] = await Promise.all([
                    getVoterElectionDetails(activeElectionId),
                    viewApprovedCandidates(activeElectionId)
                ]);
                setElectionDetails(detailsRes.data);
                setCandidates(Array.isArray(candidatesRes.data) ? candidatesRes.data : []);
            } catch (err) {
                console.error("Failed to load election candidates:", err);
                setError("Could not load candidate information.");
                setElectionDetails(null);
                setCandidates([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

    }, [activeElectionId, navigate]);

    if (isLoading) {
        return <div className="p-6 text-center">Loading Candidates...</div>;
    }
    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }
    if (!electionDetails) {
        return <div className="p-6 text-center">Could not load election details.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Candidates for: {electionDetails.title}</h2>

            <CandidatesDisplayTable candidates={candidates} />

            <div className="mt-6 text-center">
                <Link
                    to={`/voter/election/${activeElectionId}`}
                    className="text-sm text-gray-600 hover:underline"
                >
                    Back to Election Menu
                </Link>
            </div>
        </div>
    );
}

export default VoterViewCandidates;