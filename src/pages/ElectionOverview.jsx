import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Users,
    List,
    UserCheck,
    Download,
    Play,
    StopCircle,
    Calculator,
    BarChart
} from 'lucide-react';
import DateTimeFormat from '../components/DateTimeFormat.jsx';
import GenerateIdsModal from '../components/GenerateIdsModal.jsx';
import {
    getElectionDetails,
    startElection,
    endElection,
    computeElectionResults
} from '../services/apiService.js';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice.js';

function ElectionOverview() {
    const navigate = useNavigate();
    const activeElectionId = useSelector(selectActiveElectionIdentifier);
    const [electionData, setElectionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    const fetchDetails = useCallback(async () => {
        if (!activeElectionId) return;
        setError(null);
        setActionError(null);
        try {
            const res = await getElectionDetails(activeElectionId);
            setElectionData(res.data);
            localStorage.setItem('activeElection', JSON.stringify(res.data));
        } catch (err) {
            console.error("Failed to fetch election details:", err);
            setError("Could not load election overview.");
            setElectionData(null);
        } finally {
            setIsLoading(false);
        }
    }, [activeElectionId]);

    useEffect(() => {
        if (!activeElectionId) {
            console.warn('No active election identifier found, redirecting to /admin');
            navigate('/admin');
        } else {
            setIsLoading(true);
            fetchDetails().finally(() => setIsLoading(false));
        }
    }, [activeElectionId, navigate, fetchDetails]);

    const handleStartElection = async () => {
        if (!electionData?.publicIdentifier || isActionLoading) return;
        if (!window.confirm("Are you sure you want to start this election immediately? This action is final.")) return;

        setIsActionLoading(true);
        setActionError(null);
        try {
            await startElection(electionData.publicIdentifier);
            await fetchDetails();
            alert("Election started successfully!");
        } catch (err) {
            console.error("Failed to start election:", err);
            setActionError(err.response?.data?.message || "Failed to start election.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleEndElection = async () => {
        if (!electionData?.publicIdentifier || isActionLoading) return;
        if (!window.confirm("Are you sure you want to end this election immediately? This action is final.")) return;

        setIsActionLoading(true);
        setActionError(null);
        try {
            await endElection(electionData.publicIdentifier);
            await fetchDetails();
            alert("Election ended successfully!");
        } catch (err) {
            console.error("Failed to end election:", err);
            setActionError(err.response?.data?.message || "Failed to end election.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleComputeResults = async () => {
        if (!electionData?.publicIdentifier || isActionLoading) return;
        if (!window.confirm("Are you sure you want to compute the results? This will calculate and save the final tally. This action can be run multiple times.")) return;

        setIsActionLoading(true);
        setActionError(null);
        try {
            await computeElectionResults(electionData.publicIdentifier);
            await fetchDetails();
            alert("Results computed successfully!");
        } catch (err) {
            console.error("Failed to compute results:", err);
            setActionError(err.response?.data?.message || "Failed to compute results.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleViewResults = () => {
        navigate('/election-results');
    };


    if (isLoading) return <div className="p-6 text-center">Loading election overview...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!electionData) return <div className="p-6 text-center">Could not load election details.</div>;

    const { title, startDate, endDate, status, positions = [], candidates = [], voters = [] } = electionData;

    const counts = { voters: voters.length, positions: positions.length, candidates: candidates.length };
    const statCards = [
        { key: 'voters', title: 'Voters', count: counts.voters, icon: Users, color: 'bg-orange-500', route: '/election-voters' },
        { key: 'positions', title: 'Positions', count: counts.positions, icon: List, color: 'bg-pink-600', route: '/election-positions' },
        { key: 'candidates', title: 'Candidates', count: counts.candidates, icon: UserCheck, color: 'bg-indigo-600', route: '/election-candidates' },
    ];
    const goTo = (route) => navigate(route);

    return (
        <>
            <header className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                    status === 'UPCOMING' ? 'bg-yellow-500' : status === 'ONGOING' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                     {status}
                 </span>
                <div className="text-sm text-slate-500">{new Date().toLocaleDateString()}</div>
            </header>

            <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow">
                <div>
                    <p>Start: <DateTimeFormat value={startDate} /></p>
                    <p>End: <DateTimeFormat value={endDate} /></p>
                </div>
                <button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                    <Download className="h-5 w-5" /> Generate Voter IDs
                </button>
            </section>

            {actionError && <p className="mb-4 text-center text-sm text-red-500">{actionError}</p>}

            <section className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-red-800">Emergency Actions</h3>
                <div className="flex flex-wrap gap-4">
                    {status === 'UPCOMING' && (
                        <button
                            onClick={handleStartElection}
                            disabled={isActionLoading}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            <Play className="h-5 w-5" /> {isActionLoading ? 'Starting...' : 'Start Election Now'}
                        </button>
                    )}
                    {status === 'ONGOING' && (
                        <button
                            onClick={handleEndElection}
                            disabled={isActionLoading}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            <StopCircle className="h-5 w-5" /> {isActionLoading ? 'Ending...' : 'End Election Now'}
                        </button>
                    )}
                    {status !== 'UPCOMING' && status !== 'ONGOING' && (
                        <p className="text-sm text-gray-600">No emergency actions available for '{status}' status.</p>
                    )}
                </div>
            </section>

            {status === 'COMPLETED' && (
                <section className="mb-6 rounded-lg border border-blue-300 bg-blue-50 p-4 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-blue-800">Post-Election Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleComputeResults}
                            disabled={isActionLoading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Calculator className="h-5 w-5" />
                            {isActionLoading ? 'Computing...' : 'Compute Results'}
                        </button>
                        <button
                            onClick={handleViewResults}
                            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
                        >
                            <BarChart className="h-5 w-5" />
                            View Results
                        </button>
                    </div>
                </section>
            )}

            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map(({ key, title, count, icon, color, route }) => {
                    const IconComponent = icon;
                    return (
                        <button
                            key={key}
                            onClick={() => goTo(route)}
                            className={`flex justify-between rounded-xl p-5 text-white shadow transition hover:-translate-y-0.5 ${color}`}
                        >
                            <div>
                                <p>{title}</p>
                                <h3 className="text-3xl font-bold">{count}</h3>
                            </div>
                            <IconComponent className="h-8 w-8" />
                        </button>
                    );
                })}
            </section>

            <div className="mt-8 text-center">
                <Link
                    to="/admin"
                    className="text-sm text-gray-600 hover:underline"
                >
                    Back to Main Dashboard
                </Link>
            </div>

            <GenerateIdsModal
                isOpen={isGenerateModalOpen}
                setIsOpen={setIsGenerateModalOpen}
                onSuccess={fetchDetails}
                electionPublicId={activeElectionId}
            />
        </>
    );
}

export default ElectionOverview;