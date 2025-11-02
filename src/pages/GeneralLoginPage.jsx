import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Shield, Home } from 'lucide-react';

function GeneralLoginPage() {
    const navigate = useNavigate();

    const roles = [
        {
            label: 'Admin',
            icon: Shield,
            path: '/admin-login',
            color: 'bg-blue-600 hover:bg-blue-700',
            description: 'Manage elections, candidates, and results',
        },
        {
            label: 'Voter',
            icon: User,
            path: '/voter-login',
            color: 'bg-green-600 hover:bg-green-700',
            description: 'Cast your vote securely',
        },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-lg rounded-2xl bg-gray-800 p-8 text-center shadow-lg">
                <h1 className="mb-6 text-3xl font-bold">Login Portal</h1>
                <p className="mb-8 text-gray-300">
                    Choose your role to access the election system
                </p>

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <button
                                key={role.label}
                                onClick={() => navigate(role.path)}
                                className={`flex w-full flex-col items-center justify-center rounded-xl p-6 transition sm:w-1/2 ${role.color}`}
                            >
                                <Icon className="mb-2 h-10 w-10" />
                                <span className="text-lg font-semibold">{role.label}</span>
                                <p className="text-xs opacity-80">{role.description}</p>
                            </button>
                        );
                    })}
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-500"
                >
                    <Home size={16} />
                    Back Home
                </Link>

                <p className="mt-6 text-sm text-gray-400">
                    Secure • Reliable • Transparent
                </p>
            </div>
        </div>
    );
}

export default GeneralLoginPage;