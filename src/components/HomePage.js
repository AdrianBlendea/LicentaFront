import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BasicTabs from './BasicTabs'; // Import the BasicTabs component
import './HomePage.css';

const HomePage = () => {
    const [types, setTypes] = useState([]);
    const [problemsByType, setProblemsByType] = useState({});

    useEffect(() => {
        // Retrieve the auth token from localStorage
        const userData = localStorage.getItem('userData');
        let token = '';

        if (userData) {
            const parsedData = JSON.parse(userData);
            token = parsedData.token; // Extract the token from the parsed userData
        }

        // Fetch types with the auth token
        axios.get('http://localhost:8080/api/type/all', {
            headers: {
            }
        })
        .then(response => {
            const fetchedTypes = response.data;
            setTypes(fetchedTypes);
        })
        .catch(error => {
            console.error('There was an error fetching the data!', error);
        });
    }, []);

    return (
        <div className="container">
            <h1>All Problems</h1>
            <BasicTabs types={types} problemsByType={problemsByType} />
        </div>
    );
};

export default HomePage;
