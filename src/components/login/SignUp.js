import React from "react";

function SignUpForm() {
  const [state, setState] = React.useState({
    nume: "",
    email: "",
    parola: ""
  });

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { nume, email, parola } = state;
    alert(
      `Te-ai înscris cu numele: ${nume}, email: ${email} și parola: ${parola}`
    );

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
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
        <button>Înregistrează-te</button>
      </form>
    </div>
  );
}

export default SignUpForm;
