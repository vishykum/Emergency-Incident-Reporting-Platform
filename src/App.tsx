import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Map from "./components/Map";
import IncidentTable from "./components/IncidentTable";
import InputForm from "./components/InputForm";
import { Incident } from "./components/types";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultIncidentsJson from './storage/default_incidents.json'

const storageKey = "savestate272";
var json = ""; //For json export


const App: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [markerLocation, setMarkerLocation] = useState<string | null>(null);
  const [coord, setCoord] = useState<[number, number] | null>(null);
  
  //This effect ensures that the json version of the incident table stays updated triggered upon changes in incidents.length
  useEffect (() => {
    json = JSON.stringify(incidents);
    localStorage.setItem(storageKey, json);

    console.log("Json string updated!");
  }, [incidents.length]);

  //firstUpdate ensures that incidents are only loaded on the first render
  const firstUpdate = useRef(true);

  //This effect loads the incidents from localStorage to the incidents state
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      const data = localStorage.getItem(storageKey);
  
      if (data == null) {
        console.log(defaultIncidentsJson);
      }

      else {
        json = data;
        
        let objs = JSON.parse(json) as Incident[];

        setIncidents(objs);
        firstUpdate.current = false;
          console.log("Incidents loaded from localStorage!");
      }
    }
  });


  const handleFormSubmit = (newIncident: Omit<Incident, "status" | "timeReported" | "latlng">) => { // we don't need these for the form
    const timeReported = new Date().toLocaleString();

    setIncidents([...incidents, { ...newIncident, timeReported, status: "OPEN", latlng: coord }]); //It is not possible for latlng to be null at this point in the app flow
    setShowForm(false);
  };

  const handleMapClick = (location: [number, number]) => {
    setCoord(location);
    setMarkerLocation(`Latitude: ${location[0]}, Longitude: ${location[1]}`);
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

      <Map incidents={incidents} onAddIncident={handleMapClick} />

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
