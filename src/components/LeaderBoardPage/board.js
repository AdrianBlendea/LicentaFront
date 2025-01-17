import React, { useState, useEffect } from 'react';
import Profiles from './profiles';
import axios from 'axios';
import "./board.css";
import userIcon from '../Images/userIcon.png';

export default function Board() {
  const [period, setPeriod] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add('leaderboard-page');

    return () => {
      document.body.classList.remove('leaderboard-page');
    };
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8080/statistics/leaderboard');
        setLeaderboard(response.data);
      } catch (err) {
        setError('Error fetching leaderboard data');
      }
    };

    fetchLeaderboard();
  }, [period]);

  const handleClick = (e) => {
    setPeriod(e.target.dataset.id);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="main" className="leaderboard-page">
      <div className="board">
        <h1 className='leaderboard'>Clasament punctaje</h1>



        <Profiles Leaderboard={between(leaderboard, period)}></Profiles>
      </div>
    </div>
  );
}

function between(data, between) {
  const today = new Date();
  const previous = new Date(today);
  previous.setDate(previous.getDate() - (between + 1));

  return data.filter(val => {
    const userDate = new Date(val.dt);
    if (between == 0) return val;
    return previous <= userDate && today >= userDate;
  }).sort((a, b) => b.score - a.score);
}
