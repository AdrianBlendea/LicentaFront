import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentTabs from './DocumentTabs';
import { Container, Typography } from '@mui/material';
import './DocumentView.css';

function DocumentView() {
  const [categories, setCategories] = useState([]);
  const [documentsByCategory, setDocumentsByCategory] = useState({});

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Retrieve the auth token from localStorage
        const userData = localStorage.getItem('userData');
        let token = '';

        if (userData) {
          const parsedData = JSON.parse(userData);
          token = parsedData.token; // Extract the token from the parsed userData
        }

        // Fetch categories with the auth token
        const categoryResponse = await axios.get('http://localhost:8080/api/categories', {
          headers: {
          
          }
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
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Categorii
      </Typography>
      <DocumentTabs categories={categories} documentsByCategory={documentsByCategory} />
    </Container>
  );
}

export default DocumentView;
