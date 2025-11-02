import React from "react";

const VotersTable = ({ voters }) => {
    if (!voters || voters.length === 0) {
        return <p className="text-gray-500 text-center mt-4">No voters found.</p>;
    }

    return (
        <div className="overflow-x-auto mt-4">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-700 text-white">
                <tr>
                    <th className="py-3 px-4 text-left">FirstName</th>
                    <th className="py-3 px-4 text-left">LastName</th>
                </tr>
                </thead>
                <tbody>
                {voters.map((voter, index) => (
                    <tr key={index} className="border-b hover:bg-blue-50 transition">
                        <td className="py-3 px-4">{voter.firstName}</td>
                        <td className="py-3 px-4">{voter.lastName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VotersTable;
