import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "../assets/marker-icon-2x.png",
    iconUrl: "../assets/marker-icon.png",
    shadowUrl: "../assets/marker-shadow.png",
});

interface MapProps {
    onAddIncident: (location: string) => void;
}

const Map: React.FC<MapProps> = ({ onAddIncident }) => {
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
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {markerPosition && (
                    <Marker position={markerPosition}>
                        <Popup>
                            <div>
                                <p>
                                    Latitude: {markerPosition[0].toFixed(4)} <br />
                                    Longitude: {markerPosition[1].toFixed(4)}
                                </p>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => onAddIncident(`Latitude: ${markerPosition[0]}, Longitude: ${markerPosition[1]}`)}
                                >
                                    Report Emergency
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default Map;
