import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signUp } from "../api"; // Import the signUp function from api.js

function SignUp({ onLogin }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    async function submit(e) {
        e.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage("Password must be at least 8 characters long and contain at least one number.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const data = await signUp(username, email, password);

            if (data.status === "success") {
                onLogin({ username, email });
                navigate("/home", { state: { id: email } });
            } else if (data.status === "error") {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    }

    return (
        <div className="signup">
            <div className="signup__inner">
                <div className="signup-content">
                    <div className="signup__item">
                        <h1 className="signup__subtitle title">WELCOME TO SOILESAY</h1>
                        <p className="signup__text text">Practice Kazakh Language skills through fun and interactive games!</p>
                    </div>

                    <div className="signup__item">
                        <h2 className="signup__title title">CREATE ACCOUNT</h2>

                        <form className="signup__form" onSubmit={submit}>
                            <input
                                className="signup__input input"
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input
                                className="signup__input input"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className="password__container">
                                <input
                                    className="signup__input input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span className="eye-icon" onClick={toggleShowPassword}>
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </span>
                            </div>

                            <div className="password__container">
                                <input
                                    className="signup__input input"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <span className="eye-icon" onClick={toggleShowConfirmPassword}>
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                </span>
                            </div>

                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <input className="button-submit" type="submit" value="Sign Up" />

                            <br />

                            <p className="text">OR</p>

                            <button className="button button-login">
                                <Link className="link-login" to="/">
                                    Login
                                </Link>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
