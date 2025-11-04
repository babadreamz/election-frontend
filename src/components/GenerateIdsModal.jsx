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
            console.log(`Requesting generation of ${voterCount} voter IDs for election ${electionPublicId}`);
            const response = await generateVoterIds(voterCount, electionPublicId);

            console.log('Response received:', response.status);
            console.log('Response headers:', response.headers);

            // IMPROVED: Better blob handling
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            console.log('Blob created, size:', blob.size, 'bytes');

            // IMPROVED: Extract filename from Content-Disposition header
            let filename = 'membership_ids.xlsx';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            console.log('Using filename:', filename);

            // IMPROVED: Create and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                console.log('Download cleanup completed');
            }, 100);

            // Success!
            console.log('Voter IDs generated and downloaded successfully');
            setIsOpen(false);
            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            console.error("Generate IDs error:", err);
            console.error("Error response:", err.response);

            let errorMessage = 'Failed to generate IDs.';

            // IMPROVED: Better error message extraction
            if (err.response) {
                console.log('Error status:', err.response.status);
                console.log('Error data type:', typeof err.response.data);

                // Handle Blob error responses (when backend returns JSON error as blob)
                if (err.response.data instanceof Blob) {
                    try {
                        const text = await err.response.data.text();
                        console.log('Error blob content:', text);

                        // Try to parse as JSON
                        try {
                            const errorJson = JSON.parse(text);
                            errorMessage = errorJson.message || errorJson.error || errorMessage;
                        } catch (parseError) {
                            // If not JSON, use the text directly
                            errorMessage = text || errorMessage;
                        }
                    } catch (textError) {
                        console.error("Could not read error blob:", textError);
                    }
                }
                // Handle regular JSON error responses
                else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
                else if (err.response.data?.error) {
                    errorMessage = err.response.data.error;
                }
                // Handle plain text errors
                else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }

                // Add status-specific messages
                if (err.response.status === 500) {
                    errorMessage = `Server error: ${errorMessage}. Check backend logs for details.`;
                } else if (err.response.status === 400) {
                    errorMessage = `Bad request: ${errorMessage}`;
                } else if (err.response.status === 409) {
                    errorMessage = 'IDs have already been generated for this election.';
                }
            } else if (err.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = err.message || 'An unexpected error occurred.';
            }

            console.log('Final error message:', errorMessage);
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
                            <label htmlFor="numVoters" className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Voters
                            </label>
                            <input
                                type="number"
                                name="numVoters"
                                id="numVoters"
                                min="1"
                                value={numVoters}
                                onChange={(e) => setNumVoters(e.target.value)}
                                placeholder="e.g., 500"
                                className="block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        {error && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Generating...' : 'Generate & Export'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                                className="flex-1 rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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