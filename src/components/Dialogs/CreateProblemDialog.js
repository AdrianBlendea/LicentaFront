import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import axios from 'axios';

function CreateProblemDialog({ open, onClose, onProblemCreated }) {
  const [name, setName] = useState('');
  const [requirement, setRequirement] = useState('');
  const [testList, setTestList] = useState([{ input: '', expectedOutput: '' }]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [procentToPass, setProcentToPass] = useState(50); // State for percentage to pass
  const [formValid, setFormValid] = useState(false); // State to track form validity

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    let token = '';

    if (userData) {
      const parsedData = JSON.parse(userData);
      token = parsedData.token;
    }

    axios.get('http://localhost:8080/api/type/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const fetchedTypes = response.data;
      setTypes(fetchedTypes);
      if (fetchedTypes.length > 0) {
        setSelectedType(fetchedTypes[0].id); // Set the first type as default
      }
    })
    .catch(error => {
      console.error('There was an error fetching the types!', error);
    });
  }, []);

  useEffect(() => {
    validateForm();
  }, [selectedType, testList]);

  const validateForm = () => {
    // Check if selectedType is valid and there is at least one test
    const isSelectedTypeValid = selectedType !== '';
    const isTestListValid = testList.length > 0 && testList.some(test => test.input.trim() !== '' || test.expectedOutput.trim() !== '');

    setFormValid(isSelectedTypeValid && isTestListValid);
  };

  const handleAddTest = () => {
    setTestList([...testList, { input: '', expectedOutput: '' }]);
  };

  const handleRemoveTest = (index) => {
    if (testList.length > 1) {
      const newTestList = testList.filter((_, i) => i !== index);
      setTestList(newTestList);
    }
  };

  const handleTestChange = (index, field, value) => {
    const newTestList = [...testList];
    newTestList[index][field] = value;
    setTestList(newTestList);
  };

  const handleCreate = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const token = parsedData.token;

      const newProblem = {
        name,
        requirement,
        typeId: selectedType,
        testList,
        procentToPass // Include percentToPass in the DTO
      };

      axios.post('http://localhost:8080/api/problem/create', newProblem, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        onProblemCreated(response.data);
        onClose();
        window.location.reload();
      })
      .catch(error => {
        console.error('There was an error creating the problem!', error);
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Problem</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Requirement"
          type="text"
          fullWidth
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
        />
        <Select
          margin="dense"
          label="Type"
          fullWidth
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {types.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <label>Percentage to Pass: {procentToPass}%</label>
          <Slider
            value={procentToPass}
            onChange={(e, newValue) => setProcentToPass(newValue)}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={100}
          />
        </div>
        {testList.map((test, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <TextField
              label={`Input ${index + 1}`}
              type="text"
              value={test.input}
              onChange={(e) => handleTestChange(index, 'input', e.target.value)}
              fullWidth
            />
            <TextField
              label={`Expected Output ${index + 1}`}
              type="text"
              value={test.expectedOutput}
              onChange={(e) => handleTestChange(index, 'expectedOutput', e.target.value)}
              fullWidth
            />
            {testList.length > 1 && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveTest(index)}
                style={{ alignSelf: 'center', marginLeft: '10px' }}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button onClick={handleAddTest} color="primary">
          Add Test
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" disabled={!formValid || testList.length === 0}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateProblemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProblemCreated: PropTypes.func.isRequired
};

export default CreateProblemDialog;
