import React, { useState, useEffect } from 'react';
import MonacoEditor from "@monaco-editor/react";
import axios from 'axios';
import Switch from '@mui/material/Switch';
import './CodeEditor.css'; // Import CSS file for styling
import Paper from '@mui/material/Paper';


const CodeEditor = ({ initialCode = '', initialLanguage = 'java', solved = false, solutionPercent = 0 ,}) => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('java'); // Default language is java
  const [theme, setTheme] = useState('vs-dark'); // Default theme is vs-dark
  const [stdinEnabled, setStdinEnabled] = useState(true); // State to track if stdin is enabled or disabled
  const [testResults, setTestResults] = useState(null); // State to store test results
  const [isCodeRun, setIsCodeRun] = useState(false); // State to track if the code has been run after changes
  const [allTestsPassed, setAllTestsPassed] = useState(false); // State to track if all tests passed
  const [readOnly, setReadOnly] = useState(false);
  const [canYouRun, setCanYouRun] = useState(true); // State to track if the code has been run after changes
  const [deleteButonDisabled, setDeleteButonDisabled] = useState(true);
  const [percentToPass, setPercentToPass] = useState(50); // Required percentage of tests to pass
  const [percentPassed, setPercentPassed] = useState(0); // Percentage of tests passed
  const [paperText, setPaperText] = useState('');
  const [isPaperVisible, setIsPaperVisible] = useState(false);



  useEffect(() => {
    if (solved === false) setDefaultCode(language);
  }, [language]);

  useEffect(() => {
    if (solved === true) {
      setCode(initialCode);
      setLanguage(initialLanguage);
      setReadOnly(true);
      setCanYouRun(false);
      setDeleteButonDisabled(false);
      setIsPaperVisible(true);
      setPaperText("Solutia ta a trecut un procent de " + solutionPercent +"% din teste.");
    }
  }, [initialCode, initialLanguage]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setTestResults(null); // Reset test results
    setIsCodeRun(false); // Reset the code run state
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const toggleStdin = () => {
    setStdinEnabled(!stdinEnabled); // Toggle the state
  };


  

  const runCode = async (currentCode, input1) => {
    setLoading(true);
    try {
      const response = await axios.post('https://onecompiler-apis.p.rapidapi.com/api/v1/run', {
        language: language,
        stdin: input1, 
        files: [
          {
            name: getFileName(language),
            content: currentCode,
          },
        ],
      }, {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '339f3f676fmsh88d399db8b2d6c0p18231cjsn7cdac00b21c4',
          'X-RapidAPI-Host': 'onecompiler-apis.p.rapidapi.com'
        }
      });

      const data = response.data;
      if (data.stdout) {
        setOutput(data.stdout);
      } else {
        setOutput(data.stderr || 'Eroare la executarea codului');
      }
      setIsCodeRun(true); // Set the code run state to true after successful execution
      setLoading(false);
      return response.data;
    } catch (error) {
      setOutput('Eroare la executarea codului');
    }
    setLoading(false);
  };

  const fetchTestCases = async () => {
    try {
      const currentPageNumber = window.location.pathname.split('/').pop();

      // Use the extracted number to construct the dynamic URL
      const dynamicURL = `http://localhost:8080/test/${currentPageNumber}`;

      // Retrieve the auth token from localStorage
      const userData = localStorage.getItem('userData');
      let token = '';

      if (userData) {
        const parsedData = JSON.parse(userData);
        token = parsedData.token; // Extract the token from the parsed userData
      }

      // Make the axios request using the dynamic URL
      const response = await axios.get(dynamicURL, {
        headers: {
          'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching test cases:', error);
      return [];
    }
  };

  const runTestCases = async () => {
    const testCases = await fetchTestCases();
    if (testCases.length === 0) {
      console.error('No test cases available');
      return;
    }

    const results = [];
    let testsPassed = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const { input: testCaseInput, expectedOutput } = testCase;

      // Set input for the current test case
      //setInput(testCaseInput);

      // Run the code
      const data = await runCode(code, testCaseInput);

      // Check if the actual output matches the expected output
      const actualOutput = data.stdout;
      const testPassed = actualOutput.trim() === expectedOutput.trim();
      if (testPassed) {
        testsPassed++;
      }

      // After running the code, push the test result to results array
      results.push({ ...testCase, actualOutput, testPassed });
    }

    const percentPassed = (testsPassed / testCases.length) * 100;
    setPercentPassed(percentPassed);
    setTestResults(results);
    setAllTestsPassed(percentPassed >= percentToPass); // Update allTestsPassed state based on percentPassed
  };

  const setDefaultCode = (language) => {
    switch (language) {
      case 'python':
        setCode(`def main():
    print("Hello, Python!")

if __name__ == "__main__":
    main()
`);
        break;
      case 'cpp':
        setCode(`#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}
`);
        break;
      case 'java':
        setCode(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
`);
        break;
      default:
        setCode('');
    }
  };

  const getFileName = (language) => {
    switch (language) {
      case 'python':
        return 'index.py';
      case 'cpp':
        return 'index.cpp';
      case 'java':
        return 'index.java';
      default:
        return 'index.py';
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setIsCodeRun(false); // Disable the "Run Test Cases" button when the code changes
    setAllTestsPassed(false);
  };

  const deleteSolution = async () => {
    try {
      const userData = localStorage.getItem('userData');
      let userId = '';
      let token = '';

      if (userData) {
        const parsedData = JSON.parse(userData);
        userId = parsedData.id; // Extract the userId from the parsed userData
        token = parsedData.token;
      }

      const problemId = window.location.pathname.split('/').pop();

      await axios.delete('http://localhost:8080/solution/delete', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
        },
        params: {
          userId: userId,
          problemId: problemId
        },
      });

      alert('Solution deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error to delete solution:', error);
      alert('Failed to delete solution');
    }
  };

  const submitSolution = async () => {
    try {
      const userData = localStorage.getItem('userData');
      let userId = '';
      let token = '';

      if (userData) {
        const parsedData = JSON.parse(userData);
        userId = parsedData.id; // Extract the userId from the parsed userData
        token = parsedData.token;
      }

      const problemId = window.location.pathname.split('/').pop();
      const solutionDTO = {
        solution: code,
        userId: userId,
        problemId: problemId,
        language: language,
        procentScored: percentPassed // Add the percentage of tests that actually passed
      };

      await axios.post('http://localhost:8080/solution/submit', solutionDTO, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      alert('Solution submitted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Failed to submit solution');
    }
  };

  return (
  <div className="code-editor-container">
    <div className="language-select-container">
      <label htmlFor="language-select">Alege limbajul: </label>
      <select id="language-select" value={language} onChange={handleLanguageChange} enabled >
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        {/* Add more options for other languages if needed */}
      </select>
    </div>
    <div className="theme-select-container">
      <label htmlFor="theme-select">Alege tema: </label>
      <select id="theme-select" value={theme} onChange={handleThemeChange}>
        <option value="vs-dark">Dark</option>
        <option value="vs-light">Light</option>
        <option value="hc-black">High Contrast Dark</option>
      </select>
    </div>
    <div className="run-button-container">
      <button className="run-button" onClick={() => runCode(code, input)} disabled={loading || !canYouRun}>Rulează cod</button>
      <button className="run-button run-test-button" onClick={runTestCases} disabled={loading || !isCodeRun}>Rulează teste</button>
      <button className="run-button submit-button" onClick={submitSolution} disabled={percentPassed < percentToPass || !isCodeRun}>Trimitere soluție</button>
      <button className="run-button delete-solution-button" onClick={deleteSolution} disabled={deleteButonDisabled || loading}>Șterge soluție</button>
    </div>
    <div className="editor-container">
      <MonacoEditor
        width="900"
        height="41vh"
        language={language} // Use the selected language
        theme={theme} // Use the selected theme
        value={code}
        options={{
          //automaticLayout: true,
          readOnly:readOnly,
          minimap: { enabled: false }, // Disable minimap
          suggest: true, // Enable code suggestions (code completion)
          wordWrap: 'on', // Enable word wrapping
          fontFamily: '"Fira Code", "Courier New", monospace', // Custom font family
          fontSize: 16, // Custom font size
        }}
        onChange={handleCodeChange}
      />
    </div>
    <div className="stdin-container">
      <label htmlFor="stdin">Intrare (stdin):</label>
      <input type="text" id="stdin" value={input} onChange={handleInputChange} disabled={!stdinEnabled} />
      <Switch checked={stdinEnabled} onChange={toggleStdin} inputProps={{ 'aria-label': 'Enable Stdin' }} />
    </div>
    <div>
      <h2>Rezultat:</h2>
      {loading ? <p>Loading...</p> : <pre style={{ fontSize: '18px' }}>{output}</pre>}
    </div>
    {testResults && (
      <div>
        <h2>Test Results:</h2>
        <ul>
          {testResults.map((result, index) => (
            <li key={index} className={result.testPassed ? 'passed' : 'failed'}>
              Caz de testare : {result.testPassed ? 'Reușit' : 'Eșuat'}
              <br />
              <span>Rezultat așteptat: {result.expectedOutput}</span><br />
              <span>Rezultat adevărat: {result.actualOutput}</span>
            </li>
          ))}
        </ul>
        {percentPassed < percentToPass && (
          <p>{`Trebuie să treci cel puțin ${percentToPass}% din teste. Ai trecut ${percentPassed.toFixed(2)}%.`}</p>
        )}
        {solved && (
          <div>
            <p>{`You scored ${percentPassed.toFixed(2)}%.`}</p>
          </div>
        )}
      </div>
    )}
   <Paper className={`paper-container ${isPaperVisible ? '' : 'invisible'}`} elevation={3}>
  {paperText}
</Paper>
  </div>
);

};

export default CodeEditor;
