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
  const [language, setLanguage] = useState('python'); // Default language is Python
  const [theme, setTheme] = useState('vs-dark'); // Default theme is vs-dark
  const [stdinEnabled, setStdinEnabled] = useState(true); // State to track if stdin is enabled or disabled

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

  const onChange = (newValue) => {
    setCode(newValue);
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
      </div>
      <div className="editor-container">
        <MonacoEditor
          width="800"
          height="600"
          language={language} // Use the selected language
          theme={theme} // Use the selected theme
          value={code}
          options={{ suggest: true }}
          onChange={onChange}
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
    </div>
  );
};

export default CodeEditor;
