// HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BasicTabs from './BasicTabs'; // Import the BasicTabs component
import './HomePage.css';

const HomePage = () => {
    const [types, setTypes] = useState([]);
    const [problemsByType, setProblemsByType] = useState({});

    useEffect(() => {
        // Fetch types
        axios.get('http://localhost:8080/api/type/all')
            .then(response => {
                const fetchedTypes = response.data;
                setTypes(fetchedTypes);

                // Fetch problems after fetching types
                return axios.get('http://localhost:8080/api/problem/all');
            })
            .then(response => {
                const fetchedProblems = response.data;

                // Categorize problems by type
                const categorizedProblems = {};
                fetchedProblems.forEach(problem => {
                    if (!categorizedProblems[problem.type.id]) {
                        categorizedProblems[problem.type.id] = [];
                    }
                    categorizedProblems[problem.type.id].push(problem);
                });

                setProblemsByType(categorizedProblems);
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
