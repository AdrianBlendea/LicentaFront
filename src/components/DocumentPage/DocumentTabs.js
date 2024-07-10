import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box, List, ListItem, ListItemText, ListItemIcon, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download'; // Import DownloadIcon
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../Dialogs/ConfirmationDialog'; // Import the ConfirmationDialog component
import './DocumentTabs.css'; // Add your custom CSS here

function DocumentTabs({ categories }) {
  const { isAuthenticated, user } = useAuth(); // Assuming user object has the role info
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [documentsByCategory, setDocumentsByCategory] = useState({});
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility
  const [documentToDelete, setDocumentToDelete] = useState(null); // State to store document to delete
  const [dialogMessage, setDialogMessage] = useState(''); // State to store dialog message

  useEffect(() => {
    const fetchDocumentsByCategory = async () => {
      const docsByCat = {};
      try {
        const userData = localStorage.getItem('userData');
        let token = '';

        if (userData) {
          const parsedData = JSON.parse(userData);
          token = parsedData.token;
        }

        for (const category of categories) {
          const endpoint = isAuthenticated ? `http://localhost:8080/documents/all/${category.id}` : `http://localhost:8080/documents/all/noauth/${category.id}`;
          const response = await axios.get(endpoint, {
            headers: isAuthenticated ? { 'Authorization': `Bearer ${token}` } : {}
          });
          docsByCat[category.id] = response.data;
        }
        setDocumentsByCategory(docsByCat);
      } catch (error) {
        console.error('Error fetching documents by category:', error);
        alert('Failed to fetch documents by category');
      }
    };

    fetchDocumentsByCategory();
  }, [categories, isAuthenticated]);

  const handleChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleDownloadClick = async (documentId, documentName) => {
    try {
      const userData = localStorage.getItem('userData');
      let token = '';

      if (userData) {
        const parsedData = JSON.parse(userData);
        token = parsedData.token;
      }

      const response = await axios.get(`http://localhost:8080/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error fetching document:', error);
      alert('Failed to fetch document');
    }
  };

  const handleOpenDialog = (documentId) => {
    setDocumentToDelete(documentId);
    setDialogMessage('Esti sigur ca vrei sa stergi acest document?'); // Set the custom message
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDocumentToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const token = parsedData.token;

        axios.delete(`http://localhost:8080/documents/delete`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            documentId: documentToDelete
          }
        })
          .then(response => {
            console.log(response.data);
            // Remove the document from the state
            const updatedDocuments = { ...documentsByCategory };
            updatedDocuments[categories[selectedCategory].id] = updatedDocuments[categories[selectedCategory].id].filter(doc => doc.id !== documentToDelete);
            setDocumentsByCategory(updatedDocuments);
            handleCloseDialog();
          })
          .catch(error => {
            console.error('There was an error deleting the document!', error);
            handleCloseDialog();
          });
      }
    }
  };

  return (
    <Paper elevation={3} className="paper-transparent">
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
            <ListItem key={document.id || document}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={isAuthenticated ? document.name : document}
              />
              {isAuthenticated && (
                <div className="button-container">
                  <IconButton className="icon-button" aria-label="download" onClick={() => handleDownloadClick(document.id, document.name)}>
                    <DownloadIcon />
                  </IconButton>
                  {user && user.role === 'admin' && (
                    <button
                      onClick={() => handleOpenDialog(document.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      <ConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        message={dialogMessage} // Pass the message prop
      />
    </Paper>
  );
}

export default DocumentTabs;
