import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../Dialogs/ConfirmationDialog'; // Import the new component
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility
  const [problemToDelete, setProblemToDelete] = useState(null); // State to store problem to delete
  const [dialogMessage, setDialogMessage] = useState(''); // State to store dialog message
  const navigate = useNavigate();

  const fetchProblems = (typeId) => {
    const userData = localStorage.getItem('userData');
    let token = '';
    let userId = '';
    let role = '';

    if (userData) {
      const parsedData = JSON.parse(userData);
      token = parsedData.token;
      userId = parsedData.id;
      role = parsedData.role;
      if (role === 'admin') {
        setIsAdmin(true);
      }
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

  const handleOpenDialog = (problemId) => {
    setProblemToDelete(problemId);
    setDialogMessage('Esti sigur ca vrei sa stergi aceasa problema?'); // Set the custom message
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProblemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (problemToDelete) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const token = parsedData.token;

        axios.delete(`http://localhost:8080/api/problem/delete`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            problemId: problemToDelete
          }
        })
          .then(response => {
            console.log(response.data);
            // Remove the problem from the state
            setProblems(problems.filter(problem => problem.id !== problemToDelete));
            handleCloseDialog();
          })
          .catch(error => {
            console.error('There was an error deleting the problem!', error);
            handleCloseDialog();
          });
      }
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
                style={{ backgroundColor: problem.solved ? '#e8f5e9' : '#fff' }}
              >
                <div
                  onClick={() => handleProblemClick(problem.id)}
                  className={`problem-link ${problem.solved ? 'solved' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <h2>{problem.name}</h2>
                </div>
                <p>{problem.requirement}</p>
                {isAdmin && (
                  <button
                    onClick={() => handleOpenDialog(problem.id)}
                    className="delete-button"
                  >
                    Ștergere
                  </button>
                )}
              </div>
            ))}
          </div>
        </CustomTabPanel>
      ))}
      <ConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        message={dialogMessage} // Pass the message prop
      />
    </Box>
  );
}

BasicTabs.propTypes = {
  types: PropTypes.array.isRequired,
};
