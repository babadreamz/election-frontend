import {useLocation,useNavigate} from "react-router-dom";
function AdminRegSuccessPage(){
    const location = useLocation();
    const navigate = useNavigate();
    const {message, adminTag} = location.state || {}
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-96">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Success!</h2>
                <p className="text-gray-700 mb-2">{message || "Registration Successful. Make sure you copy these details"}</p>
                {adminTag && (
                    <p className="text-lg font-semibold text-green-800 mt-2">
                        Your Admin Tag: <span className="font-mono">{adminTag}</span><br />
                    </p>
                )}
                <button
                    onClick={()=>navigate("/admin-login")}
                    className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}
export default AdminRegSuccessPage;