import React, { useState } from "react";
import Map from "./components/Map";
import IncidentTable from "./components/IncidentTable";
import InputForm from "./components/InputForm";
import { Incident } from "./components/types";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [markerLocation, setMarkerLocation] = useState<string | null>(null);

  const handleFormSubmit = (newIncident: Omit<Incident, "status" | "timeReported">) => { // we don't need these for the form
    const timeReported = new Date().toLocaleString();

    setIncidents([...incidents, { ...newIncident, timeReported, status: "OPEN" }]);
    setShowForm(false);
  };

  const handleMapClick = (location: string) => {
    setMarkerLocation(location);
    setShowForm(true);
  };

  const handleMoreInfo = (incident: Incident) => {
    // TODO: create a modal to show more info
    console.log(incident);
  };

  const handleDelete = (incident: Incident) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      setIncidents(incidents.filter((i) => i !== incident)); // deleting logic
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Incident Reporting</h1>

      <Map onAddIncident={handleMapClick} />

      <IncidentTable
        incidents={incidents}
        onMoreInfo={handleMoreInfo}
        onDelete={handleDelete}
      />

      <InputForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        location={markerLocation || ""}
      />
    </div>
  );
};

export default App;
