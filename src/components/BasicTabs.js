import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './BasicTabs.css';

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

export default function BasicTabs({ types }) {
  const [value, setValue] = useState(0);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate(); // Use the useNavigate hook

  const fetchProblems = (typeId) => {
    const userData = localStorage.getItem('userData');
    let token = '';
    let userId = '';

    if (userData) {
      const parsedData = JSON.parse(userData);
      token = parsedData.token; // Extract the token from the parsed userData
      userId = parsedData.id;
    }

    axios.get(`http://localhost:8080/api/problem/type/${typeId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Add the token to the Authorization header
      },
      params: {
        userId: userId
      }
    })
    .then(response => {
      setProblems(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the problems!', error);
    });
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

  return (
    <Box className="tab-container">
      <Box className="tab-header">
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {types.map((type, index) => (
            <Tab label={type.name} key={type.id} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {types.map((type, index) => (
        <CustomTabPanel value={value} index={index} key={type.id}>
          <div className="problem-list">
            {problems.map(problem => (
              <div 
                className={`problem-card ${problem.solved ? 'solved' : ''}`} 
                key={problem.id}
                style={{ backgroundColor: problem.solved ? '#e8f5e9' : '#fff' }} // White background for unsolved problems
              >
                <div 
                  onClick={() => handleProblemClick(problem.id)} 
                  className={`problem-link ${problem.solved ? 'solved' : ''}`} 
                  style={{ cursor: 'pointer' }}
                >
                  <h2>{problem.name}</h2>
                </div>
                <p>{problem.requirement}</p>
              </div>
            ))}
          </div>
        </CustomTabPanel>
      ))}
    </Box>
  );
}

BasicTabs.propTypes = {
  types: PropTypes.array.isRequired,
};
