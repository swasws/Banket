import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyHallsPage.css';

function MyHallsPage() {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyHalls = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const currentUserId = parseInt(localStorage.getItem('userId'), 10);
        const response = await axios.get('http://127.0.0.1:8000/api/halls/', {
          headers: { Authorization: `Token ${token}` }
        });

        const filtered = response.data
          .filter(h => h.owner === currentUserId)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Сортировка: новые в начале

        setHalls(filtered);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке залов владельца');
      }
    };

    fetchMyHalls();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Удалить зал?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://127.0.0.1:8000/api/halls/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setHalls(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      alert('Ошибка при удалении зала.');
    }
  };

  return (
    <div className="my-halls-container">
      <h2>Мои залы</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="hall-grid">
        {halls.length === 0 ? (
          <p>У вас пока нет залов.</p>
        ) : (
          halls.map(hall => {
            const imageUrl = hall.image?.startsWith('http')
              ? hall.image
              : `http://127.0.0.1:8000${hall.image}`;

            return (
              <div className="hall-card" key={hall.id}>
                {hall.image && (
                  <img src={imageUrl} alt={hall.name} className="hall-image" />
                )}
                <div className="hall-info">
                  <h3>{hall.name}</h3>
                  <p><strong>Адрес:</strong> {hall.address || 'Не указан'}</p>
                  <p><strong>Вместимость:</strong> {hall.capacity_min}–{hall.capacity_max}</p>
                  <div className="hall-buttons">
                    <Link to={`/halls/${hall.id}`} className="hall-link">Подробнее</Link>
                    <Link to={`/owner/halls/${hall.id}/edit`} className="edit-button">Редактировать</Link>
                    <button onClick={() => handleDelete(hall.id)} className="delete-button">Удалить</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyHallsPage;
