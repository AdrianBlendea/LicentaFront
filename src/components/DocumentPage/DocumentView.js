import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentTabs from './DocumentTabs';
import { Container, Typography } from '@mui/material';
import './DocumentView.css';

function DocumentView() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userData = localStorage.getItem('userData');
        let token = '';

        if (userData) {
          const parsedData = JSON.parse(userData);
          token = parsedData.token;
        }

        const categoryResponse = await axios.get('http://localhost:8080/api/categories', {
          headers: {}
        });

        const fetchedCategories = categoryResponse.data;
        setCategories(fetchedCategories);

      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch categories');
      }
    };

    fetchDocuments();
  }, []);

  return (
    <Container maxWidth="900"> {/* Change maxWidth to 'lg' for wider container */}
      <Typography variant="h4" gutterBottom>
        Categorii
      </Typography>
      <DocumentTabs categories={categories} />
    </Container>
  );
}

export default DocumentView;
