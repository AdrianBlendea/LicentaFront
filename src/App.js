import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProblemPage from './components/ProblemPage.js';
import EditorPage from './components/EditorPage';
import DocumentPage from './components/DocumentPage/DocumentPage';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import LoginPage from './components/login/LoginPage';
import ProfilePage from './components/ProfilePage/ProfilePage.tsx';
import Board from './components/LeaderBoardPage/board.js';
import Plagiarism from './components/PlagiarismPage.js';
import Homepage from './components/Homepage.js';
import { AuthProvider } from './components/AuthContext'; // Adjust the import path as needed
import PrivateRoute from './components/PrivateRoute'; // Adjust the import path as needed

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ResponsiveAppBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/documents" element={<DocumentPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:problemId" element={<EditorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/board" element={<Board />} />
          <Route path="/plagiarism" element={<Plagiarism />} />
          <Route path="/problems" element={<ProblemPage/>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
