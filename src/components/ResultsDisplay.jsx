import React from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

function ResultsDisplay({ groupedData, electionTitle, backLink }) {

    if (!groupedData || Object.keys(groupedData).length === 0) {
        return (
            <div className="p-6 text-center">
                No results available yet for this election.
                <div className="mt-4">
                    <Link to={backLink || "/"} className="text-blue-600 hover:underline">
                        Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
                Election Results — {electionTitle}
            </h2>

            {Object.entries(groupedData).map(([positionName, sortedCandidates]) => {

                const totalVotes = sortedCandidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);
                const highestVoteCount = sortedCandidates.length > 0 ? (sortedCandidates[0].voteCount || 0) : 0;
                const numberOfWinners = sortedCandidates.filter(c => c.voteCount === highestVoteCount).length;
                const hasUniqueWinner = totalVotes > 0 && numberOfWinners === 1;

                return (
                    <div key={positionName} className="mb-10">
                        <h3 className="mb-3 text-xl font-semibold text-blue-700">{positionName}</h3>
                        <table className="mb-4 w-full overflow-hidden rounded-lg bg-white shadow-md">
                            <thead className="bg-blue-700 text-white">
                            <tr>
                                <th className="px-4 py-2 text-left">Candidate</th>
                                <th className="px-4 py-2 text-left">Votes</th>
                                <th className="px-4 py-2 text-left">Percentage</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedCandidates.map((c, index) => {
                                const percentage = totalVotes > 0 ? ((c.voteCount || 0) / totalVotes) * 100 : 0;
                                const isTheUniqueWinner = hasUniqueWinner && c.voteCount === highestVoteCount;
                                const candidateName = c.candidateName || 'N/A';

                                return (
                                    <tr
                                        key={c.candidateTag || c.id || index}
                                        className={`border-b hover:bg-blue-50 ${isTheUniqueWinner ? 'bg-green-100 font-semibold' : ''}`}
                                    >
                                        <td className="flex items-center gap-2 px-4 py-2">
                                            {isTheUniqueWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                                            {candidateName}
                                        </td>
                                        <td className="px-4 py-2">{c.voteCount || 0}</td>
                                        <td className="px-4 py-2">{percentage.toFixed(2)}%</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <div className="space-y-2">
                            {sortedCandidates.map((c, index) => {
                                const percentage = totalVotes > 0 ? ((c.voteCount || 0) / totalVotes) * 100 : 0;
                                const isTheUniqueWinner = hasUniqueWinner && c.voteCount === highestVoteCount;
                                const candidateName = c.candidateName || 'N/A';
                                return (
                                    <div key={c.candidateTag || c.id || index} className="flex items-center gap-2">
                                        <span className="w-32 truncate text-sm">{candidateName}</span>
                                        <div className="h-3 flex-1 rounded-full bg-gray-200">
                                            <div
                                                className={`h-3 rounded-full ${isTheUniqueWinner ? 'bg-green-600' : 'bg-blue-600'}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-12 text-right text-sm">{percentage.toFixed(1)}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <div className="mt-8 text-center">
                <Link to={backLink || "/"} className="font-medium text-blue-600 hover:text-blue-800">
                    Back
                </Link>
            </div>
        </div>
    );
}

export default ResultsDisplay;