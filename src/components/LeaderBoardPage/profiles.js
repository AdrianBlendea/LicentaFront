import React from 'react';
import userIcon from '../Images/userIcon.png';

export default function Profiles({ Leaderboard }) {
  return (
    <div id="profile">
      {Item(Leaderboard)}
    </div>
  );
}

function Item(data) {
  return (
    <>
      {data.map((value, index) => (
        <div className="flex" key={index}>
          <div className="item">
            <img src={value.profilePicture ? `data:image/jpeg;base64,${value.profilePicture}` : userIcon} alt="" />
            <div className="info">
              <h3 className='name text-dark'>{value.name}</h3>
              <span>{value.email}</span>
            </div>
          </div>
          <div className="item score">
            <span>{value.score}</span>
          </div>
        </div>
      ))}
    </>
  );
}
