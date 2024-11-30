import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface LogInProps {
    show: boolean;
    onSubmit: (data: string) => void;
}

const LogIn: React.FC<LogInProps> = ({ show, onSubmit }) => {
    const [input, setInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);  // show or hidden password

    const handleSubmit = () => {
        onSubmit(input);
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    if (!show) {
        return null;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="loginInput" style={{ margin: "10px" }}>Log in:</label>
            
            <input
                type={showPassword ? "text" : "password"}
                id="loginInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <button 
                onClick={toggleShowPassword} 
                className="btn btn-outline-secondary btn-sm"
                style={{ padding: "5px 10px" }}
            >
                {showPassword ? "Hide" : "Show"}
            </button>
            
            <button 
                onClick={handleSubmit} 
                className="btn btn-outline-secondary btn-sm"
            >
                Submit
            </button>
            
        </div>
    );
};

export default LogIn;