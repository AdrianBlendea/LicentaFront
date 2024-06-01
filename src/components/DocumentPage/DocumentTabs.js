import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box, List, ListItem, ListItemText, ListItemIcon, Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

function DocumentTabs({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [documentsByCategory, setDocumentsByCategory] = useState({});

  useEffect(() => {
    const fetchDocumentsByCategory = async () => {
      const docsByCat = {};
      try {
        for (const category of categories) {
          const response = await axios.get(`http://localhost:8080/documents/all/${category.id}`);
          docsByCat[category.id] = response.data;
        }
        setDocumentsByCategory(docsByCat);
      } catch (error) {
        console.error('Error fetching documents by category:', error);
        alert('Failed to fetch documents by category');
      }
    };

    fetchDocumentsByCategory();
  }, [categories]);

  const handleChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  return (
    <Paper elevation={3}>
      <Box display="flex" justifyContent="center">
        <Tabs
          value={selectedCategory}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category, index) => (
            <Tab key={category.id} label={category.name} />
          ))}
        </Tabs>
      </Box>
      <Box p={3}>
        <List>
          {documentsByCategory[categories[selectedCategory]?.id]?.map((document) => (
            <ListItem key={document.id} button component="a" href={`http://localhost:8080/documents/${document.id}`}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={document.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}

export default DocumentTabs;
