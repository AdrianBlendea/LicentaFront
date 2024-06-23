import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box, List, ListItem, ListItemText, ListItemIcon, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function DocumentTabs({ categories }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [documentsByCategory, setDocumentsByCategory] = useState({});
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [open, setOpen] = useState(false);

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

  const handleDocumentClick = (documentId, documentName) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch and download the document
    const fetchDocument = async () => {
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

    fetchDocument();
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
            <ListItem key={document.id || document} button={isAuthenticated} onClick={() => handleDocumentClick(document.id, document.name)}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={isAuthenticated ? document.name : document}
              />
              {isAuthenticated && (
                <IconButton edge="end" aria-label="preview" onClick={() => handlePreviewClick(document.id, document.name)}>
                  <VisibilityIcon />
                </IconButton>
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
    </Paper>
  );
}

export default DocumentTabs;
