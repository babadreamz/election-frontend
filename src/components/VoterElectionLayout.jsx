import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Assuming getVoterElectionDetails fetches necessary info including title
import { getVoterElectionDetails } from '../services/apiService';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';
import { CheckSquare, BarChart, UserCheck, UserPlus } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => (
    <Link
        to={to}
        className="flex w-full items-center gap-3 rounded p-2 hover:bg-slate-100"
    >
        <Icon className="h-5 w-5 text-slate-700" />
        <span className="text-sm text-slate-700">{label}</span>
    </Link>
);

function VoterElectionLayout() {
    const navigate = useNavigate();
    const { electionId } = useParams();
    const activeElectionIdFromStore = useSelector(selectActiveElectionIdentifier);
    const [electionTitle, setElectionTitle] = useState('Election');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!electionId || electionId !== activeElectionIdFromStore) {
            console.warn('Election ID mismatch or missing, redirecting to voter dashboard.');
            navigate('/voter-dashboard');
            return;
        }
        const fetchTitle = async () => {
            setIsLoading(true);
            setError('');
            try {
                // Fetch fresh details just for the title
                const res = await getVoterElectionDetails(electionId);
                setElectionTitle(res.data?.title || 'Election'); // Set title from fresh data
                // --- REMOVED ---
                // localStorage.setItem('activeElection', JSON.stringify(res.data)); // Don't store full stale object
                // --- END REMOVED ---
            } catch (err) {
                console.error("Failed to fetch election details for layout:", err);
                setError("Could not load election information.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTitle();

    }, [electionId, activeElectionIdFromStore, navigate]);

    if (isLoading) {
        return <div className="p-6 text-center">Loading Election...</div>;
    }
    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="w-64 border-r bg-white p-5">
                <div className="mb-6">
                    <h1 className="truncate text-xl font-semibold text-slate-800" title={electionTitle}>
                        {electionTitle}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">Voter Menu</p>
                </div>
                <nav className="space-y-1">
                    <NavItem to={`/voter/election/${electionId}/ballot`} icon={CheckSquare} label="Cast Vote" />
                    <NavItem to={`/voter/election/${electionId}/results`} icon={BarChart} label="View Results" />
                    <NavItem to={`/voter/election/${electionId}/candidates`} icon={UserCheck} label="View Candidates" />
                    <NavItem to={`/voter/election/${electionId}/apply`} icon={UserPlus} label="Apply for Candidacy" />
                    <Link to="/voter-dashboard" className="mt-4 flex w-full items-center gap-3 rounded p-2 text-sm text-blue-600 hover:bg-slate-100">
                        &larr; Back to All Elections
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default VoterElectionLayout;