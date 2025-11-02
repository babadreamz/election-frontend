import React from 'react';
import { Trash2 } from 'lucide-react';

const PositionTable = ({ positions, onDelete, deletingCode }) => {
    if (!positions || positions.length === 0) {
        return <p className="mt-4 text-center text-gray-500">No Positions found.</p>;
    }
    return (
        <div className="mt-4 overflow-x-auto">
            <table className="w-full overflow-hidden rounded-lg bg-white shadow-md">
                <thead className="bg-blue-700 text-white">
                <tr>
                    <th className="px-4 py-3 text-left">Position Name</th>
                    <th className="px-4 py-3 text-left">Position Code</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {positions.map((position) => (
                    <tr
                        key={position.positionCode || position.id}
                        className="border-b transition hover:bg-blue-50"
                    >
                        <td className="px-4 py-3">{position.name}</td>
                        <td className="px-4 py-3">{position.positionCode}</td>
                        <td className="px-4 py-3">
                            <button
                                onClick={() => onDelete(position.positionCode)}
                                disabled={deletingCode === position.positionCode}
                                className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                title="Delete Position"
                            >
                                <Trash2 size={14} className="mr-1" />
                                {deletingCode === position.positionCode ? 'Deleting...' : 'Delete'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default PositionTable;