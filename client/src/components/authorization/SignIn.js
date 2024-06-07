import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "../api"; // Import the signIn function from api.js

function SignIn({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    async function submit(e) {
        e.preventDefault();

        try {
            const data = await signIn(email, password);

            if (data.status === "exist") {
                onLogin({ email, username: data.username, isAdmin: data.isAdmin });
                if (data.isAdmin) {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            } else if (data.status === "error") {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    }

    return (
        <div className="signin">
            <div className="signin__inner">
                <div className="signin-content">
                    <h1 className="signin__title title">SIGN IN</h1>
                    <form className="signin__form" onSubmit={submit}>
                        <input
                            className="signin__input input"
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="password__container">
                            <input
                                className="signin__input input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="eye-icon" onClick={toggleShowPassword}>
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <input className="button-submit" type="submit" value="Submit" />
                        <br />
                        <p className="text">OR</p>
                        <button className="button button-login">
                            <Link className="link-login" to="/signup">
                                Sign Up
                            </Link>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
