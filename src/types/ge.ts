const API_BASE_URL = "http://localhost:8080/api/ge";

export async function getGePrice(itemId: number) {
    const res = await fetch(`${API_BASE_URL}/${itemId}/price`);
    if (!res.ok) throw new Error("Failed to fetch price");
    return res.json();
}

export async function getGePriceHistory(itemId: number) {
    const res = await fetch(`${API_BASE_URL}/${itemId}/history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
}
