import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import './LoginPage.css';

function SignUpForm() {
  const [state, setState] = useState({
    nume: "",
    email: "",
    parola: ""
  });

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = evt => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value
    });

    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    // Show the dialog immediately
    setOpen(true);

    const { nume, email, parola } = state;

    const userCreateDTO = {
      name: nume,
      email: email,
      password: parola
    };

    // Clear the form fields
    setState({
      nume: "",
      email: "",
      parola: ""
    });

    // Using fetch API to send the registration request
    fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCreateDTO)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Creează Cont</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <input
          type="text"
          name="nume"
          value={state.nume}
          onChange={handleChange}
          placeholder="Nume"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="parola"
          value={state.parola}
          onChange={handleChange}
          placeholder="Parolă"
        />
        <button type="submit" disabled={!isEmailValid}>Înregistrează-te</button>
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmare"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Un email de confirmare a fost trimis la adresa oferită.Va rugam verificati emailul pentru a va activa contul.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SignUpForm;
