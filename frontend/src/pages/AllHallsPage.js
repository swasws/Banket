// src/pages/AllHallsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AllHallsPage() {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/halls/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setHalls(response.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке всех залов');
      }
    };
    fetchHalls();
  }, []);

  return (
    <div>
      <h2>Все залы</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {halls.length === 0 ? (
        <p>Нет доступных залов.</p>
      ) : (
        <ul>
          {halls.map(hall => (
            <li key={hall.id}>
              <Link to={`/halls/${hall.id}`}>{hall.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllHallsPage;