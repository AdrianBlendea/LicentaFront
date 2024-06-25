import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box, List, ListItem, ListItemText, ListItemIcon, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download'; // Import DownloadIcon
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../ConfirmationDialog'; // Import the ConfirmationDialog component
import './DocumentTabs.css'; // Add your custom CSS here

function DocumentTabs({ categories }) {
  const { isAuthenticated, user } = useAuth(); // Assuming user object has the role info
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [documentsByCategory, setDocumentsByCategory] = useState({});
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [open, setOpen] = useState(false);
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

  const handlePreviewClick = async (documentId, documentName) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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

      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      setSelectedDocumentUrl(url);
      setSelectedDocumentType(documentName.split('.').pop().toLowerCase());
      setOpen(true);
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

  const handleClose = () => {
    setOpen(false);
    URL.revokeObjectURL(selectedDocumentUrl);
  };

  const renderPreview = () => {
    if (selectedDocumentType === 'pdf') {
      return <iframe src={selectedDocumentUrl} width="100%" height="600px" title="Document Preview"></iframe>;
    } else if (selectedDocumentType === 'jpg' || selectedDocumentType === 'jpeg' || selectedDocumentType === 'png' || selectedDocumentType === 'gif') {
      return <img src={selectedDocumentUrl} alt="Document Preview" style={{ width: '100%' }} />;
    } else if (selectedDocumentType === 'doc' || selectedDocumentType === 'docx') {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedDocumentUrl)}`}
          width="100%"
          height="600px"
          title="Document Preview"
        ></iframe>
      );
    } else {
      return <div>Preview not available for this file type</div>;
    }
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
            <ListItem key={document.id || document}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={isAuthenticated ? document.name : document}
              />
              {isAuthenticated && (
                <div className="button-container">
                  <IconButton className="icon-button" aria-label="preview" onClick={() => handlePreviewClick(document.id, document.name)}>
                    <VisibilityIcon />
                  </IconButton>
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
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Document Preview</DialogTitle>
        <DialogContent>
          {renderPreview()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
