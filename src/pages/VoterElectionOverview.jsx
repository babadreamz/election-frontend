import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    getVoterElectionDetails,
    withdrawCandidacy,
    getMyCandidateResult
} from '../services/apiService';
import {
    selectCurrentVoter,
    selectActiveElectionIdentifier,
    setActiveElection,
    logoutVoter
} from '../features/auth/authSlice';
import DateTimeFormat from '../components/DateTimeFormat.jsx';
import { CheckSquare, BarChart, UserCheck, UserPlus, AlertTriangle } from 'lucide-react';

function VoterElectionOverview() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { electionId } = useParams();
    const currentVoter = useSelector(selectCurrentVoter);
    const activeElectionIdFromStore = useSelector(selectActiveElectionIdentifier);
    const [electionDetails, setElectionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchDetails = useCallback(async () => {
        if (!electionId) return;
        setError('');
        setActionError('');
        try {
            const res = await getVoterElectionDetails(electionId);
            setElectionDetails(res.data);
        } catch (err) {
            console.error("Failed to fetch election details for voter:", err);
            setError('Could not load election details.');
            setElectionDetails(null);
        }
    }, [electionId]);


    useEffect(() => {
        if (!electionId || !currentVoter?.id) {
            console.warn('Voter Election Overview: ID or voter data missing, redirecting.');
            if (electionId !== activeElectionIdFromStore) {
                dispatch(setActiveElection(null));
            }
            navigate('/voter-dashboard', { replace: true });
            return;
        }
        if (electionId !== activeElectionIdFromStore) {
            dispatch(setActiveElection(electionId));
        }

        const loadData = async () => {
            setIsLoading(true);
            await fetchDetails();
            setIsLoading(false);
        }
        loadData();

    }, [electionId, currentVoter, activeElectionIdFromStore, navigate, dispatch, fetchDetails]);

    const isCandidateForThisElection = useMemo(() => {
        if (!currentVoter || !electionDetails?.candidates) return false;
        return electionDetails.candidates.some(
            (candidate) => candidate?.electionVoter?.voter?.voterId === currentVoter.voterId
        );
    }, [currentVoter, electionDetails]);

    const handleWithdraw = async () => {
        if (!currentVoter?.id) { /* ... */ return; }
        if (!window.confirm("Are you sure you want to withdraw your candidacy?")) return;
        setIsActionLoading(true);
        setActionError('');
        try {
            await withdrawCandidacy(electionId, currentVoter.id);
            alert("You have successfully withdrawn your candidacy.");
            await fetchDetails();
        } catch (err) { if (err.response?.status === 401 || err.response?.status === 403) {
            dispatch(logoutVoter());
            navigate('/voter-login', { replace: true });
        } }
        finally { setIsActionLoading(false); }
    };

    const handleViewMyResult = () => {
        navigate(`/voter/election/${electionId}/my-result`);
    };

    if (isLoading) return <div className="p-6 text-center">Loading Election Overview...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!electionDetails) return <div className="p-6 text-center">Could not load election details.</div>;

    const { title, startDate, endDate, status } = electionDetails;

    const actionCards = [
        ...(status === 'ONGOING' ? [{ key: 'vote', title: 'Cast Your Vote', icon: CheckSquare, color: 'bg-blue-600', route: 'ballot' }] : []),
        { key: 'candidates', title: 'View All Candidates', icon: UserCheck, color: 'bg-indigo-600', route: 'candidates' },
        { key: 'results', title: 'View All Results', icon: BarChart, color: 'bg-green-600', route: 'results' },
        ...(status === 'UPCOMING' && !isCandidateForThisElection ? [{ key: 'apply', title: 'Apply for Candidacy', icon: UserPlus, color: 'bg-orange-500', route: 'apply' }] : []),
        ...(isCandidateForThisElection && status === 'COMPLETED' ? [{ key: 'my-result', title: 'View My Result', icon: BarChart, color: 'bg-teal-600', action: handleViewMyResult }] : []),
    ];

    return (
        <div>
            <header className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow">
                <div>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="text-sm text-gray-500">Status:
                        <span className={`ml-1 font-medium ${ status === 'UPCOMING' ? 'text-yellow-600' : status === 'ONGOING' ? 'text-green-600' : 'text-red-600' }`}>
                              {status}
                         </span>
                    </p>
                </div>
                <div className="text-right text-sm text-gray-600">
                    <p>Start: <DateTimeFormat value={startDate} /></p>
                    <p>End: <DateTimeFormat value={endDate} /></p>
                </div>
            </header>

            {actionError && <p className="mb-4 text-center text-sm text-red-500">{actionError}</p>}

            {isCandidateForThisElection && (
                <section className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-yellow-800">Candidate Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        {status === 'UPCOMING' && (
                            <button
                                onClick={handleWithdraw}
                                disabled={isActionLoading}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                <AlertTriangle className="h-5 w-5" />
                                {isActionLoading ? 'Processing...' : 'Withdraw Candidacy'}
                            </button>
                        )}
                        {status !== 'UPCOMING' && (
                            <p className="text-sm text-gray-600">No candidate actions available for current election status ({status}).</p>
                        )}
                    </div>
                </section>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {actionCards.map(({ key, title, icon: Icon, color, route, action }) => (
                    action ? (
                        <button
                            key={key}
                            onClick={action}
                            disabled={isActionLoading && key === 'my-result'}
                            className={`flex flex-col items-center justify-center rounded-xl p-6 text-white shadow transition hover:-translate-y-1 ${color} disabled:opacity-70`}
                        >
                            <Icon className="mb-2 h-8 w-8" />
                            <span className="text-center font-semibold">{title}</span>
                        </button>
                    ) : (
                        <Link
                            key={key}
                            to={route}
                            className={`flex flex-col items-center justify-center rounded-xl p-6 text-white shadow transition hover:-translate-y-1 ${color}`}
                        >
                            <Icon className="mb-2 h-8 w-8" />
                            <span className="text-center font-semibold">{title}</span>
                        </Link>
                    )
                ))}
            </section>

            <div className="mt-8 text-center">
                <Link
                    to="/voter-dashboard"
                    className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                >
                    &larr; Back to All Elections
                </Link>
            </div>
        </div>
    );
}
export default VoterElectionOverview;