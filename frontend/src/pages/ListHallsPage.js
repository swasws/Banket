// src/pages/ListHallsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ListHallsPage.css'; // Подключаем стили

function ListHallsPage() {
  const [halls, setHalls] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [capacityMin, setCapacityMin] = useState('');
  const [capacityMax, setCapacityMax] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [hallRes, cityRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/halls/', {
            headers: { Authorization: `Token ${token}` }
          }),
          axios.get('http://127.0.0.1:8000/api/cities/', {
            headers: { Authorization: `Token ${token}` }
          })
        ]);
        setHalls(hallRes.data);
        setCities(cityRes.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке данных.');
      }
    };
    fetchData();
  }, []);

  const filteredHalls = halls.filter(hall => {
    const matchesSearch = hall.name.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity ? hall.city === parseInt(selectedCity) : true;
    const matchesCapacityMin = capacityMin ? hall.capacity_max >= parseInt(capacityMin) : true;
    const matchesCapacityMax = capacityMax ? hall.capacity_min <= parseInt(capacityMax) : true;
    const matchesTags = tagFilter
      ? hall.tags.toLowerCase().includes(tagFilter.toLowerCase())
      : true;

    return matchesSearch && matchesCity && matchesCapacityMin && matchesCapacityMax && matchesTags;
  });

  return (
    <div className="halls-page">
      <h2>Список Залов</h2>

      <div className="filters">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по названию" />
        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
          <option value="">🏙 Все города</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
        <input type="number" value={capacityMin} onChange={e => setCapacityMin(e.target.value)} placeholder="👥 От" />
        <input type="number" value={capacityMax} onChange={e => setCapacityMax(e.target.value)} placeholder="До" />
        <input type="text" value={tagFilter} onChange={e => setTagFilter(e.target.value)} placeholder="🏷 Теги (банкет, ...)" />
      </div>

      {error && <p className="error">{error}</p>}
      {filteredHalls.length === 0 ? (
        <p>Нет залов по выбранным критериям.</p>
      ) : (
        <div className="hall-list">
          {filteredHalls.map(hall => {
            const imageUrl = hall.image?.startsWith('http')
              ? hall.image
              : `http://127.0.0.1:8000${hall.image}`;

            return (
              <div className="hall-card" key={hall.id}>
                <img src={imageUrl} alt={hall.name} className="hall-image" />
                <div className="hall-info">
                  <h3><Link to={`/halls/${hall.id}`}>{hall.name}</Link></h3>
                  <p>{hall.address || 'Без адреса'}</p>
                  <p>👥 Вместимость: {hall.capacity_min} — {hall.capacity_max}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ListHallsPage;
