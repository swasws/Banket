// src/pages/ClientDashboard.js
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

  const requests = bookings.filter(b => b.status === 'pending');
  const approved = bookings.filter(b => b.status === 'approved');
  const rejected = bookings.filter(b => b.status === 'rejected');

  const upcoming = approved.filter(b => new Date(`${b.date}T${b.time}`) >= now);
  const approvedPast = approved.filter(b => new Date(`${b.date}T${b.time}`) < now);
  const past = bookings.filter(b => new Date(`${b.date}T${b.time}`) < now && b.status !== 'approved');

  return (
    <div className="client-dashboard-container">
      <h2 className="client-dashboard-title">Личный кабинет клиента</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="client-dashboard-grid">
        {/* 🔔 Заявки */}
        <section className="client-dashboard-section">
          <h3>🔔 Заявки</h3>
          <div className="client-dashboard-subblock">
            {requests.length === 0 && approvedPast.length === 0 && rejected.length === 0 ? (
              <p className="client-dashboard-empty">Нет заявок</p>
            ) : (
              <>
                {requests.map(b => (
                  <div key={b.id} className="client-dashboard-list-item">
                    <div className="event-head">
                      <strong>{b.event_name}</strong>
                      <span className="client-dashboard-status pending">🕒 Ожидает</span>
                    </div>
                    <p>Дата: {b.date} в {b.time}</p>
                    <p>Зал: <strong>{b.hall_name}</strong></p>
                  </div>
                ))}
                {approvedPast.map(b => (
                  <div key={b.id} className="client-dashboard-list-item">
                    <div className="event-head">
                      <strong>{b.event_name}</strong>
                      <span className="client-dashboard-status approved">✅ Подтверждено</span>
                    </div>
                    <p>Дата: {b.date} в {b.time}</p>
                    <p>Зал: <strong>{b.hall_name}</strong></p>
                    <Link to={`/chat/${b.id}`} className="chat-link">💬 Перейти в чат</Link>
                  </div>
                ))}
                {rejected.map(b => (
                  <div key={b.id} className="client-dashboard-list-item">
                    <div className="event-head">
                      <strong>{b.event_name}</strong>
                      <span className="client-dashboard-status rejected">❌ Отклонено</span>
                    </div>
                    <p>Дата: {b.date} в {b.time}</p>
                    <p>Зал: <strong>{b.hall_name}</strong></p>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* 📅 Текущие бронирования */}
        <section className="client-dashboard-section">
          <h3>📅 Текущие бронирования</h3>
          <div className="client-dashboard-subblock">
            {upcoming.length === 0 ? (
              <p className="client-dashboard-empty">Нет активных бронирований.</p>
            ) : (
              upcoming.map(b => (
                <div key={b.id} className="client-dashboard-list-item">
                  <div className="event-head">
                    <strong>{b.event_name}</strong>
                  </div>
                  <p>Дата: {b.date} в {b.time}</p>
                  <p>Зал: <strong>{b.hall_name}</strong></p>
                  <Link to={`/bookings/${b.id}/edit`} className="client-dashboard-link">✏️ Редактировать</Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 📜 История */}
        <section className="client-dashboard-section">
          <h3>📜 История</h3>
          <div className="client-dashboard-subblock">
            {past.length === 0 ? (
              <p className="client-dashboard-empty">История пуста.</p>
            ) : (
              past.map(b => (
                <div key={b.id} className="client-dashboard-list-item">
                  <div className="event-head">
                    <strong>{b.event_name}</strong>
                  </div>
                  <p>Дата: {b.date} в {b.time}</p>
                  <p>Зал: <strong>{b.hall_name}</strong></p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ClientDashboard;
