import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">
                Secure, Free and Credible Elections
            </h1>
            <p className="mb-8 max-w-xl text-gray-300">
                Create an election in seconds. Voters can vote from any location on any
                device.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">

                <Link
                    to="/create"
                    className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Create a Free Election
                </Link>
                <Link
                    to="/general-login"
                    className="rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    Login
                </Link>

                <Link
                    to="/voter-register"
                    className="rounded-lg bg-gray-700 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    Register to Vote
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;