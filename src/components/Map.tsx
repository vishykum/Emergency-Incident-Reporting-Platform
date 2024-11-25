import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Incident } from './types'

//Use this in the icon property for the Marker components to get the same marker icons throughout the map
const markerIcon = new L.Icon({
    iconUrl: String.raw`src\assets\marker-icon-2x.png`,
    iconSize: [20, 30],
});

//This is supposed to set default marker properties but it is not working
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "../assets/marker-icon-2x.png",
    iconUrl: "../assets/marker-icon.png",
    shadowUrl: "../assets/marker-shadow.png",
});

interface MapProps {
    incidents: Incident[];
    onAddIncident: (location: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({ incidents, onAddIncident }) => {
    const [markerPosition, setMarkerPosition] = React.useState<[number, number] | null>(null);

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setMarkerPosition([lat, lng]); // update marker position
            },
        });
        return null;
    };

    return (
        <div style={{ width: "60vw", height: "50vh", justifyContent: "center" }}>
            <MapContainer
                center={[49.2827, -123.1207]} // Vancouver
                zoom={10}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {markerPosition && (
                    <Marker position={markerPosition} icon={markerIcon}>
                        <Popup>
                            <div>
                                <p>
                                    Latitude: {markerPosition[0].toFixed(4)} <br />
                                    Longitude: {markerPosition[1].toFixed(4)}
                                </p>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => onAddIncident(markerPosition)}
                                >
                                    Report Emergency
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {incidents.map((incident, index) => (
                    <Marker position={incident.latlng} icon={markerIcon} key={index}>
                        <Popup>
                            <p>
                                Location: <strong>{"(lat:" + incident.latlng[0].toFixed(4) + ", lng:" + incident.latlng[1].toFixed(4) + ")"}</strong> <br />
                                Type: <strong>{incident.type}</strong>
                            </p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
