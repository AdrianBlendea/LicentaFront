import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BasicTabs from './Plagiarism'; // Import the BasicTabs component
import './PlagiarismPage.css';

const PlagiarismPage = () => {
    const [types, setTypes] = useState([]);
    const [problemsByType, setProblemsByType] = useState({});
    const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        let token = '';
        let role = '';

        if (userData) {
            const parsedData = JSON.parse(userData);
            token = parsedData.token;
            role = parsedData.role;
            if (role === 'admin') {
                setIsAdmin(true); // Set isAdmin to true if the user is an admin
            }
        }

        axios.get('http://localhost:8080/api/type/all', {
            headers: {
                'Authorization': `Bearer ${token}`
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

    const handleOpenCreateDialog = () => {
        window.open('https://jplag.github.io/JPlag/', '_blank');
    };

    return (
        <div className="container">
            <h1>Instrument de detectie a plagiarismului</h1>
            {isAdmin && (
                <button className="create-problem-button" onClick={handleOpenCreateDialog}>
                    Deschide tool plagiarism
                </button>
            )}
            <BasicTabs types={types} problemsByType={problemsByType} />
        </div>
    );
};

export default PlagiarismPage;
