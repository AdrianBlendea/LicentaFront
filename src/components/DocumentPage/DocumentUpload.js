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
        const response = await axios.get('http://localhost:8080/api/categories');
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
      formData.append('categoryId', selectedCategory); // Assuming 'categoryId' is the parameter name expected by the backend
      await axios.post('http://localhost:8080/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Document uploaded successfully');
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
