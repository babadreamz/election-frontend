import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { participateInElection } from '../services/apiService';

function ParticipateModal({ isOpen, setIsOpen, onSuccess }) {
    const [electionId, setElectionId] = useState('');
    const [membershipId, setMembershipId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setElectionId('');
            setMembershipId('');
            setError('');
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const enteredElectionId = electionId.trim();
        const enteredMembershipId = membershipId.trim();

        if (!enteredElectionId) {
            setError('Please enter an election ID.');
            setIsLoading(false);
            return;
        }
        if (!enteredMembershipId) {
            setError('Please enter your Membership ID.');
            setIsLoading(false);
            return;
        }

        try {
            await participateInElection(enteredElectionId, enteredMembershipId);

            if (onSuccess) {
                onSuccess();
            }

            setIsOpen(false);

        } catch (err) {
            const message = err.response?.data?.message || 'Participation failed. Check IDs or eligibility.';
            setError(message);
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
                        Participate in Election
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the Election ID and your Membership ID to proceed.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="electionId" className="sr-only">Election ID</label>
                            <input
                                type="text" name="electionId" id="electionId"
                                value={electionId} onChange={(e) => setElectionId(e.target.value)}
                                placeholder="Enter Election ID (e.g., E-12345)"
                                className="mt-1 block w-full rounded-md border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="membershipId" className="sr-only">Membership ID</label>
                            <input
                                type="text" name="membershipId" id="membershipId"
                                value={membershipId} onChange={(e) => setMembershipId(e.target.value)}
                                placeholder="Enter your Membership ID"
                                className="mt-1 block w-full rounded-md border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div className="flex gap-4">
                            <button
                                type="submit" disabled={isLoading}
                                className="w-full rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Submit'}
                            </button>
                            <button
                                type="button" onClick={() => setIsOpen(false)} disabled={isLoading}
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

export default ParticipateModal;