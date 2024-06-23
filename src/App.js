import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignInForm from './components/login/SignIn';


import HomePage from './components/HomePage';

import EditorPage from './components/EditorPage';
import DocumentPage from './components/DocumentPage/DocumentPage';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import LoginPage from './components/login/LoginPage';

function App() {
  return (
    <Router>
      <div className="App">
      <ResponsiveAppBar />
        <nav> 
          <ul>
          
            
          </ul>
        </nav>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/documents" element={<DocumentPage />} />
          <Route path="/editor/:problemId" element={<EditorPage />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
