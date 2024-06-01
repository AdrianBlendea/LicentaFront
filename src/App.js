import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


import HomePage from './components/HomePage';

import EditorPage from './components/EditorPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
          
            
          </ul>
        </nav>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:problemId" element={<EditorPage />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
