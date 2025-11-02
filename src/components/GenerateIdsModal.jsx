import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { generateVoterIds } from '../services/apiService';

function GenerateIdsModal({ isOpen, setIsOpen, onSuccess, electionPublicId }) {
    const [numVoters, setNumVoters] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setNumVoters('');
            setError('');
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!electionPublicId) {
            setError('Election ID is missing. Cannot generate IDs.');
            return;
        }

        const voterCount = parseInt(numVoters, 10);
        if (isNaN(voterCount) || voterCount <= 0) {
            setError('Please enter a valid positive number of voters.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await generateVoterIds(voterCount, electionPublicId);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'membership_ids.xlsx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setIsOpen(false);
            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            console.error("Generate IDs error:", err);
            let errorMessage = 'Failed to generate IDs. Have they already been generated, or is the election ID correct?';
            if (err.response && err.response.data instanceof Blob && err.response.data.type === "application/json") {
                try {
                    const errorJson = JSON.parse(await err.response.data.text());
                    errorMessage = errorJson.message || errorMessage;
                } catch (parseError) {
                    console.error("Could not parse error blob:", parseError);
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => !isLoading && setIsOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                        Generate Voter IDs
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the total number of voters you expect. This can only be done once per election.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="numVoters" className="sr-only">Number of Voters</label>
                            <input
                                type="number"
                                name="numVoters"
                                id="numVoters"
                                min="1"
                                value={numVoters}
                                onChange={(e) => setNumVoters(e.target.value)}
                                placeholder="Number of Voters (e.g., 500)"
                                className="mt-1 block w-full rounded-md border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Generating...' : 'Generate & Export'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                                className="w-full rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
export default GenerateIdsModal;