import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../services/api';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });

            // ---- Opslaan van ingelogde user info ----
            const { id: supabaseUserId, displayName, token } = response.data;

            localStorage.setItem("supabaseUserId", supabaseUserId); // optioneel: backend requests
            localStorage.setItem("currentUser", displayName); // voor dashboard rechtsboven
            localStorage.setItem("token", token); // optioneel: voor authenticatie headers

            // ---- Redirect naar dashboard ----
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
            <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Welcome back</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border rounded-xl px-4 py-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="border rounded-xl px-4 py-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <button className="bg-purple-600 text-white py-3 rounded-xl">
                        Log in
                    </button>
                </form>

                <Link
                    to="/dashboard"
                    className="bg-gray-200 text-gray-800 py-3 rounded-xl text-center block mt-4 hover:bg-gray-300 transition"
                >
                    Continue without logging in
                </Link>

                <div className="mt-6 text-center">
                    <p className="text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-purple-600 underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
