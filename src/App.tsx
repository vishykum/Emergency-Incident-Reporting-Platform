import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Map from "./components/Map";
import IncidentTable from "./components/IncidentTable";
import InputForm from "./components/InputForm";
import { Incident } from "./components/types";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultIncidentsJson from './storage/default_incidents.json'

interface MapBounds {
  southwest: L.LatLng;
  northeast: L.LatLng;
};

const storageKey = "savestate272";


const App: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [markerLocation, setMarkerLocation] = useState<string | null>(null);
  const [coord, setCoord] = useState<[number, number] | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  
  //This effect ensures that the json version of the incident table stays updated triggered upon changes in incidents.length
  useEffect (() => {
    localStorage.setItem(storageKey, JSON.stringify(incidents));

    console.log("Json string updated!");
  }, [incidents.length]);

  //firstUpdate ensures that incidents are only loaded on the first render
  const firstUpdate = useRef(true);

  //This effect loads the incidents from localStorage to the incidents state
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      const data = localStorage.getItem(storageKey);
      var objs: Incident[];
  
      if (data == null) {
        objs = defaultIncidentsJson as Incident[];
        console.log("Incidents loaded from default_incidents.json!");
      }

      else {        
        objs = JSON.parse(data) as Incident[];
        console.log("Incidents loaded from localStorage!");

      }
      setIncidents(objs);
      firstUpdate.current = false;
    }
  });

  const handleFormSubmit = (newIncident: Omit<Incident, "status" | "timeReported" | "latlng">) => { // we don't need these for the form
    const timeReported = new Date().toLocaleString();

    setIncidents([...incidents, { ...newIncident, timeReported, status: "OPEN", latlng: coord || [200,200] }]); //200 is out of range for both latitude and longitude
    setShowForm(false);
  };

  const handleMapClick = (location: [number, number], address: string) => {
    setCoord(location);
    setMarkerLocation(address);

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

  const filterBasedOnView = (incident: Incident) => {
    if (mapBounds !== null) {
      let isInBounds = ((incident.latlng[0] < mapBounds.northeast.lat && incident.latlng[0] > mapBounds.southwest.lat) && ((incident.latlng[1] < mapBounds.northeast.lng && incident.latlng[1] > mapBounds.southwest.lng) ));

      return isInBounds;
    }

    return false;
  }

  function getMapBounds(bounds: [L.LatLng, L.LatLng] | null): void {
    if (bounds !== null)
      setMapBounds({northeast: bounds[0], southwest: bounds[1]});
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Incident Reporting</h1>

      <Map incidents={incidents} onAddIncident={handleMapClick} setBounds={getMapBounds}/>

      <IncidentTable
        incidents={incidents.filter(filterBasedOnView)}
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
