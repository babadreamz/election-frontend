import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveElectionIdentifier } from '../features/auth/authSlice';
import { CheckCircle } from 'lucide-react';

function VoteSuccessPage() {
    const activeElectionId = useSelector(selectActiveElectionIdentifier);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h2 className="mb-4 text-3xl font-bold text-green-700">Vote Cast Successfully!</h2>
                <p className="mb-6 text-gray-600">
                    Your vote has been securely recorded. Thank you for participating.
                </p>
                {activeElectionId ? (
                    <Link
                        to={`/voter/election/${activeElectionId}`}
                        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-green-700"
                    >
                        Back to Election Overview
                    </Link>
                ) : (
                    <Link
                        to="/voter-dashboard"
                        className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-gray-600"
                    >
                        Back to Dashboard
                    </Link>
                )}
            </div>
        </div>
    );
}

export default VoteSuccessPage;