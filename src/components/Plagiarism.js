import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Plagiarism.css';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="tab-panel">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ types = [] }) {
  const [value, setValue] = useState(0);
  const [problems, setProblems] = useState([]);
  const [solutionCounts, setSolutionCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProblems = (typeId) => {
    const userData = localStorage.getItem('userData');
    let token = '';
    let userId = '';

    if (userData) {
      const parsedData = JSON.parse(userData);
      token = parsedData.token;
      userId = parsedData.id;
    }

    axios.get(`http://localhost:8080/api/problem/type/${typeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        userId: userId
      }
    })
      .then(response => {
        setProblems(response.data);
        response.data.forEach(problem => {
          fetchSolutionCounts(problem.id);
        });
      })
      .catch(error => {
        console.error('There was an error fetching the problems!', error);
      });
  };

  const fetchSolutionCounts = (problemId) => {
    const userData = localStorage.getItem('userData');
    let token = '';

    if (userData) {
      const parsedData = JSON.parse(userData);
      token = parsedData.token;

      ['java', 'python', 'cpp'].forEach(language => {
        axios.get(`http://localhost:8080/solution/solutionCount`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            problemId: problemId,
            solutionLanguage: language
          }
        })
          .then(response => {
            setSolutionCounts(prevCounts => ({
              ...prevCounts,
              [`${problemId}-${language}`]: response.data
            }));
          })
          .catch(error => {
            console.error('There was an error fetching the solution count!', error);
          });
      });
    }
  };

  useEffect(() => {
    if (types.length > 0) {
      fetchProblems(types[0].id);
    }
  }, [types]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    fetchProblems(types[newValue].id);
  };

  const handleProblemClick = (problemId) => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login');
    } else {
      navigate(`/editor/${problemId}`);
    }
  };

  const handleReportClick = (problemId, language) => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const token = parsedData.token;

      setLoading(true);

      axios.get(`http://localhost:8080/plagiarism`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          problemId: problemId,
          solutionLanguage: language
        },
        responseType: 'blob' // Important to handle the binary data
      })
        .then(response => {
          // Create a link to download the file
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${problemId}-${language}-report.zip`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('There was an error generating the report!', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Box className="tab-container">
      <Box className="tab-header">
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {types.length > 0 && types.map((type, index) => (
            <Tab label={type.name} key={type.id} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {types.length > 0 && types.map((type, index) => (
        <CustomTabPanel value={value} index={index} key={type.id}>
          <div className="problem-list">
            {problems.length > 0 && problems.map(problem => (
              <div
                className="problem-card"
                key={problem.id}
              >
                <div
                  onClick={() => handleProblemClick(problem.id)}
                  className="problem-link"
                  style={{ cursor: 'pointer' }}
                >
                  <h2>{problem.name}</h2>
                </div>
                <p>{problem.requirement}</p>
                <div className="report-buttons">
                  {['java', 'python', 'cpp'].map(language => {
                    const solutionCount = solutionCounts[`${problem.id}-${language}`];
                    const isDisabled = solutionCount < 2;
                    const tooltipMessage = isDisabled ? 'Not enough solutions sent for report' : '';

                    return (
                      <button
                        key={`${problem.id}-${language}`}
                        onClick={() => handleReportClick(problem.id, language)}
                        disabled={isDisabled}
                        title={tooltipMessage}
                        className={isDisabled ? 'disabled-button' : ''}
                      >
                        {language.charAt(0).toUpperCase() + language.slice(1)} Report
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CustomTabPanel>
      ))}
      {loading && (
        <div className="loading-overlay">
          <CircularProgress />
          <Typography variant="h6">Generating report...</Typography>
        </div>
      )}
    </Box>
  );
}

BasicTabs.propTypes = {
  types: PropTypes.array.isRequired,
};
