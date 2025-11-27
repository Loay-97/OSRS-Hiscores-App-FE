const API_BASE_URL = 'http://localhost:8080/api';

// Haal stats van een speler op
export async function sendGetPlayerStatsRequest(username: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/player/${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // ---- Foutafhandeling (404 + custom message) ----
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
            // Probeer fout-body te lezen (indien aanwezig)
            const errorBody = await response.json();

            if (errorBody && errorBody.error) {
                // Backend stuurt bv.: { "error": "Username doesn't exist: messsi" }
                errorMessage = errorBody.error;
            }
        } catch (_) {
            // Geen JSON in de fout-response → negeer
        }

        throw new Error(errorMessage);
    }

    // ---- Als het goed gaat ----
    return await response.json();
}

// Haal de recente lookup history op
export async function getLookupHistory(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/player-lookup-history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

// Voeg een lookup toe of update count van een speler
// Voeg een lookup toe of update count van een speler
export async function postLookupHistory(playerUsername: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/player-lookup-history`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerUsername }),
    });

    if (!response.ok) {
        let errorMessage = `Failed to update lookup history, status: ${response.status}`;
        try {
            const errorBody = await response.json();
            if (errorBody && errorBody.error) {
                errorMessage = errorBody.error;
            }
        } catch (_) {}
        throw new Error(errorMessage);
    }

    // ---- return de response JSON (nieuwe of geüpdatete record) ----
    return await response.json();
    }


