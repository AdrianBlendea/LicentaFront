import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        // Fetch exercises from your backend API
        axios.get('/api/exercises')
            .then(response => {
                setExercises(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the exercises!', error);
            });
    }, []);

    return (
        <div>
            <h1>All Exercises</h1>
            <ul>
                {exercises.map(exercise => (
                    <li key={exercise.id}>
                        {exercise.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
