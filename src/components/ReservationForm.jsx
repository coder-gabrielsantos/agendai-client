import React, { useRef, useState } from "react";
import Select from "react-select";
import {
  Calendar,
  User,
  Clock,
  VideoProjector,
  AntennaSignal,
  NavArrowDown,
  FloppyDisk,
} from "iconoir-react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/index";

const timeslotOptions = Array.from({ length: 9 }, (_, i) => ({
  value: i + 1,
  label: (
    <span>
      <span className="mono">{i + 1}</span>º horário
    </span>
  ),
}));

const datashowOptions = Array.from({ length: 6 }, (_, i) => ({
  value: `Datashow ${i + 1}`,
  label: `Datashow ${i + 1}`,
}));

const speakerOptions = Array.from({ length: 4 }, (_, i) => ({
  value: `Caixa de som ${i + 1}`,
  label: `Caixa de som ${i + 1}`,
}));

function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    timeslot: [],
    datashow: null,
    speaker: null,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dateInputRef = useRef(null);
  const navigate = useNavigate();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const maxDate = new Date(today);

  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    const daysToMonday = (8 - dayOfWeek) % 7;
    maxDate.setDate(today.getDate() + daysToMonday);
  } else {
    maxDate.setDate(today.getDate() + 1);
  }

  const formatDate = (date) => date.toISOString().split("T")[0];

  const formatLabelDate = (date) =>
    new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    }).format(date);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeslotChange = (selectedOptions) => {
    setForm((prev) => ({ ...prev, timeslot: selectedOptions }));
  };

  const openDatePicker = () => {
    dateInputRef.current?.showPicker?.();
  };

  const resetForm = () => {
    setForm({
      name: "",
      date: "",
      timeslot: [],
      datashow: null,
      speaker: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      professorName: form.name,
      date: form.date,
      timeslots: form.timeslot.map((opt) => opt.value),
      datashow: form.datashow?.value || null,
      speaker: form.speaker?.value || null,
    };

    try {
      await createReservation(payload);
      setErrorMessage("");
      setShowSuccess(true);
      resetForm();
      setTimeout(() => setShowSuccess(false), 2000);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setShowSuccess(false);
      setForm((prev) => ({
        ...prev,
        timeslot: [],
        datashow: null,
        speaker: null,
      }));
      setErrorMessage(
        "Este recurso já está reservado para o(s) horário(s) escolhido(s)."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <>
      <h1 className="title">Agendaí</h1>
      <p className="subtitle">Datashows e caixas de som do IEMA</p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="select-wrapper">
          <span className="label-icon">
            <User /> Nome do professor:
          </span>
          <div className="select-icon-container">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label className="select-wrapper">
          <span className="label-icon">
            <Calendar /> Dia da utilização:
          </span>
          <div className="select-icon-container" onClick={openDatePicker}>
            <input
              ref={dateInputRef}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={formatDate(today)}
              max={formatDate(maxDate)}
              onKeyDown={(e) => e.preventDefault()}
              required
            />
            <NavArrowDown className="select-icon" />
          </div>
          <p className="hint">
            Você pode reservar até <strong>{formatLabelDate(maxDate)}</strong>.
          </p>
        </label>

        <label>
          <span className="label-icon">
            <Clock /> Horários:
          </span>
          <Select
            isMulti
            isSearchable={false}
            name="timeslot"
            options={timeslotOptions}
            value={form.timeslot}
            onChange={handleTimeslotChange}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Selecione os horários"
          />
        </label>

        <label>
          <span className="label-icon">
            <VideoProjector /> Datashow:
          </span>
          <Select
            isSearchable={false}
            name="datashow"
            options={datashowOptions}
            value={form.datashow}
            onChange={(selected) =>
              setForm((prev) => ({ ...prev, datashow: selected }))
            }
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Nenhum"
          />
        </label>

        <label>
          <span className="label-icon">
            <AntennaSignal /> Caixa de som:
          </span>
          <Select
            isSearchable={false}
            name="speaker"
            options={speakerOptions}
            value={form.speaker}
            onChange={(selected) =>
              setForm((prev) => ({ ...prev, speaker: selected }))
            }
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Nenhuma"
          />
        </label>

        <div className="button-group">
          <button type="submit" className="submit-button">
            Reservar
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/reservas")}
          >
            Visualizar reservas
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="success-message">
          <FloppyDisk /> Reserva registrada com sucesso...
        </div>
      )}

      {errorMessage && (
        <div
          className="success-message"
          style={{ borderLeftColor: "#d63031", color: "#d63031" }}
        >
          ❌ {errorMessage}
        </div>
      )}
    </>
  );
}

export default ReservationForm;
