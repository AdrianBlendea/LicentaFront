import React, { useState, useEffect } from 'react';
import JDoodleEditor from './JDoodleEditor';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios if needed
import './EditorPage.css';
import './CodeEditor'
import CodeEditor from './CodeEditor';


const EditorPage = () => {
  const { problemId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [problemRequirement, setProblemRequirement] = useState('');

  useEffect(() => {
    // Fetch problem requirement based on problemId
    axios.get(`http://localhost:8080/api/problem/${problemId}`)
      .then(response => {
        setProblemRequirement(response.data.requirment);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, [problemId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="editor-page">
      <div className="top-box">
        {/* Render the problem text */}
        <p>{problemRequirement}</p>
      </div>
      <div className="editor-box">
        <CodeEditor />
      </div>
    </div>
  );
};

export default EditorPage;
