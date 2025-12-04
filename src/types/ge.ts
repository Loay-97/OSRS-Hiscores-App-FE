import { API_BASE_URL } from '../services/api'; // dezelfde import als bij login/register

export async function getGePrice(itemId: number) {
    const res = await fetch(`${API_BASE_URL}/ge/${itemId}/price`);
    if (!res.ok) throw new Error("Failed to fetch price");
    return res.json();
}

export async function getGePriceHistory(itemId: number) {
    const res = await fetch(`${API_BASE_URL}/${itemId}/history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
}

