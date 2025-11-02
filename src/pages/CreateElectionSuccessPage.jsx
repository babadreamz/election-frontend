import { useLocation, useNavigate } from "react-router-dom";

function CreateElectionSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { message, publicIdentifier, title, startDate, endDate } = location.state || {};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-96">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Success!</h2>
                <p className="text-gray-700 mb-2">
                    {message || "Election Created Successfully. Make sure you copy these details"}
                </p>

                {publicIdentifier && title && startDate && endDate && (
                    <p className="text-lg font-semibold text-green-800 mt-2">
                        Election Code: <span className="font-mono">{publicIdentifier}</span><br />
                        Title: <span className="font-mono">{title}</span><br />
                        Start Date: <span className="font-mono">{startDate}</span><br />
                        End Date: <span className="font-mono">{endDate}</span>
                    </p>
                )}

                <button
                    onClick={() => navigate("/admin")}
                    className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default CreateElectionSuccessPage;
