import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Ajustează calea conform structurii proiectului tău
import Cookies from 'js-cookie';
import './LoginPage.css';

const backendURL = 'http://localhost:8080/api';

function SignInForm() {
  const [state, setState] = useState({
    email: "",
    password: ""
  });
  const [loginError, setLoginError] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false); // Stare pentru validarea emailului
  const [isPasswordValid, setIsPasswordValid] = useState(false); // Stare pentru validarea parolei
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = evt => {
    const value = evt.target.value;
    const name = evt.target.name;

    setState({
      ...state,
      [name]: value
    });

    if (name === "email") {
      // Validează formatul emailului
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value));
    }

    if (name === "password") {
      // Validează dacă parola nu este goală
      setIsPasswordValid(value.trim().length > 0);
    }
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const loginURL = `${backendURL}/login`;

    fetch(loginURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: state.email, password: state.password }),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Autentificarea a eșuat');
      }
    })
    .then((data) => {
      setLoginMessage('Autentificare reușită');
      setLoginError(false);
      login(data);
      navigate('/home')
    })
    .catch((error) => {
      console.error('Error:', error);
      setLoginMessage('Autentificarea a eșuat');
      setLoginError(true);
      Cookies.remove('userData');
    });
  };

  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Autentificare</h1>
        <div className="social-container">
          <a href="#" className="social"><i className="fab fa-facebook-f" /></a>
          <a href="#" className="social"><i className="fab fa-google-plus-g" /></a>
          <a href="#" className="social"><i className="fab fa-linkedin-in" /></a>
        </div>
        {loginError && <p className="error-message">Email sau parola greșită.</p>}
        {loginMessage && <p className="success-message">{loginMessage}</p>}
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          className={isEmailValid ? 'valid' : 'invalid'} // Opțional: Adaugă clasa pentru stilizarea input-urilor valide/invalide
        />
        <input
          type="password"
          name="password"
          placeholder="Parolă"
          value={state.password}
          onChange={handleChange}
        />
        <button type="submit" disabled={!isFormValid} className={!isFormValid ? 'disabled-button' : ''}>Conectează-te</button>
      </form>
    </div>
  );
}

export default SignInForm;
