import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  VideoProjector,
  AntennaSignal,
  NavArrowLeftSolid,
  NavArrowRightSolid,
} from "iconoir-react";
import { getReservations } from "../api/index.js";

function ReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getReservations()
      .then(setReservations)
      .catch((error) => {
        console.error("Failed to fetch reservations:", error);
      });
  }, []);

  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservations = reservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatTimeslots = (slots) => {
    const list = slots.map((h) => `${h}º`);
    if (list.length === 1) return `${list[0]} horário`;
    return `${list.slice(0, -1).join(", ")} e ${list[list.length - 1]} horário`;
  };

    useEffect(() => {
        setLoading(true);
        getReservations()
            .then(setReservations)
            .catch((error) => {
                console.error("Failed to fetch reservations: ", error);
            })
            .finally(() => setLoading(false));
    }, []);

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
      {loading ? (
          <div className="loader" />
      ) : (
          <div className="res-list">
            {currentReservations.length === 0 ? (
              <p style={{ textAlign: "center", color: "#636e72" }}>
                Nenhuma reserva registrada para hoje...
              </p>
            ) : (
              currentReservations.map((res, index) => (
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
                      <span>{res.datashow || "..."}</span>
                    </div>
                    <div>
                      <AntennaSignal width={16} height={16} />
                      <span>{res.speaker || "...."}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          <button className={"left"}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <NavArrowLeftSolid color={"black"} width={32} height={32} />
          </button>
          <span>
            {currentPage} de {totalPages}
          </span>
          <button className={"right"}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <NavArrowRightSolid color={"black"} width={32} height={32} />
          </button>
        </div>
      )}
    </>
  );
}

export default ReservationsPage;
