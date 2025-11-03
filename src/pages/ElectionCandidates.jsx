import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    viewPendingCandidates,
    approveCandidate,
    viewApprovedCandidates,
    getElectionDetails,
    declineCandidate,
} from '../services/apiService';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';
import { XCircle, CheckCircle } from 'lucide-react';

const PendingCandidatesTable = ({ candidates, onApprove, onDecline, actioningId }) => {
    if (!candidates || candidates.length === 0) {
        return <p className="mt-4 text-center text-gray-500">No pending candidates found.</p>;
    }
    return (
        <div className="mt-4 overflow-x-auto">
            <table className="min-w-full rounded-lg bg-white shadow-md">
                <thead className="bg-yellow-600 text-white">
                <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Position Code</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {candidates.map((candidate) => (
                    <tr key={candidate.pendingCandidateId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{`${candidate.firstName} ${candidate.lastName}`}</td>
                        <td className="px-4 py-3">{candidate.positionCode || 'N/A'}</td>
                        <td className="px-4 py-3 space-x-2">
                            <button
                                onClick={() => onApprove(candidate.pendingCandidateId)}
                                disabled={actioningId === candidate.pendingCandidateId}
                                className="inline-flex items-center rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                title="Approve"
                            >
                                <CheckCircle size={14} className="mr-1"/>
                                {actioningId === candidate.pendingCandidateId ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                                onClick={() => onDecline(candidate.pendingCandidateId)}
                                disabled={actioningId === candidate.pendingCandidateId}
                                className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                title="Decline"
                            >
                                <XCircle size={14} className="mr-1"/>
                                {actioningId === candidate.pendingCandidateId ? 'Processing...' : 'Decline'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const ApprovedCandidatesTable = ({ candidates }) => {
    if (!candidates || candidates.length === 0) {
        return <p className="mt-4 text-center text-gray-500">No approved candidates found.</p>;
    }
    return (
        <div className="mt-4 overflow-x-auto">
            <table className="min-w-full rounded-lg bg-white shadow-md">
                <thead className="bg-green-700 text-white">
                <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Candidate Tag</th>
                    <th className="px-4 py-3 text-left">Position</th>
                    <th className="px-4 py-3 text-left">Position Code</th>
                </tr>
                </thead>
                <tbody>
                {candidates.map((candidate) => (
                    <tr key={candidate.id || candidate.voterId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{`${candidate.firstName} ${candidate.lastName}`}</td>
                        <td className="px-4 py-3">{`${candidate.candidateTag}`}</td>
                        <td className="px-4 py-3">{candidate.positionName || 'N/A'}</td>
                        <td className="px-4 py-3">{candidate.positionCode || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};


function ElectionCandidates() {
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [approvedCandidates, setApprovedCandidates] = useState([]);
    const [electionDetails, setElectionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actioningId, setActioningId] = useState(null);
    const [viewMode, setViewMode] = useState('pending');

    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);

    const fetchPendingCandidates = useCallback(async (electionIdentifier) => {
        try {
            const res = await viewPendingCandidates(electionIdentifier);
            setPendingCandidates(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Failed to load pending candidates:', e);
            setError((prev) => prev || 'Failed to load pending candidates.');
            setPendingCandidates([]);
        }
    }, []);

    const fetchApprovedCandidates = useCallback(async (electionIdentifier) => {
        try {
            const res = await viewApprovedCandidates(electionIdentifier);
            setApprovedCandidates(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Failed to load approved candidates:', e);
            setError((prev) => prev || 'Failed to load approved candidates.');
            setApprovedCandidates([]);
        }
    }, []);

    const fetchElectionDetails = useCallback(async (electionIdentifier) => {
        try {
            const res = await getElectionDetails(electionIdentifier);
            setElectionDetails(res.data);
        } catch (e) {
            console.error('Failed to load election details:', e);
            setError((prev) => prev || 'Failed to load election details.');
            setElectionDetails(null);
        }
    }, []);

    useEffect(() => {
        if (!activeElectionId) {
            console.warn("No active election identifier found in Redux, navigating to /admin");
            navigate('/admin');
            return;
        }
        const loadInitialData = async () => {
            setIsLoading(true);
            setError('');
            await Promise.all([
                fetchElectionDetails(activeElectionId),
                fetchPendingCandidates(activeElectionId),
                fetchApprovedCandidates(activeElectionId)
            ]);
            setIsLoading(false);
        };
        loadInitialData();
    }, [activeElectionId, fetchElectionDetails, fetchPendingCandidates, fetchApprovedCandidates, navigate]);

    const handleApprove = async (pendingCandidateId) => {
        if (!activeElectionId) {
            setError("Cannot approve candidate: Election context lost.");
            return;
        }
        setActioningId(pendingCandidateId);
        setError('');
        try {
            await approveCandidate(pendingCandidateId);
            setPendingCandidates(prev => prev.filter(p => p.pendingCandidateId !== pendingCandidateId));
            await fetchApprovedCandidates(activeElectionId);
        } catch (e) {
            console.error('Failed to approve candidate:', e);
            setError(e.response?.data?.message || 'Failed to approve candidate.');
        } finally {
            setActioningId(null);
        }
    };

    const handleDecline = async (pendingCandidateId) => {
        if (!activeElectionId) {
            setError("Cannot decline candidate: Election context lost.");
            return;
        }
        setActioningId(pendingCandidateId);
        setError('');
        try {
            await declineCandidate(pendingCandidateId, activeElectionId);
            setPendingCandidates(prev => prev.filter(p => p.pendingCandidateId !== pendingCandidateId));
        } catch (e) {
            console.error('Failed to decline candidate:', e);
            setError(e.response?.data?.message || 'Failed to decline candidate.');
        } finally {
            setActioningId(null);
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center">Loading Candidates...</div>;
    }
    if (error && !electionDetails) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }
    if (!electionDetails) {
        return <div className="p-6 text-center">Could not load election details.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Manage Candidates for: {electionDetails.title}</h2>

            <div className="mb-6 flex space-x-4 border-b pb-2">
                <button
                    onClick={() => setViewMode('pending')}
                    className={`rounded px-4 py-2 font-medium ${
                        viewMode === 'pending'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Pending Candidates ({pendingCandidates.length})
                </button>
                <button
                    onClick={() => setViewMode('approved')}
                    className={`rounded px-4 py-2 font-medium ${
                        viewMode === 'approved'
                            ? 'border-b-2 border-green-600 text-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Approved Candidates ({approvedCandidates.length})
                </button>
            </div>

            {error && electionDetails && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}

            {viewMode === 'pending' && (
                <PendingCandidatesTable
                    candidates={pendingCandidates}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                    actioningId={actioningId}
                />
            )}
            {viewMode === 'approved' && (
                <ApprovedCandidatesTable candidates={approvedCandidates} />
            )}

            <div className="mt-6 text-center">
                <Link
                    to="/election-overview"
                    className="text-sm text-gray-600 hover:underline"
                >
                    Back to Election Overview
                </Link>
            </div>
        </div>
    );
}

export default ElectionCandidates;