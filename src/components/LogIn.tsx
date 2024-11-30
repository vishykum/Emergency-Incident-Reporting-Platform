import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface LogInProps {
    show: boolean;
    onSubmit: (data: string) => void;
}

const LogIn: React.FC<LogInProps> = ({ show, onSubmit }) => {
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        onSubmit(input);
    };

    if (!show) {
        return null;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="loginInput" style={{ marginRight: "10px" }}>Log in:</label>
            <input
                type="text"
                id="loginInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default LogIn;