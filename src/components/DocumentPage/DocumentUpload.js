import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BasicSelect from './BasicSelect'; // Import the BasicSelect component
import './DocumentUpload.css';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Retrieve the auth token from localStorage
        const userData = localStorage.getItem('userData');
        let token = '';

        if (userData) {
          const parsedData = JSON.parse(userData);
          token = parsedData.token; // Extract the token from the parsed userData
        }

        // Fetch categories with the auth token
        const response = await axios.get('http://localhost:8080/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch categories');
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
      formData.append('category', selectedCategory); // Assuming 'categoryId' is the parameter name expected by the backend

      // Retrieve the auth token from localStorage
      const userData = localStorage.getItem('userData');
      let token = '';

      if (userData) {
        const parsedData = JSON.parse(userData);
        token = parsedData.token; // Extract the token from the parsed userData
      }

      await axios.post('http://localhost:8080/documents/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Document uploaded successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    }
  };

  return (
    <div className="document-upload">
      <h2>Incarca Document</h2>
      <input type="file" onChange={handleFileChange} />
      <BasicSelect value={selectedCategory} onChange={handleCategoryChange} categories={categories} />
      <button className="upload-button" onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default DocumentUpload;
