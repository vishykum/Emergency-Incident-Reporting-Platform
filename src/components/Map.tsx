import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Incident } from './types'
import axios from "axios";
import API_LIST from "../../api_keys.json"

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
    onAddIncident: (location: [number, number], address: string) => void;
    setBounds: (bounds: [L.LatLng, L.LatLng] | null) => void;
    onMarkerClick: (incident: Incident) => void;
    onAddMarkerRef: (id: number, ref: L.Marker | null) => void;
}

const Map: React.FC<MapProps> =  ({incidents, onAddIncident, setBounds, onMarkerClick, onAddMarkerRef}) => {
    const [map, setMap] = React.useState<L.Map | null>(null);
    const [markerPosition, setMarkerPosition] = React.useState<[number, number] | null>(null);
    const [markerLocation, setMarkerLocation] = React.useState<string | null>(null);
    const firstUpdate = React.useRef(true); //Used to send map bounds when map is initially loaded
    const markerRef = React.useRef<L.Marker | null>(null);

    function reverseGeocode(location: [number, number]): void {
        //API for reverse geocoding
        //PLEASE READ THE COMMENT BELOW BEFORE RUNNING THE APPLICATION!!
        //API limitations: 1 request/second and max 500 requests per day. If these limitations are breached, then the location will be set to latitude and longitude instead of address
        const API_KEY = API_LIST.REVERSE_GEOCODER_API_KEY;
        const request = String.raw`https://geocode.maps.co/reverse?lat=` + location[0] + String.raw`&lon=` + location[1] + String.raw`&api_key=` + API_KEY;
    
        axios.get(request)
        .then((response) => {
            setMarkerLocation(response.data.display_name);
        })
        .catch((error) => {
            console.log(error);
            setMarkerLocation(`Latitude: ${location[0]}, Longitude: ${location[1]}`);
        })
    }

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;

                setMarkerPosition([lat, lng]); // update marker position
                reverseGeocode([lat, lng] as [number, number]);

                if (markerPosition && markerRef.current) {
                    markerRef.current.openPopup(); // Open the popup every time the marker is re-rendered
        
                    if (map) {
                        map.flyTo([lat, lng], map.getZoom());
                    }
                }

            },
        });
        return null;
    };

    //This effect updates the map bounds to filter incidents only inside the map view for IncidentTable
        React.useEffect (() => {
                if (map !==null) {
                    if (firstUpdate.current) {
                        const bounds = map.getBounds();
                        setBounds([bounds.getNorthEast(), bounds.getSouthWest()]);
                        firstUpdate.current = false;
                    }
                    else {
                        map.on('moveend', () => {
                            const bounds = map.getBounds();
                            setBounds([bounds.getNorthEast(), bounds.getSouthWest()]);
                        });
            
                        return () => {
                            map.off('moveend', () => {
                                const bounds = map.getBounds();
                                setBounds([bounds.getNorthEast(), bounds.getSouthWest()]);
                            });
                        };
                    }
                }
        }, [map?.getBounds()]);
            

    return (
        <div style={{ width: "60vw", height: "50vh", justifyContent: "center"}}>
            <MapContainer
                center={[49.2827, -123.1207]} // Vancouver
                zoom={10}
                style={{ height: "100%", width: "100%" }}
                ref={(el) => {setMap(el);}}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {markerPosition && (
                    <Marker position={markerPosition} icon={markerIcon} 
                    ref={(ref) => {
                        markerRef.current = ref;
                        onAddMarkerRef(-1, ref);}} //id is -1 for active marker
                    eventHandlers={{
                        // Automatically open the popup once the marker is placed on the map
                        add: () => {                           
                            if (markerRef.current) {
                                markerRef.current.openPopup();
                                
                                if (map) {
                                    map.flyTo(markerRef.current.getLatLng(), map.getZoom());
                                }
                            }

                        },
                      }}
                    >
                        <Popup eventHandlers={{
                        // Automatically open the popup once the marker is placed on the map
                        remove: () => {                           
                            setMarkerPosition(null);
                        },
                      }}>
                            <div>
                                <p id="clickedMarker">
                                    Address: <strong>{markerLocation}</strong>
                                </p>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => onAddIncident(markerPosition, markerLocation || "")}
                                >
                                    Report Emergency
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {incidents.map((incident, index) => (
                    <Marker position={incident.latlng} icon={markerIcon} key={index} 
                    eventHandlers={{
                        popupopen: () => {
                            onMarkerClick(incident);
                        },
                        click: () => {
                            setMarkerPosition(null);
                            if (map) {
                              map.flyTo(incident.latlng, map.getZoom()); // Center map on the clicked incident
                            }
                        },
                    }} ref={(ref) => onAddMarkerRef(incident.id, ref)}>
                        <Popup>
                            <p>
                                Location: <strong>{incident.location}</strong> <br />
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
