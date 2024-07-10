import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, MenuItem, Typography, Box, Snackbar, Alert } from '@mui/material';
import './DocumentUpload.css';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const userData = localStorage.getItem('userData');
        let token = '';

        if (userData) {
          const parsedData = JSON.parse(userData);
          token = parsedData.token;
        }

        const response = await axios.get('http://localhost:8080/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setSnackbarMessage('Failed to fetch categories');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);

      const userData = localStorage.getItem('userData');
      let token = '';

      if (userData) {
        const parsedData = JSON.parse(userData);
        token = parsedData.token;
      }

      await axios.post('http://localhost:8080/documents/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage('Document încărcat cu succes');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading document:', error);
      setSnackbarMessage('Failed to upload document');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className="document-upload" sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#333' }}>
        Încarcă Document
      </Typography>
      <input
        accept="*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Alegeți fișier
        </Button>
      </label>
      {file && <Typography variant="body1" sx={{ color: '#333' }}>{file.name}</Typography>}
      <TextField
        select
        label="Categorie"
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{ color: '#333' }}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id} sx={{ color: '#333' }}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ mt: 2 }}
        disabled={!file || !selectedCategory}
      >
        Încarcă document
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DocumentUpload;
