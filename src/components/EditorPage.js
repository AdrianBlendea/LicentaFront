import React, { useState, useEffect } from 'react';
import JDoodleEditor from './JDoodleEditor';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './EditorPage.css';
import './CodeEditor';
import CodeEditor from './CodeEditor';

const EditorPage = () => {
  const { problemId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [problemRequirement, setProblemRequirement] = useState('');

  useEffect(() => {
    const fetchProblemRequirement = async () => {
      try {
        // Retrieve the auth token from localStorage
        const userData = localStorage.getItem('userData');
        let token = '';

        if (userData) {
          const parsedData = JSON.parse(userData);
          token = parsedData.token; // Extract the token from the parsed userData
        }

        // Fetch problem requirement with the auth token
        const response = await axios.get(`http://localhost:8080/api/problem/${problemId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setProblemRequirement(response.data.requirment);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchProblemRequirement();
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
