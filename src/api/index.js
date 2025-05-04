const API_BASE_URL = "http://localhost:3000";

export async function createReservation(reservationData) {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
    });
    return await response.json();
}

export async function getReservations() {
    const response = await fetch(`${API_BASE_URL}/reservations`);
    return await response.json();
}
