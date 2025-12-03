import React, { useState, useEffect } from 'react';
import { sendGetPlayerStatsRequest, getLookupHistory, postLookupHistory } from '../services/api';
import { useNavigate } from 'react-router-dom';

// --> Logout functie
const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login"; // redirect
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate(); // <-- voor navigatie naar andere pagina
    const [currentUser, setCurrentUser] = useState<string>(''); // ingelogde gebruiker
    const [name, setName] = useState<string>(''); // username om op te zoeken
    const [stats, setStats] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // --- haal displayName uit localStorage bij mount ---
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) setCurrentUser(storedUser);

        fetchHistory();
    }, []);

    // ophalen van lookup history
    const fetchHistory = async () => {
        try {
            const data = await getLookupHistory();
            setHistory(data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    // Username submit om stats op te halen
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setError('');
        setStats(null);
        setIsLoading(true);

        try {
            const data = await sendGetPlayerStatsRequest(name);
            setStats(data);

            // POST of UPDATE lookup history
            await postLookupHistory(name);

            // refresh history
            fetchHistory();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Navigatie naar GE Lookup pagina
    const goToGeLookup = () => {
        navigate('/ge'); // pad naar je GE pagina
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-white p-5">

            {/* Topbar met GE knop altijd zichtbaar */}
            <div className="w-full max-w-3xl flex justify-end items-center mb-4 gap-4 text-gray-800 font-semibold">
                {currentUser ? (
                    <span className="text-sm">Logged in as {currentUser}</span>
                ) : (
                    <span className="text-sm">Not logged in</span>
                )}

                {/* GE Lookup knop altijd zichtbaar */}
                <button
                    onClick={goToGeLookup}
                    className="bg-blue-600 text-white py-2 px-5 rounded-full hover:bg-blue-700 transition font-semibold shadow-md"
                >
                    GE Lookup
                </button>

                {/* Logout knop alleen als ingelogd */}
                {currentUser && (
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white py-2 px-5 rounded-full hover:bg-red-700 transition font-semibold shadow-md"
                    >
                        Logout
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-3xl border border-gray-100">

                {/* Zoekbalk */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Enter a username</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Username"
                        className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold"
                        disabled={isLoading || !name.trim()}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Errors */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center shadow-sm">
                        {error}
                    </div>
                )}

                {/* Stats / Skills */}
                {stats && (
                    <div className="mt-6 p-5 bg-white border rounded-xl shadow">
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">{stats.username}</h2>

                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Skills</h3>

                        <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                            {stats.skills.map((skill: any) => {
                                const progress = Math.min((skill.level / 99) * 100, 100);
                                return (
                                    <li
                                        key={skill.name}
                                        className="relative p-3 border rounded-2xl bg-gray-50 shadow-sm flex flex-col items-center justify-center group cursor-pointer hover:shadow-lg transition"
                                    >
                                        <img
                                            src={`/osrs-icons/${skill.name}_icon.png`}
                                            alt={skill.name}
                                            className="w-8 h-8 mb-1"
                                        />
                                        <p className="font-bold text-sm">{skill.name}</p>
                                        <p className="text-gray-600 text-xs">Lvl {skill.level}</p>
                                        <div className="w-full bg-gray-300 h-2 rounded-full mt-1">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                                            XP: {skill.xp.toLocaleString()} | Rank: {skill.rank.toLocaleString()}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Player Lookup History */}
                <div className="mt-6 p-5 bg-white border rounded-xl shadow">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Recently looked up players</h3>
                    <ul className="flex flex-col gap-2">
                        {history.map((h) => (
                            <li key={h.playerUsername} className="flex justify-between p-2 border rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                                <span>{h.playerUsername}</span>
                                <span className="text-gray-500 text-sm">{h.lookupCount}x</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
