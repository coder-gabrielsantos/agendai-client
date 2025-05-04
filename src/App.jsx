import { Routes, Route } from "react-router-dom";
import ReservationForm from "./components/ReservationForm";
import ReservationsPage from "./components/ReservationsPage";
import "./styles.css";

function App() {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<ReservationForm />} />
                <Route path="/reservas" element={<ReservationsPage />} />
            </Routes>
        </div>
    );
}

export default App;
