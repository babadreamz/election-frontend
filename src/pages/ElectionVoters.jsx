import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllVotersForElection, getElectionDetails } from '../services/apiService';
import VotersTable from '../components/VotersTable.jsx';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';

function ElectionVoters() {
    const [votersList, setVotersList] = useState([]);
    const [electionDetails, setElectionDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);
    const [isLoadingVoters, setIsLoadingVoters] = useState(false);
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(false);

    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);


    useEffect(() => {
        if (!activeElectionId) {
            console.warn('No active election identifier found, redirecting to /admin');
            navigate('/admin');
            return;
        }

        const fetchDetails = async () => {
            setIsLoadingDetails(true);
            setError('');
            try {
                const res = await getElectionDetails(activeElectionId);
                setElectionDetails(res.data);
            } catch (err) {
                console.error("Failed to fetch election details:", err);
                setError("Could not load election details.");
                setElectionDetails(null);
            } finally {
                setIsLoadingDetails(false);
            }
        };

        fetchDetails();
    }, [activeElectionId, navigate]);

    const handleViewVoters = async () => {
        if (!activeElectionId) {
            setError("Cannot load voters: Election context lost.");
            return;
        }
        setIsLoadingVoters(true);
        setError('');
        setShowTable(false);
        try {
            const res = await getAllVotersForElection(activeElectionId);
            setVotersList(Array.isArray(res.data) ? res.data : []);
            setShowTable(true);
        } catch (e) {
            console.error('Failed to load voters:', e);
            setError('Failed to load voters. Please try again.');
            setShowTable(false);
        } finally {
            setIsLoadingVoters(false);
        }
    };

    if (isLoadingDetails) {
        return <div className="p-6 text-center">Loading election data...</div>;
    }
    if (!electionDetails && !error) {
        return <div className="p-6 text-center">Could not load election information.</div>;
    }
    if (error && !electionDetails) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }


    return (
        <div className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Registered Voters for: {electionDetails?.title || 'Election'}</h2>

            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
                <button
                    onClick={handleViewVoters}
                    disabled={isLoadingVoters}
                    className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50`}
                >
                    {isLoadingVoters ? 'Loading Voters...' : 'View All Registered Voters'}
                </button>
                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            </div>

            {isLoadingVoters && <p className="text-center">Loading voters list...</p>}
            {!isLoadingVoters && showTable && <VotersTable voters={votersList} />}
        </div>
    );
}

export default ElectionVoters;