import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import a loader
import Logo from "../../../public/images/main_logo.png"; // Import your logo


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loader state
    const { handleLoginSuccess } = useContext(MyContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError("Both fields are required");
            return;
        }

        setError(""); // Clear previous errors
        setLoading(true); // Show loader

        try {
            // Make the API request to login
            const response = await axios.post(`https://stoxii-backend.vercel.app/api/v1/auth/login`, {
                email,
                password,
            });

            if (response.status === 200) {
                const data = response.data.data;

                // Store the token and user data in localStorage
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify(data));

                // Trigger login success
                handleLoginSuccess();
                navigate("/"); // Navigate to dashboard or another route
            }
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <div className="relative min-h-screen text-white w-[100%]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
                {/* Logo Section */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-2">Login</h2>
                    <p className="text-gray-400">Enter your credentials to access your account.</p>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {loading ? ( // Show loader when loading
                    <div className="flex justify-center items-center h-20">
                        <ClipLoader color="#2563eb" size={50} />
                    </div>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="logout-btn"
                        >
                            Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
