import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import EditorPage from './components/EditorPage';
import DocumentPage from './components/DocumentPage/DocumentPage';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import LoginPage from './components/login/LoginPage';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/documents" element={<DocumentPage />} />
        <Route path="/editor/:problemId" element={<EditorPage />} />
      </Routes>
    </div>
  );
}

export default App;
