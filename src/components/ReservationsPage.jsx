import React, { useEffect, useState } from "react";
import { Calendar, Clock, VideoProjector, AntennaSignal } from "iconoir-react";
import { getReservations } from "../api/index";

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getReservations()
      .then(setReservations)
      .catch((error) => {
        console.error("Failed to fetch reservations:", error);
      });
    }, []);

  const formatTimeslots = (slots) => {
    const list = slots.map((h) => `${h}º`);
    if (list.length === 1) return `${list[0]} horário`;
    return `${list.slice(0, -1).join(", ")} e ${list[list.length - 1]} horário`;
  };

  return (
    <>
      <h1 className="res-title">Reservas do dia</h1>
      <p className="res-subtitle">Acompanhe os recursos agendados</p>

      <button
        className="back-button"
        onClick={() => (window.location.href = "/")}
      >
        + Fazer nova reserva
      </button>

      <div className="res-list">
        {reservations.length === 0 ? (
          <p style={{ textAlign: "center", color: "#636e72" }}>
            Nenhuma reserva registrada para hoje...
          </p>
        ) : (
          reservations.map((res, index) => (
            <div className="res-card" key={index}>
              <div className="res-top">
                <h2 title={`Prof. ${res.professorName}`}>
                  Prof. {res.professorName}
                </h2>
                  <span className="res-date">
                    <Calendar width={16} height={16} />
                      {res.date.split("-").reverse().join("/")}
                    </span>
              </div>

              <div className="res-info">
                <div>
                  <Clock width={16} height={16} />
                  <span>{formatTimeslots(res.timeslots)}</span>
                </div>
                <div>
                  <VideoProjector width={16} height={16} />
                  <span>{res.datashow || "Nenhum datashow"}</span>
                </div>
                <div>
                  <AntennaSignal width={16} height={16} />
                  <span>{res.speaker || "Nenhuma caixa de som"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ReservationsPage;
