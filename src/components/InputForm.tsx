import React from "react";
import { Incident } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";

interface InputFormProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Incident, "status" | "timeReported" | "latlng" | "id">) => void;
    location: string;
}

const InputForm: React.FC<InputFormProps> = ({ show, onClose, onSubmit, location }) => {

    const [formData, setFormData] = React.useState<Omit<Incident, "status" | "timeReported" | "latlng" | "id">>({
        type: "",
        location: location || "",
        reportedBy: "",
        phoneNumber: "",
        comments: "",
    });

    React.useEffect(() => {
        setFormData((prev) => ({ ...prev, location }));
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            type: "",
            location: location || "",
            reportedBy: "",
            phoneNumber: "",
            comments: "",
        });
        onClose();
    };

    return (
        <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex={-1} role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Report Emergency</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit} className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label">
                                Incident Type
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="e.g., medical, shooting"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">
                                Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., SFU Burnaby, SFU Surrey"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="reportedBy" className="form-label">
                                Reported By
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="reportedBy"
                                name="reportedBy"
                                value={formData.reportedBy}
                                onChange={handleChange}
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="e.g., 123-456-7890"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comments" className="form-label">
                                Comments
                            </label>
                            <textarea
                                className="form-control"
                                id="comments"
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Add relevant details about the incident."
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InputForm;
