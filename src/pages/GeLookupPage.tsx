import React, { useState, useEffect } from 'react';
import { getGePrice, getGePriceHistory, getAllItemNames } from '../services/api';
import { useNavigate } from 'react-router-dom'; // <-- import useNavigate

const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
};

const GeLookupPage: React.FC = () => {
    const navigate = useNavigate(); // <-- navigator
    const [currentUser, setCurrentUser] = useState<string>('');
    const [itemName, setItemName] = useState<string>('');
    const [price, setPrice] = useState<number | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const allItems = getAllItemNames();

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) setCurrentUser(storedUser);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setItemName(value);

        if (value.trim() === "") {
            setSuggestions([]);
        } else {
            const filtered = allItems.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setItemName(suggestion);
        setSuggestions([]);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName.trim()) return;

        setError('');
        setLoading(true);
        setPrice(null);
        setHistory([]);
        setSuggestions([]);

        try {
            const p = await getGePrice(itemName);
            setPrice(p);

            const h = await getGePriceHistory(itemName);
            setHistory(h);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-white p-5">

            {/* Topbar */}
            <div className="w-full max-w-3xl flex justify-between items-center mb-4 gap-4 text-gray-800 font-semibold">
                {currentUser && (
                    <>
                        <span className="text-sm">Logged in as {currentUser}</span>
                        <button
                            onClick={logout}
                            className="bg-red-600 text-white py-2 px-5 rounded-full hover:bg-red-700 transition font-semibold shadow-md"
                        >
                            Logout
                        </button>
                    </>
                )}

                {/* Back to Dashboard knop */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white py-2 px-5 rounded-full hover:bg-blue-700 transition font-semibold shadow-md"
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-3xl border border-gray-100">

                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                    Grand Exchange Lookup
                </h1>

                {/* Zoek veld */}
                <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-6 relative">
                    <input
                        type="text"
                        value={itemName}
                        onChange={handleInputChange}
                        placeholder="Item name (e.g. 'Abyssal whip')"
                        className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
                        disabled={loading}
                    />

                    {/* Autocomplete dropdown */}
                    {suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow max-h-60 overflow-y-auto z-10">
                            {suggestions.map((s, i) => (
                                <li
                                    key={i}
                                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                                    onClick={() => handleSuggestionClick(s)}
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        type="submit"
                        className="bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold"
                        disabled={loading || !itemName.trim()}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center shadow-sm">
                        {error}
                    </div>
                )}

                {/* Current Price Result */}
                {price !== null && (
                    <div className="mt-6 p-5 bg-white border rounded-xl shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Current Price
                        </h2>
                        <p className="text-lg font-semibold text-gray-700">
                            {itemName} → {price.toLocaleString()} gp
                        </p>
                    </div>
                )}

                {/* History Table */}
                {history.length > 0 && (
                    <div className="mt-6 p-5 bg-white border rounded-xl shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Your Saved Price History
                        </h2>

                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b">
                                <th className="py-2 font-semibold">Item</th>
                                <th className="py-2 font-semibold">Price</th>
                                <th className="py-2 font-semibold">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((entry, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-2">{entry.itemName}</td>
                                    <td className="py-2">{entry.price.toLocaleString()} gp</td>
                                    <td className="py-2">{new Date(entry.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
};

export default GeLookupPage;
