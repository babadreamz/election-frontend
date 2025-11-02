import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getElectionResults, getVoterElectionDetails } from '../services/apiService';
import ResultsDisplay from '../components/ResultsDisplay.jsx';

function VoterElectionResults() {
    const [resultsList, setResultsList] = useState([]);
    const [electionDetails, setElectionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { electionId } = useParams();

    useEffect(() => {
        if (!electionId) { /* ... redirect ... */ return; }
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const [detailsRes, resultsRes] = await Promise.all([
                    getVoterElectionDetails(electionId),
                    getElectionResults(electionId)
                ]);
                setElectionDetails(detailsRes.data);
                setResultsList(Array.isArray(resultsRes.data) ? resultsRes.data : []);
            } catch (error) {
                console.log(error);
            }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [electionId, navigate]);

    const groupedAndSortedResults = useMemo(() => {
        if (!resultsList || resultsList.length === 0) return {};
        const grouped = resultsList.reduce((acc, result) => {
            const key = result.positionName || 'Unknown Position';
            acc[key] = acc[key] || [];
            acc[key].push(result);
            return acc;
        }, {});
        for (const positionName in grouped) {
            grouped[positionName].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
        }
        return grouped;
    }, [resultsList]);

    if (isLoading) return <div className="p-6 text-center">Loading results...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!electionDetails) return <div className="p-6 text-center">Could not load election information.</div>;

    return (
        <ResultsDisplay
            groupedData={groupedAndSortedResults}
            electionTitle={electionDetails.title}
            backLink={`/voter/election/${electionId}`}
        />
    );
}

export default VoterElectionResults;