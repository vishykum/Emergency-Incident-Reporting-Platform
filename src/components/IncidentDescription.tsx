import React from "react";
import { Incident } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";
import CSS from "csstype";

interface IncidentDescriptionProps {
    incident: Incident;
    show: boolean;
    loggedIn: boolean;
    onClose: () => void;
    onStatusChange: (incident: Incident, newStatus: string) => void;
};

interface StatusOptionsProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (newStatus: string) => void;
};

const IncidentDescription: React.FC<IncidentDescriptionProps> = ({ incident, show, loggedIn, 
    onClose, onStatusChange }) => {
    // Custom CSS styles for the sliding effect
    const isFirstRender = React.useRef(false);

    const fixedPanelStyle: CSS.Properties = {
        position: "absolute",
        top: 0,
        right: 0,
        width: "300px", // Adjust to your desired width
        height: "100%",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", // Slide-in animation
        zIndex: 0,
        overflowY: "auto", // Make sure content is scrollable if it overflows
        borderTopLeftRadius: "10px", // Round the top left corner for a softer look
        borderBottomLeftRadius: "10px", // Round the bottom left corner for a softer look
        transformOrigin: "right", // Ensure the panel slides in from the right
    };

    const [panelStyle, setPanelStyle] = React.useState<CSS.Properties>({
        ...fixedPanelStyle,
        boxShadow: "none",
        transform: "translateX(0)", // Moves the panel in/out
        display: "none",
});

    //This effect makes sure that the sliding panel is only displayed when it is called
    React.useEffect(() => {
        if (show) {
            setPanelStyle({
                ...fixedPanelStyle,
                display: "block",
            });

            if (isFirstRender.current) {
                setTimeout(() => {
                    setPanelStyle({
                        ...fixedPanelStyle,
                        boxShadow: "4px 0px 12px rgba(0, 0, 0, 0.15)",
                        transform: "translateX(100%)", // Moves the panel in/out
                    });
                }, 1000);
                isFirstRender.current = false;
            }

            else {
                setTimeout(() => {
                    setPanelStyle({
                        ...fixedPanelStyle,
                        boxShadow: "4px 0px 12px rgba(0, 0, 0, 0.15)",
                        transform: "translateX(100%)", // Moves the panel in/out
                    });
                }, 10);
            }
        }
        else {
            setPanelStyle({
                ...fixedPanelStyle,
                boxShadow: "none",
                transform: "translateX(0)", // Moves the panel in/out
            });

            setTimeout(() => {
                setPanelStyle({
                    ...panelStyle,
                    display: "none",
                });
              }, 200);
        }
        }, [show]);

    //This component allows the user to change incident status
    const [statusOptionsShow, setStatusOptionsShow] = React.useState(false);
    const StatusOptions: React.FC<StatusOptionsProps> = ({show, onClose, onSubmit}) => {
        let heading = (incident.status === "OPEN") ? ("RESOLVED") : ("OPEN");

        return (
            <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex={-1} role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Set incident status to <strong>{heading}</strong>?</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            id="descriptionClose"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <button type="button" className="btn btn-outline-primary" onClick={() => {onSubmit(heading)}}>
                            YES
                        </button>
                        <button type="button" className="btn btn-outline-primary" onClick={() => {onSubmit("");}}>
                            NO
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    };

    //This component populates the body of the sliding pane
    const FillDescription: React.FC = () => {
        if (incident == null) {
            return (
                <div className="modal-body"></div>
            );
        }

        else {
            const handleStatusModalSubmit = (newStatus: string) => {
                setStatusOptionsShow(false);
        
                if (newStatus != '') {
                    if(loggedIn) {
                        onStatusChange(incident, newStatus);
                    } else {
                        alert("Cannot change status. Please log in to change status")
                    }
                }
            };
        

            return (
                <div className="modal-body">
                    <p className="form-label"><strong>Type: </strong> {incident.type || ""} </p>
                    <p className="form-label"><strong>Location: </strong> {incident.location || ""} </p>
                    <p className="form-label"><strong>Reported by: </strong> {incident.reportedBy || "anonymous"}({incident.phoneNumber || "no phone number"})</p>
                    <p className="form-label"><strong>Status: </strong> {incident.status} <button className="btn btn-outline-warning btn-sm ms-2" 
                                            onClick={() => setStatusOptionsShow(true)} style={{ padding: "2px 8px", fontSize: "0.875rem" }}> Change</button></p>
                    <p className="form-label"><strong>Comments: </strong> {incident.comments || "no comments"} </p>
                    <p className="form-label"><strong>Image: </strong> 
                    {/* {incident.comments || "no image provided"}  */}
                    <img src={incident.image} alt="no image provided"></img>
                    </p>

                    <StatusOptions
                        show={statusOptionsShow}
                        onClose={() => {handleStatusModalSubmit('');}}
                        onSubmit={handleStatusModalSubmit}
                        />
                </div>
            );
        }
    }

    return (
        <div style={panelStyle}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between align-items-center">
                        <h5 className="modal-title">Incident Details</h5>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            aria-label="Close"
                            onClick={onClose}
                            style={{
                                marginRight: "10px",
                                marginTop: "5px", 
                                width: "30px",
                                height: "25px",
                                borderRadius: "15%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        > X </button>
                    </div>
                    <FillDescription />
                </div>
            </div>
        </div>
    );
}

export default IncidentDescription;