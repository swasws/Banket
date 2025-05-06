// src/pages/CityHallsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CityHallsPage() {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCityAndHalls = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const [cityRes, hallsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/cities/${id}/`, {
            headers: { Authorization: `Token ${token}` }
          }),
          axios.get('http://127.0.0.1:8000/api/halls/', {
            headers: { Authorization: `Token ${token}` }
          })
        ]);

        setCity(cityRes.data);
        const filtered = hallsRes.data.filter(h => h.city === parseInt(id));
        setHalls(filtered);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке залов по городу.');
      }
    };
    fetchCityAndHalls();
  }, [id]);

  return (
    <div>
      <h2>Залы в городе: {city ? city.name : '...'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {halls.length === 0 ? (
        <p>Нет доступных залов в этом городе.</p>
      ) : (
        <ul>
          {halls.map((hall) => (
            <li key={hall.id}>
              <Link to={`/halls/${hall.id}`}>{hall.name}</Link> — {hall.address || 'Без адреса'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CityHallsPage;
