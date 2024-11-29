import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface LogInProps {
    show: boolean;
    onSubmit: (data: string) => void;
}



const LogIn: React.FC<LogInProps> = ({ show, onSubmit, }) => {
    const handleSubmit = () => {
        let input: string = "";
        if(document.getElementById("loggedIn") == null) {
            onSubmit(input)
        } else {
            const inputElement = document.getElementById("loggedIn") as HTMLInputElement;
            input = inputElement.value;
        }
        onSubmit(input);
    };

    return (
        <div>
            <label>Log in:</label>
            <input type="text" id="loggedIn"></input>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default LogIn;