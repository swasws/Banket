import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ListHallsPage() {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const token = localStorage.getItem('authToken');
        // Если нужно быть авторизованным, добавьте заголовок:
        const response = await axios.get('http://127.0.0.1:8000/api/halls/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setHalls(response.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке списка залов');
      }
    };
    fetchHalls();
  }, []);

  return (
    <div>
      <h2>Список Залов</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      {halls.length === 0 ? (
        <p>Нет доступных залов.</p>
      ) : (
        <ul>
          {halls.map((hall) => (
            <li key={hall.id}>
              <Link to={`/halls/${hall.id}`}>{hall.name}</Link> — {hall.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListHallsPage;
