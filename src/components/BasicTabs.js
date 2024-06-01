// BasicTabs.js
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
  const [value, setValue] = React.useState(0);
  const [problems, setProblems] = React.useState([]);

  const fetchProblems = (typeId) => {
    axios.get(`http://localhost:8080/api/problem/type/${typeId}`)
      .then(response => {
        setProblems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the problems!', error);
      });
  };

  React.useEffect(() => {
    if (types.length > 0) {
      fetchProblems(types[0].id);
    }
  }, [types]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    fetchProblems(types[newValue].id);
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
              <div className="problem-card" key={problem.id}>
                <Link to={`/editor/${problem.id}`} className="problem-link">
                  <h2>{problem.name}</h2>
                </Link>
                <p>{problem.requirment}</p>
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
