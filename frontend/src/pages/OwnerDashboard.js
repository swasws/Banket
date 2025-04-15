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
    <div className="dashboard-container">
      <h2 className="dashboard-title">Личный кабинет владельца</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {halls.length === 0 ? (
        <p>У вас пока нет залов.</p>
      ) : (
        halls.map(hall => (
          <div key={hall.id}>
            <div className="hall-card">
              <h3 className="hall-title">{hall.name}</h3>
              <div className="hall-links">
                <Link to={`/halls/${hall.id}`}>Просмотр</Link>
                <Link to={`/owner/halls/${hall.id}/edit`}>Редактировать</Link>
                <button
                  className="delete-hall-button"
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

            {bookingsByHall[hall.id]?.length > 0 && (
              <div className="booking-section">
                <h4>Заявки на бронирование:</h4>
                {bookingsByHall[hall.id].map(booking => (
                  <div className="booking-card" key={booking.id}>
                    <p><strong>{booking.event_name}</strong> — {booking.date} в {booking.time}</p>
                    <p>👥 {booking.people_count} человек</p>
                    <p>📝 {booking.description || 'Без описания'}</p>
                    <p className="status">🧾 Статус: <strong>{booking.status}</strong></p>
                    {booking.status === 'pending' && (
                      <div className="booking-actions">
                        <button className="btn-approve" onClick={() => handleBookingAction(booking.id, 'approve')}>
                          ✅ Подтвердить
                        </button>
                        <button className="btn-reject" onClick={() => handleBookingAction(booking.id, 'reject')}>
                          ❌ Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerDashboard;
