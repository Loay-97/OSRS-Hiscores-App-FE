import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../services/api';

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, {
                email,
                password,
                displayName
            });

            // redirect naar login na succesvolle registratie
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
            <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

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
                        type="text"
                        placeholder="Choose a username"
                        className="border rounded-xl px-4 py-3"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="border rounded-xl px-4 py-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Repeat password"
                        className="border rounded-xl px-4 py-3"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <button className="bg-purple-600 text-white py-3 rounded-xl">
                        Make an account
                    </button>
                </form>

                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-600 underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
