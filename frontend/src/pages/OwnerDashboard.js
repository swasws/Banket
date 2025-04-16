// src/pages/OwnerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const [halls, setHalls] = useState([]);
  const [bookingsByHall, setBookingsByHall] = useState({});
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');
  const currentUserId = parseInt(localStorage.getItem('userId'), 10);

  useEffect(() => {
    const fetchHallsAndBookings = async () => {
      try {
        const hallsRes = await axios.get('http://127.0.0.1:8000/api/halls/', {
          headers: { Authorization: `Token ${token}` }
        });

        const ownerHalls = hallsRes.data.filter(h => h.owner === currentUserId);
        setHalls(ownerHalls);

        const bookingsMap = {};
        for (const hall of ownerHalls) {
          const bookingsRes = await axios.get(`http://127.0.0.1:8000/api/bookings/by-hall/${hall.id}/`, {
            headers: { Authorization: `Token ${token}` }
          });
          bookingsMap[hall.id] = bookingsRes.data;
        }
        setBookingsByHall(bookingsMap);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке залов или бронирований.');
      }
    };

    fetchHallsAndBookings();
  }, []);

  const handleBookingAction = async (bookingId, action) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/bookings/${bookingId}/${action}/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });

      setBookingsByHall(prev => {
        const updated = { ...prev };
        for (const hallId in updated) {
          updated[hallId] = updated[hallId].map(b =>
            b.id === bookingId ? { ...b, status: action === 'approve' ? 'approved' : 'rejected' } : b
          );
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert('Ошибка при выполнении действия.');
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="left-column">
        <h2>📌 Мои залы</h2>
        {halls.length === 0 && <p>Залов пока нет.</p>}
        {halls.map(hall => (
          <div key={hall.id} className="hall-card">
          <h3>{hall.name}</h3>
          <p>👥 Вместимость: от {hall.capacity_min} до {hall.capacity_max} человек</p>
          <p>🏷️ Теги: {hall.tags
            ? hall.tags.split(',').map((tag, idx) => (
                <span key={idx} className="tag-badge">#{tag.trim()}</span>
              ))
            : 'нет'}</p>

            <div className="hall-links">
              <Link to={`/halls/${hall.id}`} className="hall-button view">Просмотр</Link>
              <Link to={`/owner/halls/${hall.id}/edit`} className="hall-button edit">Редактировать</Link>
              <button
                className="hall-button delete"
                onClick={async () => {
                  if (window.confirm('Удалить зал?')) {
                    await axios.delete(`http://127.0.0.1:8000/api/halls/${hall.id}/`, {
                      headers: { Authorization: `Token ${token}` }
                    });
                    setHalls(prev => prev.filter(h => h.id !== hall.id));
                  }
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="right-column">
        <h2>📨 Заявки на бронирование</h2>
        {halls.map(hall => (
          <div key={hall.id}>
            {bookingsByHall[hall.id]?.length > 0 && (
              <div>
                <h3>Зал: {hall.name}</h3>
                {bookingsByHall[hall.id].map(booking => (
                  <div className="booking-card" key={booking.id}>
                    <p><strong>{booking.event_name}</strong> — {booking.date} в {booking.time}</p>
                    <p>👥 Вместимость: {booking.people_count} человек</p>
                    <p>📝 Описание: {booking.description || 'Без описания'}</p>
                    <p className={`status ${booking.status}`}>Статус: <strong>{booking.status}</strong></p>

                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <button className="btn-approve" onClick={() => handleBookingAction(booking.id, 'approve')}>Подтвердить</button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'approved') && (
                        <button className="btn-reject" onClick={() => {
                          const confirmMsg = booking.status === 'approved'
                            ? 'Вы уверены, что хотите отклонить подтверждённую бронь?'
                            : 'Отклонить бронь?';
                          if (window.confirm(confirmMsg)) {
                            handleBookingAction(booking.id, 'reject');
                          }
                        }}>Отклонить</button>
                      )}
                      {booking.status === 'approved' && (
                        <Link to={`/chat/${booking.id}`} className="chat-button">💬 Перейти в чат</Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;
