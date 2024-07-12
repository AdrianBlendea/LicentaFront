import React from 'react';
import { Link } from 'react-router-dom'; 
import LottieAnimation from '../animations/LottieAnimation';
import mainAnimationData from '../animations/homeanimation.json'; 
import pythonanimation from '../animations/pythonanimation.json'; 
import javaanimation from '../animations/javaanimation.json'; 
import canimation from '../animations/canimation.json'; 
import './HomePage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Bine ai venit!</h1>
        <h1>Începeți călătoria în programare</h1>
        <div className="content">
          <div className="left-text">
            <h2>Suport Cuprinzător</h2>
            <p>
              Aplicația noastră de programare oferă suport cuprinzător pentru rezolvarea problemelor
              în diverse limbaje de programare. Fie că ești începător sau programator avansat,
              vei găsi resurse și instrumente care să te ajute să-ți îmbunătățești abilitățile
              în Java, C++ și Python.
            </p>
            <div className="small-animations">
              <LottieAnimation animationData={javaanimation} />
              <LottieAnimation animationData={pythonanimation} />
              <LottieAnimation animationData={canimation} />
            </div>
          </div>
          <div className="animation-container">
            <div className="animation">
              <LottieAnimation animationData={mainAnimationData} /> {}
            </div>
          </div>
          <div className="right-text">
            <h2>Comunitate Interactivă</h2>
            <p>
              Alătură-te comunității noastre pentru a accesa tutoriale, ghiduri de rezolvare a problemelor
              și provocări interactive de codare. Platforma noastră este proiectată să îți ofere
              instrumentele și cunoștințele necesare pentru a aborda sarcini de programare complexe
              și pentru a-ți îmbunătăți competențele de codare.
            </p>
            <Link to="/problems" className="start-button">
              Start Programming
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Homepage;
