import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PositionTable from '../components/PositionTable';
import { getElectionDetails, deletePosition } from '../services/apiService';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';

function ElectionPositions() {
    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);

    const [electionData, setElectionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [deletingCode, setDeletingCode] = useState(null);

    const fetchDetails = useCallback(async () => {
        if (!activeElectionId) return;
        // setIsLoading(true);
        setError(null);
        setActionError(null);
        try {
            const res = await getElectionDetails(activeElectionId);
            setElectionData(res.data);
            localStorage.setItem('activeElection', JSON.stringify(res.data));
        } catch (err) {
            console.error("Failed to fetch election details:", err);
            setError("Could not load election positions.");
            setElectionData(null);
        } finally {
            // setIsLoading(false);
        }
    }, [activeElectionId]);

    useEffect(() => {
        if (!activeElectionId) {
            console.warn('No active election identifier found in Redux, redirecting to /admin');
            navigate('/admin');
            return;
        }
        setIsLoading(true);
        fetchDetails().finally(() => setIsLoading(false));
    }, [activeElectionId, navigate, fetchDetails]);

    const handleAddPosition = () => {
        if (electionData) {
            navigate('/create-position', { state: electionData });
        } else {
            setError("Cannot add position until election data loads.");
        }
    };

    const handleDeletePosition = async (positionCode) => {
        if (!activeElectionId) {
            setActionError("Cannot delete: Election context lost.");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete position "${positionCode}"? This cannot be undone.`)) {
            return;
        }

        setDeletingCode(positionCode);
        setActionError(null);
        try {
            await deletePosition(positionCode, activeElectionId);
            await fetchDetails();
        } catch (err) {
            console.error("Failed to delete position:", err);
            setActionError(err.response?.data?.message || "Failed to delete position.");
        } finally {
            setDeletingCode(null);
        }
    };

    const { positions = [], title = 'Election Positions' } = electionData || {};

    if (isLoading) {
        return <div className="p-6 text-center">Loading positions...</div>;
    }

    if (error && !electionData) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!electionData) {
        return <div className="p-6 text-center">Could not load election data.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Manage Positions for: {title}</h2>

            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
                <button
                    onClick={handleAddPosition}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    disabled={!electionData}
                >
                    Add New Position
                </button>
            </div>

            {actionError && <p className="mb-4 text-center text-sm text-red-500">{actionError}</p>}

            <h3 className="mb-3 mt-6 text-xl font-semibold">Current Positions</h3>
            <PositionTable
                positions={positions}
                onDelete={handleDeletePosition}
                deletingCode={deletingCode}
            />

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
export default ElectionPositions;