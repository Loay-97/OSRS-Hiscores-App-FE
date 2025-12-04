import React from 'react';
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GeLookupPage from './pages/GeLookupPage';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ge" element={<GeLookupPage />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
