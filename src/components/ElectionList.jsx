import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Search, Filter, Plus } from 'lucide-react';
import { setActiveElection } from '../features/auth/authSlice';
import DateTimeFormat from './DateTimeFormat.jsx';

function ElectionList({ elections }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [activeElectionId, setActiveElectionId] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const filteredElections = useMemo(() => {
        return elections.filter((e) => {
            const s = e.publicIdentifier?.toLowerCase().includes(searchTerm.toLowerCase());
            const f = filter ? e.status?.toLowerCase() === filter.toLowerCase() : true;
            return s && f;
        });
    }, [elections, searchTerm, filter]);

    const handleActivate = (election) => {
        setError(null);
        try {
            dispatch(setActiveElection(election.publicIdentifier));
            setActiveElectionId(election.publicIdentifier);
            navigate('/election-overview');
        } catch (e) {
            console.error('Setting active election failed', e);
            setError('Could not select election. Please try again.');
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Elections</h2>
                <button
                    onClick={() => navigate('/create-election')}
                    className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white"
                >
                    <Plus className="h-5 w-5" /> New
                </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex w-full items-center rounded-lg bg-white px-3 py-2 shadow sm:w-2/3">
                    <Search className="mr-2 h-5 w-5 text-gray-500" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by ID"
                        className="w-full outline-none"
                    />
                </div>
                <div className="flex w-full items-center rounded-lg bg-white px-3 py-2 shadow sm:w-auto sm:min-w-[200px]">
                    <Filter className="mr-2 h-5 w-5 text-gray-500" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-transparent"
                    >
                        <option value="">Filter By Status</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

            <div className="overflow-x-auto rounded-lg bg-white shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Start</th>
                        <th className="p-3 text-left">End</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredElections.map((e) => (
                        <tr
                            key={e.publicIdentifier}
                            className={`border-t ${activeElectionId === e.publicIdentifier ? 'bg-green-100' : ''}`}
                        >
                            <td className="p-3">{e.title}</td>
                            <td className="p-3">
                                <DateTimeFormat value={e.startDate} />
                            </td>
                            <td className="p-3">
                                <DateTimeFormat value={e.endDate} />
                            </td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleActivate(e)}
                                    className="font-semibold text-blue-800"
                                >
                                    Do More
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredElections.length === 0 && (
                        <tr>
                            <td colSpan="4" className="py-4 text-center text-gray-500">
                                No elections found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ElectionList;