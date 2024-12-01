import React from "react";
import { Incident } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";

interface IncidentTableProps {
    incidents: Incident[];
    onMoreInfo: (incident: Incident) => void;
    onDelete: (incident: Incident) => void;
}

const IncidentTable: React.FC<IncidentTableProps> = ({ incidents, onMoreInfo, onDelete }) => {
    return (
        <div className="container mt-4">
            <table className="table table-striped table-bordered align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Time Reported</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map((incident, index) => (
                        <tr key={index}>
                            <td>{incident.location}</td>
                            <td className="text-lowercase">{incident.type}</td>
                            <td>{incident.timeReported}</td>
                            <td>
                                <span
                                    className={`badge ${incident.status === "RESOLVED"
                                        ? "bg-success"
                                        : "bg-warning text-dark"
                                        }`}
                                >
                                    {incident.status}
                                </span>
                            </td>
                            <td>
                                <div className="d-flex flex-column align-items-center gap-2">
                                <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => onMoreInfo(incident)}
                                >
                                    Details
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => onDelete(incident)}
                                >
                                    Delete
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncidentTable;
