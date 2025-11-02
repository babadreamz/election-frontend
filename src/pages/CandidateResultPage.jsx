import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyCandidateResult } from '../services/apiService';
import { selectCurrentVoter } from '../features/auth/authSlice';

function CandidateResultPage() {
    const navigate = useNavigate();
    const { electionId } = useParams();
    const currentVoter = useSelector(selectCurrentVoter);

    const [resultData, setResultData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!electionId || !currentVoter?.id) {
            console.warn('My Result Page: ID or voter data missing, redirecting.');
            navigate('/voter-dashboard', { replace: true });
            return;
        }

        const fetchMyResult = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await getMyCandidateResult(electionId, currentVoter.id);
                setResultData(res.data);
            } catch (err) {
                console.error("Failed to load candidate result:", err);
                setError(err.response?.data?.message || "Could not load your result. Results might not be available yet.");
                setResultData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyResult();
    }, [electionId, currentVoter, navigate]);

    if (isLoading) {
        return <div className="p-6 text-center">Loading Your Result...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>{error}</p>
                <div className="mt-4">
                    <Link
                        to={`/voter/election/${electionId}`}
                        className="text-blue-600 hover:underline"
                    >
                        Back to Election Overview
                    </Link>
                </div>
            </div>
        );
    }

    if (!resultData) {
        return (
            <div className="p-6 text-center">
                Could not load your result data.
                <div className="mt-4">
                    <Link
                        to={`/voter/election/${electionId}`}
                        className="text-blue-600 hover:underline"
                    >
                        Back to Election Overview
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Your Result</h2>
                <p className="mb-2 text-lg text-gray-700">
                    Election: <span className="font-semibold">{resultData.electionTitle || 'N/A'}</span>
                </p>
                <p className="mb-4 text-lg text-gray-700">
                    Position: <span className="font-semibold">{resultData.positionName || 'N/A'}</span>
                </p>

                <div className="my-6 rounded-md bg-blue-50 p-4">
                    <p className="text-xl font-semibold text-blue-800">
                        Votes Received: <span className="text-3xl">{resultData.voteCount || 0}</span>
                    </p>
                    <p className="mt-1 text-base text-blue-700">
                        Percentage: <span className="font-semibold">{(resultData.percentage || 0).toFixed(2)}%</span>
                    </p>
                </div>

                <Link
                    to={`/voter/election/${electionId}`}
                    className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md hover:bg-blue-700"
                >
                    Back to Election Overview
                </Link>
            </div>
        </div>
    );
}
export default CandidateResultPage;