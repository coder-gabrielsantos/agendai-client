import React from "react";
import {
    Calendar,
    Clock,
    VideoProjector,
    AntennaSignal
} from "iconoir-react";

const mockReservations = [
    {
        name: "Ana Beatrizaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        date: "2025-05-06",
        timeslot: [4, 5, 6],
        datashow: "Datashow 4",
        speaker: "Caixa de Som 3"
    },
    {
        name: "Bruno",
        date: "2025-05-06",
        timeslot: [1, 2],
        datashow: null,
        speaker: null
    },
    {
        name: "Carlos Henrique",
        date: "2025-05-06",
        timeslot: [7, 8],
        datashow: "Datashow 2",
        speaker: "Caixa de Som 1"
    },
    {
        name: "Daniela Souza",
        date: "2025-05-06",
        timeslot: [3],
        datashow: "Datashow 1",
        speaker: null
    },
    {
        name: "Eduarda Lima",
        date: "2025-05-06",
        timeslot: [2, 3, 4],
        datashow: null,
        speaker: "Caixa de Som 2"
    }
];

function ReservationsPage() {
    const formatTimeslots = (slots) => {
        const list = slots.map((h) => `${h}º`);
        if (list.length === 1) return `${list[0]} horário`;
        return `${list.slice(0, -1).join(", ")} e ${list[list.length - 1]} horário`;
    };

    return (
        <>
            <header className="res-header">
                <h1 className="res-title">Reservas do dia</h1>
                <p className="res-subtitle">Acompanhe os recursos agendados</p>
            </header>

            <button className="back-button" onClick={() => window.location.href = "/"}>
                + Fazer nova reserva
            </button>

            <div className="res-list">
                {mockReservations.map((res, index) => (
                    <div className="res-card" key={index}>
                        <div className="res-top">
                            <h2 title={`Prof. ${res.name}`}>Prof. {res.name}</h2>
                            <span className="res-date">
                                <Calendar width={16} height={16} />
                                {res.date}
                            </span>
                        </div>
                        <div className="res-info">
                            <div>
                                <Clock width={16} height={16} />
                                <span>{formatTimeslots(res.timeslot)}</span>
                            </div>
                            <div>
                                <VideoProjector width={16} height={16} />
                                <span>{res.datashow || "Nenhum Datashow"}</span>
                            </div>
                            <div>
                                <AntennaSignal width={16} height={16} />
                                <span>{res.speaker || "Nenhuma Caixa de Som"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ReservationsPage;
