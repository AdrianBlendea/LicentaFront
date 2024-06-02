// DocumentView.js
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
        const categoryResponse = await axios.get('http://localhost:8080/api/categories');
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
