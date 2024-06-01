import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import './CodeEditor.css'; // Import CSS file for styling

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('python'); // Default language is Python

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const runCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: getLanguageId(language), // Get language ID based on selected language
          stdin: '', // No input provided
        }),
      });
      const data = await response.json();
      if (data.status && data.status.id === 3) {
        setOutput(data.stdout);
      } else {
        setOutput(data.stderr);
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

  // Function to get language ID based on language name
  const getLanguageId = (language) => {
    switch (language) {
      case 'python':
        return 71;
      case 'cpp':
        return 54;
      case 'java':
        return 62;
      // Add more cases for other languages if needed
      default:
        return 71; // Default to Python if language not found
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
      <MonacoEditor
        width="800"
        height="600"
        language={language} // Use the selected language
        theme="vs-dark"
        value={code}
        options={{ suggest: true }}
        onChange={onChange}
      />
      <button onClick={runCode} disabled={loading}>Run Code</button>
      <div>
        <h2>Output:</h2>
        {loading ? <p>Loading...</p> : <pre>{output}</pre>}
      </div>
    </div>
  );
};

export default CodeEditor;
