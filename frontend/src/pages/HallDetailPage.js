import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function HallDetailPage() {
  const { id } = useParams(); // Получаем ID зала из URL
  const [hall, setHall] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://127.0.0.1:8000/api/halls/${id}/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setHall(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 403) {
          setError('У вас нет прав для просмотра этого зала.');
        } else if (err.response && err.response.status === 404) {
          setError('Зал не найден.');
        } else {
          setError('Ошибка при загрузке зала.');
        }
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!hall) return <p>Нет данных.</p>;

  // Корректный URL изображения
  const imageUrl = hall.image?.startsWith('http')
    ? hall.image
    : `http://127.0.0.1:8000${hall.image}`;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Детали Зала</h2>
      <p><strong>ID:</strong> {hall.id}</p>
      <p><strong>Название:</strong> {hall.name}</p>
      <p><strong>Описание:</strong> {hall.description || '—'}</p>

      {hall.image && (
        <div style={{ margin: '10px 0' }}>
          <strong>Изображение:</strong><br />
          <img
            src={imageUrl}
            alt={hall.name}
            style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      <p><strong>Теги:</strong> {hall.tags || '—'}</p>
      <p><strong>Цена:</strong> {hall.price ? `${hall.price} сом` : '—'}</p>
      <p><strong>Вместимость:</strong> от {hall.capacity_min || 0} до {hall.capacity_max || 0}</p>
      <p><strong>Адрес:</strong> {hall.address || '—'}</p>
      <p><strong>Еда:</strong> {hall.food_option === 'venue' ? 'От заведения' : 'Своя'}</p>
      <p><strong>Алкоголь:</strong> {hall.alcohol_option === 'allowed' ? 'Разрешено' : 'Запрещено'}</p>
      <p><strong>Типы мероприятий:</strong> {hall.event_types || '—'}</p>
      <p><strong>Обслуживание:</strong> {hall.service ? 'Есть' : 'Нет'}</p>
      <p><strong>Правила:</strong> {hall.rules || '—'}</p>
    </div>
  );
}

export default HallDetailPage;
