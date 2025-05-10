import React, {useState, useRef} from "react";
import Select from "react-select";
import {
  Calendar,
  User,
  Clock,
  VideoProjector,
  AntennaSignal,
  NavArrowDown,
} from "iconoir-react";
import { useNavigate } from "react-router-dom";
import { createReservation, getAvailableResources } from "../api/index";

const timeslotOptions = Array.from({ length: 9 }, (_, i) => ({
  value: i + 1,
  label: (
    <span>
      <span className="mono">{i + 1}</span>º horário
    </span>
  ),
}));

function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    timeslot: [],
    datashow: null,
    speaker: null,
  });

  const [availableDatashows, setAvailableDatashows] = useState([]);
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dateInputRef = useRef(null);
  const navigate = useNavigate();

  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
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
    setForm((prev) => ({
      ...prev,
      timeslot: selectedOptions,
      datashow: null,
      speaker: null,
    }));
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

  const handleResourceFocus = async () => {
    if (form.timeslot.length === 0 || !form.date) return;

    const times = form.timeslot.map((opt) => opt.value);
    const { datashows, speakers } = await getAvailableResources(form.date, times);

    setAvailableDatashows(datashows);
    setAvailableSpeakers(speakers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasHorarios = form.timeslot.length > 0;
    const hasRecursos = form.datashow || form.speaker;

    if (!hasHorarios && !hasRecursos) {
      setErrorMessage("Selecione pelo menos um horário ou um recurso...");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    const payload = {
      professorName: form.name,
      date: form.date,
      timeslots: form.timeslot.map((opt) => opt.value),
      datashow: form.datashow?.value || null,
      speaker: form.speaker?.value || null,
    };

    try {
      await createReservation(payload);
      setSuccessMessage("Reserva registrada...");
      setErrorMessage("");
      resetForm();
      setTimeout(() => setSuccessMessage(""), 2000);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        timeslot: [],
        datashow: null,
        speaker: null,
      }));
      setSuccessMessage("");
      setErrorMessage(
          "Recurso já reservado..."
      );
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  const isDateAndTimeslotNotInformed =
      form.date === "" || form.timeslot.length === 0;

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
            Você pode reservar até <strong>{formatLabelDate(maxDate)}</strong>
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
              isDisabled={isDateAndTimeslotNotInformed}
              isSearchable={false}
              name="datashow"
              options={availableDatashows.map((d) => ({ value: d, label: d }))}
              value={form.datashow}
              onChange={(selected) =>
                  setForm((prev) => ({ ...prev, datashow: selected }))
              }
              onFocus={handleResourceFocus}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={isDateAndTimeslotNotInformed ? "Informe a data e horários" : ""}
              noOptionsMessage={() =>
                  isDateAndTimeslotNotInformed
                      ? "Informe a data e horários"
                      : "Nenhum datashow disponível"
              }
          />
        </label>

        <label>
          <span className="label-icon">
            <AntennaSignal /> Caixa de som:
          </span>
          <Select
              isDisabled={isDateAndTimeslotNotInformed}
              isSearchable={false}
              name="speaker"
              options={availableSpeakers.map((s) => ({ value: s, label: s }))}
              value={form.speaker}
              onChange={(selected) =>
                  setForm((prev) => ({ ...prev, speaker: selected }))
              }
              onFocus={handleResourceFocus}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={isDateAndTimeslotNotInformed ? "Informe a data e horários" : ""}
              noOptionsMessage={() =>
                  isDateAndTimeslotNotInformed
                      ? "Informe a data e horários"
                      : "Nenhuma caixa de som disponível"
              }
          />
        </label>

        <div className="button-group">
          <button
            type="submit"
            className={`submit-button ${successMessage ? "success" : ""} ${errorMessage ? "error" : ""}`}
          >
            {successMessage ? (
                <>
                  Reserva registrada...
                </>
            ) : errorMessage ? (
                <>
                  Conflito na reserva...
                </>
            ) : (
                "Reservar"
            )}

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
    </>
  );
}

export default ReservationForm;
