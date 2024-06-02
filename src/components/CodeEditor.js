import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import Switch from '@mui/material/Switch';
import './CodeEditor.css'; // Import CSS file for styling

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('java'); // Default language is Pjava
  const [theme, setTheme] = useState('vs-dark'); // Default theme is vs-dark
  const [stdinEnabled, setStdinEnabled] = useState(true); // State to track if stdin is enabled or disabled
  const [testResults, setTestResults] = useState(null); // State to store test results

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
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

  const runCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://onecompiler-apis.p.rapidapi.com/api/v1/run', {
        language: language,
        stdin: input, // Pass input value to the code execution
        files: [
          {
            name: getFileName(language),
            content: code,
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
        setOutput(data.stderr || 'Error executing code');
      }
    } catch (error) {
      setOutput('Error executing code');
    }
    setLoading(false);
  };

  const fetchTestCases = async () => {
    try {
      const currentPageNumber = window.location.pathname.split('/').pop();

      // Use the extracted number to construct the dynamic URL
      const dynamicURL = `http://localhost:8080/test/${currentPageNumber}`;
      
      // Make the axios request using the dynamic URL
      const response = await axios.get(dynamicURL);
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
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const { input: testCaseInput, expectedOutput } = testCase;
    
    // Set input for the current test case
    setInput(testCaseInput);
    
    // Run the code
    await runCode();
    
    // After running the code, push the test result to results array
    results.push({ ...testCase, actualOutput: output });
  }

  // After all test cases have been executed, update the testResults state
  setTestResults(results);
};

  useEffect(() => {
    setDefaultCode(language);
  }, [language]);

  const setDefaultCode = (language) => {
    switch (language) {
      case 'python':
        setCode(`# Python program
def main():
    print("Hello, Python!")

if __name__ == "__main__":
    main()
`);
        break;
      case 'cpp':
        setCode(`// C++ program
#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}
`);
        break;
      case 'java':
        setCode(`// Java program
public class Main {
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

  return (
    <div className="code-editor-container">
      <div className="language-select-container">
        <label htmlFor="language-select">Select Language: </label>
        <select id="language-select" value={language} onChange={handleLanguageChange}>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          {/* Add more options for other languages if needed */}
        </select>
      </div>
      <div className="theme-select-container">
        <label htmlFor="theme-select">Select Theme: </label>
        <select id="theme-select" value={theme} onChange={handleThemeChange}>
          <option value="vs-dark">Dark</option>
          <option value="vs-light">Light</option>
          <option value="hc-black">High Contrast Dark</option>
        </select>
      </div>
      <div className="run-button-container">
  <button className="run-button" onClick={runCode} disabled={loading}>Run Code</button>
  <button className="run-button run-test-button" onClick={runTestCases} disabled={loading}>Run Test Cases</button>
</div>
      <div className="editor-container">
        <MonacoEditor
          width="900"
          height="600"
          language={'language'} // Use the selected language
          theme={theme} // Use the selected theme
          value={code}
          options={{
            automaticLayout: true,
            minimap: { enabled: false }, // Disable minimap
            suggest: true, // Enable code suggestions (code completion)
            wordWrap: 'on', // Enable word wrapping
            fontFamily: '"Fira Code", "Courier New", monospace', // Custom font family
            fontSize: 16, // Custom font size
          }}
          onChange={setCode}
        />
      </div>
      <div className="stdin-container">
        <label htmlFor="stdin">Input (stdin):</label>
        <input type="text" id="stdin" value={input} onChange={handleInputChange} disabled={!stdinEnabled} />
        <Switch checked={stdinEnabled} onChange={toggleStdin} inputProps={{ 'aria-label': 'Enable Stdin' }} />
      </div>
      <div>
        <h2>Output:</h2>
        {loading ? <p>Loading...</p> : <pre style={{ fontSize: '18px' }}>{output}</pre>}
      </div>
      {testResults && (
  <div>
    <h2>Test Results:</h2>
    <ul>
      {testResults.map((result, index) => (
        <li key={index} className={result.actualOutput === result.expectedOutput ? 'passed' : 'failed'}>
          Test Case {result.id}: {result.actualOutput === result.expectedOutput ? 'Passed' : 'Failed'}
          <br />
          <span>Expected: {result.expectedOutput}</span><br />
          <span>Actual: {result.actualOutput}</span>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
};

export default CodeEditor;
