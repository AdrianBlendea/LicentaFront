import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import JDoodleEditor from './JDoodleEditor';

import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/editor">JDoodle Editor</Link>
            </li>
            
          </ul>
        </nav>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/editor" element={<JDoodleEditor />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
