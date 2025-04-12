import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import IncidentTable from "./components/IncidentTable";
import InputForm from "./components/InputForm";
import LogIn from "./components/LogIn";
import { validatePassword } from "./password";
import passwords from "./storage/password_store.json";
import { Incident, Dict, LogInInfo } from "./components/types";
import IncidentDescription from "./components/IncidentDescription";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultIncidentsJson from './storage/default_incidents.json'
import Map from "./components/Map";

interface MapBounds {
  southwest: L.LatLng;
  northeast: L.LatLng;
};

const storageKey = "savestate272";
const idKey = "id";

const App: React.FC = () => {
  const [logInInfo, setLogInInfo] = useState<LogInInfo>({
    message: "Not logged In",
    status: "default",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionIncident, setDescriptionIncident] = useState<Incident | null>(null);
  const [markerLocation, setMarkerLocation] = useState<string | null>(null);
  const [coord, setCoord] = useState<[number, number] | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const firstUpdate = useRef(true);   //firstUpdate ensures that incidents are only loaded on the first render
  const markerRefs = useRef(new Dict());
  const [currId, setId] = useState<number>(0);
  const turnOffDescription = () => { setShowDescription(false) }//prob remove
  let closedescription = turnOffDescription;//prob remove

  const handleAddMarkerRef = (id: number, ref: L.Marker | null) => {
    if (ref) {
      markerRefs.current.map.set(id, ref); // Add marker ref to the Map
    } else {
      markerRefs.current.map.delete(id); // Remove marker ref if marker is removed
    }
  };

  useEffect(() => {
    incidents.sort(compareNums);

    localStorage.setItem(storageKey, JSON.stringify(incidents));

    console.log("Json string updated!");
  }, [incidents])

  useEffect(() => {
    if (markerRefs.current.map.has(-1)) {
      if (markerRefs.current.map.get(-1)?.isPopupOpen()) markerRefs.current.map.get(-1)?.closePopup();
    }

    localStorage.setItem(idKey, JSON.stringify(currId));

    console.log("ID updated!");
  }, [currId]);

  // loads the incidents and id variable from localStorage file to the incidents state
  useLayoutEffect(() => {

    //CAUTION: The line below should be uncommented only for testing the default incidents
    //localStorage.clear();

    if (firstUpdate.current) {
      const data = localStorage.getItem(storageKey);
      const getId = localStorage.getItem(idKey);
      var objs: Incident[];

      if (data == null) {
        objs = defaultIncidentsJson as Incident[];
        console.log("Incidents loaded from default_incidents.json!");


      }

      else {
        objs = JSON.parse(data) as Incident[];
        console.log("Incidents loaded from localStorage!");

      }

      if (getId !== null) {
        setId(JSON.parse(getId) as number);
      }

      else {
        setId(3); //we have incidents with ids 0, 1, and 2 in default_incidents.json
      }

      setIncidents(objs);
      firstUpdate.current = false;
    }
  });

  const handleFormSubmit = (newIncident: Omit<Incident, "status" | "timeReported" | "latlng" | "id">) => { // we don't need these for the form
    const timeReported = new Date().toLocaleString();

    setIncidents([...incidents, { ...newIncident, timeReported, status: "OPEN", latlng: coord || [200, 200], id: currId }]); //200 is out of range for both latitude and longitude
    setShowForm(false);

    setId(currId + 1);
  };

  const handleLogIn = (input: string) => {
    const isValid = passwords.some((password: string) => validatePassword(input, password));
    if (isValid) {
      setIsLoggedIn(true);
      setLogInInfo({ message: "Password correct. Logged In.", status: "success" });
    } else {
      setIsLoggedIn(false);
      setLogInInfo({ message: "Password incorrect. Not Logged In.", status: "error" });
    }
  };


  const getLogInInfoStyle = () => {
    switch (logInInfo.status) {
      case "success":
        return { color: "green" };
      case "error":
        return { color: "red" };
      default:
        return { color: "black" };
    }
  };

  const handleMapClick = (location: [number, number], address: string) => {
    setCoord(location);
    setMarkerLocation(address);

    setShowForm(true);
  };

  const handleMoreInfo = (incident: Incident) => {
    const incidentId = incident.id;

    if (markerRefs.current.map.has(incidentId)) {
      markerRefs.current.map.get(incidentId)?.openPopup();
    }

    if (showDescription) {
      setShowDescription(false);

      //ensures that the values in the sliding pane only updates when re-appears
      setTimeout(() => {
        if (descriptionIncident !== incident) setDescriptionIncident(incident);
        setShowDescription(true);
      }, 500);
    }

    else {
      if (descriptionIncident !== incident) setDescriptionIncident(incident);
      setShowDescription(true);
    }
  };

  const handleDelete = (incident: Incident) => {
    if (isLoggedIn) {
      if (window.confirm("Are you sure you want to delete this incident?")) {
        setIncidents(incidents.filter((i) => i !== incident)); // deleting logic
      }
    } else {
      alert("Cannot delete incident. Please log in to change status");
    }
  };

  const handleStatusChange = (incident: Incident, newStatus: string) => {
    setShowDescription(false);

    const incidentCopy = { ...incident }

    let newIncident = { ...incident };
    newIncident.status = newStatus;

    console.log(incidentCopy)
    setIncidents([...incidents.filter((i) => JSON.stringify(i) !== JSON.stringify(incident)), { ...newIncident }]); //JSON.stringify was used to compare the objects by value

    //ensures that the values in the sliding pane only updates when re-appears
    setTimeout(() => {
      setDescriptionIncident(newIncident);
      setShowDescription(true);
    }, 500);
  };

  const handleMarkerClick = (incident: Incident) => {

    if (showDescription) {
      setShowDescription(false);

      //sliding animation when same marker is clicked
      setTimeout(() => {
        if (descriptionIncident !== incident) setDescriptionIncident(incident);
        setShowDescription(true);
      }, 500);
    }

    else {
      if (descriptionIncident !== incident) setDescriptionIncident(incident);
      setShowDescription(true);
    }


  };

  //Only display the incidents within map view in the Incident Table
  const filterBasedOnView = (incident: Incident) => {
    if (mapBounds !== null) {
      let isInBounds = ((incident.latlng[0] < mapBounds.northeast.lat && incident.latlng[0] > mapBounds.southwest.lat) && ((incident.latlng[1] < mapBounds.northeast.lng && incident.latlng[1] > mapBounds.southwest.lng)));

      return isInBounds;
    }

    return false;
  }

  function getMapBounds(bounds: [L.LatLng, L.LatLng] | null): void {
    if (bounds !== null)
      setMapBounds({ northeast: bounds[0], southwest: bounds[1] });
  }

  function compareNums(a: Incident, b: Incident) {
    return Date.parse(a.timeReported) - Date.parse(b.timeReported);
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Incident Reporting</h1>

      <div style={{ position: "relative", width: "60vw", height: "50vh", justifyContent: "center" }}>
        <Map incidents={incidents} onAddIncident={handleMapClick} setBounds={getMapBounds} onMarkerClick={handleMarkerClick} onAddMarkerRef={handleAddMarkerRef} />

        <IncidentDescription
          incident={descriptionIncident as Incident} //Incident can't be null here
          show={showDescription}
          loggedIn={isLoggedIn}
          onClose={closedescription}
          onStatusChange={handleStatusChange}
        />
      </div>

      <LogIn
        show={true}
        onSubmit={handleLogIn}
      />
      <strong style={getLogInInfoStyle()}>{logInInfo.message}</strong>

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
