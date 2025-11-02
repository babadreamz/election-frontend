import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar.jsx';
import ElectionList from '../components/ElectionList.jsx';
import { getMyElections } from '../services/apiService.js';

function AdminDashboardPage() {
    const [elections, setElections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const res = await getMyElections();
                setElections(res.data);
            } catch (e) {
                console.error('Failed to load elections', e);
                setError('Failed to load elections.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchElections();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <div className="p-8 text-center">Loading elections...</div>;
        }
        if (error) {
            return <div className="p-8 text-center text-red-500">{error}</div>;
        }
        return <ElectionList elections={elections} />;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />

            {renderContent()}
        </div>
    );
}

export default AdminDashboardPage;