import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from './CodeEditor';
import './EditorPage.css';

const EditorPage = () => {
  const { problemId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [problemRequirement, setProblemRequirement] = useState('');
  const [solution, setSolution] = useState('');
  const [language, setLanguage] = useState('java'); // Default language
  const [solvedProblem, setSolvedProblem] = useState(false);
  const [solutionProcent, setSolutionProcent] = useState(0);

  useEffect(() => {
    const fetchProblemRequirement = async () => {
      try {
        const userData = localStorage.getItem('userData');
        let token = '';
        let userId = '';

        if (userData) {
          const parsedData = JSON.parse(userData);
          token = parsedData.token; // Extract the token from the parsed userData
          userId = parsedData.id;
        }

        // Fetch problem requirement with the auth token
        const response = await axios.get(`http://localhost:8080/api/problem/${problemId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Add the token to the Authorization header
          },
          params: {
            userId: userId
          }
        });

        const { requirment, solved } = response.data;
        setProblemRequirement(requirment);

        // Conditionally fetch solution if the problem is solved
        if (solved) {
          const solutionResponse = await axios.get('http://localhost:8080/solution', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              userId: userId,
              problemId: problemId
            }
          });
          const { solution, language, procentScored } = solutionResponse.data;
          setSolution(solution);
          setLanguage(language);
          setSolvedProblem(true);
          setSolutionProcent(procentScored);
        }

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
        <p>{problemRequirement}</p>
      </div>
      <div className="editor-box">
        <CodeEditor initialCode={solution} initialLanguage={language} solved={solvedProblem} solutionPercent = {solutionProcent}/>
      </div>
    </div>
  );
};

export default EditorPage;
