import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ClientDashboard.css';

function ClientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/bookings/', {
          headers: { Authorization: `Token ${token}` }
        });
        setBookings(response.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке бронирований.');
      }
    };
    fetchBookings();
  }, []);

  const now = new Date();

  const upcoming = bookings.filter(b => new Date(`${b.date}T${b.time}`) >= now);
  const past = bookings.filter(b => new Date(`${b.date}T${b.time}`) < now);

  return (
    <div className="client-dashboard-container">
      <h2 className="client-dashboard-title">Личный кабинет клиента</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section className="client-dashboard-section">
        <h3>🔔 Заявки на бронирования</h3>
        {bookings.length === 0 ? (
          <p className="client-dashboard-empty">Нет уведомлений</p>
        ) : (
          <ul className="client-dashboard-list">
            {bookings.map(b => (
              <li key={b.id}>
                <strong>{b.event_name}</strong> —
                <span className={`client-dashboard-status ${b.status}`}>
                  {b.status === 'approved' && ' ✅ Подтверждено'}
                  {b.status === 'rejected' && ' ❌ Отклонено'}
                  {b.status === 'pending' && ' 🕒 Ожидает'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="client-dashboard-section">
        <h3>📅 Текущие бронирования</h3>
        {upcoming.length === 0 ? (
          <p className="client-dashboard-empty">Нет активных бронирований.</p>
        ) : (
          <ul className="client-dashboard-list">
            {upcoming.map(b => (
              <li key={b.id}>
                <strong>{b.event_name}</strong> — {b.date} в {b.time}<br />
                Зал: <strong>{b.hall_name}</strong><br />
                <Link to={`/bookings/${b.id}/edit`} className="client-dashboard-link">Редактировать</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="client-dashboard-section">
        <h3>📜 История бронирований</h3>
        {past.length === 0 ? (
          <p className="client-dashboard-empty">История пуста.</p>
        ) : (
          <ul className="client-dashboard-list">
            {past.map(b => (
              <li key={b.id}>
                <strong>{b.event_name}</strong> — {b.date} в {b.time}<br />
                Зал: <strong>{b.hall_name}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ClientDashboard;
