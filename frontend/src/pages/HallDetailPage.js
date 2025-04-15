import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './HallDetailPage.css';

function HallDetailPage() {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://127.0.0.1:8000/api/halls/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setHall(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('У вас нет прав для просмотра этого зала.');
        } else if (err.response?.status === 404) {
          setError('Зал не найден.');
        } else {
          setError('Ошибка при загрузке зала.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHall();
  }, [id]);

  if (loading) return <p className="hall-loading">Загрузка...</p>;
  if (error) return <p className="hall-error">{error}</p>;
  if (!hall) return <p className="hall-empty">Нет данных.</p>;

  const imageUrl = hall.image?.startsWith('http')
    ? hall.image
    : `http://127.0.0.1:8000${hall.image}`;

  return (
    <div className="hall-detail-container">
      <div className="hall-header">
        <h2>{hall.name}</h2>
        <p className="hall-subtitle">ID: {hall.id}</p>
      </div>

      {hall.image && (
        <div className="hall-image-block">
          <img src={imageUrl} alt={hall.name} className="hall-image" />
        </div>
      )}

      <div className="hall-info-grid">
        <div><strong>📄 Описание:</strong> {hall.description || '—'}</div>
        <div><strong>🏷 Теги:</strong> {hall.tags || '—'}</div>
        <div><strong>💰 Цена:</strong> {hall.price ? `${hall.price} сом` : '—'}</div>
        <div><strong>👥 Вместимость:</strong> {hall.capacity_min} – {hall.capacity_max}</div>
        <div><strong>📍 Адрес:</strong> {hall.address || '—'}</div>
        <div><strong>🍽 Еда:</strong> {hall.food_option === 'venue' ? 'От заведения' : 'Своя'}</div>
        <div><strong>🍷 Алкоголь:</strong> {hall.alcohol_option === 'allowed' ? 'Разрешено' : 'Запрещено'}</div>
        <div><strong>🎉 Мероприятия:</strong> {hall.event_types || '—'}</div>
        <div><strong>🧑‍🍳 Обслуживание:</strong> {hall.service ? 'Есть' : 'Нет'}</div>
        <div><strong>⚠️ Правила:</strong> {hall.rules || '—'}</div>
      </div>

      <div className="hall-action">
        <Link to={`/halls/${hall.id}/book`}>
          <button className="hall-book-btn">Забронировать</button>
        </Link>
      </div>
    </div>
  );
}

export default HallDetailPage;
