import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Users, List, UserCheck, FileText, BarChart, CheckSquare } from 'lucide-react';

function ElectionLayout() {
    const navigate = useNavigate();

    const NavItem = ({ to, icon: Icon, label }) => (
        <button
            onClick={() => navigate(to)}
            className="flex w-full items-center gap-3 rounded p-2 hover:bg-slate-100"
        >
            <Icon className="h-5 w-5 text-slate-700" />
            <span className="text-sm text-slate-700">{label}</span>
        </button>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="w-64 border-r bg-white p-5">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-800">Election Admin</h1>
                    <p className="mt-1 text-sm text-slate-500">Navigation</p>
                </div>
                <nav className="space-y-1">
                    <NavItem to="/election-overview" icon={FileText} label="Overview" />
                    <NavItem to="/election-voters" icon={Users} label="Voters" />
                    <NavItem to="/election-candidates" icon={UserCheck} label="Candidates" />
                    <NavItem to="/election-positions" icon={List} label="Positions" />
                    <NavItem to="/election-ballot-preview" icon={CheckSquare} label="Ballot Preview" />
                    <NavItem to="/election-results" icon={BarChart} label="Results" />
                </nav>
            </aside>

             <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default ElectionLayout;