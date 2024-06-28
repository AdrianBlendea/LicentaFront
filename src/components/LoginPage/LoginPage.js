import React, { useState } from "react";
import "./LoginPage.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

export default function LoginPage() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
    return (
      <div className="LoginPage-wrapper">
        <div className="LoginPage">
          <div className={containerClass} id="container">
            <SignUpForm />
            <SignInForm />
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>Bine ai revenit!</h1>
                  <p>
                    Pentru a te conecta te rugam introdu datele personale
                  </p>
                  <button
                    className="ghost"
                    id="signIn"
                    onClick={() => handleOnClick("signIn")}
                  >
                    Autentificare
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1>Primadata pe aplicatie?</h1>
                  <p>Creaza cont pentru a putea accesa resursele complete ale aplicatiei</p>
                  <button
                    className="ghost"
                    id="signUp"
                    onClick={() => handleOnClick("signUp")}
                  >
                    Inregistrare
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
}