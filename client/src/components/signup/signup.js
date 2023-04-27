import React, { useState, useContext} from "react";
import "./signup.css";
import { GlobalContext } from "../../context";


export default function Signup() {
    const context = useContext(GlobalContext);

    const [email, setUserName] = useState();
    const [password, setPassword] = useState();
    const [ setShowSignup ] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
        })
        .then((response) => {
            if (response.status === 200) {
            return response.json();
            } else {
            throw new Error("error when submitting data", { cause: response });
            }
        })
        .then((data) => {
            context.updateUserData(data.email, data.token, Boolean(data.isAdmin));
            localStorage.setItem("token", JSON.stringify(data.token));
        })
        .then((data) => {
            context.updateUserData(data.email, data.token, Boolean(data.userAdd));
            localStorage.setItem("token", JSON.stringify(data.token));
        })
        .catch((err) => {
            console.error("handleSubmit", err);
        });

    };

    return (
        <>
        <div className="signup-wrapper">
            <form className="form" onSubmit={handleSubmit}>
            <h1>Create an account</h1>
            <h5>Only for current BCIT nursing students.</h5>   
            <label>
                <p>BCIT Email</p>
                <input type="text" onChange={(e) => setUserName(e.target.value)} />
            </label>
            <label>
                <p>Password</p>
                <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <label>
                <p>Confirm Password</p>
                <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <div className="submit-button">
                <button type="submit">SIGN UP</button>
            </div>
            {/* <p className="mt-4">
                Already have an account?{" "}
                <a className="create-Link" href="/login">
                Sign In
                </a>
            </p> */}
            <p className="mt-4">Already have an account?{" "}<a href='/' onClick={() => setShowSignup(true)}>Sign In</a> </p>

            </form>
        </div>
        </>
    );
    }
