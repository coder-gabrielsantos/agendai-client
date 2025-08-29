import React, {useEffect, useState} from "react";
import {
  Calendar,
  Clock,
  VideoProjector,
  AntennaSignal,
  NavArrowLeftSolid,
  NavArrowRightSolid,
} from "iconoir-react";
import {getReservations, deleteReservation} from "../api/index.js";

function ReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReservations = () => {
    setLoading(true);
    getReservations()
      .then(setReservations)
      .catch((error) => {
        console.error("Failed to fetch reservations:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const totalPages = Math.ceil(reservations.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservations = reservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatTimeslots = (slots = []) => {
    const sorted = [...slots].sort((a, b) => a - b);
    const list = sorted.map((h) => `${h}º`);
    if (list.length === 0) return "";
    if (list.length === 1) return `${list[0]} horário`;
    return `${list.slice(0, -1).join(", ")} e ${list[list.length - 1]} horário`;
  };

  const handleCardClick = (res) => {
    setErrorMsg("");
    setSelectedReservation(res);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedReservation?._id) return;
    try {
      setDeleting(true);
      await deleteReservation(selectedReservation._id);
      // Atualiza a lista local sem refetch (ou, se preferir, chame fetchReservations())
      setReservations((prev) =>
        prev.filter((r) => r._id !== selectedReservation._id)
      );
      setShowModal(false);
      setSelectedReservation(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao deletar a reserva");
    } finally {
      setDeleting(false);
    }
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

      {loading ? (
        <div className="loader"/>
      ) : (
        <div className="res-list">
          {currentReservations.length === 0 ? (
            <p style={{textAlign: "center", color: "#636e72"}}>
              Nenhuma reserva registrada para hoje...
            </p>
          ) : (
            currentReservations.map((res) => (
              <div
                className="res-card"
                key={res._id || `${res.date}-${res.professorName}`}
                onClick={() => handleCardClick(res)}
                style={{cursor: "pointer"}}
                title="Pressione para ver opções"
              >
                <div className="res-top">
                  <h2 title={`Prof. ${res.professorName}`}>
                    Prof. {res.professorName}
                  </h2>
                  <span className="res-date">
                    <Calendar width={16} height={16}/>
                    {res.date?.split("-").reverse().join("/")}
                  </span>
                </div>
                <div className="res-info">
                  <div>
                    <Clock width={16} height={16}/>
                    <span>{formatTimeslots(res.timeslots)}</span>
                  </div>
                  <div>
                    <VideoProjector width={16} height={16}/>
                    <span>{res.datashow || "..."}</span>
                  </div>
                  <div>
                    <AntennaSignal width={16} height={16}/>
                    <span>{res.speaker || "..."}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className={"left"}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <NavArrowLeftSolid color={"black"} width={32} height={32}/>
          </button>
          <span>
            {currentPage} de {totalPages}
          </span>
          <button
            className={"right"}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <NavArrowRightSolid color={"black"} width={32} height={32}/>
          </button>
        </div>
      )}

      {/* Modal de confirmação */}
      {showModal && selectedReservation && (
        <div
          className="modal-backdrop"
          onClick={() => !deleting && setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              boxShadow:
                "0 10px 20px rgba(0,0,0,0.15), 0 6px 6px rgba(0,0,0,0.10)",
            }}
          >
            <h3 style={{marginTop: 0, marginBottom: 8}}>
              Deletar esta reserva?
            </h3>
            <p style={{margin: "8px 0 12px", color: "#2d3436"}}>
              Atenção: exclua esta reserva apenas se tiver sido feita por você.
              <br/>
              <small style={{color: "#636e72"}}>
                Essa ação não pode ser desfeita.
              </small>
            </p>

            <div
              style={{
                background: "#fafafa",
                padding: 16,
                borderRadius: 16,
                marginBottom: 16,
                fontSize: 14,
                lineHeight: 1.5,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                rowGap: 8,
                columnGap: 12,
              }}
            >
              <span style={{ fontWeight: 600, color: "#2d3436" }}>Professor:</span>
              <span>{selectedReservation.professorName}</span>

              <span style={{ fontWeight: 600, color: "#2d3436" }}>Data:</span>
              <span>{selectedReservation.date?.split("-").reverse().join("/")}</span>

              <span style={{ fontWeight: 600, color: "#2d3436" }}>Horários:</span>
              <span>{formatTimeslots(selectedReservation.timeslots)}</span>

              {selectedReservation.datashow && (
                <>
                  <span style={{ fontWeight: 600, color: "#2d3436" }}>Datashow:</span>
                  <span>{selectedReservation.datashow}</span>
                </>
              )}

              {selectedReservation.speaker && (
                <>
                  <span style={{ fontWeight: 600, color: "#2d3436" }}>Caixa de som:</span>
                  <span>{selectedReservation.speaker}</span>
                </>
              )}

              {selectedReservation.space && (
                <>
                  <span style={{ fontWeight: 600, color: "#2d3436" }}>Espaço:</span>
                  <span>{selectedReservation.space}</span>
                </>
              )}
            </div>

            {errorMsg && (
              <div
                style={{
                  color: "#d63031",
                  background: "#ffecec",
                  border: "1px solid #ffd3d3",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 10,
                  fontSize: 14,
                }}
              >
                {errorMsg}
              </div>
            )}

            <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
              <button
                onClick={() => !deleting && setShowModal(false)}
                disabled={deleting}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid #b2bec3",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  background: "#d63031",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {deleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservationsPage;
