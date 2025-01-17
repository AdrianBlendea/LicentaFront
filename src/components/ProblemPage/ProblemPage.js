import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BasicTabs from './BasicTabs'; 
import CreateProblemDialog from '../Dialogs/CreateProblemDialog'; 
import './ProblemPage.css';

const ProblemPage = () => {
    const [types, setTypes] = useState([]);
    const [problemsByType, setProblemsByType] = useState({});
    const [openCreateDialog, setOpenCreateDialog] = useState(false); 
    const [isAdmin, setIsAdmin] = useState(false); 

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        let token = '';
        let role = '';

        if (userData) {
            const parsedData = JSON.parse(userData);
            token = parsedData.token;
            role = parsedData.role;
            if (role === 'admin') {
                setIsAdmin(true); 
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
        window.location.reload();
    };

    return (
        <div className="container">
            <h1>Probleme</h1>
            {isAdmin && (
                <button className="create-problem-button" onClick={handleOpenCreateDialog}>
                    Problemă nouă
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

export default ProblemPage;
