import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BasicTabs from './BasicTabs'; // Import the BasicTabs component
import CreateProblemDialog from './CreateProblemDialog'; // Import the CreateProblemDialog component
import './HomePage.css';

const HomePage = () => {
    const [types, setTypes] = useState([]);
    const [problemsByType, setProblemsByType] = useState({});
    const [openCreateDialog, setOpenCreateDialog] = useState(false); // State for create dialog
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
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleProblemCreated = (newProblem) => {
        // Logic to handle the new problem creation and update the state if needed
    };

    return (
        <div className="container">
            <h1>All Problems</h1>
            {isAdmin && (
                <button className="create-problem-button" onClick={handleOpenCreateDialog}>
                    Create Problem
                </button>
            )}
            <BasicTabs types={types} problemsByType={problemsByType} />
            <CreateProblemDialog
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
                onProblemCreated={handleProblemCreated}
            />
        </div>
    );
};

export default HomePage;
