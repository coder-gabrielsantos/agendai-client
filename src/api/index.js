const API_BASE_URL = "https://agendai-server.vercel.app";

export async function createReservation(reservationData) {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.error || "Failed to create reservation");
        error.code = data.code || response.status;
        throw error;
    }

    return data;
}

export async function getReservations() {
    const response = await fetch(`${API_BASE_URL}/reservations`);
    return await response.json();
}

export async function getAvailableResources(date, timeslots) {
    const response = await fetch(`${API_BASE_URL}/reservations/available`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, timeslots }),
    });
    return await response.json();
}
